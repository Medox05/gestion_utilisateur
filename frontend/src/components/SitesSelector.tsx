import type { Site } from "../types/models";

type Props = {
  sites: Site[];
  selectedSites: number[];
  globalAccess: boolean;
  onToggleSite: (id: number) => void;
  onGlobalAccessChange: (value: boolean) => void;
};

export default function SitesSelector({
  sites,
  selectedSites,
  globalAccess,
  onToggleSite,
  onGlobalAccessChange,
}: Props) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="mb-0">Sites autorisés</h5>
          <span className="badge bg-secondary">Accès</span>
        </div>

        <div className="form-check mb-3">
          <input className="form-check-input" type="checkbox" id="globalAccess" checked={globalAccess} onChange={(e) => onGlobalAccessChange(e.target.checked)}/>
          <label className="form-check-label" htmlFor="globalAccess">
            Accès global (Tous les sites)
          </label>
        </div>

        {globalAccess ? (
          <div className="alert alert-success mb-0">
            Tous les sites seront autorisés pour cet utilisateur.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 100 }}>Choisir</th>
                  <th style={{ width: 120 }}>Code</th>
                  <th>Nom</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site) => (
                  <tr key={site.id}>
                    <td>
                      <input type="checkbox" checked={selectedSites.includes(site.id)}onChange={() => onToggleSite(site.id)}/>
                    </td>
                    <td>{site.code}</td>
                    <td>{site.nom}</td>
                  </tr>
                ))}

                {sites.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-secondary">
                      Aucun site disponible
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}