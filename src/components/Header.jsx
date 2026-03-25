import { clubs } from "../data/clubs";

export default function Header({
  activeFilter,
  myClubs,
  onFilterChange,
  onOpenClubEditor,
  onLogout,
}) {
  const navigationItems = [
    { id: "all", label: "All Clubs" },
    { id: "my-clubs", label: "My Clubs" },
    ...clubs.map((club) => ({ id: club.id, label: club.shortName })),
  ];

  return (
    <header className="dashboard-header">
      <div className="brand-block">
        <p className="brand-kicker">Graphic Era Clubs</p>
        <h1>Discover, join, and follow campus events</h1>
        <p className="brand-subcopy">
          Your clubs are saved to your profile, and you can update “My Clubs” anytime.
        </p>
      </div>

      <div className="top-actions">
        <button type="button" className="ghost-button" onClick={onOpenClubEditor}>
          Update My Clubs
        </button>
        <button type="button" className="text-button" onClick={onLogout}>
          Logout
        </button>
      </div>

      <nav className="club-nav" aria-label="Club sections">
        {navigationItems.map((item) => {
          const isMyClubs = item.id === "my-clubs";
          const isDisabled = isMyClubs && myClubs.length === 0;
          return (
            <button
              key={item.id}
              type="button"
              className={`club-pill ${activeFilter === item.id ? "active" : ""}`}
              onClick={() => onFilterChange(item.id)}
              disabled={isDisabled}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
