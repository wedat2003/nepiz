import type { CSSProperties } from "react";
import styles from "./secret-botanical-garden.module.css";

type FlowerKind = "lily" | "peony";
type GardenVars = CSSProperties & Record<string, string | number>;

interface FlowerSpec {
  id: string;
  kind: FlowerKind;
  left: string;
  scale: number;
  delay: number;
  tilt: number;
  zIndex: number;
  sway: number;
}

interface LilyLeafSpec {
  baseY: number;
  tipX: number;
  tipY: number;
  rotation: number;
  delayOffset: number;
}

interface PeonyLeafClusterSpec {
  baseY: number;
  spread: number;
  height: number;
  rotation: number;
  delayOffset: number;
}

interface FireflySpec {
  left: string;
  bottom: string;
  delay: number;
  driftX: string;
  driftY: string;
}

interface GrassBladeSpec {
  tipX: number;
  tipY: number;
  width: number;
  opacity: number;
  delayOffset: number;
  front?: boolean;
}

interface GrassClusterSpec {
  id: string;
  baseX: number;
  baseY: number;
  scale: number;
  sway: number;
  blades: GrassBladeSpec[];
}

const FLOWERS: FlowerSpec[] = [
  { id: "lily-left", kind: "lily", left: "22%", scale: 0.94, delay: 0.28, tilt: -7, zIndex: 2, sway: 7.2 },
  { id: "peony-center", kind: "peony", left: "48%", scale: 1.12, delay: 0.48, tilt: -1, zIndex: 4, sway: 8.3 },
  { id: "lily-right", kind: "lily", left: "69%", scale: 0.98, delay: 0.76, tilt: 4, zIndex: 3, sway: 7.5 },
  { id: "peony-right", kind: "peony", left: "83%", scale: 0.9, delay: 0.9, tilt: 6, zIndex: 2, sway: 8.7 },
];

const LILY_LEAVES: LilyLeafSpec[] = [
  { baseY: 458, tipX: 178, tipY: 404, rotation: 8, delayOffset: 0.16 },
  { baseY: 426, tipX: 76, tipY: 352, rotation: -8, delayOffset: 0.24 },
  { baseY: 386, tipX: 176, tipY: 304, rotation: 10, delayOffset: 0.32 },
  { baseY: 344, tipX: 84, tipY: 254, rotation: -8, delayOffset: 0.4 },
  { baseY: 298, tipX: 168, tipY: 210, rotation: 8, delayOffset: 0.48 },
  { baseY: 258, tipX: 92, tipY: 170, rotation: -6, delayOffset: 0.56 },
];

const PEONY_CLUSTERS: PeonyLeafClusterSpec[] = [
  { baseY: 452, spread: 58, height: 92, rotation: -11, delayOffset: 0.2 },
  { baseY: 396, spread: 50, height: 82, rotation: 8, delayOffset: 0.3 },
  { baseY: 338, spread: 42, height: 68, rotation: -5, delayOffset: 0.4 },
];

const FIREFLIES: FireflySpec[] = [
  { left: "16%", bottom: "52%", delay: 0.6, driftX: "0.8rem", driftY: "-4.2rem" },
  { left: "28%", bottom: "66%", delay: 1.4, driftX: "-0.5rem", driftY: "-3.4rem" },
  { left: "43%", bottom: "58%", delay: 2.1, driftX: "0.7rem", driftY: "-5rem" },
  { left: "58%", bottom: "64%", delay: 0.9, driftX: "-0.6rem", driftY: "-4.4rem" },
  { left: "74%", bottom: "56%", delay: 1.8, driftX: "0.9rem", driftY: "-4.8rem" },
  { left: "87%", bottom: "61%", delay: 2.5, driftX: "-0.4rem", driftY: "-3.8rem" },
];

