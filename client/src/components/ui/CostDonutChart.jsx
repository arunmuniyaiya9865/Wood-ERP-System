export default function CostDonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 58;
  const gap = 2;

  let cumAngle = -Math.PI / 2;
  const slices = data
    .filter((d) => d.value > 0)
    .map((d) => {
      const fraction = d.value / total;
      const angle = fraction * (2 * Math.PI);
      const startAngle = cumAngle + gap / r;
      const endAngle = cumAngle + angle - gap / r;
      cumAngle += angle;

      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const largeArc = angle > Math.PI ? 1 : 0;

      return { ...d, path: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`, fraction };
    });

  const fmt = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 }).format(n);

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((s, i) => (
          <path
            key={i}
            d={s.path}
            fill="none"
            stroke={s.color}
            strokeWidth="16"
            strokeLinecap="round"
            style={{ transition: "stroke-width 200ms" }}
          />
        ))}
        {/* Center label */}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="10" fill="#9ca3af" fontFamily="system-ui">Total</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="11" fontWeight="600" fill="#111827" fontFamily="system-ui">
          {fmt(total)}
        </text>
      </svg>

      {/* Legend */}
      <div className="w-full space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
              <span className="text-xs text-gray-500 truncate max-w-[100px]">{d.label}</span>
            </div>
            <span className="text-xs font-semibold text-gray-700 tabular-nums">
              {total > 0 ? Math.round((d.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}