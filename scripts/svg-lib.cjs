// Shared flat-vector SVG primitive library for public/illustrations/qNNN.svg
// generation, matching the character/scenery kit established in the
// original q001.svg (sky gradient, layered hills, round flat figures built
// from paths/rects, small flower clusters) and the fixed palette + canvas
// from specs/svg-illustration-spec.md §3/§5.
//
// Every primitive uses ONLY these palette colors and returns a plain SVG
// fragment string. Gradients are registered on a per-file `ctx` (unique ids
// via ctx.id()) and collected once into a single <defs> block by render().

const PALETTE = {
  SKY_LIGHT: "#BFE3F0",
  SKY_DEEP: "#8FCFE6",
  WHITE: "#FFFFFF",
  WARM_WHITE: "#F5FBFE",
  TEAL: "#7FB4B0",
  GREEN_LIGHT: "#9FCF6E",
  GREEN_DEEP: "#5E9E5A",
  SAGE: "#A9C5A0",
  GOLD: "#F2C94C",
  SAND: "#E9CE8E",
  BROWN: "#8B5A2B",
  BROWN_WARM: "#A0653A",
  CORAL: "#EB8A73",
  SKIN_LIGHT: "#F1C9A5",
  SKIN_MED: "#D9A878",
  GLOW: "#FCE39A",
  NAVY: "#3D5A80",
};

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function makeCtx(idPrefix = "") {
  let n = 0;
  return {
    defs: [],
    id(prefix) {
      n++;
      return `${idPrefix}${prefix}${n}`;
    },
  };
}

// ---- background layers ----------------------------------------------

function sky(ctx, top, bottom) {
  const id = ctx.id("sky");
  ctx.defs.push(
    `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>`,
  );
  return `<rect width="1200" height="900" fill="url(#${id})"/>`;
}

function hill(baseY, dip, color) {
  return `<path d="M0,${baseY} Q300,${baseY - dip} 600,${baseY - dip * 0.35} T1200,${baseY - dip * 0.45} V900 H0 Z" fill="${color}"/>`;
}

function ground(y, color) {
  return `<rect x="0" y="${y}" width="1200" height="${900 - y}" fill="${color}"/>`;
}

function wave(y, color, opacity = 0.75) {
  return `<path d="M0,${y} Q150,${y - 14} 300,${y} T600,${y} T900,${y} T1200,${y} V900 H0 Z" fill="${color}" opacity="${opacity}"/>`;
}

/** Soft contact shadow — grounds a standing figure/object visually. */
function shadow(rx = 30, ry = rx * 0.32, opacity = 0.22) {
  return `<ellipse cx="0" cy="4" rx="${rx}" ry="${ry}" fill="${PALETTE.GREEN_DEEP}" opacity="${opacity}"/>`;
}

/** A few thin grass blades — cheap ground texture filler. */
function grassTuft(cx, baseY, scale = 1, color = PALETTE.GREEN_DEEP) {
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    <path d="M-10,4 Q-14,-16 -6,-26" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M0,4 Q0,-22 4,-30" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M10,4 Q14,-14 8,-24" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>
  </g>`;
}

// ---- light & sky elements ---------------------------------------------

function glow(ctx, cx, cy, r, color = PALETTE.GLOW) {
  const id = ctx.id("glow");
  ctx.defs.push(
    `<radialGradient id="${id}"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`,
  );
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id})"/>`;
}

function sunDisc(cx, cy, r, color = PALETTE.GOLD) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;
}

function moonCrescent(cx, cy, scale = 1, color = PALETTE.WARM_WHITE) {
  return `<path transform="translate(${cx},${cy}) scale(${scale})" d="M0,-22 A22,22 0 1,0 0,22 A16,16 0 1,1 0,-22 Z" fill="${color}"/>`;
}

function star(cx, cy, scale = 1, color = PALETTE.GLOW) {
  return `<path transform="translate(${cx},${cy}) scale(${scale})" d="M0,-20 L5,-6 L20,0 L5,6 L0,20 L-5,6 L-20,0 L-5,-6 Z" fill="${color}"/>`;
}

