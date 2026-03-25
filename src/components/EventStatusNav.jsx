const STATUS_ITEMS = [
  { id: "all", label: "All Events" },
  { id: "finished", label: "Finished" },
  { id: "going-on", label: "Going On" },
  { id: "upcoming", label: "Upcoming" }
];

export default function EventStatusNav({ activeStatus, counts, onStatusChange }) {
  return (
    <div className="event-filter-bar" aria-label="Event timeline filters">
      {STATUS_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`event-filter-bar__button ${activeStatus === item.id ? "active" : ""}`}
          onClick={() => onStatusChange(item.id)}
        >
          {item.label}
          <span>{counts[item.id] || 0}</span>
        </button>
      ))}
    </div>
  );
}
