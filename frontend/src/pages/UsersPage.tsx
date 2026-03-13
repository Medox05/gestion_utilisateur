import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import LoadingOverlay from "../components/LoadingOverlay";
import ToastHost, { type ToastType } from "../components/ToastHost";
import UserTable from "../components/UserTable";
import { deleteUser, getUsers } from "../services/userService";
import type { User } from "../types/models";

export default function UsersPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [toast, setToast] = useState<{
    show: boolean;
    type: ToastType;
    message: string;
  }>({
    show: false,
    type: "success",
    message: "",
  });

  const toastMsg = (type: ToastType, message: string) => {
    setToast({ show: true, type, message });
  };

  const load = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (e: any) {
      toastMsg("danger", e?.response?.data?.message ?? "Erreur chargement utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;

    return users.filter((u) =>
      [u.login, u.nom, u.prenom, u.email].some((v) =>
        (v || "").toLowerCase().includes(q)
      )
    );
  }, [users, search]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const onDelete = async (id: number) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;

    try {
      setLoading(true);
      await deleteUser(id);
      toastMsg("success", "Utilisateur supprimé ✅");
      await load();
    } catch (e: any) {
      toastMsg("danger", e?.response?.data?.message ?? "Erreur suppression");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay show={loading} />

      <ToastHost
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="mb-0">Utilisateurs</h2>
          <div className="text-secondary">Liste des utilisateurs</div>
        </div>

        <button className="btn btn-success" onClick={() => navigate("/users/create")}>
          + Ajouter utilisateur
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="mb-0">Table des utilisateurs</h5>
            <span className="badge bg-dark">Total: {users.length}</span>
          </div>

          <div className="mb-3">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <UserTable users={paged} onDelete={onDelete} />

          <Pagination
            page={page}
            pageSize={pageSize}
            total={filtered.length}
            onPageChange={setPage}
          />
        </div>
      </div>
    </>
  );
}