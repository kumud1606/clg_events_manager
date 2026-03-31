import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import { clubs } from "../data/clubs";
import { events } from "../data/events";
import { getStudentRegisteredEvents } from "../utils/events";
import { getEventRegistrations, getStudentProfile } from "../utils/storage";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, monthIndex) => ({
  value: monthIndex,
  label: new Date(2026, monthIndex, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  })
}));

function getMonthGrid(monthDate) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const cells = [];

  for (let index = 0; index < startOffset; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function getDateKey(date) {
  return date.toLocaleDateString("en-CA");
}

function getRoleLabel(event) {
  if (event.registration.participate && event.registration.volunteer) {
    return "Participating + Volunteering";
  }

  if (event.registration.volunteer) {
    return "Volunteering";
  }

  return "Participating";
}

function getDayTone(dayEvents) {
  const hasParticipating = dayEvents.some((event) => event.registration.participate);
  const hasVolunteering = dayEvents.some((event) => event.registration.volunteer);

  if (hasParticipating && hasVolunteering) {
    return "mixed";
  }

  if (hasVolunteering) {
    return "volunteer";
  }

  return "participate";
}

export default function CalendarPage() {
  const student = getStudentProfile();
  const myClubCount = student?.clubs?.length || 0;
  const [now, setNow] = useState(() => new Date());
  const [registrations, setRegistrations] = useState(() => getEventRegistrations());
  const [activeMonth, setActiveMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const currentMonthIndex = now.getMonth();

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
      setRegistrations(getEventRegistrations());
    }, 30000);

    return () => window.clearInterval(intervalId);
  }, []);

  const calendarEvents = useMemo(
    () => getStudentRegisteredEvents(events, registrations, now),
    [now, registrations]
  );

  const eventsByDate = useMemo(
    () =>
      calendarEvents.reduce((grouped, event) => {
        const key = getDateKey(new Date(event.startDate));
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(event);
        return grouped;
      }, {}),
    [calendarEvents]
  );

  const monthCells = useMemo(() => getMonthGrid(activeMonth), [activeMonth]);
  const monthLabel = activeMonth.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  });

  return (
    <AppShell myClubCount={myClubCount}>
      <section className="calendar-page">
        <div className="calendar-board">
          <div className="calendar-board__header">
            <div>
              <p className="eyebrow">Personal Calendar</p>
              <h1>{monthLabel}</h1>
              <p>Hover on a marked date to see the club name and your role for that event.</p>
            </div>

            <div className="calendar-board__controls">
              <div className="calendar-board__month-picker">
                <span className="calendar-board__month-icon" aria-hidden="true">
                  Month
                </span>
                <div className="calendar-board__month-scroller" role="tablist" aria-label="Select month">
                  {MONTH_OPTIONS.map((month) => {
                    const isActive = month.value === activeMonth.getMonth();
                    const isCurrentMonth = month.value === currentMonthIndex;

                    return (
                      <button
                        key={month.value}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={`calendar-board__month-chip ${isActive ? "calendar-board__month-chip--active" : ""} ${
                          isCurrentMonth ? "calendar-board__month-chip--current" : ""
                        }`}
                        onClick={() => setActiveMonth(new Date(activeMonth.getFullYear(), month.value, 1))}
                      >
                        <span>{month.label}</span>
                        {isCurrentMonth ? <small>This month</small> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="calendar-legend">
            <span className="calendar-legend__item">
              <span className="calendar-legend__dot calendar-legend__dot--participate" />
              Participating
            </span>
            <span className="calendar-legend__item">
              <span className="calendar-legend__dot calendar-legend__dot--volunteer" />
              Volunteering
            </span>
            <span className="calendar-legend__item">
              <span className="calendar-legend__dot calendar-legend__dot--mixed" />
              Both Roles
            </span>
          </div>

          <div className="calendar-grid">
            {WEEK_DAYS.map((day) => (
              <div key={day} className="calendar-grid__weekday">
                {day}
              </div>
            ))}

            {monthCells.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="calendar-grid__cell calendar-grid__cell--empty" />;
              }

              const dateKey = getDateKey(date);
              const dayEvents = eventsByDate[dateKey] || [];
              const isToday = dateKey === getDateKey(now);
              const tone = dayEvents.length > 0 ? getDayTone(dayEvents) : "";

              return (
                <div
                  key={dateKey}
                  className={`calendar-grid__cell ${isToday ? "calendar-grid__cell--today" : ""}`}
                >
                  <div
                    className={`calendar-grid__date ${tone ? `calendar-grid__date--${tone}` : ""}`}
                    tabIndex={dayEvents.length > 0 ? 0 : -1}
                  >
                    {isToday ? <span className="calendar-grid__today-badge">Today</span> : null}
                    {date.getDate()}
                    {dayEvents.length > 0 ? (
                      <div className="calendar-grid__tooltip">
                        {dayEvents.map((event) => {
                          const club = clubs.find((item) => item.id === event.clubId);
                          return (
                            <div key={event.id} className="calendar-grid__tooltip-item">
                              <strong>{club?.name || event.title}</strong>
                              <span>{getRoleLabel(event)}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