const GRASS_CLUSTERS: GrassClusterSpec[] = [
  {
    id: "grass-a",
    baseX: 64,
    baseY: 370,
    scale: 1.06,
    sway: 6.2,
    blades: [
      { tipX: -34, tipY: -156, width: 14, opacity: 0.26, delayOffset: 0.94 },
      { tipX: -16, tipY: -136, width: 10, opacity: 0.22, delayOffset: 1.0 },
      { tipX: 2, tipY: -168, width: 12, opacity: 0.34, delayOffset: 1.06, front: true },
      { tipX: 18, tipY: -142, width: 10, opacity: 0.24, delayOffset: 1.12 },
      { tipX: 38, tipY: -118, width: 8, opacity: 0.18, delayOffset: 1.18 },
    ],
  },
  {
    id: "grass-b",
    baseX: 176,
    baseY: 370,
    scale: 1.14,
    sway: 6.8,
    blades: [
      { tipX: -52, tipY: -172, width: 16, opacity: 0.3, delayOffset: 1.02 },
      { tipX: -28, tipY: -150, width: 12, opacity: 0.26, delayOffset: 1.08 },
      { tipX: -6, tipY: -186, width: 13, opacity: 0.34, delayOffset: 1.14, front: true },
      { tipX: 18, tipY: -160, width: 11, opacity: 0.24, delayOffset: 1.2 },
      { tipX: 44, tipY: -132, width: 10, opacity: 0.2, delayOffset: 1.26 },
      { tipX: 62, tipY: -108, width: 8, opacity: 0.16, delayOffset: 1.32 },
    ],
  },
  {
    id: "grass-c",
    baseX: 322,
    baseY: 370,
    scale: 1.08,
    sway: 6.5,
    blades: [
      { tipX: -46, tipY: -162, width: 14, opacity: 0.28, delayOffset: 1.12 },
      { tipX: -22, tipY: -142, width: 10, opacity: 0.22, delayOffset: 1.18 },
      { tipX: 0, tipY: -176, width: 12, opacity: 0.34, delayOffset: 1.24, front: true },
      { tipX: 24, tipY: -152, width: 11, opacity: 0.24, delayOffset: 1.3 },
      { tipX: 52, tipY: -126, width: 9, opacity: 0.18, delayOffset: 1.36 },
    ],
  },
  {
    id: "grass-d",
    baseX: 488,
    baseY: 370,
    scale: 1.18,
    sway: 7.1,
    blades: [
      { tipX: -58, tipY: -178, width: 17, opacity: 0.3, delayOffset: 1.22 },
      { tipX: -34, tipY: -156, width: 13, opacity: 0.26, delayOffset: 1.28 },
      { tipX: -10, tipY: -194, width: 14, opacity: 0.36, delayOffset: 1.34, front: true },
      { tipX: 18, tipY: -168, width: 12, opacity: 0.28, delayOffset: 1.4 },
      { tipX: 42, tipY: -146, width: 10, opacity: 0.22, delayOffset: 1.46 },
      { tipX: 68, tipY: -116, width: 8, opacity: 0.16, delayOffset: 1.52 },
    ],
  },
  {
    id: "grass-e",
    baseX: 666,
    baseY: 370,
    scale: 1.1,
    sway: 6.6,
    blades: [
      { tipX: -48, tipY: -168, width: 15, opacity: 0.28, delayOffset: 1.32 },
      { tipX: -24, tipY: -148, width: 11, opacity: 0.24, delayOffset: 1.38 },
      { tipX: 0, tipY: -184, width: 13, opacity: 0.34, delayOffset: 1.44, front: true },
      { tipX: 20, tipY: -160, width: 11, opacity: 0.26, delayOffset: 1.5 },
      { tipX: 44, tipY: -136, width: 9, opacity: 0.2, delayOffset: 1.56 },
    ],
  },
  {
    id: "grass-f",
    baseX: 850,
    baseY: 370,
    scale: 1.16,
    sway: 6.9,
    blades: [
      { tipX: -54, tipY: -174, width: 16, opacity: 0.3, delayOffset: 1.42 },
      { tipX: -28, tipY: -150, width: 12, opacity: 0.24, delayOffset: 1.48 },
      { tipX: -4, tipY: -188, width: 13, opacity: 0.34, delayOffset: 1.54, front: true },
      { tipX: 24, tipY: -162, width: 11, opacity: 0.26, delayOffset: 1.6 },
      { tipX: 50, tipY: -138, width: 10, opacity: 0.2, delayOffset: 1.66 },
      { tipX: 72, tipY: -112, width: 8, opacity: 0.16, delayOffset: 1.72 },
    ],
  },
  {
    id: "grass-g",
    baseX: 1042,
    baseY: 370,
    scale: 1.04,
    sway: 6.3,
    blades: [
      { tipX: -40, tipY: -158, width: 14, opacity: 0.26, delayOffset: 1.54 },
      { tipX: -18, tipY: -136, width: 10, opacity: 0.22, delayOffset: 1.6 },
      { tipX: 4, tipY: -170, width: 12, opacity: 0.32, delayOffset: 1.66, front: true },
      { tipX: 26, tipY: -146, width: 10, opacity: 0.22, delayOffset: 1.72 },
      { tipX: 48, tipY: -120, width: 8, opacity: 0.18, delayOffset: 1.78 },
    ],
  },
];

