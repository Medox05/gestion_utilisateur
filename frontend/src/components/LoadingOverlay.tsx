export default function LoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.25)", zIndex: 2000 }}>

      <div className="bg-white rounded-3 shadow p-4 d-flex align-items-center gap-3">
        <div className="spinner-border" role="status" aria-label="loading" />
        <div className="fw-semibold">Loading...</div>
        
      </div>
    </div>
  );
}