function cloud(cx, cy, scale = 1, opacity = 0.95, color = PALETTE.WHITE) {
  return `<g transform="translate(${cx},${cy}) scale(${scale})" opacity="${opacity}"><ellipse cx="-30" cy="0" rx="34" ry="20" fill="${color}"/><ellipse cx="10" cy="-8" rx="42" ry="26" fill="${color}"/><ellipse cx="46" cy="2" rx="30" ry="18" fill="${color}"/></g>`;
}

function lightBeam(ctx, cx, topY, bottomY, width, color = PALETTE.GLOW) {
  const glowPart = glow(ctx, cx, topY + 20, width * 1.6, color);
  const beam = `<path d="M${cx - width / 2},${bottomY} L${cx - 6},${topY} L${cx + 6},${topY} L${cx + width / 2},${bottomY} Z" fill="${color}" opacity="0.5"/>`;
  return glowPart + beam;
}

// ---- vegetation ---------------------------------------------------------

function tree(cx, baseY, scale = 1, crown = PALETTE.GREEN_DEEP, trunk = PALETTE.BROWN) {
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    ${shadow(40)}
    <rect x="-8" y="-60" width="16" height="60" rx="6" fill="${trunk}"/>
    <circle cx="0" cy="-92" r="46" fill="${crown}"/>
    <circle cx="-28" cy="-72" r="30" fill="${crown}"/>
    <circle cx="28" cy="-72" r="30" fill="${crown}"/>
  </g>`;
}

function flower(cx, baseY, scale = 1, petal = PALETTE.CORAL, center = PALETTE.GOLD) {
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    <circle cx="0" cy="-10" r="7" fill="${petal}"/><circle cx="9" cy="-3" r="7" fill="${petal}"/>
    <circle cx="6" cy="8" r="7" fill="${petal}"/><circle cx="-6" cy="8" r="7" fill="${petal}"/>
    <circle cx="-9" cy="-3" r="7" fill="${petal}"/><circle cx="0" cy="0" r="6" fill="${center}"/>
    <rect x="-2" y="12" width="4" height="20" fill="${PALETTE.GREEN_DEEP}"/>
  </g>`;
}

function sprout(cx, baseY, scale = 1) {
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    <path d="M0,0 Q-4,-30 -20,-40" stroke="${PALETTE.GREEN_DEEP}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M0,0 Q4,-34 20,-42" stroke="${PALETTE.GREEN_DEEP}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M0,0 Q0,-40 0,-50" stroke="${PALETTE.GREEN_DEEP}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse cx="-20" cy="-42" rx="10" ry="6" fill="${PALETTE.GREEN_LIGHT}"/>
    <ellipse cx="20" cy="-44" rx="10" ry="6" fill="${PALETTE.GREEN_LIGHT}"/>
  </g>`;
}

// ---- figures (no facial features by design — flat, friendly silhouettes) ---

function figureChild(cx, baseY, scale = 1, opts = {}) {
  const {
    top = PALETTE.GOLD,
    skin = PALETTE.SKIN_LIGHT,
    hair = PALETTE.BROWN_WARM,
    legs = PALETTE.NAVY,
    girl = false,
  } = opts;
  if (girl) {
    const dress = top;
    return `<g transform="translate(${cx},${baseY}) scale(${scale})">
      ${shadow(36)}
      <path d="M-30,-60 Q0,-78 30,-60 L40,20 Q0,32 -40,20 Z" fill="${dress}"/>
      <path d="M-26,-56 L-36,-16" stroke="${skin}" stroke-width="14" stroke-linecap="round"/>
      <path d="M26,-56 L36,-16" stroke="${skin}" stroke-width="14" stroke-linecap="round"/>
      <circle cx="0" cy="-86" r="25" fill="${skin}"/>
      <path d="M-25,-92 Q0,-116 25,-92 Q26,-72 18,-62 Q24,-88 0,-94 Q-24,-88 -18,-62 Q-26,-72 -25,-92 Z" fill="${hair}"/>
    </g>`;
  }
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    ${shadow(30)}
    <path d="M-24,-58 Q0,-72 24,-58 L20,10 Q0,20 -20,10 Z" fill="${top}"/>
    <rect x="-18" y="8" width="15" height="38" rx="7" fill="${legs}"/>
    <rect x="3" y="8" width="15" height="38" rx="7" fill="${legs}"/>
    <path d="M-20,-52 L-30,-16" stroke="${skin}" stroke-width="13" stroke-linecap="round"/>
    <path d="M20,-52 L30,-16" stroke="${skin}" stroke-width="13" stroke-linecap="round"/>
    <circle cx="0" cy="-82" r="23" fill="${skin}"/>
    <path d="M-22,-88 Q0,-108 22,-88 Q22,-98 0,-100 Q-22,-98 -22,-88 Z" fill="${hair}"/>
  </g>`;
}

