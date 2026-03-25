import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import { clubs } from "../data/clubs";
import { events } from "../data/events";
import { downloadCertificatePdf } from "../utils/certificate";
import { getStudentRegisteredEvents } from "../utils/events";
import {
  getCertificateDownloads,
  getEventRegistrations,
  getStudentProfile,
  markCertificateDownloaded
} from "../utils/storage";

function formatRoleLabel(event) {
  if (event.registration.participate && event.registration.volunteer) {
    return "Participant and Volunteer";
  }

  if (event.registration.volunteer) {
    return "Volunteer";
  }

  return "Participant";
}

export default function CertificatesPage() {
  const student = getStudentProfile();
  const myClubCount = student?.clubs?.length || 0;
  const [now, setNow] = useState(() => new Date());
  const [registrations, setRegistrations] = useState(() => getEventRegistrations());
  const [downloads, setDownloads] = useState(() => getCertificateDownloads());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
      setRegistrations(getEventRegistrations());
      setDownloads(getCertificateDownloads());
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, []);

  const registeredEvents = useMemo(
    () => getStudentRegisteredEvents(events, registrations, now),
    [now, registrations]
  );

  const sections = useMemo(() => {
    const downloaded = [];
    const yetToDownload = [];
    const yetToReceive = [];

    registeredEvents.forEach((event) => {
      const downloadState = downloads[String(event.id)];

      if (event.status === "finished") {
        if (downloadState?.downloaded) {
          downloaded.push(event);
        } else {
          yetToDownload.push(event);
        }
      } else {
        yetToReceive.push(event);
      }
    });

    return { downloaded, yetToDownload, yetToReceive };
  }, [downloads, registeredEvents]);

  function handleDownload(event) {
    downloadCertificatePdf({
      studentName: student?.enrollment || "Graphic Era Student",
      eventTitle: event.title,
      roleLabel: formatRoleLabel(event),
      venue: event.venue,
      dateLabel: event.date
    });

    setDownloads(markCertificateDownloaded(event.id));
  }

  function renderCertificateList(items, emptyText, showButton) {
    if (items.length === 0) {
      return <p className="certificate-empty">{emptyText}</p>;
    }

    return (
      <div className="certificate-list">
        {items.map((event, index) => {
          const club = clubs.find((item) => item.id === event.clubId);
          return (
            <article
              key={event.id}
              className="certificate-card"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="certificate-card__header">
                <div>
                  <p className="eyebrow">Certificate Event</p>
                  <h3>{event.title}</h3>
                  <p>{club?.name}</p>
                </div>
                <span className={`event-status event-status--${event.status}`}>{event.statusLabel}</span>
              </div>
              <div className="certificate-card__meta">
                <span>{event.date}</span>
                <span>{event.venue}</span>
                <span>{formatRoleLabel(event)}</span>
              </div>
              {showButton ? (
                <button
                  type="button"
                  className="primary-button certificate-card__button"
                  onClick={() => handleDownload(event)}
                >
                  Download Certificate PDF
                </button>
              ) : null}
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <AppShell myClubCount={myClubCount}>
      <section className="certificates-page">
        <section className="certificate-section certificate-section--downloaded">
          <div className="certificate-section__heading">
            <h2>Downloaded</h2>
            <span>{sections.downloaded.length}</span>
          </div>
          {renderCertificateList(sections.downloaded, "No certificates downloaded yet.", false)}
        </section>

        <section className="certificate-section certificate-section--pending-download">
          <div className="certificate-section__heading">
            <h2>Yet to Download</h2>
            <span>{sections.yetToDownload.length}</span>
          </div>
          {renderCertificateList(sections.yetToDownload, "No finished events are waiting for download.", true)}
        </section>

        <section className="certificate-section certificate-section--pending-issue">
          <div className="certificate-section__heading">
            <h2>Yet to Receive</h2>
            <span>{sections.yetToReceive.length}</span>
          </div>
          {renderCertificateList(sections.yetToReceive, "No upcoming or ongoing certificates are pending.", false)}
        </section>
      </section>
    </AppShell>
  );
}
