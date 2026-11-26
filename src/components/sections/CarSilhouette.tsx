/**
 * Silhueta de carro "recortada pela luz" — estética de campanha automotiva
 * em estúdio escuro: só as bordas recebem luz azul, com um feixe de luz
 * percorrendo a linha do teto. Vetorial (leve e nítido em qualquer tela).
 */
export function CarSilhouette({ className = "" }: { className?: string }) {
  const body =
    "M78 236 C62 230 58 214 66 202 C74 192 92 188 120 184 L210 172 C262 150 318 118 382 100 C440 84 520 80 590 84 C660 88 718 104 770 132 L812 152 C858 158 904 166 930 180 C946 189 950 204 948 220 L946 232 C944 240 936 244 924 244 L862 244 C858 205 828 180 790 180 C752 180 722 205 718 244 L344 244 C340 205 310 180 272 180 C234 180 204 205 200 244 L96 244 C88 244 82 241 78 236 Z";
  const glass =
    "M300 168 C350 134 404 110 460 100 C520 92 590 92 640 98 L656 166 Z M676 166 L662 99 C704 106 742 120 776 142 L790 160 Z";
  const roofline = "M120 184 L210 172 C262 150 318 118 382 100 C440 84 520 80 590 84 C660 88 718 104 770 132 L812 152 C858 158 904 166 930 180";
  return (
    <svg viewBox="0 0 1000 320" className={className} aria-hidden="true" fill="none" overflow="visible">
      <defs>
        <linearGradient id="car-rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5b9bff" stopOpacity="0" />
          <stop offset="0.25" stopColor="#5b9bff" stopOpacity="0.55" />
          <stop offset="0.62" stopColor="#bcd6ff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#5b9bff" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="car-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d2350" />
          <stop offset="0.55" stopColor="#081633" />
          <stop offset="1" stopColor="#040b1c" />
        </linearGradient>
        <linearGradient id="car-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1a3f8f" stopOpacity="0.6" />
          <stop offset="1" stopColor="#06142f" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="car-head" cx="0" cy="0.5" r="1">
          <stop offset="0" stopColor="#fff6c8" />
          <stop offset="0.35" stopColor="#ffd000" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="car-beam" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#ffe68a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffd000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="car-floor" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1f63e0" stopOpacity="0" />
          <stop offset="0.5" stopColor="#5b9bff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#1f63e0" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="wheel" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" stopColor="#0b1530" />
          <stop offset="0.9" stopColor="#1b2b52" />
          <stop offset="1" stopColor="#5b9bff" stopOpacity="0.6" />
        </radialGradient>
      </defs>

      {/* feixe do farol */}
      <path d="M84 204 L-260 170 L-260 262 Z" fill="url(#car-beam)" opacity="0.35" />

      {/* carroceria */}
      <path d={body} fill="url(#car-body)" />
      <path d={glass} fill="url(#car-glass)" />
      {/* vinco lateral */}
      <path d="M150 206 C380 196 640 194 900 198" stroke="#5b9bff" strokeOpacity="0.35" strokeWidth="1.5" />
      {/* contorno com luz de recorte */}
      <path d={body} stroke="url(#car-rim)" strokeWidth="2" />
      {/* luz percorrendo o teto */}
      <path d={roofline} stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" pathLength={990} className="energy-flow" />

      {/* rodas */}
      {[272, 790].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="244" r="54" fill="url(#wheel)" />
          <circle cx={cx} cy="244" r="34" stroke="#5b9bff" strokeOpacity="0.45" strokeWidth="1.5" />
          {Array.from({ length: 5 }).map((_, i) => {
            const a = (i * 72 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={cx + Math.cos(a) * 8}
                y1={244 + Math.sin(a) * 8}
                x2={cx + Math.cos(a) * 32}
                y2={244 + Math.sin(a) * 32}
                stroke="#8fb6ff"
                strokeOpacity="0.35"
                strokeWidth="5"
                strokeLinecap="round"
              />
            );
          })}
          <circle cx={cx} cy="244" r="7" fill="#9fc0ff" fillOpacity="0.5" />
        </g>
      ))}

      {/* farol e lanterna */}
      <path d="M82 200 L130 192 L126 202 L86 208 Z" fill="#fff6c8" />
      <ellipse cx="100" cy="200" rx="46" ry="16" fill="url(#car-head)" opacity="0.85" />
      <path d="M912 182 L944 192 L942 202 L906 194 Z" fill="#ff3b3b" opacity="0.85" />

      {/* reflexo no piso */}
      <rect x="40" y="298" width="940" height="2" fill="url(#car-floor)" />
      <ellipse cx="530" cy="300" rx="430" ry="14" fill="#000" opacity="0.55" />
    </svg>
  );
}
