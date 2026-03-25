export function getEventStatus(event, now = new Date()) {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  if (end < now) {
    return { id: "finished", label: "Finished" };
  }

  if (start <= now && end >= now) {
    return { id: "going-on", label: "Going On" };
  }

  return { id: "upcoming", label: "Upcoming" };
}

export function enrichEvents(events, now = new Date()) {
  return events.map((event) => {
    const status = getEventStatus(event, now);
    return {
      ...event,
      status: status.id,
      statusLabel: status.label
    };
  });
}

export function getStudentRegisteredEvents(events, registrations, now = new Date()) {
  return enrichEvents(events, now)
    .map((event) => {
      const eventRegistration = registrations[String(event.id)] || {};
      const participation = eventRegistration.participate;
      const volunteer = eventRegistration.volunteer;

      return {
        ...event,
        registration: {
          participate: Boolean(participation?.active),
          volunteer: Boolean(volunteer?.active),
          participateAt: participation?.registeredAt || null,
          volunteerAt: volunteer?.registeredAt || null
        }
      };
    })
    .filter((event) => event.registration.participate || event.registration.volunteer);
}
