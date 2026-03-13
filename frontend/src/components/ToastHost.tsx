export type ToastType = "success" | "danger" | "warning" | "info";

export default function ToastHost({
  show,
  type,
  message,
  onClose,
}: {
  show: boolean;
  type: ToastType;
  message: string;
  onClose: () => void;
}) { 
  if (!show) return null;

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 2500 }}>
      <div className={`toast show text-bg-${type} border-0`} role="alert">
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}