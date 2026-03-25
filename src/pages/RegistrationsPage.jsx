import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import { clubs } from "../data/clubs";
import { events } from "../data/events";
import { downloadCertificatePdf } from "../utils/certificate";
import { getStudentRegisteredEvents } from "../utils/events";
import { getEventRegistrations, getStudentProfile, markCertificateDownloaded } from "../utils/storage";

function formatRoleLabel(event) {
  if (event.registration.participate && event.registration.volunteer) {
    return "Participant and Volunteer";
  }

  if (event.registration.volunteer) {
    return "Volunteer";
  }

  return "Participant";
}

export default function RegistrationsPage() {
  const student = getStudentProfile();
  const myClubCount = student?.clubs?.length || 0;
  const [now, setNow] = useState(() => new Date());
  const [registrations, setRegistrations] = useState(() => getEventRegistrations());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
      setRegistrations(getEventRegistrations());
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, []);

  const registeredEvents = useMemo(
    () => getStudentRegisteredEvents(events, registrations, now),
    [now, registrations]
  );

  const stats = useMemo(
    () => ({
      total: registeredEvents.length,
      active: registeredEvents.filter((event) => event.status !== "finished").length,
      certificates: registeredEvents.filter((event) => event.status === "finished").length
    }),
    [registeredEvents]
  );

  function handleCertificateDownload(event) {
    downloadCertificatePdf({
      studentName: student?.enrollment || "Graphic Era Student",
      eventTitle: event.title,
      roleLabel: formatRoleLabel(event),
      venue: event.venue,
      dateLabel: event.date
    });

    markCertificateDownloaded(event.id);
  }

  return (
    <AppShell myClubCount={myClubCount}>
      <section className="registrations-page">
        <div className="profile-card registrations-hero">
          <p className="eyebrow">Registrations</p>
          <h1>Your event commitments</h1>
          <p>Track every event where you signed up, see the current status, and download certificates after completion.</p>

          <div className="profile-stats">
            <div className="profile-stat">
              <strong>{stats.total}</strong>
              <span>Total Registrations</span>
            </div>
            <div className="profile-stat">
              <strong>{stats.active}</strong>
              <span>Active Events</span>
            </div>
            <div className="profile-stat">
              <strong>{stats.certificates}</strong>
              <span>Certificates Ready</span>
            </div>
          </div>
        </div>

        {registeredEvents.length > 0 ? (
          <div className="registration-grid">
            {registeredEvents.map((event, index) => {
              const club = clubs.find((item) => item.id === event.clubId);
              return (
                <article
                  key={event.id}
                  className="registration-card"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="registration-card__header">
                    <div>
                      <p className="eyebrow">Registered Event</p>
                      <h2>{event.title}</h2>
                      <p>{club?.name}</p>
                    </div>
                    <span className={`event-status event-status--${event.status}`}>{event.statusLabel}</span>
                  </div>

                  <div className="registration-card__meta">
                    <span>{event.date}</span>
                    <span>{event.venue}</span>
                    <span>{formatRoleLabel(event)}</span>
                  </div>

                  <p className="registration-card__caption">{event.caption.split("\n")[0]}</p>

                  {event.status === "finished" ? (
                    <button
                      type="button"
                      className="primary-button registration-card__button"
                      onClick={() => handleCertificateDownload(event)}
                    >
                      Generate Certificate PDF
                    </button>
                  ) : (
                    <div className="registration-card__pending">
                      Certificate will unlock automatically after the event is finished.
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="placeholder-card">
            <p className="eyebrow">Nothing Registered</p>
            <h2>Your participation list is empty</h2>
            <p>Use the event feed to join or volunteer for events. They will then appear here automatically.</p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
