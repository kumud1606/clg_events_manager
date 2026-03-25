const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCaptcha(length = 6) {
  return Array.from({ length }, () => {
    const index = Math.floor(Math.random() * ALPHABET.length);
    return ALPHABET[index];
  }).join("");
}
