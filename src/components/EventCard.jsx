import { clubs } from "../data/clubs";

export default function EventCard({ event, registrationState, onRegister, onGenerateCertificate }) {
  const club = clubs.find((item) => item.id === event.clubId);
  const participateActive = Boolean(registrationState.participate?.active);
  const volunteerActive = Boolean(registrationState.volunteer?.active);
  const captionParagraphs = event.caption.split("\n\n").filter(Boolean);
  const canGenerateCertificate = event.status === "finished" && (participateActive || volunteerActive);
  const registrationClosed = event.status === "finished";
  const closedMessage = "This event is no longer ongoing.";

  return (
    <article className="event-card">
      <div className="event-card__header">
        <div className="event-card__club-mark" style={{ backgroundColor: club?.color }}>
          {club?.logo ? <img className="event-card__club-logo" src={club.logo} alt={`${club.name} logo`} /> : club?.icon}
        </div>
        <div>
          <h3>{event.title}</h3>
          <p>{club?.name}</p>
        </div>
      </div>

      <div className={`event-card__post ${event.mediaType === "video" ? "event-card__post--video" : ""}`}>
        {event.mediaType === "video" ? (
          <video
            className="event-card__image event-card__video"
            controls
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={event.poster}
          >
            <source src={event.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img className="event-card__image" src={event.image} alt={event.title} />
        )}

        <div className="event-card__body">
          <div className="event-card__meta">
            <span>{event.date}</span>
            <span>{event.venue}</span>
            <span className={`event-status event-status--${event.status}`}>{event.statusLabel}</span>
          </div>
          <div className="event-card__caption">
            <div className="event-card__caption-copy">
              {captionParagraphs.map((paragraph) => (
                <p key={paragraph}>
                  {paragraph.startsWith("Register now:") ? (
                    <>
                      Register now:{" "}
                      <a href={paragraph.replace("Register now:", "").trim()} target="_blank" rel="noreferrer">
                        {paragraph.replace("Register now:", "").trim()}
                      </a>
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
            </div>
          </div>
          <div className="event-card__actions">
            <button
              type="button"
              className={`event-action-button ${participateActive ? "active" : ""}`}
              onClick={() => onRegister(event.id, "participate")}
              disabled={registrationClosed}
              title={registrationClosed ? closedMessage : ""}
            >
              {participateActive ? "Participating" : "Participate"}
            </button>
            <button
              type="button"
              className={`event-action-button event-action-button--volunteer ${volunteerActive ? "active" : ""}`}
              onClick={() => onRegister(event.id, "volunteer")}
              disabled={registrationClosed}
              title={registrationClosed ? closedMessage : ""}
            >
              {volunteerActive ? "Volunteering" : "Volunteer"}
            </button>
            {canGenerateCertificate ? (
              <button
                type="button"
                className="event-action-button event-action-button--certificate"
                onClick={() => onGenerateCertificate(event)}
              >
                Generate Certificate
              </button>
            ) : null}
          </div>
          <div className="event-card__tags">
            {event.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
