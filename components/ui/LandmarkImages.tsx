'use client'

/**
 * Hub-and-spoke: Globe at center, 3 circles per side with ~14% vertical gap between each.
 * SVG viewBox 0-100 → x = % of container width, y = % of height (~375×330px).
 *
 * Left column:   Paris  top=2%  left=4%  size=62  → SVG (12, 11)
 *                Tokyo  top=36% left=2%  size=56  → SVG (10, 44)
 *                Rome   top=67% left=5%  size=54  → SVG (12, 75)
 *
 * Right column:  London top=2%  right=4% size=56  → SVG (89, 10)
 *                Mumbai top=33% right=2% size=58  → SVG (90, 42)
 *                Santorini top=64% right=3% size=62 → SVG (89, 73)
 *
 * Globe:         top=33% center size=90          → SVG (50, 47)
 *
 * Vertical gaps: L: Paris→Tokyo 15%, Tokyo→Rome 14% | R: London→Mumbai 14%, Mumbai→Santorini 13%
 */

const cities = [
  {
    // Eiffel Tower at blue hour — much richer than the old shot
    src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&h=300&fit=crop&auto=format',
    alt: 'Paris',
    size: 62,
    style: { top: '2%', left: '4%' },
    cx: 12, cy: 11,
  },
  {
    // Big Ben + Westminster at golden hour
    src: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=300&fit=crop&auto=format',
    alt: 'London',
    size: 56,
    style: { top: '2%', right: '4%' },
    cx: 89, cy: 10,
  },
  {
    // Mount Fuji with Chureito Pagoda — iconic Japan shot
    src: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=300&h=300&fit=crop&auto=format',
    alt: 'Tokyo',
    size: 56,
    style: { top: '36%', left: '2%' },
    cx: 10, cy: 44,
  },
  {
    // Mumbai skyline at night
    src: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=300&h=300&fit=crop&auto=format',
    alt: 'Mumbai',
    size: 58,
    style: { top: '33%', right: '2%' },
    cx: 90, cy: 42,
  },
  {
    // Colosseum aerial — dramatic and clear
    src: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=300&h=300&fit=crop&auto=format',
    alt: 'Rome',
    size: 54,
    style: { top: '67%', left: '5%' },
    cx: 12, cy: 75,
  },
  {
    // Santorini blue domes — the classic postcard shot
    src: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=300&fit=crop&auto=format',
    alt: 'Santorini',
    size: 62,
    style: { top: '64%', right: '3%' },
    cx: 89, cy: 73,
  },
]

// Earth at night — city lights from space
const GLOBE_SRC = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=300&fit=crop&auto=format'
const GLOBE_SIZE = 90
const GX = 50
const GY = 47

/**
 * Decoration zones — each verified clear of all circles by >5%:
 *   ✈️  (41–47%, 3–9%)    top-center between Paris & London
 *   🍕  (24–29%, 12–17%)  upper-left, right of Paris, above globe
 *   🎒  (63–68%, 11–16%)  upper-right, left of London, above globe
 *   🛂  (21–27%, 56–62%)  left-mid below Tokyo (ends 53%), above Rome (starts 67%)
 *   🗺️  (72–77%, 53–59%)  right-mid below globe (ends 60%), left of Mumbai/Santorini
 *   🍜  (34–39%, 72–78%)  bottom-center-left, right of Rome (ends x=19%)
 *   🥐  (63–68%, 71–77%)  bottom-center-right, left of Santorini (starts x=78.5%)
 */
const decorations = [
  { emoji: '✈️', style: { top: '3%',  left: '41%'  }, size: 22, rotate: '-15deg' },
  { emoji: '🍕', style: { top: '12%', left: '24%'  }, size: 18, rotate: '12deg'  },
  { emoji: '🎒', style: { top: '11%', left: '63%'  }, size: 18, rotate: '-8deg'  },
  { emoji: '🛂', style: { top: '56%', left: '21%'  }, size: 19, rotate: '-5deg'  },
  { emoji: '🗺️', style: { top: '53%', left: '72%'  }, size: 19, rotate: '8deg'   },
  { emoji: '🍜', style: { top: '72%', left: '34%'  }, size: 19, rotate: '10deg'  },
  { emoji: '🥐', style: { top: '71%', left: '63%'  }, size: 18, rotate: '-9deg'  },
]

export default function LandmarkImages() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 1. Lines — bottom layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {cities.map((c) => (
          <line
            key={c.alt}
            x1={GX} y1={GY}
            x2={c.cx} y2={c.cy}
            stroke="white"
            strokeWidth="1.2"
            strokeOpacity="0.65"
            strokeDasharray="3 2.5"
          />
        ))}
        {/* Glow ring + center dot at globe */}
        <circle cx={GX} cy={GY} r="2.6" fill="none" stroke="white" strokeWidth="0.6" strokeOpacity="0.3" />
        <circle cx={GX} cy={GY} r="1.3" fill="white" fillOpacity="0.6" />
        {/* Terminus dots at each city */}
        {cities.map((c) => (
          <circle key={c.alt} cx={c.cx} cy={c.cy} r="1.1" fill="white" fillOpacity="0.55" />
        ))}
      </svg>

      {/* 2. City circles */}
      {cities.map((city) => (
        <div key={city.alt} className="absolute" style={city.style}>
          <img
            src={city.src}
            alt={city.alt}
            width={city.size}
            height={city.size}
            className="rounded-full object-cover"
            style={{
              width: city.size,
              height: city.size,
              boxShadow: '0 4px 20px rgba(0,0,0,0.18), 0 0 0 3px white',
            }}
          />
        </div>
      ))}

      {/* 3. Central globe — on top of city circles */}
      <div
        className="absolute"
        style={{ top: '33%', left: '50%', transform: 'translateX(-50%)' }}
      >
        <img
          src={GLOBE_SRC}
          alt="Earth at night"
          width={GLOBE_SIZE}
          height={GLOBE_SIZE}
          className="rounded-full object-cover"
          style={{
            width: GLOBE_SIZE,
            height: GLOBE_SIZE,
            boxShadow: '0 6px 32px rgba(0,0,0,0.3), 0 0 0 4px white',
          }}
        />
      </div>

      {/* 4. Decorations — rendered last, always on top */}
      {decorations.map((d, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            ...d.style,
            fontSize: d.size,
            transform: `rotate(${d.rotate})`,
            opacity: 0.9,
            lineHeight: 1,
          }}
        >
          {d.emoji}
        </div>
      ))}
    </div>
  )
}