/** Kneeling child, hands folded — for prayer/repentance scenes. */
function figureKneeling(cx, baseY, scale = 1, opts = {}) {
  const { top = PALETTE.GOLD, skin = PALETTE.SKIN_LIGHT, hair = PALETTE.BROWN_WARM } = opts;
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    ${shadow(28)}
    <path d="M-26,0 Q-30,-46 0,-56 Q30,-46 26,0 Z" fill="${top}"/>
    <ellipse cx="0" cy="-30" rx="14" ry="10" fill="${skin}"/>
    <circle cx="0" cy="-76" r="21" fill="${skin}"/>
    <path d="M-20,-82 Q0,-100 20,-82 Q20,-90 0,-92 Q-20,-90 -20,-82 Z" fill="${hair}"/>
  </g>`;
}

/** Standing child with both palms raised toward the sky. */
function figureReaching(cx, baseY, scale = 1, opts = {}) {
  const { top = PALETTE.CORAL, skin = PALETTE.SKIN_LIGHT, hair = PALETTE.BROWN_WARM, legs = PALETTE.NAVY } = opts;
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    ${shadow(28)}
    <path d="M-22,-56 Q0,-70 22,-56 L18,10 Q0,20 -18,10 Z" fill="${top}"/>
    <rect x="-16" y="8" width="14" height="36" rx="7" fill="${legs}"/>
    <rect x="2" y="8" width="14" height="36" rx="7" fill="${legs}"/>
    <path d="M-18,-50 L-36,-84" stroke="${skin}" stroke-width="12" stroke-linecap="round"/>
    <path d="M18,-50 L36,-84" stroke="${skin}" stroke-width="12" stroke-linecap="round"/>
    <circle cx="0" cy="-80" r="22" fill="${skin}"/>
    <path d="M-21,-86 Q0,-104 21,-86 Q21,-95 0,-97 Q-21,-95 -21,-86 Z" fill="${hair}"/>
  </g>`;
}

function figureAdult(cx, baseY, scale = 1, opts = {}) {
  const { robe = PALETTE.NAVY, skin = PALETTE.SKIN_MED, hair = PALETTE.BROWN, headscarf = false } = opts;
  const head = headscarf
    ? `<circle cx="0" cy="-118" r="24" fill="${skin}"/><path d="M-30,-124 Q0,-158 30,-124 L26,-70 Q0,-84 -26,-70 Z" fill="${robe}"/>`
    : `<circle cx="0" cy="-118" r="24" fill="${skin}"/><path d="M-24,-124 Q0,-146 24,-124 Q24,-134 0,-136 Q-24,-134 -24,-124 Z" fill="${hair}"/>`;
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    ${shadow(40)}
    <path d="M-34,10 Q-38,-70 0,-92 Q38,-70 34,10 Z" fill="${robe}"/>
    <rect x="-34" y="-20" width="68" height="10" fill="${PALETTE.SAND}"/>
    <path d="M-28,-84 L-40,-30" stroke="${skin}" stroke-width="13" stroke-linecap="round"/>
    <path d="M28,-84 L40,-30" stroke="${skin}" stroke-width="13" stroke-linecap="round"/>
    ${head}
  </g>`;
}

// ---- symbolic objects (never depicting God/Christ/Spirit as a figure) ----

function cross(cx, baseY, scale = 1, color = PALETTE.BROWN_WARM) {
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    ${shadow(26)}
    <rect x="-9" y="-130" width="18" height="130" rx="4" fill="${color}"/>
    <rect x="-38" y="-96" width="76" height="18" rx="4" fill="${color}"/>
  </g>`;
}

