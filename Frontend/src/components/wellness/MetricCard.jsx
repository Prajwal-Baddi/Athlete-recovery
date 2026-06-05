export default function MetricCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <div
      className="rounded-3xl border border-apex-border
      bg-apex-bg2 p-5 shadow-apex-card"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl"
        style={{
          background: `${color}20`,
          color,
        }}
      >
        {icon}
      </div>

      <p className="text-apex-txt2">
        {title}
      </p>

      <h2 className="text-4xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
}