const LILY_OUTER_PETAL = "M120 150 C136 134 151 88 143 34 C139 10 101 10 97 34 C89 88 104 134 120 150 Z";
const LILY_INNER_PETAL = "M120 146 C132 132 142 94 136 48 C132 22 108 22 104 48 C98 94 108 132 120 146 Z";
const PEONY_OUTER_PETAL = "M120 156 C150 148 172 120 168 82 C164 42 132 18 120 34 C108 18 76 42 72 82 C68 120 90 148 120 156 Z";
const PEONY_MID_PETAL = "M120 150 C142 144 158 120 156 90 C154 58 132 38 120 50 C108 38 86 58 84 90 C82 120 98 144 120 150 Z";
const PEONY_INNER_PETAL = "M120 144 C136 140 148 120 146 98 C144 74 130 60 120 68 C110 60 96 74 94 98 C92 120 104 140 120 144 Z";

function lilyLeafPath(baseY: number, tipX: number, tipY: number) {
  const isRight = tipX > 120;
  const stemShoulder = isRight ? 132 : 108;
  const returnX = isRight ? 126 : 114;
  const tipReturn = isRight ? tipX - 12 : tipX + 12;
  const midY = Math.round((baseY + tipY) / 2);

  return `M120 ${baseY} C ${stemShoulder} ${baseY - 12}, ${tipX} ${midY + 20}, ${tipX} ${tipY} C ${tipReturn} ${midY + 14}, ${returnX} ${baseY - 34}, 120 ${baseY} Z`;
}

function lilyLeafVeinPath(baseY: number, tipX: number, tipY: number) {
  const controlX = tipX > 120 ? tipX - 10 : tipX + 10;
  const controlY = Math.round((baseY + tipY) / 2);

  return `M120 ${baseY - 10} C 120 ${baseY - 44}, ${controlX} ${controlY + 18}, ${tipX} ${tipY + 6}`;
}

function peonyLeafletPath(baseX: number, baseY: number, tipX: number, tipY: number) {
  const sideCurve = tipX > baseX ? 16 : -16;
  const innerCurve = tipX > baseX ? 12 : -12;
  const crownX = tipX + (tipX > baseX ? -8 : 8);

  return `M${baseX} ${baseY} C ${baseX + sideCurve} ${baseY - 12}, ${tipX} ${baseY - 32}, ${tipX} ${tipY + 18} C ${tipX} ${tipY + 8}, ${crownX} ${tipY}, ${tipX - sideCurve} ${tipY + 4} C ${baseX + innerCurve} ${tipY + 16}, ${baseX + innerCurve} ${baseY - 28}, ${baseX} ${baseY} Z`;
}

function peonyLeafletVeinPath(baseX: number, baseY: number, tipX: number, tipY: number) {
  const curve = tipX > baseX ? -8 : 8;

  return `M${baseX} ${baseY - 6} C ${baseX + curve} ${baseY - 28}, ${tipX + curve} ${baseY - 34}, ${tipX} ${tipY + 10}`;
}

function centralLeafletPath(baseY: number, height: number) {
  return `M120 ${baseY} C 134 ${baseY - 16}, 138 ${baseY - 40}, 134 ${baseY - 64} C 130 ${
    baseY - height
  }, 124 ${baseY - height - 8}, 120 ${baseY - height} C 116 ${baseY - height - 8}, 110 ${
    baseY - height
  }, 106 ${baseY - 64} C 102 ${baseY - 40}, 106 ${baseY - 16}, 120 ${baseY} Z`;
}

