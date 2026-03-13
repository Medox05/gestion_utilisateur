import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingOverlay from "../components/LoadingOverlay";
import ToastHost, { type ToastType } from "../components/ToastHost";
import SitesSelector from "../components/SitesSelector";
import {
  createUser,
  getSites,
  getUserById,
  updateUser,
} from "../services/userService";
import type { Site } from "../types/models";

export default function UserFormPage({
  mode,
}: {
  mode: "create" | "edit";
}) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [globalAccess, setGlobalAccess] = useState(false);
  const [selectedSites, setSelectedSites] = useState<number[]>([]);

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

  const isOnlyText = (value: string) => /^[A-Za-zÀ-ÿ\s'-]+$/.test(value);
  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const toggleSite = (siteId: number) => {
    setSelectedSites((prev) =>
      prev.includes(siteId)
        ? prev.filter((id) => id !== siteId)
        : [...prev, siteId]
    );
  };

  const handleGlobalAccessChange = (checked: boolean) => {
    setGlobalAccess(checked);
    if (checked) setSelectedSites([]);
  };

  const loadSites = async () => {
    try {
      const data = await getSites();
      setSites(data);
    } catch {
      toastMsg("danger", "Erreur chargement des sites");
    }
  };

  const loadUser = async (userId: number) => {
    try {
      setLoading(true);
      const user = await getUserById(userId);

      setNom(user.nom ?? "");
      setPrenom(user.prenom ?? "");
      setEmail(user.email ?? "");
      setGlobalAccess(user.typeAcces === "GLOBAL");
      setSelectedSites(user.sites?.map((s: Site) => s.id) ?? []);
    } catch (e: any) {
      toastMsg("danger", e?.response?.data?.message ?? "Erreur chargement utilisateur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  useEffect(() => {
    if (mode === "edit" && id) {
      loadUser(Number(id));
    }
  }, [mode, id]);

  const submit = async () => {
    const nomValue = nom.trim();
    const prenomValue = prenom.trim();
    const emailValue = email.trim();

    if (!nomValue || !prenomValue || !emailValue) {
      toastMsg("danger", "Remplis tous les champs obligatoires");
      return;
    }

    if (!isOnlyText(nomValue)) {
      toastMsg("danger", "Le nom doit contenir uniquement du texte");
      return;
    }

    if (!isOnlyText(prenomValue)) {
      toastMsg("danger", "Le prénom doit contenir uniquement du texte");
      return;
    }

    if (!isValidEmail(emailValue)) {
      toastMsg("danger", "Email invalide");
      return;
    }

    if (!globalAccess && selectedSites.length === 0) {
      toastMsg("danger", "Choisis au moins un site");
      return;
    }

    const payload = {
      nom: nomValue,
      prenom: prenomValue,
      email: emailValue,
      globalAccess,
      sites: globalAccess ? [] : selectedSites,
    };

    try {
      setLoading(true);

      if (mode === "create") {
        await createUser(payload);
        toastMsg("success", "Utilisateur ajouté ✅");
      } else if (id) {
        await updateUser(Number(id), payload);
        toastMsg("success", "Utilisateur modifié ✅");
      }

      setTimeout(() => {
        navigate("/users");
      }, 700);
    } catch (e: any) {
      toastMsg("danger", e?.response?.data?.message ?? "Erreur enregistrement");
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
          <h2 className="mb-0">
            {mode === "create" ? "Ajouter utilisateur" : `Modifier utilisateur #${id}`}
          </h2>
          <div className="text-secondary">
            {mode === "create"
              ? "Création d’un nouvel utilisateur"
              : "Modification des informations utilisateur"}
          </div>
        </div>

        <button className="btn btn-outline-secondary" onClick={() => navigate("/users")}>
          Retour
        </button>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">Informations utilisateur</h5>

          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Nom</label>
              <input
                className="form-control"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Prénom</label>
              <input
                className="form-control"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Prénom"
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
          </div>
        </div>
      </div>

      <SitesSelector
        sites={sites}
        selectedSites={selectedSites}
        globalAccess={globalAccess}
        onToggleSite={toggleSite}
        onGlobalAccessChange={handleGlobalAccessChange}
      />

      <div className="mt-4 d-flex justify-content-end gap-2">
        <button className="btn btn-outline-secondary" onClick={() => navigate("/users")}>
          Annuler
        </button>
        <button className="btn btn-primary" onClick={submit}>
          {mode === "create" ? "Créer" : "Enregistrer"}
        </button>
      </div>
    </>
  );
}