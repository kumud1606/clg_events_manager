import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";
import Header from "../components/Header";
import { clubs, events } from "../data/clubs";
import { getLoggedInStudent, getMyClubs, logoutStudent, setMyClubs } from "../utils/storage";

export default function DashboardPage() {
  const navigate = useNavigate();
  const student = useMemo(() => getLoggedInStudent(), []);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [myClubs, setMyClubsState] = useState(student ? getMyClubs(student.id) : []);

  if (!student) {
    return <Navigate to="/login" replace />;
  }

  const filteredEvents = events.filter((event) => {
    if (activeFilter === "all") {
      return true;
    }
    if (activeFilter === "my-clubs") {
      return myClubs.includes(event.clubId);
    }
    return event.clubId === activeFilter;
  });

  const saveClubEditor = (clubId) => {
    const nextSelection = myClubs.includes(clubId)
      ? myClubs.filter((item) => item !== clubId)
      : [...myClubs, clubId];

    setMyClubsState(nextSelection);
    setMyClubs(student.id, nextSelection);
  };

  const handleLogout = () => {
    logoutStudent();
    navigate("/login");
  };

  return (
    <main className="dashboard-page">
      <Header
        activeFilter={activeFilter}
        myClubs={myClubs}
        onFilterChange={setActiveFilter}
        onOpenClubEditor={() => setIsEditorOpen(true)}
        onLogout={handleLogout}
      />

      <section className="welcome-strip">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h2>{student.id}</h2>
        </div>
        
      </section>

      <section className="feed-layout">
        <aside className="sidebar-card">
          <h3>My Clubs</h3>
          <p>These choices personalize your experience and can be changed any time.</p>
          <div className="sidebar-tags">
            {myClubs.length > 0 ? (
              myClubs.map((clubId) => {
                const club = clubs.find((item) => item.id === clubId);
                return (
                  <span key={clubId} className="sidebar-tag" style={{ borderColor: club?.accent }}>
                    {club?.name}
                  </span>
                );
              })
            ) : (
              <span className="sidebar-empty">No clubs selected yet.</span>
            )}
          </div>
        </aside>

        <div className="event-feed">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <div className="empty-state">
              <h3>No events in this section yet</h3>
              <p>Try another club tab or update your My Clubs selection.</p>
            </div>
          )}
        </div>
      </section>

      {isEditorOpen ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsEditorOpen(false)}>
          <div className="modal-card" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow">Update Preferences</p>
                <h3>Edit My Clubs</h3>
              </div>
              <button type="button" className="text-button" onClick={() => setIsEditorOpen(false)}>
                Close
              </button>
            </div>

            <div className="club-grid compact">
              {clubs.map((club) => {
                const isActive = myClubs.includes(club.id);
                return (
                  <button
                    key={club.id}
                    type="button"
                    className={`club-card ${isActive ? "selected" : ""}`}
                    style={{ "--club-accent": club.accent }}
                    onClick={() => saveClubEditor(club.id)}
                  >
                    <span>{club.name}</span>
                    <small>{club.description}</small>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