function centralLeafletVeinPath(baseY: number, height: number) {
  return `M120 ${baseY - 8} C 120 ${baseY - 30}, 122 ${baseY - 58}, 120 ${baseY - height + 8}`;
}

function grassBladePath(tipX: number, tipY: number, width: number) {
  const neck = Math.max(7, width * 0.6);
  const shoulder = Math.max(12, width * 1.5);
  const midX = tipX * 0.56;
  const midY = tipY * 0.58;

  return `M0 0 C ${neck} -18, ${midX + width * 0.8} ${midY + 16}, ${tipX} ${tipY} C ${
    midX - width * 0.8
  } ${midY + 12}, ${-shoulder} -22, 0 0 Z`;
}

function grassVeinPath(tipX: number, tipY: number) {
  return `M0 -4 C ${tipX * 0.22} ${tipY * 0.24}, ${tipX * 0.72} ${tipY * 0.66}, ${tipX} ${tipY + 6}`;
}

function Flower({ spec }: { spec: FlowerSpec }) {
  const style = {
    "--left": spec.left,
    "--scale": spec.scale,
    "--delay": `${spec.delay}s`,
    "--tilt": `${spec.tilt}deg`,
    "--sway-duration": `${spec.sway}s`,
    zIndex: spec.zIndex,
  } as GardenVars;

  const ids = {
    stem: `${spec.id}-stem`,
    leaf: `${spec.id}-leaf`,
    bloomOuter: `${spec.id}-bloom-outer`,
    bloomInner: `${spec.id}-bloom-inner`,
    bloomMid: `${spec.id}-bloom-mid`,
    stamen: `${spec.id}-stamen`,
    pistil: `${spec.id}-pistil`,
    glow: `${spec.id}-glow`,
    shadow: `${spec.id}-shadow`,
  };

  const lilyStem = "M120 520 C124 450 114 392 120 324 C126 248 122 190 120 136";
  const peonyStem = "M120 520 C116 454 126 406 122 334 C118 260 120 206 120 150";

  return (
    <div className={`${styles.flower} ${styles[spec.kind]}`} style={style}>
      <svg className={styles.flowerSvg} viewBox="0 0 240 560" aria-hidden="true">
        <defs>
          <linearGradient id={ids.stem} x1="120" y1="136" x2="120" y2="520" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={spec.kind === "lily" ? "#d7f3b8" : "#d9efb1"} />
            <stop offset="52%" stopColor={spec.kind === "lily" ? "#5b9c62" : "#4d8a58"} />
            <stop offset="100%" stopColor="#163327" />
          </linearGradient>
          <linearGradient id={ids.leaf} x1="80" y1="140" x2="176" y2="520" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={spec.kind === "lily" ? "#d6f6b9" : "#d0ebb2"} />
            <stop offset="48%" stopColor={spec.kind === "lily" ? "#5da56c" : "#4e8c5c"} />
            <stop offset="100%" stopColor="#173126" />
          </linearGradient>
          <linearGradient id={ids.bloomOuter} x1="120" y1="18" x2="120" y2="164" gradientUnits="userSpaceOnUse">
            {spec.kind === "lily" ? (
              <>
                <stop offset="0%" stopColor="#fffdf7" />
                <stop offset="58%" stopColor="#f7dbe7" />
                <stop offset="100%" stopColor="#df8fb3" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#fff1f6" />
                <stop offset="52%" stopColor="#f0a1bf" />
                <stop offset="100%" stopColor="#b44f84" />
              </>
            )}
          </linearGradient>
          <linearGradient id={ids.bloomMid} x1="120" y1="34" x2="120" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fff7fa" />
            <stop offset="56%" stopColor="#ffc6da" />
            <stop offset="100%" stopColor="#e086aa" />
          </linearGradient>
          <linearGradient id={ids.bloomInner} x1="120" y1="42" x2="120" y2="150" gradientUnits="userSpaceOnUse">
            {spec.kind === "lily" ? (
              <>
                <stop offset="0%" stopColor="#fffef5" />
                <stop offset="56%" stopColor="#f3e7de" />
                <stop offset="100%" stopColor="#d6a8bf" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#fffdfd" />
                <stop offset="54%" stopColor="#ffdbe7" />
                <stop offset="100%" stopColor="#eca1bc" />
              </>
            )}
          </linearGradient>
          <linearGradient id={ids.stamen} x1="120" y1="70" x2="120" y2="156" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f6d978" />
            <stop offset="100%" stopColor="#f8f3d3" />
          </linearGradient>
          <linearGradient id={ids.pistil} x1="120" y1="58" x2="120" y2="154" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d9f0b4" />
            <stop offset="100%" stopColor="#a4c67f" />
          </linearGradient>
          <radialGradient id={ids.glow} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor={spec.kind === "lily" ? "rgba(255, 247, 238, 0.78)" : "rgba(255, 213, 226, 0.62)"} />
            <stop offset="100%" stopColor="rgba(255, 213, 226, 0)" />
          </radialGradient>
          <filter id={ids.shadow} x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="rgba(0, 0, 0, 0.28)" />
          </filter>
        </defs>

        <path className={styles.stemPath} d={spec.kind === "lily" ? lilyStem : peonyStem} pathLength={1} stroke={`url(#${ids.stem})`} />

        <g className={styles.leafLayer}>
          {spec.kind === "lily"
            ? LILY_LEAVES.map((leaf, index) => (
                <g
                  key={`${spec.id}-leaf-${index}`}
                  transform={`rotate(${leaf.rotation} 120 ${leaf.baseY})`}
                >
                  <path
                    className={`${styles.leafPath} ${styles.lilyLeafPath}`}
                    d={lilyLeafPath(leaf.baseY, leaf.tipX, leaf.tipY)}
                    fill={`url(#${ids.leaf})`}
                    style={{ "--enter-delay": `${spec.delay + leaf.delayOffset}s` } as GardenVars}
                  />
                  <path
                    className={styles.leafVein}
                    d={lilyLeafVeinPath(leaf.baseY, leaf.tipX, leaf.tipY)}
                    style={{ "--enter-delay": `${spec.delay + leaf.delayOffset + 0.06}s` } as GardenVars}
                  />
                </g>
              ))
            : PEONY_CLUSTERS.map((cluster, index) => (
                <g
                  key={`${spec.id}-cluster-${index}`}
                  transform={`rotate(${cluster.rotation} 120 ${cluster.baseY})`}
                >
                  <path
                    className={`${styles.leafPath} ${styles.peonyLeafPath}`}
                    d={centralLeafletPath(cluster.baseY, cluster.height)}
                    fill={`url(#${ids.leaf})`}
                    style={{ "--enter-delay": `${spec.delay + cluster.delayOffset}s` } as GardenVars}
                  />
                  <path
                    className={styles.leafVein}
                    d={centralLeafletVeinPath(cluster.baseY, cluster.height)}
                    style={{ "--enter-delay": `${spec.delay + cluster.delayOffset + 0.05}s` } as GardenVars}
                  />
                  <path
                    className={`${styles.leafPath} ${styles.peonyLeafPath}`}
                    d={peonyLeafletPath(120, cluster.baseY - 8, 120 - cluster.spread, cluster.baseY - cluster.height + 10)}
                    fill={`url(#${ids.leaf})`}
                    style={{ "--enter-delay": `${spec.delay + cluster.delayOffset + 0.05}s` } as GardenVars}
                  />
                  <path
                    className={styles.leafVein}
                    d={peonyLeafletVeinPath(120, cluster.baseY - 8, 120 - cluster.spread, cluster.baseY - cluster.height + 10)}
                    style={{ "--enter-delay": `${spec.delay + cluster.delayOffset + 0.1}s` } as GardenVars}
                  />
                  <path
                    className={`${styles.leafPath} ${styles.peonyLeafPath}`}
                    d={peonyLeafletPath(120, cluster.baseY - 8, 120 + cluster.spread, cluster.baseY - cluster.height + 12)}
                    fill={`url(#${ids.leaf})`}
                    style={{ "--enter-delay": `${spec.delay + cluster.delayOffset + 0.1}s` } as GardenVars}
                  />
                  <path
                    className={styles.leafVein}
                    d={peonyLeafletVeinPath(120, cluster.baseY - 8, 120 + cluster.spread, cluster.baseY - cluster.height + 12)}
                    style={{ "--enter-delay": `${spec.delay + cluster.delayOffset + 0.14}s` } as GardenVars}
                  />
                </g>
              ))}
        </g>

        <g
          className={styles.bloomGroup}
          style={{ "--bloom-delay": `${spec.delay + 0.78}s` } as GardenVars}
          filter={`url(#${ids.shadow})`}
        >
          <ellipse className={styles.bloomGlow} cx="120" cy="132" rx={spec.kind === "lily" ? 56 : 68} ry={spec.kind === "lily" ? 44 : 52} fill={`url(#${ids.glow})`} />

          {spec.kind === "lily" ? (
            <>
              {[0, 120, 240].map((rotation, index) => (
                <g key={`${spec.id}-outer-${rotation}`} transform={`rotate(${rotation} 120 150)`}>
                  <path
                    className={`${styles.petalPath} ${styles.lilyOuterPetal}`}
                    d={LILY_OUTER_PETAL}
                    fill={`url(#${ids.bloomOuter})`}
                    style={{ "--enter-delay": `${spec.delay + 0.84 + index * 0.08}s` } as GardenVars}
                  />
                </g>
              ))}
              {[60, 180, 300].map((rotation, index) => (
                <g key={`${spec.id}-inner-${rotation}`} transform={`rotate(${rotation} 120 146)`}>
                  <path
                    className={`${styles.petalPath} ${styles.lilyInnerPetal}`}
                    d={LILY_INNER_PETAL}
                    fill={`url(#${ids.bloomInner})`}
                    style={{ "--enter-delay": `${spec.delay + 1.08 + index * 0.06}s` } as GardenVars}
                  />
                </g>
              ))}
              {[20, 76, 134, 196, 254, 314].map((rotation, index) => (
                <g key={`${spec.id}-stamen-${rotation}`} transform={`rotate(${rotation} 120 148)`}>
                  <g
                    className={styles.stamenGroup}
                    style={{ "--enter-delay": `${spec.delay + 1.22 + index * 0.04}s` } as GardenVars}
                  >
                    <path d="M120 146 C122 128 126 98 134 74" stroke={`url(#${ids.stamen})`} strokeWidth="2.4" fill="none" strokeLinecap="round" />
                    <ellipse cx="136" cy="68" rx="4" ry="8" fill="#b07023" />
                  </g>
                </g>
              ))}
              <g
                className={styles.pistilGroup}
                style={{ "--enter-delay": `${spec.delay + 1.3}s` } as GardenVars}
              >
                <path d="M120 148 C120 124 122 94 120 58" stroke={`url(#${ids.pistil})`} strokeWidth="3" fill="none" strokeLinecap="round" />
                <ellipse cx="120" cy="54" rx="5" ry="5" fill="#d8ecb1" />
              </g>
            </>
          ) : (
            <>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation, index) => (
                <g key={`${spec.id}-guard-${rotation}`} transform={`rotate(${rotation} 120 156)`}>
                  <path
                    className={`${styles.petalPath} ${styles.peonyOuterPetal}`}
                    d={PEONY_OUTER_PETAL}
                    fill={`url(#${ids.bloomOuter})`}
                    style={{ "--enter-delay": `${spec.delay + 0.82 + index * 0.04}s` } as GardenVars}
                  />
                </g>
              ))}
              {[18, 58, 98, 138, 178, 218, 258, 298, 338].map((rotation, index) => (
                <g key={`${spec.id}-mid-${rotation}`} transform={`rotate(${rotation} 120 150)`}>
                  <path
                    className={`${styles.petalPath} ${styles.peonyMidPetal}`}
                    d={PEONY_MID_PETAL}
                    fill={`url(#${ids.bloomMid})`}
                    style={{ "--enter-delay": `${spec.delay + 1.04 + index * 0.032}s` } as GardenVars}
                  />
                </g>
              ))}
              {[8, 38, 68, 98, 128, 158, 188, 218, 248, 278, 308, 338].map((rotation, index) => (
                <g key={`${spec.id}-inner-${rotation}`} transform={`rotate(${rotation} 120 144)`}>
                  <path
                    className={`${styles.petalPath} ${styles.peonyInnerPetal}`}
                    d={PEONY_INNER_PETAL}
                    fill={`url(#${ids.bloomInner})`}
                    style={{ "--enter-delay": `${spec.delay + 1.18 + index * 0.024}s` } as GardenVars}
                  />
                </g>
              ))}
              {Array.from({ length: 14 }).map((_, index) => {
                const rotation = index * (360 / 14);

                return (
                  <g key={`${spec.id}-stamen-${rotation}`} transform={`rotate(${rotation} 120 146)`}>
                    <g
                      className={styles.stamenGroup}
                      style={{ "--enter-delay": `${spec.delay + 1.3 + index * 0.02}s` } as GardenVars}
                    >
                      <path d="M120 146 C122 134 124 122 128 108" stroke={`url(#${ids.stamen})`} strokeWidth="2" fill="none" strokeLinecap="round" />
                      <ellipse cx="129" cy="104" rx="2.8" ry="3.8" fill="#efc247" />
                    </g>
                  </g>
                );
              })}
              <circle
                className={styles.peonyHeart}
                cx="120"
                cy="144"
                r="16"
                fill="rgba(243, 205, 97, 0.85)"
              />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}

