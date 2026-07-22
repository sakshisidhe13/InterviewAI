import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import "./AppLayout.css";

export default function AppLayout({
  title = "Dashboard",
  children,
}) {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-main">
        <Topbar title={title} />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}