import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import type { SpatialMarker, EvidenceItem } from "../../types/case";

interface Props {
  markers: SpatialMarker[];
  evidence: EvidenceItem[];
  templateId: string;
}

const SEVERITY_LABELS: Record<SpatialMarker["severity"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const STATUS_LABELS: Record<NonNullable<SpatialMarker["status"]>, string> = {
  open: "Open",
  resolved: "Resolved",
  "needs-review": "Needs Review",
};

type SceneTone = "copper" | "forest" | "slate";

interface SceneMeta {
  title: string;
  subtitle: string;
  eyebrow: string;
  helper: string;
  tone: SceneTone;
  metrics: string[];
}

const SCENE_META: Record<string, SceneMeta> = {
  "auto-claim": {
    title: "Collision Geometry Review",
    subtitle: "Parking-lot impact mapped against vehicle damage, scene context, and repair evidence",
    eyebrow: "3D damage reconstruction",
    helper: "Orbit the incident at a glance: contact point, evidence provenance, and severity all stay spatially linked",
    tone: "copper",
    metrics: ["4 evidence anchors", "Front-right impact", "$1,070 estimate"],
  },
  "fleet-safety": {
    title: "Dock Maneuver Risk Replay",
    subtitle: "Warehouse reverse path, exclusion-zone breach, and operator distraction in one operational view",
    eyebrow: "3D safety reconstruction",
    helper: "The scene clarifies where the unit moved, what it struck, and which risk controls failed during the maneuver",
    tone: "forest",
    metrics: ["4 risk anchors", "4.2 mph impact", "Bay 4 workflow"],
  },
  "site-inspection": {
    title: "Facade Condition Map",
    subtitle: "Structural issues, envelope failures, and pedestrian hazards layered onto a premium spatial building model",
    eyebrow: "3D inspection review",
    helper: "Reviewers can scan the whole building instantly, then open each finding with linked evidence and remediation context",
    tone: "slate",
    metrics: ["4 field findings", "Exterior envelope", "Priority remediation"],
  },
};

function toneClassName(tone: SceneTone) {
  return `spatial-panel--${tone}`;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.35;
const ZOOM_STEP = 0.18;
const BASE_DRAG_ALLOWANCE = 28;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatAnchorNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function formatCount(value: number) {
  return String(value).padStart(2, "0");
}

function formatSectionLabel(sectionKey?: string) {
  if (!sectionKey) return "Supporting evidence";
  return sectionKey
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (match) => match.toUpperCase());
}

function AutoClaimScene() {
  return (
    <svg
      viewBox="0 0 1200 720"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="spatial-scene__svg"
    >
      <defs>
        <linearGradient id="auto-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#181311" />
          <stop offset="48%" stopColor="#251a16" />
          <stop offset="100%" stopColor="#120f0d" />
        </linearGradient>
        <radialGradient id="auto-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#ffbb8c" stopOpacity="0.28" />
          <stop offset="55%" stopColor="#ff8d4d" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="auto-lot" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#473630" />
          <stop offset="100%" stopColor="#221917" />
        </linearGradient>
        <linearGradient id="auto-car-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0ede9" />
          <stop offset="100%" stopColor="#b2aca5" />
        </linearGradient>
        <linearGradient id="auto-car-side" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9b948b" />
          <stop offset="100%" stopColor="#6d665f" />
        </linearGradient>
        <linearGradient id="auto-dark-car" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34383f" />
          <stop offset="100%" stopColor="#12161d" />
        </linearGradient>
        <filter id="auto-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="20" stdDeviation="24" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>

      <rect width="1200" height="720" fill="url(#auto-bg)" />
      <rect width="1200" height="720" fill="url(#auto-glow)" />

      <g opacity="0.9">
        <polygon points="130,520 640,250 1085,432 575,690" fill="url(#auto-lot)" />
        <polygon points="130,520 130,574 575,720 575,690" fill="#140f0d" opacity="0.9" />
        <polygon points="575,690 575,720 1085,462 1085,432" fill="#090807" opacity="0.9" />
      </g>

      <g stroke="#7d665b" strokeOpacity="0.45" strokeWidth="6">
        <line x1="280" y1="470" x2="705" y2="250" />
        <line x1="374" y1="505" x2="799" y2="286" />
        <line x1="468" y1="541" x2="893" y2="321" />
        <line x1="562" y1="576" x2="987" y2="357" />
        <line x1="657" y1="612" x2="1085" y2="394" />
      </g>
      <g stroke="#f4d7a8" strokeOpacity="0.58" strokeWidth="5">
        <line x1="216" y1="548" x2="552" y2="708" />
        <line x1="342" y1="482" x2="678" y2="642" />
        <line x1="468" y1="415" x2="804" y2="575" />
        <line x1="594" y1="349" x2="930" y2="509" />
      </g>

      <g opacity="0.65">
        <polygon points="664,186 928,286 832,336 566,236" fill="#2a1d19" />
        <polygon points="566,236 566,293 832,393 832,336" fill="#171210" />
        <polygon points="832,336 832,393 928,343 928,286" fill="#0e0a09" />
        <ellipse cx="745" cy="394" rx="128" ry="42" fill="#000" opacity="0.35" />
      </g>

      <g filter="url(#auto-shadow)">
        <ellipse cx="492" cy="475" rx="164" ry="58" fill="#000" opacity="0.42" />
        <polygon points="390,255 585,328 470,388 276,314" fill="url(#auto-car-top)" />
        <polygon points="276,314 276,420 470,494 470,388" fill="url(#auto-car-side)" />
        <polygon points="470,388 470,494 585,434 585,328" fill="#8b847d" />
        <path d="M286 414 C 302 390, 345 390, 368 414" fill="none" stroke="#645d56" strokeWidth="8" strokeLinecap="round" opacity="0.72" />
        <path d="M414 465 C 430 438, 478 441, 496 469" fill="none" stroke="#645d56" strokeWidth="8" strokeLinecap="round" opacity="0.72" />
        <polygon points="280,401 470,471 470,488 280,419" fill="#5e5750" opacity="0.55" />
        <path d="M300 374 L 468 437" stroke="#cfc7bd" strokeWidth="4" strokeLinecap="round" opacity="0.34" />
        <polygon points="331,283 465,333 390,372 257,321" fill="#87a7c2" opacity="0.82" />
        <polygon points="394,307 506,349 442,382 331,340" fill="#7394ad" opacity="0.75" />
        <polygon points="516,354 553,367 491,400 455,386" fill="#d2c9be" />
        <polygon points="285,387 359,415 359,452 285,423" fill="#8b847d" />
        <polygon points="389,427 470,458 470,494 389,463" fill="#8b847d" />
        <ellipse cx="329" cy="430" rx="44" ry="22" fill="#151515" />
        <ellipse cx="463" cy="481" rx="48" ry="24" fill="#151515" />
        <ellipse cx="329" cy="430" rx="22" ry="22" fill="#79808a" />
        <ellipse cx="463" cy="481" rx="24" ry="24" fill="#79808a" />
      </g>

      <g>
        <path d="M487 383 C 540 355, 582 350, 624 364" fill="none" stroke="#ff8a43" strokeWidth="10" strokeLinecap="round" opacity="0.9" />
        <path d="M489 399 C 540 373, 580 370, 613 383" fill="none" stroke="#ffd1a9" strokeWidth="4" strokeLinecap="round" opacity="0.95" />
        <circle cx="494" cy="389" r="14" fill="#ff8a43" opacity="0.75" />
        <circle cx="494" cy="389" r="30" fill="#ff8a43" opacity="0.14" />
      </g>

      <g opacity="0.92">
        <rect x="772" y="116" width="232" height="132" rx="18" fill="#1a1512" stroke="#6b4b3b" />
        <rect x="790" y="138" width="92" height="64" rx="10" fill="#40352f" />
        <rect x="896" y="138" width="90" height="18" rx="9" fill="#4f3f36" />
        <rect x="896" y="168" width="60" height="12" rx="6" fill="#8b5e48" />
        <rect x="896" y="188" width="76" height="12" rx="6" fill="#5a4d45" />
        <text x="896" y="219" fill="#d8c7ba" fontSize="20" fontFamily="system-ui, sans-serif" fontWeight="600">Repair estimate linked</text>
      </g>

      <g opacity="0.88">
        <rect x="156" y="114" width="212" height="120" rx="18" fill="#161311" stroke="#4c3c33" />
        <text x="182" y="154" fill="#e0d5ca" fontSize="20" fontFamily="system-ui, sans-serif" fontWeight="600">Scene overview</text>
        <text x="182" y="184" fill="#9c8f85" fontSize="16" fontFamily="system-ui, sans-serif">Lot C geometry confirms</text>
        <text x="182" y="206" fill="#9c8f85" fontSize="16" fontFamily="system-ui, sans-serif">low-speed side sweep path</text>
        <rect x="182" y="214" width="122" height="10" rx="5" fill="#8b5e48" />
      </g>
    </svg>
  );
}

function FleetSafetyScene() {
  return (
    <svg
      viewBox="0 0 1200 720"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="spatial-scene__svg"
    >
      <defs>
        <linearGradient id="fleet-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#101615" />
          <stop offset="50%" stopColor="#152421" />
          <stop offset="100%" stopColor="#0a0f0f" />
        </linearGradient>
        <radialGradient id="fleet-glow" cx="58%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#6fd4b1" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#3a7f69" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fleet-floor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#24322e" />
          <stop offset="100%" stopColor="#101716" />
        </linearGradient>
        <linearGradient id="fleet-van" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e5ebe6" />
          <stop offset="100%" stopColor="#b9c3bc" />
        </linearGradient>
        <linearGradient id="fleet-van-side" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8da098" />
          <stop offset="100%" stopColor="#5f716a" />
        </linearGradient>
        <filter id="fleet-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="22" floodColor="#000" floodOpacity="0.46" />
        </filter>
      </defs>

      <rect width="1200" height="720" fill="url(#fleet-bg)" />
      <rect width="1200" height="720" fill="url(#fleet-glow)" />

      <polygon points="84,536 628,252 1092,430 548,714" fill="url(#fleet-floor)" />
      <polygon points="84,536 84,590 548,720 548,714" fill="#0a0f0f" />
      <polygon points="548,714 548,720 1092,466 1092,430" fill="#07100f" />

      <g opacity="0.8">
        <polygon points="674,132 1036,268 1036,476 674,338" fill="#172220" />
        <polygon points="582,180 674,132 674,338 582,387" fill="#0d1414" />
        <polygon points="582,180 944,315 1036,268 674,132" fill="#243431" />
        <rect x="753" y="220" width="160" height="126" rx="12" fill="#0f1817" opacity="0.95" />
        <rect x="771" y="238" width="124" height="90" rx="10" fill="#21312e" />
        <rect x="946" y="192" width="34" height="204" rx="10" fill="#101716" />
      </g>

      <g stroke="#6fae97" strokeOpacity="0.3" strokeWidth="4">
        <line x1="220" y1="560" x2="574" y2="374" />
        <line x1="312" y1="595" x2="666" y2="409" />
        <line x1="404" y1="630" x2="758" y2="444" />
        <line x1="496" y1="665" x2="850" y2="479" />
      </g>

      <g opacity="0.85">
        <path d="M314 450 C 382 420, 454 404, 540 402" fill="none" stroke="#8fe8c7" strokeWidth="9" strokeLinecap="round" strokeDasharray="18 16" />
        <path d="M336 475 C 402 446, 474 430, 556 428" fill="none" stroke="#d3fff0" strokeWidth="3" strokeLinecap="round" strokeDasharray="12 14" opacity="0.9" />
      </g>

      <g filter="url(#fleet-shadow)">
        <ellipse cx="430" cy="492" rx="150" ry="54" fill="#000" opacity="0.42" />
        <polygon points="350,286 576,370 448,438 224,352" fill="url(#fleet-van)" />
        <polygon points="224,352 224,460 448,545 448,438" fill="url(#fleet-van-side)" />
        <polygon points="448,438 448,545 576,477 576,370" fill="#7d9088" />
        <polygon points="312,313 452,364 378,404 239,351" fill="#71949f" opacity="0.78" />
        <polygon points="461,369 546,400 475,438 392,406" fill="#d7ddd9" />
        <rect x="255" y="408" width="116" height="18" rx="9" fill="#2a6b4a" opacity="0.85" />
        <ellipse cx="283" cy="463" rx="42" ry="22" fill="#121515" />
        <ellipse cx="430" cy="521" rx="48" ry="24" fill="#121515" />
        <ellipse cx="283" cy="463" rx="21" ry="21" fill="#71817c" />
        <ellipse cx="430" cy="521" rx="24" ry="24" fill="#71817c" />
      </g>

      <g filter="url(#fleet-shadow)">
        <ellipse cx="604" cy="420" rx="92" ry="30" fill="#000" opacity="0.28" />
        <polygon points="578,316 668,350 632,368 542,334" fill="#d8a440" />
        <polygon points="542,334 542,424 632,460 632,368" fill="#926926" />
        <polygon points="632,368 632,460 668,442 668,350" fill="#7f5618" />
        <rect x="592" y="274" width="30" height="56" rx="10" fill="#2d251f" />
      </g>

      <g>
        <circle cx="520" cy="416" r="16" fill="#ff8f6c" opacity="0.82" />
        <circle cx="520" cy="416" r="38" fill="#ff8f6c" opacity="0.14" />
        <path d="M519 416 C 560 402, 586 394, 603 386" fill="none" stroke="#ff8f6c" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
      </g>

      <g opacity="0.92">
        <rect x="180" y="122" width="240" height="126" rx="18" fill="#0f1716" stroke="#33574b" />
        <text x="206" y="158" fill="#d7ebe4" fontSize="20" fontFamily="system-ui, sans-serif" fontWeight="600">Dispatch distraction</text>
        <rect x="206" y="175" width="78" height="46" rx="12" fill="#21312e" />
        <rect x="298" y="178" width="96" height="12" rx="6" fill="#71d6b1" opacity="0.8" />
        <rect x="298" y="201" width="64" height="10" rx="5" fill="#4f7e6f" opacity="0.8" />
        <rect x="206" y="228" width="148" height="8" rx="4" fill="#28413b" />
      </g>
    </svg>
  );
}

function SiteInspectionScene() {
  return (
    <svg
      viewBox="0 0 1200 720"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="spatial-scene__svg"
    >
      <defs>
        <linearGradient id="site-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#121519" />
          <stop offset="50%" stopColor="#182028" />
          <stop offset="100%" stopColor="#0a0d12" />
        </linearGradient>
        <radialGradient id="site-glow" cx="56%" cy="42%" r="58%">
          <stop offset="0%" stopColor="#8fa8c7" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#597192" stopOpacity="0.11" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="site-ground" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#28313c" />
          <stop offset="100%" stopColor="#10141a" />
        </linearGradient>
        <linearGradient id="site-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8d4ce" />
          <stop offset="100%" stopColor="#aca59b" />
        </linearGradient>
        <linearGradient id="site-side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b8b1a7" />
          <stop offset="100%" stopColor="#8d867d" />
        </linearGradient>
        <linearGradient id="site-window" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9eb2c4" />
          <stop offset="100%" stopColor="#5e7288" />
        </linearGradient>
        <filter id="site-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="24" stdDeviation="28" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>

      <rect width="1200" height="720" fill="url(#site-bg)" />
      <rect width="1200" height="720" fill="url(#site-glow)" />

      <polygon points="86,574 604,320 1088,474 570,720" fill="url(#site-ground)" />
      <polygon points="86,574 86,620 570,720 570,720" fill="#0a0d12" />

      <g filter="url(#site-shadow)">
        <ellipse cx="604" cy="476" rx="244" ry="64" fill="#000" opacity="0.36" />
        <polygon points="430,154 804,282 804,534 430,406" fill="url(#site-front)" />
        <polygon points="804,282 936,212 936,460 804,534" fill="url(#site-side)" />
        <polygon points="430,154 562,86 936,212 804,282" fill="#ede8e1" />
        <polygon points="430,154 430,406 384,430 384,177" fill="#8d867d" opacity="0.45" />
        <path d="M430 242 L 804 370" stroke="#beb7ae" strokeWidth="3" opacity="0.55" />
        <path d="M430 322 L 804 450" stroke="#b4ada5" strokeWidth="3" opacity="0.5" />
        <path d="M548 110 L 548 446" stroke="#c8c1b8" strokeWidth="2.5" opacity="0.24" />
        <path d="M665 150 L 665 486" stroke="#c8c1b8" strokeWidth="2.5" opacity="0.24" />
        <polygon points="824,270 870,252 870,315 824,334" fill="#7d92a4" opacity="0.55" />
        <polygon points="824,354 870,336 870,399 824,418" fill="#6f8598" opacity="0.48" />
        <rect x="560" y="336" width="102" height="162" rx="10" fill="#8f867d" />
        <rect x="575" y="350" width="35" height="132" rx="6" fill="#70675f" />
        <rect x="614" y="350" width="35" height="132" rx="6" fill="#70675f" />
      </g>

      <g opacity="0.92">
        {[
          [476, 188], [582, 224], [688, 260],
          [476, 276], [582, 312], [688, 348],
          [476, 364], [688, 436]
        ].map(([x, y], index) => (
          <g key={`${x}-${y}-${index}`}>
            <polygon points={`${x - 8},${y + 10} ${x + 66},${y + 36} ${x + 66},${y + 100} ${x - 8},${y + 74}`} fill="#4c5e73" opacity="0.18" />
            <polygon points={`${x},${y} ${x + 74},${y + 26} ${x + 74},${y + 86} ${x},${y + 60}`} fill="url(#site-window)" opacity="0.9" />
            <polygon points={`${x},${y} ${x + 74},${y + 26} ${x + 110},${y + 8} ${x + 36},${y - 18}`} fill="#cbd8e2" opacity="0.55" />
            <line x1={x + 37} y1={y + 12} x2={x + 37} y2={y + 74} stroke="#d7e2ec" strokeOpacity="0.42" strokeWidth="2.5" />
            <line x1={x + 5} y1={y + 30} x2={x + 69} y2={y + 52} stroke="#d7e2ec" strokeOpacity="0.26" strokeWidth="2" />
          </g>
        ))}
      </g>

      <g>
        <path d="M523 127 L 618 160" stroke="#ffad7b" strokeWidth="8" strokeLinecap="round" strokeDasharray="18 12" opacity="0.9" />
        <path d="M589 309 L 637 326 L 620 378 L 572 360" fill="none" stroke="#ff9d84" strokeWidth="7" strokeLinecap="round" opacity="0.88" />
        <path d="M742 416 C 760 430, 776 466, 786 512" fill="none" stroke="#7eb7ff" strokeWidth="8" strokeLinecap="round" opacity="0.45" />
        <path d="M742 416 C 764 442, 786 478, 800 534" fill="none" stroke="#dfeeff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        <polygon points="576,518 647,542 604,564 534,540" fill="#d7a864" opacity="0.9" />
      </g>

      <g opacity="0.9">
        <rect x="154" y="118" width="248" height="132" rx="18" fill="#11161d" stroke="#405166" />
        <text x="182" y="158" fill="#dce6f4" fontSize="20" fontFamily="system-ui, sans-serif" fontWeight="600">Remediation queue</text>
        <rect x="182" y="180" width="108" height="12" rx="6" fill="#7ba0d6" opacity="0.85" />
        <rect x="182" y="204" width="156" height="12" rx="6" fill="#4c5e75" opacity="0.85" />
        <rect x="182" y="228" width="120" height="12" rx="6" fill="#ffb17b" opacity="0.85" />
      </g>
    </svg>
  );
}

function SceneIllustration({ templateId }: { templateId: string }) {
  if (templateId === "auto-claim") return <AutoClaimScene />;
  if (templateId === "fleet-safety") return <FleetSafetyScene />;
  return <SiteInspectionScene />;
}

export function SpatialReviewPanel({ markers, evidence, templateId }: Props) {
  const [selectedId, setSelectedId] = useState<string>(markers[0]?.id ?? "");
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sceneViewportRef = useRef<HTMLDivElement | null>(null);
  const sceneSurfaceRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const meta = SCENE_META[templateId] ?? SCENE_META["site-inspection"];

  useEffect(() => {
    if (!markers.some((marker) => marker.id === selectedId)) {
      setSelectedId(markers[0]?.id ?? "");
    }
  }, [markers, selectedId]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === sceneSurfaceRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    handleFullscreenChange();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const selectedMarker = useMemo(
    () => markers.find((m) => m.id === selectedId) ?? markers[0] ?? null,
    [markers, selectedId]
  );
  const selectedMarkerIndex = selectedMarker
    ? markers.findIndex((marker) => marker.id === selectedMarker.id)
    : -1;

  const relatedEvidence = useMemo(() => {
    if (!selectedMarker) return [] as EvidenceItem[];
    return selectedMarker.relatedEvidenceIds
      .map((id) => evidence.find((item) => item.id === id))
      .filter(Boolean) as EvidenceItem[];
  }, [selectedMarker, evidence]);

  const openCount = markers.filter(
    (m) => !m.status || m.status === "open" || m.status === "needs-review"
  ).length;

  const clampPan = useCallback((nextPan: { x: number; y: number }, nextZoom = zoom) => {
    const rect = sceneViewportRef.current?.getBoundingClientRect();

    if (!rect) return nextPan;

    const maxX = Math.max(((nextZoom - MIN_ZOOM) * rect.width) / 2, BASE_DRAG_ALLOWANCE);
    const maxY = Math.max(((nextZoom - MIN_ZOOM) * rect.height) / 2, BASE_DRAG_ALLOWANCE);

    return {
      x: clamp(nextPan.x, -maxX, maxX),
      y: clamp(nextPan.y, -maxY, maxY),
    };
  }, [zoom]);

  const handleZoomChange = useCallback((nextZoom: number, origin = { x: 0, y: 0 }) => {
    const safeZoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);

    setZoom((currentZoom) => {
      const ratio = safeZoom / currentZoom;

      setPan((currentPan) =>
        clampPan(
          {
            x: origin.x - (origin.x - currentPan.x) * ratio,
            y: origin.y - (origin.y - currentPan.y) * ratio,
          },
          safeZoom
        )
      );

      return safeZoom;
    });
  }, [clampPan]);

  const handleResetView = useCallback(() => {
    setZoom(MIN_ZOOM);
    setPan({ x: 0, y: 0 });
  }, []);

  const focusMarker = useCallback((marker: SpatialMarker, requestedZoom = Math.max(zoom, 1.18)) => {
    const rect = sceneViewportRef.current?.getBoundingClientRect();
    const safeZoom = clamp(requestedZoom, MIN_ZOOM, MAX_ZOOM);

    setSelectedId(marker.id);

    if (!rect) {
      setZoom(safeZoom);
      return;
    }

    const baseX = (marker.x / 100 - 0.5) * rect.width;
    const baseY = (marker.y / 100 - 0.5) * rect.height;

    setZoom(safeZoom);
    setPan(
      clampPan(
        {
          x: -baseX * safeZoom,
          y: -baseY * safeZoom,
        },
        safeZoom
      )
    );
  }, [clampPan, zoom]);

  const handleWheel = useCallback((event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();

    const rect = sceneViewportRef.current?.getBoundingClientRect();
    const delta = event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;

    if (!rect) {
      handleZoomChange(zoom + delta);
      return;
    }

    handleZoomChange(zoom + delta, {
      x: event.clientX - rect.left - rect.width / 2,
      y: event.clientY - rect.top - rect.height / 2,
    });
  }, [handleZoomChange, zoom]);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;

    const target = event.target as HTMLElement;
    if (target.closest("button")) return;

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y,
    };

    sceneViewportRef.current?.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }, [pan.x, pan.y]);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragStateRef.current || dragStateRef.current.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragStateRef.current.startX;
    const deltaY = event.clientY - dragStateRef.current.startY;

    setPan(
      clampPan(
        {
          x: dragStateRef.current.originX + deltaX,
          y: dragStateRef.current.originY + deltaY,
        },
        zoom
      )
    );
  }, [clampPan, zoom]);

  const handlePointerUp = useCallback((event?: ReactPointerEvent<HTMLDivElement>) => {
    if (event && dragStateRef.current?.pointerId === event.pointerId) {
      sceneViewportRef.current?.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current = null;
    setIsDragging(false);
  }, []);

  const handleToggleFullscreen = useCallback(async () => {
    if (!sceneSurfaceRef.current) return;

    if (document.fullscreenElement === sceneSurfaceRef.current) {
      await document.exitFullscreen();
      return;
    }

    await sceneSurfaceRef.current.requestFullscreen();
  }, []);

  const tilt = useMemo(
    () => ({
      x: clamp(-pan.y / 22, -7, 7),
      y: clamp(pan.x / 22, -7, 7),
    }),
    [pan.x, pan.y]
  );

  const activeAnchorNumber = selectedMarkerIndex >= 0 ? formatAnchorNumber(selectedMarkerIndex) : "00";
  const totalAnchorCount = formatCount(markers.length);

  return (
    <section
      className={["spatial-panel", toneClassName(meta.tone)].join(" ")}
      aria-label="Spatial annotation review"
    >
      <div className="spatial-panel__header">
        <div className="spatial-panel__header-main">
          <div className="spatial-panel__eyebrow">{meta.eyebrow}</div>
          <h2 className="spatial-panel__hero-title">{meta.title}</h2>
          <p className="spatial-panel__hero-copy">{meta.subtitle}</p>
        </div>
        <div className="spatial-panel__summary-rail">
          <div className="spatial-panel__summary-card">
            <span className="spatial-panel__summary-label">Active findings</span>
            <strong>{openCount}</strong>
          </div>
          <div className="spatial-panel__summary-card">
            <span className="spatial-panel__summary-label">Anchors</span>
            <strong>{markers.length}</strong>
          </div>
          <div className="spatial-panel__summary-card spatial-panel__summary-card--wide">
            <span className="spatial-panel__summary-label">Why this view matters</span>
            <strong>{meta.helper}</strong>
          </div>
        </div>
      </div>

      <div className="spatial-panel__body">
        <div className="spatial-panel__scene-wrap">
          <div
            className="spatial-panel__scene-surface"
            ref={sceneSurfaceRef}
          >
            <div className="spatial-scene__hud">
              <span className="spatial-scene__hud-badge">Spatial</span>
              <span className="spatial-scene__hud-context">{meta.metrics.join(" · ")}</span>
            </div>

            <div className="spatial-scene__controls">
              <div className="spatial-scene__interaction-pill">
                Drag to inspect · scroll to zoom · use the strip below to jump between anchors
              </div>

              <div className="spatial-scene__control-group">
                <button
                  type="button"
                  className="spatial-scene__control"
                  onClick={() => handleZoomChange(zoom - ZOOM_STEP)}
                  aria-label="Zoom out"
                >
                  −
                </button>
                <span className="spatial-scene__zoom-readout">{Math.round(zoom * 100)}%</span>
                <button
                  type="button"
                  className="spatial-scene__control"
                  onClick={() => handleZoomChange(zoom + ZOOM_STEP)}
                  aria-label="Zoom in"
                >
                  +
                </button>
                <button
                  type="button"
                  className="spatial-scene__control spatial-scene__control--label"
                  onClick={handleResetView}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="spatial-scene__control spatial-scene__control--label"
                  onClick={handleToggleFullscreen}
                >
                  {isFullscreen ? "Collapse" : "Expand"}
                </button>
              </div>
            </div>

            <div className="spatial-scene__metrics">
              {meta.metrics.map((item) => (
                <span key={item} className="spatial-scene__metric-chip">
                  {item}
                </span>
              ))}
            </div>

            {selectedMarker && (
              <div className="spatial-scene__focus-panel">
                <div className="spatial-scene__focus-top">
                  <span className="spatial-scene__focus-anchor">
                    Anchor {activeAnchorNumber} / {totalAnchorCount}
                  </span>
                  <span className={`spatial-scene__focus-severity spatial-scene__focus-severity--${selectedMarker.severity}`}>
                    {SEVERITY_LABELS[selectedMarker.severity]}
                  </span>
                </div>
                <strong className="spatial-scene__focus-title">{selectedMarker.label}</strong>
                <span className="spatial-scene__focus-meta">
                  {formatSectionLabel(selectedMarker.relatedExtractionSectionKey)} · {relatedEvidence.length} linked {relatedEvidence.length === 1 ? "item" : "items"}
                </span>
              </div>
            )}

            <div className="spatial-scene__visual">
              <div
                ref={sceneViewportRef}
                className={[
                  "spatial-scene__viewport",
                  isDragging ? "spatial-scene__viewport--dragging" : "",
                ].filter(Boolean).join(" ")}
                onWheel={handleWheel}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onDoubleClick={handleResetView}
              >
                <div
                  className="spatial-scene__transform"
                  style={{
                    transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom}) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  }}
                >
                  <SceneIllustration templateId={templateId} />

                  {markers.map((marker, index) => (
                    <button
                      key={marker.id}
                      type="button"
                      className={[
                        "spatial-marker",
                        `spatial-marker--${marker.severity}`,
                        selectedMarker?.id === marker.id ? "spatial-marker--active" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedId(marker.id);
                      }}
                      aria-label={`${marker.label}: ${SEVERITY_LABELS[marker.severity]} severity`}
                      aria-pressed={selectedMarker?.id === marker.id}
                    >
                      <span className="spatial-marker__pulse" aria-hidden="true" />
                      <span className="spatial-marker__dot" aria-hidden="true" />
                      <span className="spatial-marker__index">{formatAnchorNumber(index)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="spatial-panel__detail-pane">
          {selectedMarker ? (
            <div className="spatial-marker-detail" key={selectedMarker.id}>
              <div className="spatial-marker-detail__header">
                <span className={`spatial-marker-detail__severity spatial-marker-detail__severity--${selectedMarker.severity}`}>
                  {SEVERITY_LABELS[selectedMarker.severity]}
                </span>
                {selectedMarker.status && (
                  <span className={`spatial-marker-detail__status spatial-marker-detail__status--${selectedMarker.status}`}>
                    {STATUS_LABELS[selectedMarker.status]}
                  </span>
                )}
              </div>

              <h3 className="spatial-marker-detail__title">{selectedMarker.label}</h3>
              <p className="spatial-marker-detail__note">{selectedMarker.note}</p>

              <div className="spatial-marker-detail__meta-grid">
                <div className="spatial-marker-detail__meta-card">
                  <span className="spatial-marker-detail__meta-label">Anchor</span>
                  <strong>{activeAnchorNumber} / {totalAnchorCount}</strong>
                </div>
                <div className="spatial-marker-detail__meta-card">
                  <span className="spatial-marker-detail__meta-label">Linked evidence</span>
                  <strong>{relatedEvidence.length}</strong>
                </div>
                <div className="spatial-marker-detail__meta-card spatial-marker-detail__meta-card--wide">
                  <span className="spatial-marker-detail__meta-label">Scene linkage</span>
                  <strong>{formatSectionLabel(selectedMarker.relatedExtractionSectionKey)}</strong>
                </div>
              </div>

              <div className="spatial-marker-detail__actions">
                <button
                  type="button"
                  className="spatial-marker-detail__action spatial-marker-detail__action--primary"
                  onClick={() => focusMarker(selectedMarker, Math.max(zoom, 1.2))}
                >
                  Center in scene
                </button>
                <button
                  type="button"
                  className="spatial-marker-detail__action"
                  onClick={handleResetView}
                >
                  Reset camera
                </button>
              </div>

              {selectedMarker.relatedExtractionSectionKey && (
                <div className="spatial-marker-detail__section-ref">
                  <span className="spatial-marker-detail__section-ref-label">Related section</span>
                  <span className="spatial-marker-detail__section-ref-key">
                    {selectedMarker.relatedExtractionSectionKey}
                  </span>
                </div>
              )}

              {relatedEvidence.length > 0 && (
                <div className="spatial-marker-detail__evidence">
                  <span className="spatial-marker-detail__evidence-label">Supporting evidence</span>
                  <ul className="spatial-marker-detail__evidence-list">
                    {relatedEvidence.map((ev) => (
                      <li key={ev.id} className="spatial-marker-detail__evidence-item">
                        <span className={`spatial-evidence-type spatial-evidence-type--${ev.type}`}>
                          {ev.type}
                        </span>
                        <div className="spatial-marker-detail__evidence-copy">
                          <span className="spatial-marker-detail__evidence-name">{ev.name}</span>
                          <span className="spatial-marker-detail__evidence-desc">{ev.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : null}
        </aside>
      </div>

      <div className="spatial-panel__marker-index">
        {markers.map((marker, index) => (
          <button
            key={marker.id}
            type="button"
            className={[
              "spatial-index-item",
              `spatial-index-item--${marker.severity}`,
              selectedMarker?.id === marker.id ? "spatial-index-item--active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => focusMarker(marker)}
          >
            <span className="spatial-index-item__number">{formatAnchorNumber(index)}</span>
            <span className="spatial-index-item__label">{marker.label}</span>
            {marker.status && (
              <span className={`spatial-index-item__status spatial-index-item__status--${marker.status}`}>
                {STATUS_LABELS[marker.status]}
              </span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