function GroundFoliage() {
  return (
    <div className={styles.foliage}>
      <svg className={styles.foliageSvg} viewBox="0 0 1200 380" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="grass-back" x1="0" y1="152" x2="0" y2="370" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#96d49a" />
            <stop offset="48%" stopColor="#497d54" />
            <stop offset="100%" stopColor="#12261a" />
          </linearGradient>
          <linearGradient id="grass-front" x1="0" y1="148" x2="0" y2="370" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#c4edb0" />
            <stop offset="42%" stopColor="#5e9a69" />
            <stop offset="100%" stopColor="#173126" />
          </linearGradient>
          <linearGradient id="grass-vein" x1="0" y1="150" x2="0" y2="364" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(244, 255, 231, 0.5)" />
            <stop offset="100%" stopColor="rgba(244, 255, 231, 0.05)" />
          </linearGradient>
        </defs>

        <path
          className={styles.soil}
          d="M0 370 C118 332 234 316 344 324 C468 334 568 308 692 320 C812 332 950 314 1200 332 V380 H0 Z"
        />

        {GRASS_CLUSTERS.map((cluster) => (
          <g
            key={cluster.id}
            className={styles.grassCluster}
            transform={`translate(${cluster.baseX} ${cluster.baseY}) scale(${cluster.scale})`}
            style={{ "--cluster-sway": `${cluster.sway}s` } as GardenVars}
          >
            <ellipse className={styles.grassBaseShadow} cx="0" cy="3" rx="26" ry="9" />
            {cluster.blades.map((blade, index) => (
              <g key={`${cluster.id}-blade-${index}`}>
                <path
                  className={`${styles.grassBladeShape} ${blade.front ? styles.grassBladeFront : styles.grassBladeBack}`}
                  d={grassBladePath(blade.tipX, blade.tipY, blade.width)}
                  fill={blade.front ? "url(#grass-front)" : "url(#grass-back)"}
                  style={
                    {
                      "--blade-delay": `${blade.delayOffset}s`,
                      "--blade-opacity": blade.opacity,
                    } as GardenVars
                  }
                />
                <path
                  className={styles.grassBladeVein}
                  d={grassVeinPath(blade.tipX, blade.tipY)}
                  stroke="url(#grass-vein)"
                  style={{ "--blade-delay": `${blade.delayOffset + 0.04}s` } as GardenVars}
                />
              </g>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function SecretBotanicalGarden() {
  return (
    <div className={styles.scene}>
      <div className={styles.night} />
      <div className={styles.aurora} />
      <div className={styles.mist} />
      <div className={styles.stars} />

      <div className={styles.fireflies} aria-hidden="true">
        {FIREFLIES.map((firefly, index) => (
          <span
            key={`firefly-${index}`}
            className={styles.firefly}
            style={
              {
                "--firefly-left": firefly.left,
                "--firefly-bottom": firefly.bottom,
                "--firefly-delay": `${firefly.delay}s`,
                "--drift-x": firefly.driftX,
                "--drift-y": firefly.driftY,
              } as GardenVars
            }
          />
        ))}
      </div>

      <GroundFoliage />

      <div className={styles.groundGlow} />

      <div className={styles.flowersLayer}>
        {FLOWERS.map((flower) => (
          <Flower key={flower.id} spec={flower} />
        ))}
      </div>
    </div>
  );
}
