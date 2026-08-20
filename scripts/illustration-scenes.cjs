// Scene recipes for all 114 public/illustrations/qNNN.svg files, built from
// the shared primitive kit in scripts/svg-lib.cjs. One entry per
// question_number, composed per specs/svg-illustration-spec.md (palette,
// doctrine, §7 sensitive-question table) and the layered-composition
// instruction added to §8 (background -> midground -> foreground).
//
// Consumed by scripts/generate-illustrations.cjs.

const L = require("./svg-lib.cjs");
const P = L.PALETTE;

// ---- reusable background presets ----------------------------------------

const BG_DAY = () => ({
  mood: "day",
  sky: [P.SKY_LIGHT, P.SKY_DEEP],
  hills: [
    { y: 680, dip: 100, color: P.GREEN_LIGHT },
    { y: 760, dip: 100, color: P.GREEN_DEEP },
    { y: 840, dip: 50, color: P.SAGE },
  ],
});
const BG_DAWN = () => ({
  mood: "day",
  sky: [P.GLOW, P.GOLD],
  hills: [
    { y: 700, dip: 90, color: P.SAND },
    { y: 780, dip: 90, color: P.GREEN_DEEP },
    { y: 850, dip: 40, color: P.SAGE },
  ],
});
const BG_DUSK = () => ({
  mood: "day",
  sky: [P.GOLD, P.CORAL],
  hills: [
    { y: 700, dip: 90, color: P.GREEN_DEEP },
    { y: 800, dip: 70, color: P.BROWN },
  ],
});
const BG_ETERNITY = () => ({
  mood: "night",
  sky: [P.SKY_DEEP, P.NAVY],
  hills: [
    { y: 720, dip: 80, color: P.TEAL },
    { y: 800, dip: 60, color: P.NAVY },
  ],
});
const BG_SINAI = () => ({
  mood: "day",
  sky: [P.SKY_LIGHT, P.SKY_DEEP],
  hills: [
    { y: 600, dip: 220, color: P.SAGE },
    { y: 760, dip: 120, color: P.GREEN_DEEP },
    { y: 850, dip: 40, color: P.SAGE },
  ],
});
const BG_GARDEN = () => ({
  mood: "day",
  sky: [P.SKY_LIGHT, P.GLOW],
  hills: [
    { y: 680, dip: 110, color: P.GREEN_LIGHT },
    { y: 780, dip: 90, color: P.GREEN_DEEP },
    { y: 850, dip: 40, color: P.SAGE },
  ],
});
const BG_DARK_GATE = () => ({
  mood: "dark",
  sky: [P.SKY_DEEP, P.NAVY],
  hills: [
    { y: 740, dip: 50, color: P.TEAL },
    { y: 800, dip: 40, color: P.NAVY },
  ],
});
const BG_SEA = () => ({
  mood: "day",
  sky: [P.SKY_LIGHT, P.SKY_DEEP],
  hills: [{ y: 780, dip: 40, color: P.SAND }],
});
const BG_VILLAGE = () => ({
  mood: "day",
  sky: [P.GLOW, P.SKY_LIGHT],
  hills: [
    { y: 700, dip: 80, color: P.GREEN_LIGHT },
    { y: 780, dip: 70, color: P.GREEN_DEEP },
    { y: 850, dip: 30, color: P.SAGE },
  ],
});
const BG_ROOM = () => ({
  mood: "room",
  sky: null,
  ground: { y: 0, color: P.WARM_WHITE },
});

/**
 * Deterministic ambient filler (clouds/stars + grass texture), seeded by
 * question_number so scenes of the same mood aren't visually identical —
 * satisfies the §8 "layered composition, no empty flat zones" instruction
 * without hand-placing filler in all 114 cases individually.
 */
function atmosphere(bg, n) {
  const mood = bg.mood || "day";
  const seed = n * 53;
  const at = (base, span, offset = 0) => base + ((seed + offset * 17) % span);

  if (mood === "room") return [];
  if (mood === "night" || mood === "dark") {
    return [
      (c) => L.star(at(140, 260, 1), at(110, 90, 2), 0.55 + (n % 3) * 0.15),
      (c) => L.star(at(760, 280, 3), at(130, 100, 4), 0.5 + (n % 2) * 0.2),
    ];
  }
  return [
    (c) => L.cloud(at(110, 240, 1), at(110, 70, 2), 0.85 + (n % 3) * 0.12),
    (c) => L.cloud(at(760, 280, 3), at(140, 90, 4), 0.8 + (n % 2) * 0.15),
    (c) => L.grassTuft(at(50, 180, 5), 890, 0.9 + (n % 2) * 0.2),
    (c) => L.grassTuft(at(960, 200, 6), 888, 0.9 + (n % 3) * 0.15),
  ];
}

