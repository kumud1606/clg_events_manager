import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClubChip from "../components/ClubChip";
import { clubs } from "../data/clubs";
import { getStudentProfile, updateStudentClubs } from "../utils/storage";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const student = getStudentProfile();
  const [selectedClubs, setSelectedClubs] = useState(student?.clubs || []);

  const selectedCount = selectedClubs.length;

  function toggleClub(clubId) {
    setSelectedClubs((current) =>
      current.includes(clubId) ? current.filter((item) => item !== clubId) : [...current, clubId]
    );
  }

  function handleContinue() {
    updateStudentClubs(selectedClubs);
    navigate("/feed/all");
  }

  return (
    <main className="onboarding-page">
      <section className="onboarding-panel">
        <div className="onboarding-panel__intro">
          <h1>Welcome</h1>
          <p>
            Are you already part of any club or student group? Pick all that apply. This choice is
            saved for your profile now, and you can change it later anytime from the
            <strong> My Preferences</strong> section in the header.
          </p>
        </div>

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

        <div className="onboarding-panel__footer">
          <p>{selectedCount} club(s) selected</p>
          <div className="onboarding-panel__actions">
            <button type="button" className="ghost-button" onClick={() => navigate("/")}>
              Back
            </button>
            <button type="button" className="primary-button" onClick={handleContinue}>
              Continue to Clubs Feed
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
