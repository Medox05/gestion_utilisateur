export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      className="form-control"
      placeholder="Rechercher ( nom / prénom / email)"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}