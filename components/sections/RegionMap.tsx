/**
 * Stylized (not to-scale) map of the service area — static SVG, no map API.
 * Towns are placed in approximate relative positions around Lake Cumberland.
 */
export function RegionMap({ className = "" }: { className?: string }) {
  const towns: { name: string; x: number; y: number; hq?: boolean }[] = [
    { name: "Columbia", x: 95, y: 118 },
    { name: "Russell Springs", x: 205, y: 128, hq: true },
    { name: "Jamestown", x: 215, y: 178 },
    { name: "Somerset", x: 388, y: 118 },
    { name: "Monticello", x: 340, y: 232 },
    { name: "Albany", x: 218, y: 268 },
  ];
  return (
    <svg
      viewBox="0 0 480 320"
      role="img"
      aria-label="Stylized map of our service area: Russell Springs (headquarters), Jamestown, Somerset, Columbia, Monticello, and Albany around Lake Cumberland"
      className={className}
    >
      <rect width="480" height="320" rx="12" fill="#F5F1E9" />
      {/* Lake Cumberland — stylized */}
      <path
        d="M60 205 C 120 185, 160 210, 215 200 S 320 170, 370 185 S 430 175, 455 160"
        fill="none"
        stroke="#97B7D9"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path
        d="M150 215 C 190 225, 240 212, 285 205"
        fill="none"
        stroke="#97B7D9"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.5"
      />
      <text x="290" y="200" fontSize="11" fontStyle="italic" fill="#3D71A8">
        Lake Cumberland
      </text>
      {towns.map((t) => (
        <g key={t.name}>
          {t.hq ? (
            <>
              <circle cx={t.x} cy={t.y} r="10" fill="#B08D3E" opacity="0.3" />
              <circle cx={t.x} cy={t.y} r="5.5" fill="#0C447C" stroke="#B08D3E" strokeWidth="2" />
            </>
          ) : (
            <circle cx={t.x} cy={t.y} r="4.5" fill="#0C447C" />
          )}
          <text
            x={t.x}
            y={t.y - 12}
            fontSize="12"
            fontWeight={t.hq ? 700 : 500}
            fill="#16202E"
            textAnchor="middle"
          >
            {t.name}
          </text>
          {t.hq ? (
            <text x={t.x} y={t.y + 22} fontSize="9" fill="#93712B" textAnchor="middle" fontWeight={700} letterSpacing="1">
              OUR SHOP
            </text>
          ) : null}
        </g>
      ))}
      <text x="14" y="306" fontSize="9" fill="#4C5D76">
        Not to scale — six counties, one local team.
      </text>
    </svg>
  );
}
