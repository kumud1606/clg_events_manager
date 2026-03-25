import { useEffect, useState } from "react";
import { getSavedTheme, saveTheme } from "../utils/storage";
import HeaderNav from "./HeaderNav";
import SidebarNav from "./SidebarNav";

export default function AppShell({ myClubCount, children }) {
  const [theme, setTheme] = useState(() => getSavedTheme());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    saveTheme(theme);
  }, [theme]);

  return (
    <main className="app-shell">
      <SidebarNav />
      <div className="app-shell__content">
        <HeaderNav
          myClubCount={myClubCount}
          theme={theme}
          onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
        />
        {children}
      </div>
    </main>
  );
}