function emptyTomb(cx, baseY, scale = 1) {
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    <path d="M-70,0 L-70,-70 Q0,-140 70,-70 L70,0 Z" fill="${PALETTE.BROWN}"/>
    <path d="M-46,0 L-46,-56 Q0,-104 46,-56 L46,0 Z" fill="${PALETTE.GLOW}" opacity="0.85"/>
    <circle cx="94" cy="-18" r="34" fill="${PALETTE.SAND}"/>
  </g>`;
}

function crown(cx, cy, scale = 1, color = PALETTE.GOLD) {
  return `<g transform="translate(${cx},${cy}) scale(${scale})">
    <path d="M-40,20 L-40,-6 L-24,10 L-10,-16 L0,6 L10,-16 L24,10 L40,-6 L40,20 Z" fill="${color}"/>
    <rect x="-40" y="18" width="80" height="12" rx="4" fill="${color}"/>
    <circle cx="0" cy="-6" r="5" fill="${PALETTE.CORAL}"/>
  </g>`;
}

function stoneTablet(cx, baseY, scale = 1, cracked = false, color = PALETTE.WARM_WHITE) {
  const crack = cracked
    ? `<path d="M-6,-70 L6,-30 L-4,10" stroke="${PALETTE.SAGE}" stroke-width="4" fill="none" stroke-linecap="round"/>`
    : "";
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    ${shadow(30)}
    <path d="M-46,10 L-46,-46 Q-46,-64 -28,-64 L-8,-64 Q0,-78 8,-64 L28,-64 Q46,-64 46,-46 L46,10 Z" fill="${color}" stroke="${PALETTE.SAGE}" stroke-width="3"/>
    ${crack}
  </g>`;
}

function openBible(cx, baseY, scale = 1, cover = PALETTE.NAVY) {
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    <path d="M0,-40 L-70,-52 L-70,20 L0,34 Z" fill="${PALETTE.WARM_WHITE}" stroke="${PALETTE.SAGE}" stroke-width="2"/>
    <path d="M0,-40 L70,-52 L70,20 L0,34 Z" fill="${PALETTE.WARM_WHITE}" stroke="${PALETTE.SAGE}" stroke-width="2"/>
    <rect x="-4" y="-40" width="8" height="74" fill="${cover}"/>
  </g>`;
}

function scroll(cx, baseY, scale = 1) {
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    <rect x="-50" y="-30" width="100" height="60" rx="8" fill="${PALETTE.WARM_WHITE}"/>
    <rect x="-58" y="-32" width="16" height="64" rx="8" fill="${PALETTE.SAND}"/>
    <rect x="42" y="-32" width="16" height="64" rx="8" fill="${PALETTE.SAND}"/>
    <rect x="-30" y="-4" width="60" height="8" rx="4" fill="${PALETTE.CORAL}"/>
  </g>`;
}

function gate(cx, baseY, scale = 1, dark = false) {
  const frame = dark ? PALETTE.NAVY : PALETTE.BROWN_WARM;
  const panel = dark ? PALETTE.NAVY : PALETTE.SAND;
  const opacity = dark ? 0.92 : 1;
  return `<g transform="translate(${cx},${baseY}) scale(${scale})" opacity="${opacity}">
    ${shadow(56)}
    <path d="M-60,10 L-60,-60 Q0,-112 60,-60 L60,10 Z" fill="${frame}"/>
    <rect x="-48" y="-14" width="44" height="76" rx="4" fill="${panel}"/>
    <rect x="4" y="-14" width="44" height="76" rx="4" fill="${panel}"/>
  </g>`;
}

