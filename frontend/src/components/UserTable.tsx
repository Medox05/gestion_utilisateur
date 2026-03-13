import { useNavigate } from "react-router-dom";
import type { User } from "../types/models";

type Props = {
  users: User[];
  onDelete: (id: number) => void;
};

export default function UserTable({ users, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Login</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th style={{ whiteSpace: "nowrap" }}>Type accès</th>
            <th>Date création</th>
            <th>Sites</th>
            <th style={{ width: 180 }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ whiteSpace: "nowrap" }}>
              <td>{u.id}</td>
              <td>{u.login}</td>
              <td>{u.nom}</td>
              <td >{u.prenom}</td>
              <td >{u.email}</td>
              <td>
                <span className={`badge ${u.typeAcces === "GLOBAL" ? "bg-success" : "bg-secondary"}`}>
                  {u.typeAcces}
                </span>
              </td>
              <td>{u.dateCreation ? new Date(u.dateCreation).toLocaleString() : "-"}</td>
              <td>
                {u.typeAcces === "GLOBAL" ? (
                  <span className="badge bg-success">Tous les sites</span>
                ) : u.sites?.length ? (
                  u.sites.map((s) => (
                    <span key={s.id} className="badge bg-primary me-1">
                      {s.code}
                    </span>
                  ))
                ) : (
                  <span className="text-secondary">Aucun</span>
                )}
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => navigate(`/users/${u.id}/edit`)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(u.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan={10} className="text-center text-secondary py-4">
                Aucun utilisateur
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}