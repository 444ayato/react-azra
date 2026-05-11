export default function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-[var(--dark-blue)]">{title}</h1>
      <p className="text-gray-500 text-sm mt-1">{subtitle}</p>
    </div>
  );
}