function brokenStatue(cx, baseY, scale = 1) {
  return `<g transform="translate(${cx},${baseY}) rotate(68) scale(${scale})">
    <rect x="-14" y="-70" width="28" height="90" rx="6" fill="${PALETTE.SAGE}"/>
    <rect x="-20" y="12" width="40" height="14" rx="4" fill="${PALETTE.SAGE}"/>
  </g>`;
}

function breadAndCup(cx, baseY, scale = 1) {
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    <rect x="-90" y="20" width="180" height="10" fill="${PALETTE.SAND}"/>
    <ellipse cx="-45" cy="10" rx="42" ry="24" fill="${PALETTE.BROWN_WARM}"/>
    <ellipse cx="-45" cy="2" rx="36" ry="18" fill="${PALETTE.SAND}"/>
    <path d="M40,20 L34,-24 Q34,-40 54,-40 Q74,-40 74,-24 L68,20 Z" fill="${PALETTE.TEAL}"/>
    <rect x="48" y="20" width="12" height="16" fill="${PALETTE.TEAL}"/>
  </g>`;
}

function manger(cx, baseY, scale = 1) {
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    ${shadow(50)}
    <path d="M-60,0 L-50,-30 L50,-30 L60,0 Z" fill="${PALETTE.BROWN}"/>
    <path d="M-46,-28 Q0,-46 46,-28 L40,-14 Q0,-28 -40,-14 Z" fill="${PALETTE.SAND}"/>
    <rect x="-66" y="-4" width="12" height="30" fill="${PALETTE.BROWN_WARM}"/>
    <rect x="54" y="-4" width="12" height="30" fill="${PALETTE.BROWN_WARM}"/>
  </g>`;
}

function throne(cx, baseY, scale = 1) {
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    <rect x="-50" y="-100" width="100" height="20" rx="6" fill="${PALETTE.NAVY}"/>
    <rect x="-50" y="-100" width="16" height="100" rx="6" fill="${PALETTE.NAVY}"/>
    <rect x="34" y="-100" width="16" height="100" rx="6" fill="${PALETTE.NAVY}"/>
    <rect x="-42" y="-16" width="84" height="16" rx="4" fill="${PALETTE.SAND}"/>
  </g>${crown(cx, baseY - 74, scale * 0.6)}`;
}

function sheep(cx, baseY, scale = 1) {
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    ${shadow(28)}
    <ellipse cx="0" cy="-20" rx="30" ry="20" fill="${PALETTE.WARM_WHITE}"/>
    <circle cx="24" cy="-26" r="12" fill="${PALETTE.SAND}"/>
    <rect x="-18" y="-4" width="6" height="16" fill="${PALETTE.SAND}"/>
    <rect x="8" y="-4" width="6" height="16" fill="${PALETTE.SAND}"/>
  </g>`;
}

function goat(cx, baseY, scale = 1) {
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    ${shadow(24)}
    <ellipse cx="0" cy="-18" rx="26" ry="16" fill="${PALETTE.BROWN_WARM}"/>
    <circle cx="22" cy="-26" r="10" fill="${PALETTE.BROWN_WARM}"/>
    <path d="M16,-36 L20,-46 M28,-36 L24,-46" stroke="${PALETTE.BROWN}" stroke-width="4" stroke-linecap="round"/>
    <rect x="-14" y="-4" width="6" height="14" fill="${PALETTE.BROWN}"/>
    <rect x="6" y="-4" width="6" height="14" fill="${PALETTE.BROWN}"/>
  </g>`;
}

function waterVessel(cx, baseY, scale = 1) {
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    <path d="M-30,0 Q-34,-40 0,-44 Q34,-40 30,0 Z" fill="${PALETTE.TEAL}"/>
    <ellipse cx="0" cy="-44" rx="30" ry="8" fill="${PALETTE.SKY_LIGHT}"/>
  </g>`;
}

function river(y, color = PALETTE.TEAL) {
  return wave(y, color, 0.85);
}

