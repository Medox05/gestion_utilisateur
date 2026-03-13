import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const itemClass = (path: string) =>
    `list-group-item list-group-item-action ${pathname === path ? "active" : ""}`;

  return (
    <div
      className="d-flex flex-column bg-dark text-white"
      style={{ width: 260, minHeight: "100vh" }}
    >
      <div className="p-3 border-bottom border-secondary">
        <div className="fw-bold fs-4">Admin Panel</div>
        <div className="text-secondary small">Users & Sites</div>
      </div>

      <div className="list-group list-group-flush">
        <Link to="/users" className={itemClass("/users")}>
          Utilisateurs
        </Link>
        <Link to="/users/create" className={itemClass("/users/create")}>
          Ajouter utilisateur
        </Link>
      </div>

      <div className="mt-auto p-3 border-top border-secondary text-secondary small">
        © {new Date().getFullYear()}
      </div>
    </div>
  );
}