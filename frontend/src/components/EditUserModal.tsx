import { useEffect, useState } from "react";
import type { Site, User } from "../types/models";
import { getSites, updateUser } from "../services/userService";

type Props = {
  user: User | null;
  onClose: () => void;
  onUpdated: () => void;
  onToast: (type: "success" | "danger", msg: string) => void;
};

export default function EditUserModal({
  user,
  onClose,
  onUpdated,
  onToast,
}: Props) {
  const [sites, setSites] = useState<Site[]>([]);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [selectedSites, setSelectedSites] = useState<number[]>([]);
  const [globalAccess, setGlobalAccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSites()
      .then((data) => setSites(data))
      .catch(() => onToast("danger", "Erreur chargement des sites"));
  }, [onToast]);

  useEffect(() => {
    if (!user) return;

    setNom(user.nom ?? "");
    setPrenom(user.prenom ?? "");
    setEmail(user.email ?? "");
    setGlobalAccess(user.typeAcces === "GLOBAL");
    setSelectedSites(user.sites?.map((s) => Number(s.id)) ?? []);
  }, [user]);

  const toggleSite = (id: number) => {
    setSelectedSites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleGlobalAccessChange = (checked: boolean) => {
    setGlobalAccess(checked);

    if (checked) {
      setSelectedSites([]);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    

    if (!nom.trim() || !prenom.trim() || !email.trim()) {
      onToast("danger", "Remplis nom, prénom et email");
      return;
    }

    if (!globalAccess && selectedSites.length === 0) {
      onToast("danger", "Choisis au moins un site");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        nom: nom.trim(),
        prenom: prenom.trim(),
        email: email.trim(),
        globalAccess,
        sites: globalAccess ? [] : selectedSites,
      };

      await updateUser(user.id, payload);

      onToast("success", "Utilisateur modifié ✅");
      onUpdated();
      onClose();
    } catch (e: any) {
      onToast(
        "danger",
        e?.response?.data?.message ?? "Erreur modification utilisateur"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={onClose}>
      <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Edit User #{user.id}</h4>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <input className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom"/>
              </div>

              <div className="col-md-4">
                <input className="form-control" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Prénom"/>
              </div>

              <div className="col-md-4">
                <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
              </div>
            </div>

            <div className="fw-semibold mb-2">Sites autorisés</div>

            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" id="editGlobalAccess" checked={globalAccess} onChange={(e) => handleGlobalAccessChange(e.target.checked)}/>
              <label className="form-check-label" htmlFor="editGlobalAccess">
                Accès global (Tous les sites)
              </label>
            </div>

            {!globalAccess && (
              <div className="row">
                {sites.map((s) => (
                  <div key={s.id} className="col-md-4 mb-2">
                    <label className="d-flex align-items-center gap-2">
                      <input type="checkbox" checked={selectedSites.includes(Number(s.id))} onChange={() => toggleSite(Number(s.id))}/>
                      <span>{s.nom}</span>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {globalAccess && (
              <div className="text-success">Tous les sites seront autorisés</div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
            Cancel
            </button>

            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}