function pathRoad(color = PALETTE.SAND) {
  return `<path d="M480,900 Q520,600 600,450 Q680,300 640,150" stroke="${color}" stroke-width="70" fill="none" stroke-linecap="round" opacity="0.85"/>`;
}

function basketFruit(cx, baseY, scale = 1) {
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    <path d="M-34,0 L-28,-30 L28,-30 L34,0 Z" fill="${PALETTE.SAND}"/>
    <circle cx="-10" cy="-36" r="12" fill="${PALETTE.CORAL}"/>
    <circle cx="8" cy="-40" r="12" fill="${PALETTE.GOLD}"/>
    <circle cx="0" cy="-30" r="12" fill="${PALETTE.CORAL}"/>
  </g>`;
}

function house(cx, baseY, scale = 1) {
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    ${shadow(44)}
    <rect x="-30" y="-40" width="60" height="40" fill="${PALETTE.SAND}"/>
    <path d="M-38,-40 L0,-70 L38,-40 Z" fill="${PALETTE.BROWN_WARM}"/>
  </g>`;
}

function bed(cx, baseY, scale = 1) {
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    <rect x="-50" y="-20" width="100" height="24" rx="6" fill="${PALETTE.WARM_WHITE}" stroke="${PALETTE.SAGE}" stroke-width="2"/>
    <rect x="-56" y="0" width="10" height="20" fill="${PALETTE.BROWN}"/>
    <rect x="46" y="0" width="10" height="20" fill="${PALETTE.BROWN}"/>
  </g>`;
}

function table(cx, baseY, scale = 1, color = PALETTE.BROWN) {
  return `<g transform="translate(${cx},${baseY}) scale(${scale})">
    <rect x="-90" y="0" width="180" height="10" fill="${color}"/>
    <rect x="-80" y="10" width="12" height="40" fill="${color}"/>
    <rect x="68" y="10" width="12" height="40" fill="${color}"/>
  </g>`;
}

function rock(cx, baseY, scale = 1, color = PALETTE.SAGE) {
  return `<path transform="translate(${cx},${baseY}) scale(${scale})" d="M-60,20 Q-70,-40 -20,-60 Q40,-80 60,-30 Q70,10 30,20 Z" fill="${color}"/>`;
}

/**
 * Assembles a full SVG document from a recipe:
 *   { title, sky: [top, bottom], hills: [{y, dip, color}], ground: {y, color},
 *     layers: [(ctx) => svgFragment, ...] }  // back-to-front order
 * Background (sky/hills/ground) is optional per-field; layers run after and
 * may register their own gradients via ctx.
 */
function render(recipe, idPrefix = "") {
  const ctx = makeCtx(idPrefix);
  const bg = recipe.sky ? sky(ctx, recipe.sky[0], recipe.sky[1]) : "";
  const hillsSvg = (recipe.hills || []).map((h) => hill(h.y, h.dip, h.color)).join("");
  const groundSvg = recipe.ground ? ground(recipe.ground.y, recipe.ground.color) : "";
  const layersSvg = (recipe.layers || []).map((fn) => fn(ctx)).join("");
  const defsSvg = ctx.defs.length ? `<defs>${ctx.defs.join("")}</defs>` : "";
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid meet" role="img">' +
    `<title>${escapeXml(recipe.title)}</title>` +
    defsSvg +
    bg +
    hillsSvg +
    groundSvg +
    layersSvg +
    "</svg>"
  );
}

module.exports = {
  PALETTE,
  escapeXml,
  makeCtx,
  render,
  sky,
  hill,
  ground,
  wave,
  shadow,
  grassTuft,
  glow,
  sunDisc,
  moonCrescent,
  star,
  cloud,
  lightBeam,
  tree,
  flower,
  sprout,
  figureChild,
  figureKneeling,
  figureReaching,
  figureAdult,
  cross,
  emptyTomb,
  crown,
  stoneTablet,
  openBible,
  scroll,
  gate,
  brokenStatue,
  breadAndCup,
  manger,
  throne,
  sheep,
  goat,
  waterVessel,
  river,
  pathRoad,
  basketFruit,
  house,
  bed,
  table,
  rock,
};
