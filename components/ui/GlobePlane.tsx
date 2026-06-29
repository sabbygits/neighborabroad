'use client'

export default function GlobePlane() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <svg
        viewBox="0 0 320 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-sm"
      >
        {/* Globe shadow */}
        <ellipse cx="100" cy="158" rx="62" ry="8" fill="#4DB6AC" fillOpacity="0.15" />

        {/* Globe body */}
        <circle cx="100" cy="95" r="72" fill="#4DB6AC" />

        {/* Land masses */}
        <ellipse cx="85" cy="75" rx="22" ry="28" fill="#81C784" />
        <ellipse cx="115" cy="100" rx="14" ry="18" fill="#81C784" />
        <ellipse cx="70" cy="110" rx="10" ry="14" fill="#81C784" />
        <ellipse cx="100" cy="60" rx="12" ry="8" fill="#81C784" />
        <ellipse cx="130" cy="78" rx="8" ry="10" fill="#81C784" />

        {/* Globe shine */}
        <ellipse cx="78" cy="68" rx="14" ry="10" fill="white" fillOpacity="0.12" transform="rotate(-20 78 68)" />

        {/* Globe outline */}
        <circle cx="100" cy="95" r="72" stroke="#3DA899" strokeWidth="2" />

        {/* Flight arc path */}
        <path
          d="M 155 55 Q 220 10 285 45"
          stroke="#3DA899"
          strokeWidth="2"
          strokeDasharray="5 4"
          strokeLinecap="round"
        />

        {/* Plane */}
        <g transform="translate(261, 28) rotate(30)">
          <path
            d="M0 0 L14 -5 L16 0 L14 5 L0 0Z"
            fill="#2E7D74"
          />
          <path d="M4 -5 L10 -10 L12 -8 L6 -3Z" fill="#2E7D74" />
          <path d="M4 5 L10 10 L12 8 L6 3Z" fill="#2E7D74" />
          <path d="M1 -2 L5 -4 L5 4 L1 2Z" fill="#3DA899" />
        </g>
      </svg>
    </div>
  )
}
