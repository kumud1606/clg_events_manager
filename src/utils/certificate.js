function escapePdfText(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdfText(lines) {
  const header = "BT\n/F1 26 Tf\n80 700 Td\n";
  const body = lines
    .map((line, index) => {
      const prefix = index === 0 ? "" : "0 -34 Td\n";
      return `${prefix}(${escapePdfText(line)}) Tj\n`;
    })
    .join("");

  return `${header}${body}ET`;
}

export function downloadCertificatePdf({ studentName, eventTitle, roleLabel, venue, dateLabel }) {
  const content = buildPdfText([
    "Graphic Era Certificate of Participation",
    "",
    `This certifies that ${studentName}`,
    `contributed as ${roleLabel}`,
    `for ${eventTitle}.`,
    "",
    `Venue: ${venue}`,
    `Event date: ${dateLabel}`,
    "",
    "Issued by Graphic Era Student Activities"
  ]);

  const objects = [];
  const addObject = (body) => {
    objects.push(body);
    return objects.length;
  };

  const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
  const pagesId = addObject("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  const pageId = addObject(
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>"
  );
  const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const contentId = addObject(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);

  const pdfParts = ["%PDF-1.4\n"];
  const offsets = [0];

  [catalogId, pagesId, pageId, fontId, contentId].forEach((id) => {
    offsets[id] = pdfParts.join("").length;
    pdfParts.push(`${id} 0 obj\n${objects[id - 1]}\nendobj\n`);
  });

  const xrefStart = pdfParts.join("").length;
  pdfParts.push(`xref\n0 ${objects.length + 1}\n`);
  pdfParts.push("0000000000 65535 f \n");

  for (let index = 1; index <= objects.length; index += 1) {
    pdfParts.push(`${String(offsets[index]).padStart(10, "0")} 00000 n \n`);
  }

  pdfParts.push(
    `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF`
  );

  const blob = new Blob(pdfParts, { type: "application/pdf" });
  const link = document.createElement("a");
  const safeTitle = eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = `${safeTitle || "certificate"}-certificate.pdf`;
  link.click();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
