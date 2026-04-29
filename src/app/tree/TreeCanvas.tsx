"use client";

/* ── Knowledge Tree — 11 SVG Stages ─────────────────────────────────────────
   viewBox 0 0 400 440  •  each stage composed of layered SVG elements
   CSS animation classes are applied to the root <svg> so child elements
   can use @keyframes-based animations defined in globals.css
   ───────────────────────────────────────────────────────────────────────── */

type Props = { stage: number; transitioning?: boolean };

export default function TreeCanvas({ stage, transitioning }: Props) {
  const s = Math.max(0, Math.min(10, stage));

  return (
    <svg
      viewBox="0 0 400 440"
      className={`w-full max-w-[380px] select-none transition-all duration-700 ${transitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
      aria-label={`Knowledge tree, stage ${s}`}
    >
      {/* ── Ground ── */}
      <Ground stage={s} />

      {/* ── Tree ── */}
      {s === 0  && <Stage0 />}
      {s === 1  && <Stage1 />}
      {s === 2  && <Stage2 />}
      {s === 3  && <Stage3 />}
      {s === 4  && <Stage4 />}
      {s === 5  && <Stage5 />}
      {s === 6  && <Stage6 />}
      {s === 7  && <Stage7 />}
      {s === 8  && <Stage8 />}
      {s === 9  && <Stage9 />}
      {s === 10 && <Stage10 />}
    </svg>
  );
}

/* ── Ground ─────────────────────────────────────────────────────────────── */
function Ground({ stage }: { stage: number }) {
  const cracked = stage < 2;
  const grassColor = stage < 2 ? "#2a1f0e" : stage < 4 ? "#2d4a1e" : "#3a6b28";
  const groundColor = stage < 2 ? "#1a1208" : "#1e2e10";

  return (
    <g>
      {/* Ground base */}
      <ellipse cx="200" cy="410" rx="130" ry="18" fill={groundColor} />
      {cracked ? (
        <>
          {/* Cracks */}
          <line x1="140" y1="405" x2="155" y2="415" stroke="#0f0a04" strokeWidth="1.5" />
          <line x1="155" y1="415" x2="145" y2="420" stroke="#0f0a04" strokeWidth="1" />
          <line x1="240" y1="403" x2="255" y2="413" stroke="#0f0a04" strokeWidth="1.5" />
          <line x1="255" y1="413" x2="265" y2="408" stroke="#0f0a04" strokeWidth="1" />
          <line x1="195" y1="408" x2="205" y2="418" stroke="#0f0a04" strokeWidth="1" />
        </>
      ) : (
        /* Grass blades */
        <g fill={grassColor}>
          {[150,160,170,180,200,215,230,245,255].map((x, i) => (
            <ellipse key={i} cx={x} cy={405} rx={3} ry={6 + (i % 3)} />
          ))}
        </g>
      )}
    </g>
  );
}

/* ── Trunk helper ────────────────────────────────────────────────────────── */
function Trunk({ height = 120, color = "#4a3728", girth = 12 }: {
  height?: number; color?: string; girth?: number;
}) {
  const top = 400 - height;
  return (
    <path
      d={`M ${200 - girth} 400 Q ${200 - girth / 2} ${top + height / 2} ${200 - girth / 3} ${top}
          L ${200 + girth / 3} ${top} Q ${200 + girth / 2} ${top + height / 2} ${200 + girth} 400 Z`}
      fill={color}
    />
  );
}

/* ── Stage 0 — Dead / Barren ─────────────────────────────────────────────── */
function Stage0() {
  return (
    <g>
      <Trunk height={110} color="#2a2220" girth={10} />
      {/* Main branches — dark, twisted */}
      <g stroke="#1e1a18" strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M200 290 Q170 265 140 255" />
        <path d="M200 290 Q230 265 260 255" />
        <path d="M185 310 Q155 290 130 295" />
        <path d="M215 310 Q245 290 270 295" />
        {/* Twigs */}
        <path d="M140 255 Q125 245 115 235" strokeWidth="2.5" />
        <path d="M140 255 Q135 242 130 230" strokeWidth="2" />
        <path d="M260 255 Q275 245 285 235" strokeWidth="2.5" />
        <path d="M260 255 Q265 242 270 230" strokeWidth="2" />
        <path d="M130 295 Q115 285 105 275" strokeWidth="2" />
        <path d="M270 295 Q285 285 295 275" strokeWidth="2" />
      </g>
    </g>
  );
}

/* ── Stage 1 — First Breath (buds) ──────────────────────────────────────── */
function Stage1() {
  return (
    <g>
      <Trunk height={115} color="#3a2a1e" girth={11} />
      <g stroke="#2e1f14" strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M200 285 Q170 260 138 250" />
        <path d="M200 285 Q230 260 262 250" />
        <path d="M185 305 Q155 285 128 290" />
        <path d="M215 305 Q245 285 272 290" />
        <path d="M138 250 Q122 240 112 228" strokeWidth="2.5" />
        <path d="M138 250 Q133 237 128 225" strokeWidth="2" />
        <path d="M262 250 Q278 240 288 228" strokeWidth="2.5" />
        <path d="M262 250 Q267 237 272 225" strokeWidth="2" />
      </g>
      {/* Amber buds */}
      {[
        [112, 228], [128, 225], [288, 228], [272, 225],
        [138, 250], [262, 250], [128, 290], [272, 290],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4} fill="#d97706" opacity={0.85} />
      ))}
    </g>
  );
}

/* ── Stage 2 — Awakening (tiny pale green leaves) ───────────────────────── */
function Stage2() {
  return (
    <g>
      <Trunk height={120} color="#4a3220" girth={12} />
      <g stroke="#3a2510" strokeWidth="3.5" fill="none" strokeLinecap="round">
        <path d="M200 280 Q168 255 135 245" />
        <path d="M200 280 Q232 255 265 245" />
        <path d="M183 302 Q152 280 124 285" />
        <path d="M217 302 Q248 280 276 285" />
        <path d="M135 245 Q118 233 108 220" strokeWidth="2.5" />
        <path d="M265 245 Q282 233 292 220" strokeWidth="2.5" />
      </g>
      {/* Small pale green leaf clusters */}
      {[
        [108, 220, 14], [292, 220, 14],
        [135, 245, 12], [265, 245, 12],
        [124, 285, 11], [276, 285, 11],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.7} fill="#a3c97a" opacity={0.75} />
      ))}
      {/* Tiny grass patch center */}
      <ellipse cx="200" cy="395" rx="40" ry="6" fill="#3a6b28" opacity="0.5" />
    </g>
  );
}

/* ── Stage 3 — Sprout (canopy forming) ──────────────────────────────────── */
function Stage3() {
  return (
    <g className="tree-sway">
      <Trunk height={130} color="#5a3c28" girth={13} />
      <g stroke="#4a2e18" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M200 270 Q165 245 128 238" />
        <path d="M200 270 Q235 245 272 238" />
        <path d="M180 295 Q145 270 115 275" />
        <path d="M220 295 Q255 270 285 275" />
      </g>
      {/* Muted green canopy blobs */}
      <ellipse cx="200" cy="250" rx="55" ry="40" fill="#6a9a42" opacity="0.7" />
      <ellipse cx="150" cy="260" rx="38" ry="28" fill="#5a8a38" opacity="0.75" />
      <ellipse cx="250" cy="260" rx="38" ry="28" fill="#5a8a38" opacity="0.75" />
      <ellipse cx="130" cy="285" rx="28" ry="20" fill="#5a8a38" opacity="0.6" />
      <ellipse cx="270" cy="285" rx="28" ry="20" fill="#5a8a38" opacity="0.6" />
    </g>
  );
}

/* ── Stage 4 — Sapling (clear young canopy) ─────────────────────────────── */
function Stage4() {
  return (
    <g className="tree-sway">
      <Trunk height={140} color="#6b4832" girth={14} />
      {/* Canopy — more defined, soft green */}
      <ellipse cx="200" cy="240" rx="65" ry="48" fill="#7ab854" opacity="0.8" />
      <ellipse cx="200" cy="220" rx="50" ry="38" fill="#8dca64" opacity="0.85" />
      <ellipse cx="155" cy="255" rx="42" ry="30" fill="#7ab854" opacity="0.8" />
      <ellipse cx="245" cy="255" rx="42" ry="30" fill="#7ab854" opacity="0.8" />
      <ellipse cx="200" cy="260" rx="70" ry="35" fill="#6aa848" opacity="0.6" />
      {/* Ground grass */}
      <ellipse cx="200" cy="402" rx="80" ry="8" fill="#4a8a32" opacity="0.55" />
    </g>
  );
}

/* ── Stage 5 — Growing (bright green + flowers) ─────────────────────────── */
function Stage5() {
  return (
    <g className="tree-sway">
      <Trunk height={150} color="#7a5238" girth={15} />
      <ellipse cx="200" cy="230" rx="75" ry="55" fill="#86d056" opacity="0.85" />
      <ellipse cx="200" cy="210" rx="58" ry="44" fill="#9ae464" opacity="0.9" />
      <ellipse cx="148" cy="248" rx="48" ry="34" fill="#86d056" opacity="0.82" />
      <ellipse cx="252" cy="248" rx="48" ry="34" fill="#86d056" opacity="0.82" />
      <ellipse cx="200" cy="268" rx="80" ry="38" fill="#72be48" opacity="0.65" />
      {/* Flowers — white/pink dots */}
      {[
        [175, 215], [200, 200], [225, 215],
        [155, 240], [245, 240], [190, 235], [210, 235],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill={i % 2 === 0 ? "#fff" : "#f9a8d4"} opacity={0.9} />
      ))}
      <ellipse cx="200" cy="403" rx="90" ry="9" fill="#4a8a32" opacity="0.6" />
    </g>
  );
}

/* ── Stage 6 — Flourishing (wider + golden tones + soft glow) ───────────── */
function Stage6() {
  return (
    <g className="tree-glow">
      <Trunk height={158} color="#8a5c3a" girth={16} />
      {/* Glow aura behind canopy */}
      <ellipse cx="200" cy="225" rx="95" ry="70" fill="#fde68a" opacity="0.12" />
      {/* Canopy layers */}
      <ellipse cx="200" cy="225" rx="85" ry="62" fill="#92d45a" opacity="0.82" />
      <ellipse cx="200" cy="205" rx="65" ry="50" fill="#a8e866" opacity="0.88" />
      <ellipse cx="140" cy="243" rx="54" ry="38" fill="#88c852" opacity="0.84" />
      <ellipse cx="260" cy="243" rx="54" ry="38" fill="#88c852" opacity="0.84" />
      <ellipse cx="200" cy="268" rx="90" ry="40" fill="#7ab848" opacity="0.68" />
      {/* Golden leaves */}
      {[[168,208],[200,195],[232,208],[148,235],[252,235]].map(([x,y],i) => (
        <ellipse key={i} cx={x} cy={y} rx={8} ry={5} fill="#fbbf24" opacity={0.6} />
      ))}
      {/* Flowers */}
      {[[178,212],[200,198],[222,212],[155,238],[245,238]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={5} fill={i%2===0?"#fff":"#fde68a"} opacity={0.85} />
      ))}
      <ellipse cx="200" cy="403" rx="100" ry="9" fill="#4a8a32" opacity="0.65" />
    </g>
  );
}

/* ── Stage 7 — Ancient (rich green + trunk glow + fireflies) ────────────── */
function Stage7() {
  return (
    <g>
      {/* Trunk with glow */}
      <g className="tree-glow">
        <Trunk height={165} color="#9a6842" girth={17} />
        {/* Deep green canopy */}
        <ellipse cx="200" cy="218" rx="92" ry="68" fill="#2d7a3a" opacity="0.9" />
        <ellipse cx="200" cy="198" rx="72" ry="56" fill="#3a9848" opacity="0.92" />
        <ellipse cx="135" cy="238" rx="58" ry="42" fill="#2d7a3a" opacity="0.88" />
        <ellipse cx="265" cy="238" rx="58" ry="42" fill="#2d7a3a" opacity="0.88" />
        <ellipse cx="200" cy="265" rx="95" ry="42" fill="#266830" opacity="0.7" />
        {/* Golden canopy highlights */}
        {[[172,205],[200,190],[228,205],[148,232],[252,232]].map(([x,y],i) => (
          <ellipse key={i} cx={x} cy={y} rx={10} ry={6} fill="#86efac" opacity={0.5} />
        ))}
      </g>
      {/* Fireflies — independent animation */}
      <circle className="firefly-1" cx="160" cy="240" r="3" fill="#fef08a" opacity="0.9" />
      <circle className="firefly-2" cx="240" cy="230" r="2.5" fill="#fef08a" opacity="0.8" />
      <circle className="firefly-3" cx="175" cy="210" r="2" fill="#d9f99d" opacity="0.85" />
      <circle className="firefly-4" cx="225" cy="215" r="2.5" fill="#fef08a" opacity="0.75" />
      <ellipse cx="200" cy="403" rx="105" ry="9" fill="#3a7a28" opacity="0.7" />
    </g>
  );
}

/* ── Stage 8 — Radiant (majestic, wide, flowers + sway) ─────────────────── */
function Stage8() {
  return (
    <g className="tree-sway-heavy">
      <Trunk height={172} color="#a87248" girth={18} />
      {/* Wide canopy */}
      <ellipse cx="200" cy="210" rx="105" ry="76" fill="#2e823e" opacity="0.88" />
      <ellipse cx="200" cy="188" rx="82" ry="62" fill="#3aaa50" opacity="0.92" />
      <ellipse cx="125" cy="232" rx="64" ry="46" fill="#2e823e" opacity="0.86" />
      <ellipse cx="275" cy="232" rx="64" ry="46" fill="#2e823e" opacity="0.86" />
      <ellipse cx="200" cy="268" rx="108" ry="44" fill="#276234" opacity="0.72" />
      {/* Blooming flowers */}
      {[
        [165,195,6],[200,180,7],[235,195,6],
        [138,222,5],[262,222,5],[175,215,5],[225,215,5],
      ].map(([x,y,r],i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={i%3===0?"#fda4af":i%3===1?"#fff":"#fde68a"} opacity={0.9} />
      ))}
      {/* Simple birds */}
      <g stroke="#1a2e1a" strokeWidth="1.5" fill="none" strokeLinecap="round">
        <path d="M125 180 Q130 175 135 180" />
        <path d="M268 168 Q273 163 278 168" />
        <path d="M155 155 Q161 149 167 155" />
      </g>
      {/* Fireflies */}
      <circle className="firefly-1" cx="155" cy="235" r="3" fill="#fef08a" opacity="0.85" />
      <circle className="firefly-3" cx="245" cy="228" r="2.5" fill="#d9f99d" opacity="0.8" />
      <ellipse cx="200" cy="403" rx="112" ry="9" fill="#3a7a28" opacity="0.72" />
    </g>
  );
}

/* ── Stage 9 — Enchanted (golden shimmer + falling petals) ──────────────── */
function Stage9() {
  return (
    <g className="tree-glow-gold">
      <Trunk height={178} color="#c4884a" girth={19} />
      {/* Glowing golden canopy */}
      <ellipse cx="200" cy="200" rx="112" ry="82" fill="#3a7a28" opacity="0.85" />
      <ellipse cx="200" cy="178" rx="88" ry="68" fill="#4aaa38" opacity="0.9" />
      <ellipse cx="118" cy="225" rx="70" ry="50" fill="#3a7a28" opacity="0.85" />
      <ellipse cx="282" cy="225" rx="70" ry="50" fill="#3a7a28" opacity="0.85" />
      <ellipse cx="200" cy="268" rx="115" ry="46" fill="#2a6020" opacity="0.72" />
      {/* Golden shimmer leaves */}
      {[
        [162,188],[200,172],[238,188],[138,215],[262,215],
        [175,205],[225,205],[195,195],[205,195],
      ].map(([x,y],i) => (
        <ellipse key={i} cx={x} cy={y} rx={12} ry={7}
          fill={i%2===0?"#fbbf24":"#fef08a"} opacity={0.65} />
      ))}
      {/* Falling petals */}
      <ellipse className="petal-1" cx="160" cy="195" rx="5" ry="3" fill="#fda4af" opacity="0.9" />
      <ellipse className="petal-2" cx="240" cy="185" rx="4" ry="2.5" fill="#fde68a" opacity="0.85" />
      <ellipse className="petal-3" cx="195" cy="175" rx="5" ry="3" fill="#fda4af" opacity="0.8" />
      <ellipse className="petal-4" cx="225" cy="200" rx="4" ry="2.5" fill="#fde68a" opacity="0.9" />
      <ellipse className="petal-5" cx="175" cy="210" rx="4" ry="2.5" fill="#fda4af" opacity="0.85" />
      <ellipse className="petal-6" cx="215" cy="192" rx="5" ry="3" fill="#fef08a" opacity="0.8" />
      {/* Fireflies */}
      <circle className="firefly-1" cx="152" cy="228" r="3.5" fill="#fef08a" opacity="0.9" />
      <circle className="firefly-2" cx="248" cy="220" r="3" fill="#d9f99d" opacity="0.85" />
      <circle className="firefly-3" cx="170" cy="205" r="2.5" fill="#fef08a" opacity="0.8" />
      <circle className="firefly-4" cx="230" cy="210" r="3" fill="#d9f99d" opacity="0.8" />
      <ellipse cx="200" cy="403" rx="118" ry="9" fill="#3a7a28" opacity="0.75" />
    </g>
  );
}

/* ── Stage 10 — Legendary ────────────────────────────────────────────────── */
function Stage10() {
  return (
    <g>
      {/* Aura rings */}
      <circle className="aura-ring-1" cx="200" cy="220" r="60" fill="none" stroke="#fbbf24" strokeWidth="3" opacity="0.4" />
      <circle className="aura-ring-2" cx="200" cy="220" r="60" fill="none" stroke="#86efac" strokeWidth="3" opacity="0.35" />
      <circle className="aura-ring-3" cx="200" cy="220" r="60" fill="none" stroke="#c4b5fd" strokeWidth="3" opacity="0.3" />

      <g className="tree-glow-gold">
        <Trunk height={185} color="#d4986a" girth={20} />
        {/* Radiant canopy */}
        <ellipse cx="200" cy="190" rx="122" ry="90" fill="#2a6820" opacity="0.85" />
        <ellipse cx="200" cy="165" rx="95" ry="74" fill="#3a9830" opacity="0.9" />
        <ellipse cx="110" cy="218" rx="76" ry="55" fill="#2a6820" opacity="0.85" />
        <ellipse cx="290" cy="218" rx="76" ry="55" fill="#2a6820" opacity="0.85" />
        <ellipse cx="200" cy="272" rx="120" ry="48" fill="#205018" opacity="0.72" />
        {/* Dense golden-glowing leaves */}
        {[
          [155,178],[180,162],[200,155],[220,162],[245,178],
          [130,208],[170,198],[200,192],[230,198],[270,208],
          [145,225],[255,225],
        ].map(([x,y],i) => (
          <ellipse key={i} cx={x} cy={y} rx={14} ry={8}
            fill={i%3===0?"#fbbf24":i%3===1?"#fef08a":"#86efac"} opacity={0.7} />
        ))}
        {/* Flowers */}
        {[[168,172],[200,158],[232,172],[148,200],[252,200]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r={6}
            fill={i%2===0?"#fda4af":"#fff"} opacity={0.95} />
        ))}
      </g>

      {/* Sparkles */}
      <g fill="#fbbf24">
        <path className="sparkle-1" d="M120 170 l3-8 3 8-8-3 8 3z" />
        <path className="sparkle-2" d="M280 165 l3-8 3 8-8-3 8 3z" />
        <path className="sparkle-3" d="M145 140 l2.5-7 2.5 7-7-2.5 7 2.5z" />
        <path className="sparkle-4" d="M255 140 l2.5-7 2.5 7-7-2.5 7 2.5z" />
        <path className="sparkle-5" d="M200 130 l3-8 3 8-8-3 8 3z" />
        <path className="sparkle-6" d="M165 155 l2-5 2 5-5-2 5 2z" fill="#c4b5fd" />
      </g>

      {/* Falling petals */}
      <ellipse className="petal-1" cx="158" cy="185" rx="6" ry="3.5" fill="#fda4af" opacity="0.92" />
      <ellipse className="petal-2" cx="242" cy="175" rx="5" ry="3" fill="#fde68a" opacity="0.88" />
      <ellipse className="petal-3" cx="195" cy="162" rx="6" ry="3.5" fill="#c4b5fd" opacity="0.85" />
      <ellipse className="petal-4" cx="225" cy="192" rx="5" ry="3" fill="#fde68a" opacity="0.92" />
      <ellipse className="petal-5" cx="172" cy="202" rx="5" ry="3" fill="#fda4af" opacity="0.88" />
      <ellipse className="petal-6" cx="218" cy="182" rx="6" ry="3.5" fill="#c4b5fd" opacity="0.82" />

      {/* Fireflies */}
      <circle className="firefly-1" cx="148" cy="222" r="4" fill="#fef08a" opacity="0.95" />
      <circle className="firefly-2" cx="252" cy="215" r="3.5" fill="#d9f99d" opacity="0.9" />
      <circle className="firefly-3" cx="165" cy="198" r="3" fill="#c4b5fd" opacity="0.85" />
      <circle className="firefly-4" cx="235" cy="205" r="3.5" fill="#fef08a" opacity="0.9" />

      <ellipse cx="200" cy="403" rx="125" ry="9" fill="#3a7a28" opacity="0.78" />
    </g>
  );
}
