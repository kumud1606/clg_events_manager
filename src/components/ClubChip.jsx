import { Link } from "react-router-dom";

export default function ClubChip({ club, selected, onClick, compact = false, href }) {
  const className = `club-chip ${selected ? "selected" : ""} ${compact ? "compact" : ""}`;
  const style = { "--club-accent": club.color };
  const content = (
    <>
      <span className="club-chip__badge">
        {club.logo ? <img className="club-chip__badge-image" src={club.logo} alt={`${club.name} logo`} /> : club.icon}
      </span>
      <span>
        <strong>{club.name}</strong>
        {!compact && <small>{club.description}</small>}
      </span>
    </>
  );

  if (href) {
    return (
      <Link className={className} to={href} style={style}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick} style={style}>
      {content}
    </button>
  );
}