function scenes(entry) {
  const n = entry.question_number;
  const title = entry.scene_brief;
  const R = (bg, layers, opts = {}) => ({
    title,
    ...bg,
    layers: [...(opts.noAtmosphere ? [] : atmosphere(bg, n)), ...layers],
  });

  switch (n) {
    // ---- 1. Бог -----------------------------------------------------
    case 1:
      return R(BG_DAY(), [
        (c) => L.glow(c, 600, 200, 260),
        (c) => L.tree(160, 800, 1),
        (c) => L.flower(1020, 800, 1),
        (c) => L.figureChild(480, 760, 1.3),
        (c) => L.figureChild(660, 770, 1.2, { girl: true, top: P.CORAL }),
      ]);
    case 2:
      return R(BG_DAWN(), [
        (c) => L.glow(c, 600, 220, 300),
        (c) => L.flower(360, 800, 1),
        (c) => L.flower(840, 800, 1),
        (c) => L.figureReaching(600, 780, 1.6, { top: P.CORAL }),
      ]);
    case 3:
      return R(BG_DAY(), [
        (c) => L.sunDisc(980, 160, 70, P.GOLD),
        (c) => L.tree(220, 800, 1.2),
        (c) => L.tree(980, 780, 0.9),
        (c) => L.wave(840, P.TEAL),
        (c) => L.sheep(600, 820, 1),
      ]);
    case 4:
      return R(BG_DAY(), [
        (c) => L.glow(c, 300, 180, 200),
        (c) => L.tree(200, 800, 1.1),
        (c) => L.tree(500, 790, 0.9),
        (c) => L.cloud(900, 220, 1.4),
        (c) => L.wave(850, P.TEAL, 0.6),
      ]);
    case 5:
      return R(BG_DAY(), [
        (c) => L.tree(760, 760, 1.6),
        (c) => L.flower(300, 800, 1),
        (c) => L.figureChild(600, 790, 1.3),
        (c) => L.openBible(600, 830, 0.9),
      ]);
    case 6:
      return R(BG_DAWN(), [
        (c) => L.glow(c, 600, 260, 280),
        (c) => L.rock(600, 740, 1.3),
        (c) => L.openBible(600, 700, 1.1),
      ]);
    case 7:
      return R(
        { sky: [P.SKY_LIGHT, P.SKY_DEEP], hills: [{ y: 820, dip: 40, color: P.GREEN_LIGHT }] },
        [
          (c) => L.glow(c, 400, 260, 260, P.GLOW),
          (c) => L.glow(c, 800, 340, 220, P.WARM_WHITE),
          (c) => L.cloud(300, 400, 1.3),
          (c) => L.cloud(880, 420, 1.1),
        ],
      );
    case 8:
      return R(
        { sky: [P.SKY_LIGHT, P.SKY_DEEP], hills: [{ y: 820, dip: 30, color: P.SAGE }] },
        [
          (c) => L.glow(c, 600, 420, 240, P.WARM_WHITE),
          (c) => L.cloud(600, 420, 1.6, 0.9, P.WARM_WHITE),
        ],
      );
    case 9:
      return R(BG_SEA(), [
        (c) => L.wave(800, P.TEAL),
        (c) => L.wave(850, P.SKY_DEEP, 0.5),
        (c) => L.figureChild(600, 780, 1.4),
      ]);
    case 10:
      return R(BG_ETERNITY(), [
        (c) => L.star(200, 160, 1),
        (c) => L.star(420, 120, 0.8),
        (c) => L.star(950, 180, 1.1),
        (c) => L.star(560, 260, 0.6),
        (c) => L.star(1080, 300, 0.7),
        (c) => L.glow(c, 700, 260, 200, P.GLOW),
        (c) => L.tree(150, 800, 0.9, P.TEAL, P.NAVY),
      ]);
    case 11:
      return R(BG_ETERNITY(), [
        (c) => L.star(260, 180, 1),
        (c) => L.star(700, 130, 0.9),
        (c) => L.star(1000, 220, 1),
        (c) => L.star(140, 300, 0.6),
        (c) => L.star(820, 320, 0.7),
        (c) => L.moonCrescent(880, 220, 1.4),
        (c) => L.tree(1050, 800, 0.9, P.TEAL, P.NAVY),
      ]);
    case 12:
      return R(BG_SEA(), [(c) => L.wave(760, P.TEAL), (c) => L.wave(820, P.SKY_DEEP, 0.6), (c) => L.rock(600, 800, 1.6)]);
    case 13:
      return R(
        { sky: [P.SKY_LIGHT, P.SKY_DEEP], hills: [{ y: 800, dip: 60, color: P.SAGE }] },
        [(c) => L.lightBeam(c, 600, 120, 620, 200), (c) => L.openBible(600, 760, 1.4)],
      );
    case 14:
      return R(BG_SINAI(), [(c) => L.wave(830, P.TEAL, 0.7), (c) => L.cloud(300, 220, 1.3)]);
    case 15:
      return R(BG_DAY(), [(c) => L.glow(c, 600, 200, 240), (c) => L.figureKneeling(600, 800, 1.6)]);
    case 16:
      return R(
        { sky: [P.SKY_LIGHT, P.SKY_DEEP], hills: [{ y: 800, dip: 50, color: P.GREEN_LIGHT }] },
        [(c) => L.lightBeam(c, 600, 100, 780, 180), (c) => L.tree(880, 800, 1)],
      );
    case 17:
      return R(
        { sky: [P.SKY_LIGHT, P.SKY_DEEP], hills: [{ y: 820, dip: 30, color: P.SAGE }] },
        [
          (c) => L.lightBeam(c, 420, 140, 640, 90),
          (c) => L.lightBeam(c, 600, 100, 640, 90),
          (c) => L.lightBeam(c, 780, 140, 640, 90),
        ],
      );
    case 18:
      return R(
        { sky: [P.SKY_LIGHT, P.SKY_DEEP], hills: [{ y: 820, dip: 30, color: P.SAGE }] },
        [
          (c) => L.glow(c, 540, 380, 150, P.GLOW),
          (c) => L.glow(c, 600, 380, 150, P.WARM_WHITE),
          (c) => L.glow(c, 660, 380, 150, P.GLOW),
        ],
      );

    // ---- 2. Сотворение ------------------------------------------------
    case 19:
      return R(BG_DAY(), [
        (c) => L.sunDisc(940, 150, 60),
        (c) => L.tree(220, 800, 1.1),
        (c) => L.wave(850, P.TEAL, 0.7),
      ]);
    case 20:
      return R(
        { mood: "night", sky: [P.NAVY, P.SKY_DEEP], hills: [{ y: 780, dip: 40, color: P.GREEN_DEEP }] },
        [(c) => L.glow(c, 900, 300, 300, P.GLOW), (c) => L.flower(950, 800, 1.2), (c) => L.tree(1050, 790, 0.9)],
      );
    case 21:
      return R(BG_DAY(), [(c) => L.scroll(600, 760, 1.3), (c) => L.tree(220, 800, 0.9)]);
    case 22:
      return R(BG_DAY(), [(c) => L.sunDisc(360, 200, 60), (c) => L.moonCrescent(840, 220, 1.2), (c) => L.tree(600, 800, 1)]);
    case 23:
      return R(BG_DUSK(), [(c) => L.glow(c, 600, 260, 220, P.GLOW), (c) => L.tree(300, 810, 1)]);

    // ---- 3. Как человек согрешил -------------------------------------
    case 24:
      return R(BG_GARDEN(), [
        (c) => L.tree(300, 800, 1.3),
        (c) => L.tree(950, 790, 1),
        (c) => L.figureAdult(600, 800, 1.4, { robe: P.NAVY, headscarf: false }),
      ]);
    case 25:
      return R(BG_GARDEN(), [
        (c) => L.tree(250, 800, 1.1),
        (c) => L.flower(950, 800, 1),
        (c) => L.figureAdult(780, 800, 1.3, { robe: P.CORAL, skin: P.SKIN_LIGHT, headscarf: true }),
      ]);
    case 26:
      return R(BG_GARDEN(), [
        (c) => L.tree(950, 790, 1),
        (c) => L.flower(250, 800, 1),
        (c) => `<ellipse transform="translate(600,800)" cx="0" cy="0" rx="60" ry="18" fill="${P.SAND}"/>`,
      ]);
    case 27:
      return R(BG_GARDEN(), [
        (c) => L.tree(600, 760, 1.6),
        (c) => `<g transform="translate(560,830)"><ellipse cx="0" cy="0" rx="70" ry="20" fill="${P.NAVY}"/><circle cx="-40" cy="-10" r="18" fill="${P.SKIN_MED}"/></g>`,
        (c) => L.figureAdult(880, 800, 1.1, { robe: P.CORAL, headscarf: true }),
      ]);
    case 28:
      return R(BG_GARDEN(), [
        (c) => L.figureAdult(480, 800, 1.2, { robe: P.NAVY }),
        (c) => L.figureAdult(700, 800, 1.2, { robe: P.CORAL, headscarf: true }),
        (c) => L.glow(c, 480, 700, 40, P.GLOW),
        (c) => L.glow(c, 700, 700, 40, P.GLOW),
      ]);
    case 29:
      return R(BG_DAY(), [
        (c) => L.tree(950, 800, 0.9),
        (c) => L.figureChild(600, 780, 1.6),
        (c) => L.glow(c, 600, 700, 50, P.GLOW),
      ]);
    case 30:
      return R(BG_DAY(), [(c) => L.tree(780, 760, 1.5), (c) => L.figureChild(500, 800, 1.3), (c) => L.openBible(500, 840, 0.8)]);
    case 31:
      return R(BG_GARDEN(), [
        (c) => L.tree(280, 800, 1.1),
        (c) => L.flower(950, 800, 1),
        (c) => L.figureAdult(520, 800, 1.2, { robe: P.NAVY }),
        (c) => L.figureAdult(700, 800, 1.2, { robe: P.CORAL, headscarf: true }),
      ]);
    case 32:
      return R(BG_DAY(), [
        (c) => L.pathRoad(P.GOLD),
        (c) => `<path d="M600,450 Q500,600 300,780" stroke="${P.SAGE}" stroke-width="50" fill="none" stroke-linecap="round" opacity="0.7"/>`,
        (c) => L.figureChild(600, 820, 1.1),
      ]);
    case 33:
      return R(BG_DAY(), [
        (c) => L.pathRoad(P.SAND),
        (c) => `<g transform="translate(880,600)"><rect x="-6" y="0" width="12" height="90" fill="${P.BROWN}"/><circle cx="0" cy="-20" r="26" fill="${P.WARM_WHITE}" stroke="${P.CORAL}" stroke-width="6"/></g>`,
        (c) => L.figureChild(700, 800, 1),
      ]);
    case 34:
      return R(BG_DAY(), [(c) => L.openBible(600, 820, 1.2), (c) => L.figureChild(600, 700, 1.1)]);
    case 35:
      return R(BG_GARDEN(), [
        (c) => L.tree(600, 700, 1.4),
        (c) => `<circle cx="600" cy="640" r="14" fill="${P.CORAL}"/>`,
        (c) => L.figureAdult(320, 810, 1, { robe: P.NAVY }),
        (c) => L.figureAdult(460, 810, 1, { robe: P.CORAL, headscarf: true }),
      ]);
    case 36:
      return R(BG_GARDEN(), [
        (c) => L.tree(600, 700, 1.4),
        (c) => `<path d="M660,640 Q700,600 680,560" stroke="${P.SAGE}" stroke-width="8" fill="none" stroke-linecap="round"/>`,
        (c) => L.figureAdult(280, 820, 0.9, { robe: P.NAVY }),
        (c) => L.figureAdult(420, 820, 0.9, { robe: P.CORAL, headscarf: true }),
      ]);
    case 37:
      return R(BG_GARDEN(), [
        (c) => L.gate(900, 700, 1),
        (c) => L.pathRoad(P.SAND),
        (c) => L.figureAdult(420, 820, 0.9, { robe: P.NAVY }),
        (c) => L.figureAdult(540, 820, 0.9, { robe: P.CORAL, headscarf: true }),
      ]);
    case 38:
      return R(BG_DAY(), [
        (c) => L.pathRoad(P.SAND),
        (c) => L.figureChild(500, 700, 0.7),
        (c) => L.figureChild(600, 780, 0.9),
        (c) => L.figureChild(680, 850, 1.1),
      ]);
    case 39:
      return R(BG_DAY(), [(c) => L.pathRoad(P.SAND), (c) => L.figureChild(600, 800, 1.2), (c) => L.cloud(560, 560, 0.9, 0.8, P.SAGE)]);
    case 40:
      return R(BG_DAY(), [
        (c) => `<path d="M600,900 L600,500 M600,650 L360,450 M600,650 L840,450" stroke="${P.SAND}" stroke-width="40" fill="none" stroke-linecap="round" opacity="0.85"/>`,
        (c) => L.figureChild(600, 800, 1.2),
      ]);
    case 41:
      return R(BG_DARK_GATE(), [(c) => L.glow(c, 980, 500, 220, P.GLOW), (c) => L.gate(500, 760, 1.3, true)]);
    case 42:
      return R(BG_DARK_GATE(), [
        (c) => L.glow(c, 950, 500, 260, P.GLOW),
        (c) => `<rect x="700" y="500" width="500" height="400" fill="${P.GREEN_DEEP}" opacity="0.3"/>`,
        (c) => L.gate(600, 760, 1.4, true),
        (c) => L.figureChild(950, 820, 0.9),
      ]);

    // ---- 5. Спасение ---------------------------------------------------
    case 43:
      return R(BG_DUSK(), [(c) => L.gate(950, 700, 1, false), (c) => L.glow(c, 950, 620, 150, P.GLOW), (c) => L.cross(500, 780, 1.4)]);
    case 44:
      return R(BG_DAWN(), [(c) => L.star(600, 220, 1.4), (c) => L.openBible(600, 760, 1.2)]);
    case 45:
      return R(
        { mood: "night", sky: [P.NAVY, P.SKY_DEEP], hills: [{ y: 800, dip: 40, color: P.GREEN_DEEP }] },
        [(c) => L.star(600, 200, 1.6), (c) => L.house(600, 800, 1.3), (c) => L.manger(600, 830, 1)],
      );
    case 46:
      return R(
        { mood: "night", sky: [P.NAVY, P.SKY_DEEP], hills: [{ y: 800, dip: 40, color: P.GREEN_DEEP }] },
        [(c) => L.star(600, 200, 1.3), (c) => L.manger(600, 830, 1), (c) => L.figureAdult(780, 830, 1, { robe: P.TEAL, headscarf: true })],
      );
    case 47:
      return R(
        { mood: "night", sky: [P.NAVY, P.SKY_DEEP], hills: [{ y: 800, dip: 40, color: P.GREEN_DEEP }] },
        [(c) => L.star(600, 180, 1.6), (c) => L.lightBeam(c, 600, 220, 700, 140), (c) => L.manger(600, 830, 1.1)],
      );
    case 48:
      return R(
        { mood: "night", sky: [P.NAVY, P.SKY_DEEP], hills: [{ y: 800, dip: 40, color: P.GREEN_DEEP }] },
        [(c) => L.star(600, 200, 1.4), (c) => L.manger(600, 830, 1.1), (c) => `<rect x="560" y="800" width="80" height="24" rx="6" fill="${P.WARM_WHITE}"/>`],
      );
    case 49:
      return R(BG_DAWN(), [(c) => L.rock(600, 800, 1.2), (c) => `<rect x="530" y="700" width="140" height="50" rx="10" fill="${P.WARM_WHITE}" stroke="${P.SAGE}" stroke-width="3"/>`]);
    case 50:
      return R(BG_DAWN(), [(c) => L.table(600, 800, 1.1), (c) => L.scroll(600, 760, 1.2)]);
    case 51:
      return R(BG_DUSK(), [(c) => L.cross(600, 780, 1.6)]);
    case 52:
      return R(BG_DUSK(), [
        (c) => L.cross(600, 740, 1.6),
        (c) => L.figureAdult(360, 850, 0.7, { robe: P.NAVY }),
        (c) => L.figureAdult(460, 860, 0.7, { robe: P.CORAL, headscarf: true }),
        (c) => L.figureAdult(820, 850, 0.7, { robe: P.SAGE }),
      ]);
    case 53:
      return R(BG_DUSK(), [(c) => L.pathRoad(P.SAND), (c) => L.cross(600, 500, 1), (c) => L.figureKneeling(600, 820, 1.3)]);
    case 54:
      return R(BG_DAY(), [(c) => L.rock(700, 800, 1), (c) => L.figureKneeling(560, 820, 1.4)]);
    case 55:
      return R(BG_DAWN(), [(c) => L.glow(c, 600, 220, 260), (c) => L.figureReaching(600, 800, 1.5)]);
    case 56:
      return R(BG_DAY(), [(c) => L.tree(760, 760, 1.5), (c) => L.figureKneeling(500, 820, 1.4)]);
    case 57:
      return R(BG_DUSK(), [(c) => L.star(780, 220, 1.4), (c) => L.figureAdult(500, 810, 1.2, { robe: P.SAGE })]);
    case 58:
      return R(BG_DAWN(), [(c) => L.table(600, 800, 1.1), (c) => L.openBible(430, 750, 0.9), (c) => L.cross(600, 730, 1), (c) => L.crown(780, 700, 0.9)]);
    case 59:
      return R(BG_DAY(), [(c) => L.rock(600, 780, 1.2), (c) => L.openBible(600, 730, 1.1)]);
    case 60:
      return R(BG_DUSK(), [(c) => L.cross(600, 780, 1.6)]);
    case 61:
      return R(BG_DAY(), [(c) => `<rect x="500" y="760" width="200" height="30" rx="10" fill="${P.SAGE}"/>`, (c) => L.crown(600, 720, 1.2)]);

    // ---- 7. Десять заповедей -------------------------------------------
    case 62:
      return R(BG_SINAI(), [(c) => L.stoneTablet(560, 620, 1.1), (c) => L.stoneTablet(650, 630, 1.1)]);
    case 63:
      return R(BG_SINAI(), [(c) => L.glow(c, 800, 260, 200), (c) => L.stoneTablet(430, 700, 1.1)]);
    case 64:
      return R(BG_DAY(), [
        (c) => L.figureChild(400, 800, 1),
        (c) => L.figureAdult(560, 800, 1, { robe: P.TEAL }),
        (c) => L.figureAdult(720, 800, 1, { robe: P.CORAL, headscarf: true }),
        (c) => L.figureChild(870, 800, 1),
      ]);
    case 65:
      return R(BG_DAY(), [(c) => L.pathRoad(P.SAND), (c) => L.figureAdult(700, 800, 1, { robe: P.SAGE }), (c) => L.figureChild(560, 810, 1)]);
    case 66:
      return R(BG_DAY(), [(c) => L.pathRoad(P.SAND), (c) => L.figureAdult(500, 830, 1, { robe: P.NAVY }), (c) => L.figureAdult(680, 800, 1, { robe: P.TEAL })]);
    case 67:
      return R(
        { sky: [P.SKY_LIGHT, P.SKY_DEEP], hills: [{ y: 750, dip: 200, color: P.SAGE }] },
        [(c) => L.lightBeam(c, 600, 120, 700, 140)],
      );
    case 68:
      return R(BG_SINAI(), [(c) => L.glow(c, 600, 220, 220), (c) => L.figureKneeling(600, 820, 1.4)]);
    case 69:
      return R(BG_DAY(), [(c) => L.glow(c, 900, 220, 220), (c) => L.brokenStatue(360, 820, 1)]);
    case 70:
      return R(BG_DAY(), [(c) => L.figureChild(500, 800, 1.3), (c) => L.openBible(500, 840, 0.9), (c) => L.brokenStatue(950, 850, 0.8)]);
    case 71:
      return R(BG_DAY(), [(c) => `<rect x="300" y="600" width="600" height="300" fill="${P.WARM_WHITE}" opacity="0.5"/>`, (c) => L.figureKneeling(600, 820, 1.4)]);
    case 72:
      return R(BG_DAY(), [(c) => L.figureKneeling(600, 820, 1.5)]);
    case 73:
      return R(BG_SINAI(), [(c) => L.stoneTablet(560, 650, 1), (c) => L.stoneTablet(650, 660, 1)]);
    case 74:
      return R(BG_VILLAGE(), [
        (c) => L.house(300, 800, 1),
        (c) => L.house(500, 810, 0.9),
        (c) => L.house(880, 800, 1),
        (c) => L.figureAdult(650, 830, 0.9, { robe: P.SAGE }),
        (c) => L.figureChild(730, 840, 0.8),
      ]);
    case 75:
      return R(BG_DAWN(), [(c) => L.sunDisc(600, 240, 90)]);
    case 76:
      return R(BG_DAY(), [
        (c) => L.pathRoad(P.SAND),
        (c) => L.figureAdult(460, 830, 0.9, { robe: P.NAVY }),
        (c) => L.figureAdult(560, 830, 0.9, { robe: P.CORAL, headscarf: true }),
        (c) => L.figureChild(660, 850, 0.9),
      ]);
    case 77:
      return R(BG_DAY(), [
        (c) => L.pathRoad(P.SAND),
        (c) => L.figureAdult(480, 820, 0.9, { robe: P.NAVY }),
        (c) => L.figureAdult(700, 820, 0.9, { robe: P.CORAL, headscarf: true }),
        (c) => L.figureChild(590, 840, 0.9),
      ]);
    case 78:
      return R(BG_DAY(), [(c) => L.tree(950, 800, 0.9), (c) => L.figureAdult(700, 810, 0.9, { robe: P.SAGE }), (c) => L.figureChild(560, 830, 1)]);
    case 79:
      return R(BG_DAY(), [(c) => L.tree(600, 740, 1.6), (c) => L.figureChild(480, 830, 1), (c) => L.figureChild(700, 830, 1, { girl: true, top: P.CORAL })]);
    case 80:
      return R(BG_DAY(), [(c) => L.sunDisc(950, 160, 70), (c) => L.figureChild(500, 820, 1.1), (c) => L.figureChild(700, 820, 1.1, { girl: true, top: P.TEAL })]);
    case 81:
      return R(BG_DAY(), [
        (c) => L.house(900, 800, 1),
        (c) => L.pathRoad(P.SAND),
        (c) => L.figureAdult(460, 830, 0.9, { robe: P.NAVY }),
        (c) => L.figureAdult(560, 830, 0.9, { robe: P.CORAL, headscarf: true }),
      ]);
    case 82:
      return R(BG_DAY(), [(c) => L.pathRoad(P.GOLD), (c) => L.figureChild(600, 820, 1.3)]);
    case 83:
      return R(BG_DAY(), [(c) => L.tree(950, 800, 0.9), (c) => L.figureChild(500, 820, 1, { girl: true, top: P.CORAL }), (c) => L.figureChild(700, 820, 1)]);
    case 84:
      return R(BG_DAY(), [(c) => L.figureChild(500, 820, 1, { girl: true, top: P.TEAL }), (c) => L.figureChild(700, 820, 1), (c) => L.flower(600, 700, 0.9)]);
    case 85:
      return R(BG_DAY(), [(c) => L.figureChild(500, 820, 1), (c) => L.figureChild(700, 820, 1, { girl: true, top: P.CORAL })]);
    case 86:
      return R(BG_DAY(), [(c) => L.glow(c, 600, 640, 40), (c) => L.figureChild(600, 820, 1.4)]);
    case 87:
      return R(BG_DAY(), [(c) => L.figureChild(600, 820, 1.3), (c) => L.basketFruit(720, 850, 1.1), (c) => L.basketFruit(340, 850, 0.9)]);
    case 88:
      return R(BG_DAY(), [(c) => L.house(600, 780, 1.1), (c) => L.figureChild(600, 850, 1.2), (c) => L.flower(760, 860, 0.8)]);
    case 89:
      return R(BG_SINAI(), [(c) => L.stoneTablet(600, 650, 1.3, true)]);
    case 90:
      return R(BG_DAWN(), [(c) => L.rock(600, 800, 1.2), (c) => L.openBible(500, 730, 1), (c) => L.crown(760, 700, 0.9)]);
    case 91:
      return R(BG_DARK_GATE(), [(c) => L.glow(c, 950, 500, 220, P.GLOW), (c) => L.gate(500, 760, 1.3, true)]);
    case 92:
      return R(BG_DAWN(), [(c) => L.pathRoad(P.SAND), (c) => L.cross(600, 480, 1), (c) => L.figureKneeling(600, 820, 1.4)]);
    case 93:
      return R(BG_DAWN(), [(c) => L.glow(c, 600, 220, 260), (c) => L.figureReaching(600, 800, 1.5)]);
    case 94:
      return R(BG_DAY(), [(c) => L.rock(700, 800, 1), (c) => L.figureKneeling(560, 820, 1.4)]);
    case 95:
      return R(BG_DAY(), [
        (c) => L.figureChild(500, 820, 1),
        (c) => L.figureAdult(650, 820, 1, { robe: P.SAGE }),
        (c) => L.figureAdult(770, 830, 0.9, { robe: P.TEAL, headscarf: true }),
        (c) => L.openBible(560, 850, 0.7),
      ]);
    case 96:
      return R(BG_ROOM(), [
        (c) => `<rect x="820" y="120" width="260" height="340" rx="12" fill="${P.SKY_LIGHT}"/>`,
        (c) => `<rect x="840" y="140" width="220" height="300" fill="${P.SKY_DEEP}" opacity="0.5"/>`,
        (c) => `<ellipse cx="500" cy="870" rx="220" ry="26" fill="${P.SAGE}" opacity="0.4"/>`,
        (c) => L.flower(1000, 800, 0.8),
        (c) => L.table(500, 800, 1),
        (c) => L.figureChild(500, 730, 1.1),
        (c) => L.openBible(500, 780, 0.9),
      ]);
    case 97:
      return R(BG_DAY(), [(c) => L.table(600, 800, 1), (c) => L.waterVessel(460, 760, 1), (c) => L.breadAndCup(760, 800, 0.8)]);
    case 98:
      return R(BG_SEA(), [(c) => L.river(800), (c) => L.glow(c, 600, 300, 200, P.WARM_WHITE)]);
    case 99:
      return R(BG_DAY(), [(c) => L.table(600, 800, 1.2), (c) => L.breadAndCup(600, 800, 1.1)]);
    case 100:
      return R(BG_DAWN(), [(c) => L.breadAndCup(600, 800, 2.1)]);
    case 101:
      return R(BG_DAY(), [
        (c) => L.table(600, 800, 1.2),
        (c) => L.breadAndCup(600, 800, 1),
        (c) => L.figureAdult(340, 850, 0.8, { robe: P.SAGE }),
        (c) => L.figureAdult(860, 850, 0.8, { robe: P.TEAL, headscarf: true }),
      ]);
    case 102:
      return R(BG_ROOM(), [
        (c) => `<rect x="80" y="140" width="220" height="300" rx="12" fill="${P.SKY_DEEP}"/>`,
        (c) => L.star(190, 220, 0.8),
        (c) => L.star(240, 300, 0.6),
        (c) => `<ellipse cx="600" cy="870" rx="240" ry="26" fill="${P.SAGE}" opacity="0.35"/>`,
        (c) => L.bed(700, 800, 1.2),
        (c) => L.figureKneeling(560, 820, 1.2),
        (c) => L.glow(c, 190, 220, 90, P.GLOW),
      ]);
    case 103:
      return R(BG_DAY(), [(c) => L.table(600, 830, 1), (c) => L.openBible(600, 800, 0.9), (c) => L.figureKneeling(600, 780, 1.2)]);
    case 104:
      return R(BG_DAY(), [(c) => L.table(600, 800, 1), (c) => L.lightBeam(c, 600, 100, 700, 160), (c) => L.openBible(600, 780, 1.1)]);
    case 105:
      return R(BG_DUSK(), [(c) => L.figureKneeling(600, 820, 1.5)]);
    case 106:
      return R(BG_DAWN(), [(c) => L.emptyTomb(560, 780, 1.2)]);
    case 107:
      return R(
        { sky: [P.SKY_LIGHT, P.GLOW], hills: [{ y: 840, dip: 30, color: P.WARM_WHITE }] },
        [(c) => L.cloud(300, 300, 1.4), (c) => L.cloud(880, 260, 1.2), (c) => L.throne(600, 780, 1.3)],
      );
    case 108:
      return R(BG_DAY(), [(c) => L.sheep(420, 820, 1.2), (c) => L.sheep(360, 800, 1), (c) => L.goat(800, 820, 1.2), (c) => L.goat(870, 800, 1)]);
    case 109:
      return R(BG_ROOM(), [
        (c) => `<rect x="780" y="120" width="280" height="360" rx="12" fill="${P.GOLD}" opacity="0.35"/>`,
        (c) => L.glow(c, 920, 260, 180, P.GLOW),
        (c) => `<ellipse cx="500" cy="870" rx="220" ry="26" fill="${P.SAGE}" opacity="0.35"/>`,
        (c) => L.bed(500, 800, 1.2),
        (c) => L.flower(220, 830, 0.9),
      ]);
    case 110:
      return R(BG_DAWN(), [(c) => L.sunDisc(600, 220, 80), (c) => L.sprout(600, 800, 1.4)]);
    case 111:
      return R(BG_DARK_GATE(), [(c) => L.glow(c, 980, 500, 220, P.GLOW), (c) => L.gate(500, 760, 1.3, true)]);
    case 112:
      return R(BG_DARK_GATE(), [
        (c) => L.glow(c, 980, 500, 240, P.GLOW),
        (c) => `<rect x="450" y="600" width="140" height="220" rx="6" fill="${P.NAVY}"/>`,
      ]);
    case 113:
      return R(BG_GARDEN(), [(c) => L.glow(c, 600, 260, 260), (c) => L.gate(600, 760, 1.3), (c) => L.tree(300, 810, 1), (c) => L.flower(900, 830, 1)]);
    case 114:
      return R(BG_GARDEN(), [
        (c) => L.glow(c, 600, 220, 260),
        (c) => L.tree(280, 800, 1.1),
        (c) => L.tree(920, 790, 1),
        (c) => L.flower(600, 850, 1),
        (c) => L.flower(480, 830, 0.8),
      ]);

    default:
      throw new Error(`No scene recipe defined for question_number ${n}`);
  }
}

module.exports = { scenes };
