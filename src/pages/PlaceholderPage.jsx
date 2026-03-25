import AppShell from "../components/AppShell";
import { getStudentProfile } from "../utils/storage";

export default function PlaceholderPage({ title, subtitle, description }) {
  const student = getStudentProfile();
  const myClubCount = student?.clubs?.length || 0;

  return (
    <AppShell myClubCount={myClubCount}>
      <section className="placeholder-page">
        <div className="placeholder-card">
          <p className="eyebrow">Separate Page</p>
          <h1>{title}</h1>
          <h2>{subtitle}</h2>
          <p>{description}</p>
        </div>
      </section>
    </AppShell>
  );
}
