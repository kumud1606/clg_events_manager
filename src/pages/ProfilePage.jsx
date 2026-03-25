import { useMemo, useState } from "react";
import AppShell from "../components/AppShell";
import ClubChip from "../components/ClubChip";
import { clubs } from "../data/clubs";
import { events } from "../data/events";
import { getStudentRegisteredEvents } from "../utils/events";
import { getEventRegistrations, getStudentProfile, updateStudentClubs } from "../utils/storage";

export default function ProfilePage() {
  const student = getStudentProfile();
  const [selectedClubs, setSelectedClubs] = useState(student?.clubs || []);
  const [saved, setSaved] = useState(false);
  const registrations = getEventRegistrations();
  const registeredEvents = useMemo(
    () => getStudentRegisteredEvents(events, registrations, new Date()),
    [registrations]
  );

  function toggleClub(clubId) {
    setSaved(false);
    setSelectedClubs((current) =>
      current.includes(clubId) ? current.filter((item) => item !== clubId) : [...current, clubId]
    );
  }

  function handleSave() {
    updateStudentClubs(selectedClubs);
    setSaved(true);
  }

  return (
    <AppShell myClubCount={selectedClubs.length}>
      <section className="profile-page">
        <div className="profile-card">
          <p className="eyebrow">Student Profile</p>
          <h1>{student?.enrollment || "Student Profile"}</h1>
          <p>You can update your preferences here whenever needed.</p>

          <div className="profile-stats">
            <div className="profile-stat">
              <strong>{selectedClubs.length}</strong>
              <span>Selected Clubs</span>
            </div>
            <div className="profile-stat">
              <strong>{clubs.length}</strong>
              <span>Total Clubs</span>
            </div>
            <div className="profile-stat">
              <strong>{registeredEvents.length}</strong>
              <span>Registrations</span>
            </div>
          </div>
        </div>

        <div className="profile-card">
          <h2>Choose or update your preferences</h2>
          <div className="club-grid">
            {clubs.map((club) => (
              <ClubChip
                key={club.id}
                club={club}
                selected={selectedClubs.includes(club.id)}
                onClick={() => toggleClub(club.id)}
              />
            ))}
          </div>

          <div className="profile-actions">
            <button type="button" className="primary-button" onClick={handleSave}>
              Save Preferences
            </button>
            {saved ? <p className="profile-success">Your clubs were updated successfully.</p> : null}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
