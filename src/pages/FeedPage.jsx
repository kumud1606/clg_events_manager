import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import EventCard from "../components/EventCard";
import EventStatusNav from "../components/EventStatusNav";
import { events } from "../data/events";
import { downloadCertificatePdf } from "../utils/certificate";
import { enrichEvents } from "../utils/events";
import {
  getEventRegistrations,
  getStudentProfile,
  markCertificateDownloaded,
  toggleEventRegistration
} from "../utils/storage";

export default function FeedPage() {
  const { sectionId = "all" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const student = getStudentProfile();
  const myClubs = student?.clubs || [];
  const [registrations, setRegistrations] = useState(() => getEventRegistrations());
  const activeStatus = searchParams.get("status") || "all";
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, []);

  const sectionEvents = useMemo(() => {
    if (sectionId === "all") {
      return events;
    }

    if (sectionId === "my-clubs") {
      return events.filter((event) => myClubs.includes(event.clubId));
    }

    return events.filter((event) => event.clubId === sectionId);
  }, [myClubs, sectionId]);

  const enrichedEvents = useMemo(() => enrichEvents(sectionEvents, now), [now, sectionEvents]);

  const statusCounts = useMemo(
    () =>
      enrichedEvents.reduce(
        (counts, event) => ({
          ...counts,
          all: counts.all + 1,
          [event.status]: counts[event.status] + 1
        }),
        { all: 0, finished: 0, "going-on": 0, upcoming: 0 }
      ),
    [enrichedEvents]
  );

  const filteredEvents = useMemo(() => {
    if (activeStatus === "all") {
      return enrichedEvents;
    }

    return enrichedEvents.filter((event) => event.status === activeStatus);
  }, [activeStatus, enrichedEvents]);
  function handleStatusChange(statusId) {
    const nextParams = new URLSearchParams(searchParams);
    if (statusId === "all") {
      nextParams.delete("status");
    } else {
      nextParams.set("status", statusId);
    }
    setSearchParams(nextParams);
  }

  function handleRegister(eventId, registrationType) {
    setRegistrations(toggleEventRegistration(eventId, registrationType));
  }

  function handleGenerateCertificate(event) {
    const eventRegistration = registrations[String(event.id)] || {};
    const roleLabel =
      eventRegistration.participate?.active && eventRegistration.volunteer?.active
        ? "Participant and Volunteer"
        : eventRegistration.volunteer?.active
          ? "Volunteer"
          : "Participant";

    downloadCertificatePdf({
      studentName: student?.enrollment || "Graphic Era Student",
      eventTitle: event.title,
      roleLabel,
      venue: event.venue,
      dateLabel: event.date
    });

    markCertificateDownloaded(event.id);
  }

  return (
    <AppShell myClubCount={myClubs.length}>
      <section className="feed-main">
        {sectionId !== "all" ? (
          <EventStatusNav
            activeStatus={activeStatus}
            counts={statusCounts}
            onStatusChange={handleStatusChange}
          />
        ) : null}

        <div className="feed-posts">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                registrationState={registrations[String(event.id)] || {}}
                onRegister={handleRegister}
                onGenerateCertificate={handleGenerateCertificate}
              />
            ))
          ) : (
            <div className="empty-feed">
              <h3>No events match this section yet.</h3>
              <p>Try switching the event status bar or opening another club from the top navigation.</p>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}
