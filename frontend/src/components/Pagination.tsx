export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="d-flex align-items-center justify-content-between mt-3">
      <div className="text-secondary small">
        Page <b>{page}</b> / {totalPages} — Total: {total}
      </div>

      <div className="btn-group">
        <button className="btn btn-outline-secondary" disabled={!canPrev} onClick={() => onPageChange(1)}>
          «
        </button>
        <button className="btn btn-outline-secondary" disabled={!canPrev} onClick={() => onPageChange(page - 1)}>
          ‹
        </button>
        <button className="btn btn-outline-secondary" disabled={!canNext} onClick={() => onPageChange(page + 1)}>        
          ›
        </button>
        <button className="btn btn-outline-secondary" disabled={!canNext} onClick={() => onPageChange(totalPages)}>
          »
        </button>
      </div>
    </div>
  );
}