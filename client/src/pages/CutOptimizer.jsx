import { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ─────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────
const PALETTE = [
  "#2563EB",
  "#059669",
  "#DC2626",
  "#D97706",
  "#7C3AED",
  "#0891B2",
  "#65A30D",
  "#C026D3",
  "#EA580C",
  "#0D9488",
  "#BE185D",
  "#0369A1",
];

const DEFAULT_CUTS = [
  { l: 300, w: 6, t: 2, q: 1 },
  { l: 300, w: 17, t: 2.3, q: 1 },
  { l: 300, w: 27, t: 2.3, q: 1 },
  { l: 300, w: 32, t: 2.3, q: 1 },
  { l: 300, w: 35, t: 2.3, q: 2 },
  { l: 300, w: 37, t: 2.3, q: 3 },
  { l: 300, w: 34, t: 2.3, q: 1 },
  { l: 300, w: 33, t: 2.3, q: 1 },
  { l: 300, w: 28, t: 2.3, q: 1 },
  { l: 300, w: 22, t: 2.3, q: 1 },
  { l: 300, w: 10, t: 2.3, q: 1 },
];

// ─────────────────────────────────────────────
//  GEOMETRY UTILITIES
// ─────────────────────────────────────────────
function logVolume(diaSmall, diaLarge, length) {
  const rs = diaSmall / 2,
    rl = diaLarge / 2;
  // result in cm³
  return (Math.PI * length / 3) * (rs * rs + rs * rl + rl * rl);
}

function rectInCircle(
  rx,
  ry,
  rw,
  rh,
  R,
  margin = 0.08
) {
  const r2 = (R - margin) ** 2;
  return (
    rx * rx + ry * ry <= r2 &&
    (rx + rw) ** 2 + ry * ry <= r2 &&
    rx * rx + (ry + rh) ** 2 <= r2 &&
    (rx + rw) ** 2 + (ry + rh) ** 2 <= r2
  );
}

function rectsOverlap(
  ax,
  ay,
  aw,
  ah,
  bx,
  by,
  bw,
  bh,
  gap = 0
) {
  return !(
    ax + aw + gap <= bx ||
    bx + bw + gap <= ax ||
    ay + ah + gap <= by ||
    by + bh + gap <= ay
  );
}

function contactScore(
  px,
  py,
  pw,
  ph,
  placed,
  R
) {
  let c = 0;
  const eps = 0.6;

  for (const q of placed) {
    if (!q.placed) continue;
    if (q.x == null || q.y == null || q.pw == null || q.ph == null) continue;

    if (
      Math.abs(px - (q.x + q.pw)) < eps &&
      Math.max(py, q.y) < Math.min(py + ph, q.y + q.ph)
    )
      c += Math.min(py + ph, q.y + q.ph) - Math.max(py, q.y);

    if (
      Math.abs(px + pw - q.x) < eps &&
      Math.max(py, q.y) < Math.min(py + ph, q.y + q.ph)
    )
      c += Math.min(py + ph, q.y + q.ph) - Math.max(py, q.y);

    if (
      Math.abs(py - (q.y + q.ph)) < eps &&
      Math.max(px, q.x) < Math.min(px + pw, q.x + q.pw)
    )
      c += Math.min(px + pw, q.x + q.pw) - Math.max(px, q.x);

    if (
      Math.abs(py + ph - q.y) < eps &&
      Math.max(px, q.x) < Math.min(px + pw, q.x + q.pw)
    )
      c += Math.min(px + pw, q.x + q.pw) - Math.max(px, q.x);
  }

  const corners = [
    [px, py],
    [px + pw, py],
    [px, py + ph],
    [px + pw, py + ph],
  ];
  for (const [cx, cy] of corners) {
    if (R - Math.sqrt(cx * cx + cy * cy) < 2) c += 3;
  }
  return c;
}

// ─────────────────────────────────────────────
//  PACKING ENGINE
// ─────────────────────────────────────────────
function tryPlace(piece, placed, R, kerf) {
  const STEP = 0.35;
  const orientations = [
    { pw: piece.w, ph: piece.h, rotated: false },
    { pw: piece.h, ph: piece.w, rotated: true },
  ];

  let bestPos = null;
  let bestScore = -Infinity;
  let bestOri = null;

  for (const ori of orientations) {
    const { pw, ph } = ori;
    for (let gy = -R; gy + ph <= R + 0.01; gy += STEP) {
      for (let gx = -R; gx + pw <= R + 0.01; gx += STEP) {
        if (!rectInCircle(gx, gy, pw, ph, R)) continue;

        let ok = true;
        for (const q of placed) {
          if (!q.placed) continue;
          if (q.x == null || q.y == null || q.pw == null || q.ph == null)
            continue;

          if (rectsOverlap(gx, gy, pw, ph, q.x, q.y, q.pw, q.ph, kerf)) {
            ok = false;
            break;
          }
        }
        if (!ok) continue;

        const cs = contactScore(gx, gy, pw, ph, placed, R);
        const dist = Math.sqrt((gx + pw / 2) ** 2 + (gy + ph / 2) ** 2);
        const score =
          cs * 20 - dist - (gy + ph) * 0.5 - Math.abs(gx + pw / 2) * 0.1;

        if (score > bestScore) {
          bestScore = score;
          bestPos = { x: gx, y: gy };
          bestOri = ori;
        }
      }
    }
  }

  if (bestPos && bestOri) {
    return {
      ...piece,
      x: bestPos.x,
      y: bestPos.y,
      pw: bestOri.pw,
      ph: bestOri.ph,
      rotated: bestOri.rotated,
      placed: true,
    };
  }

  return {
    ...piece,
    x: 0,
    y: 0,
    pw: piece.w,
    ph: piece.h,
    rotated: false,
    placed: false,
  };
}

function packAll(pieces, R, kerf) {
  const sorted = [...pieces].sort((a, b) => b.w * b.h - a.w * a.h);
  const placed = [];
  const unplaced = [];

  for (const p of sorted) {
    const r = tryPlace(p, placed, R, kerf);
    if (r.placed) placed.push(r);
    else unplaced.push(p);
  }

  const overflow = [];
  for (const p of unplaced) {
    const r = tryPlace(p, placed, R, kerf);
    if (r.placed) placed.push(r);
    else
      overflow.push({
        ...p,
        x: 0,
        y: 0,
        pw: p.w,
        ph: p.h,
        rotated: false,
        placed: false,
      });
  }
  return [...placed, ...overflow];
}

function findOffcuts(placed, R, kerf) {
  const G = 2;
  const free = [];

  for (let gy = -R; gy + G <= R; gy += G) {
    for (let gx = -R; gx + G <= R; gx += G) {
      if (!rectInCircle(gx, gy, G, G, R, 0.15)) continue;
      if (
        placed
          .filter((p) => p.placed)
          .some((p) =>
            rectsOverlap(gx, gy, G, G, p.x, p.y, p.pw, p.ph, kerf / 2)
          )
      )
        continue;
      free.push({ gx, gy });
    }
  }

  const used = new Set();
  const res = [];

  free.forEach((c, i) => {
    if (used.has(i)) return;

    let mw = G,
      mh = G;

    while (
      free.some(
        (cc, ii) =>
          !used.has(ii) &&
          Math.abs(cc.gx - (c.gx + mw)) < 0.01 &&
          Math.abs(cc.gy - c.gy) < 0.01
      )
    )
      mw += G;

    let canGrow = true;
    while (canGrow) {
      for (let x = c.gx; x < c.gx + mw - 0.01; x += G) {
        if (
          !free.some(
            (cc, ii) =>
              !used.has(ii) &&
              Math.abs(cc.gx - x) < 0.01 &&
              Math.abs(cc.gy - (c.gy + mh)) < 0.01
          )
        ) {
          canGrow = false;
          break;
        }
      }
      if (canGrow) mh += G;
    }

    free.forEach((cc, ii) => {
      if (
        cc.gx >= c.gx - 0.01 &&
        cc.gx < c.gx + mw - 0.01 &&
        cc.gy >= c.gy - 0.01 &&
        cc.gy < c.gy + mh - 0.01
      )
        used.add(ii);
    });

    if (mw >= 2 && mh >= 2) res.push({ x: c.gx, y: c.gy, w: mw, h: mh });
  });

  return res;
}

function computeAreas(
  placed,
  offcuts,
  R,
  kerf
) {
  const circleArea = Math.PI * R * R;
  const usedArea = placed
    .filter((p) => p.placed)
    .reduce((s, p) => s + (p.pw ?? 0) * (p.ph ?? 0), 0);

  const kerfArea = placed
    .filter((p) => p.placed)
    .reduce((s, p) => s + kerf * (p.ph ?? 0) + kerf * (p.pw ?? 0), 0);

  const offcutArea = offcuts.reduce((s, o) => s + o.w * o.h, 0);
  const trueWaste = Math.max(0, circleArea - usedArea - offcutArea - kerfArea);

  return {
    circleArea,
    usedArea,
    offcutArea,
    kerfArea,
    trueWaste,
    usedPct: (usedArea / circleArea) * 100,
    offcutPct: (offcutArea / circleArea) * 100,
    kerfPct: (kerfArea / circleArea) * 100,
    wastePct: (trueWaste / circleArea) * 100,
  };
}

// ─────────────────────────────────────────────
//  PURE OPTIMISER (ONE LOG + ONE CUT LIST)
// ─────────────────────────────────────────────
function optimiseSingleLogWithCuts(log, cuts, kerfMM) {
  const validCuts = cuts.filter((c) => c.l > 0 && c.w > 0 && c.t > 0 && c.q > 0);
  if (!log.diaSmall || !log.logLength || validCuts.length === 0) return null;

  const R = log.diaSmall / 2;
  const kerf = kerfMM / 10;

  const pieces = [];
  validCuts.forEach((c, ci) => {
    for (let i = 0; i < c.q; i++) {
      pieces.push({ l: c.l, w: c.w, h: c.t, ci, inst: i + 1 });
    }
  });

  const placed = packAll(pieces, R, kerf);
  const offcuts = findOffcuts(placed, R, kerf);
  const areas = computeAreas(placed, offcuts, R, kerf);

  const stats = {
    circleArea: areas.circleArea,
    usedArea: areas.usedArea,
    placedCount: placed.filter((p) => p.placed).length,
    neededCount: placed.length,
    coveragePct: areas.usedPct,
  };

  return { placed, offcuts, areas, stats };
}

// ─────────────────────────────────────────────
//  MATCHING (BEST CUT LIST PER LOG)
// ─────────────────────────────────────────────
function scoreMatch(result) {
  // Primary: maximize usedPct
  // Tie-breakers: minimize wastePct, maximize placed ratio, minimize kerfPct
  const used = result.areas.usedPct;
  const waste = result.areas.wastePct;
  const kerf = result.areas.kerfPct;
  const placedRatio =
    result.stats.neededCount > 0 ? result.stats.placedCount / result.stats.neededCount : 0;

  return (
    used * 1000 +
    placedRatio * 200 -
    waste * 50 -
    kerf * 10
  );
}

function bestCutListForLog(log, lists, kerfMM) {
  let best = null;

  for (const list of lists) {
    const r = optimiseSingleLogWithCuts(log, list.cuts, kerfMM);
    if (!r) continue;

    const s = scoreMatch(r);
    if (!best || s > best.score) {
      best = { logId: log.id, listId: list.id, result: r, score: s };
    }
  }

  return best;
}

function matchAllLogs(logs, lists, kerfMM) {
  return logs
    .map((log) => bestCutListForLog(log, lists, kerfMM))
    .filter((x) => !!x);
}

// ─────────────────────────────────────────────
//  LOG CANVAS — colors preserved
// ─────────────────────────────────────────────
function LogCanvas({
  placed,
  offcuts,
  R,
  kerf,
  diaSmall,
  diaLarge,
  areas,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !placed.length || !areas) return;

    const canvas = canvasRef.current;
    const W = canvas.offsetWidth || 560;
    const H = Math.round(W * 0.84);

    canvas.width = W;
    canvas.height = H;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, W, H);

    const pad = 44;
    const scale = Math.min((W - 2 * pad) / (R * 2), (H - 2 * pad) / (R * 2));
    const ox = W / 2,
      oy = H / 2;

    const tx = (x) => ox + x * scale;
    const ty = (y) => oy + y * scale;

    // bark + wood
    ctx.beginPath();
    ctx.arc(ox, oy, R * scale + 10, 0, Math.PI * 2);
    ctx.fillStyle = "#78350F";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ox, oy, R * scale, 0, Math.PI * 2);
    ctx.fillStyle = "#C8966A";
    ctx.fill();

    ctx.strokeStyle = "#92400E";
    ctx.lineWidth = 2;
    ctx.stroke();

    [0.82, 0.62, 0.42, 0.22].forEach((f) => {
      ctx.beginPath();
      ctx.arc(ox, oy, R * scale * f, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(146,64,14,0.1)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    ctx.save();
    ctx.beginPath();
    ctx.arc(ox, oy, R * scale, 0, Math.PI * 2);
    ctx.clip();

    // offcuts
    offcuts.forEach((oc) => {
      ctx.fillStyle = "rgba(74,222,128,0.25)";
      ctx.fillRect(tx(oc.x), ty(oc.y), oc.w * scale, oc.h * scale);
      ctx.strokeStyle = "#16A34A";
      ctx.lineWidth = 0.7;
      ctx.setLineDash([3, 2]);
      ctx.strokeRect(tx(oc.x), ty(oc.y), oc.w * scale, oc.h * scale);
      ctx.setLineDash([]);
    });

    // placed rectangles
    placed
      .filter((p) => p.placed)
      .forEach((p) => {
        const col = PALETTE[p.ci % PALETTE.length];
        const pw = (p.pw ?? 0) * scale;
        const ph = (p.ph ?? 0) * scale;

        ctx.fillStyle = col + "E0";
        ctx.fillRect(tx(p.x ?? 0), ty(p.y ?? 0), pw, ph);

        ctx.strokeStyle = col;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(tx(p.x ?? 0), ty(p.y ?? 0), pw, ph);

        if (pw > 24 && ph > 10) {
          ctx.fillStyle = "#fff";
          ctx.font = `${Math.min(10, ph * 0.62)}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            `${p.pw}×${p.ph}`,
            tx(p.x ?? 0) + pw / 2,
            ty(p.y ?? 0) + ph / 2
          );
        }

        if (p.rotated && pw > 18 && ph > 18) {
          ctx.fillStyle = "rgba(255,255,255,0.6)";
          ctx.font = "8px monospace";
          ctx.textAlign = "right";
          ctx.textBaseline = "top";
          ctx.fillText("↺", tx(p.x ?? 0) + pw - 2, ty(p.y ?? 0) + 2);
        }
      });

    // kerf overlay
    placed
      .filter((p) => p.placed)
      .forEach((p) => {
        ctx.fillStyle = "rgba(251,191,36,0.3)";
        ctx.fillRect(
          tx((p.x ?? 0) + (p.pw ?? 0)),
          ty(p.y ?? 0),
          kerf * scale,
          (p.ph ?? 0) * scale
        );
        ctx.fillRect(
          tx(p.x ?? 0),
          ty((p.y ?? 0) + (p.ph ?? 0)),
          (p.pw ?? 0) * scale,
          kerf * scale
        );
      });

    ctx.restore();
  }, [placed, offcuts, R, kerf, diaSmall, diaLarge, areas]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full block rounded-lg border border-gray-200"
    />
  );
}

// ─────────────────────────────────────────────
//  MAIN COMPONENT (MULTI-LOG + MULTI-LIST)
// ─────────────────────────────────────────────
export default function CutOptimizer() {
  const [rawLogs, setRawLogs] = useState([
    {
      id: "L1",
      name: "Log #1",
      diaSmall: 40,
      diaLarge: 45,
      logLength: 300,
    },
    {
      id: "L2",
      name: "Log #2",
      diaSmall: 35,
      diaLarge: 40,
      logLength: 270,
    },
  ]);

  const [cuttingLists, setCuttingLists] = useState([
    { id: "C1", name: "List A", cuts: DEFAULT_CUTS },
    {
      id: "C2",
      name: "List B (sample)",
      cuts: [
        { l: 300, w: 10, t: 2.5, q: 8 },
        { l: 250, w: 10, t: 2.5, q: 4 },
        { l: 240, w: 15, t: 3.8, q: 3 },
      ],
    },
  ]);

  const [activeLogId, setActiveLogId] = useState("L1");
  const [activeListId, setActiveListId] = useState("C1");

  // Viewer result (single selected log + list)
  const [placed, setPlaced] = useState([]);
  const [offcuts, setOffcuts] = useState([]);
  const [areas, setAreas] = useState(null);
  const [stats, setStats] = useState(null);
  const [hasResult, setHasResult] = useState(false);

  const [activeTab, setActiveTab] = useState("visual");

  // Matching results (multi analysis)
  const [matches, setMatches] = useState(null);

  const [kerfMM, setKerfMM] = useState(2);

  const activeLog = useMemo(
    () => rawLogs.find((l) => l.id === activeLogId) ?? rawLogs[0],
    [rawLogs, activeLogId]
  );

  const activeList = useMemo(
    () => cuttingLists.find((c) => c.id === activeListId) ?? cuttingLists[0],
    [cuttingLists, activeListId]
  );

  const R = activeLog?.diaSmall ? activeLog.diaSmall / 2 : 0;
  const kerf = kerfMM / 10;

  const volumeCm3 = activeLog
    ? logVolume(activeLog.diaSmall, activeLog.diaLarge, activeLog.logLength)
    : 0;
  const volumeM3 = volumeCm3 / 1e6;

  // ─────────────────────────────────────────────
  //  LIST/LOG HELPERS
  // ─────────────────────────────────────────────
  const addLog = () => {
    const id = `L${Date.now()}`;
    setRawLogs((ls) => [
      ...ls,
      {
        id,
        name: `Log #${ls.length + 1}`,
        diaSmall: 40,
        diaLarge: 45,
        logLength: 300,
      },
    ]);
    setActiveLogId(id);
    setHasResult(false);
    setMatches(null);
  };

  const removeLog = (id) => {
    setRawLogs((ls) => ls.filter((l) => l.id !== id));
    if (activeLogId === id) {
      const next = rawLogs.find((l) => l.id !== id);
      if (next) setActiveLogId(next.id);
    }
    setHasResult(false);
    setMatches(null);
  };

  const updateLog = (id, field, val) => {
    setRawLogs((ls) =>
      ls.map((l) => (l.id === id ? { ...l, [field]: field === "name" ? String(val) : +val } : l))
    );
    setHasResult(false);
    setMatches(null);
  };

  const addCuttingList = () => {
    const id = `C${Date.now()}`;
    setCuttingLists((cs) => [...cs, { id, name: `List ${cs.length + 1}`, cuts: DEFAULT_CUTS }]);
    setActiveListId(id);
    setHasResult(false);
    setMatches(null);
  };

  const removeCuttingList = (id) => {
    setCuttingLists((cs) => cs.filter((c) => c.id !== id));
    if (activeListId === id) {
      const next = cuttingLists.find((c) => c.id !== id);
      if (next) setActiveListId(next.id);
    }
    setHasResult(false);
    setMatches(null);
  };

  const updateCuttingListName = (id, name) => {
    setCuttingLists((cs) => cs.map((c) => (c.id === id ? { ...c, name } : c)));
    setHasResult(false);
    setMatches(null);
  };

  const addCutRow = () => {
    setCuttingLists((cs) =>
      cs.map((c) =>
        c.id === activeListId ? { ...c, cuts: [...c.cuts, { l: 300, w: 10, t: 4, q: 1 }] } : c
      )
    );
    setHasResult(false);
    setMatches(null);
  };

  const removeCutRow = (idx) => {
    setCuttingLists((cs) =>
      cs.map((c) => (c.id === activeListId ? { ...c, cuts: c.cuts.filter((_, i) => i !== idx) } : c))
    );
    setHasResult(false);
    setMatches(null);
  };

  const updateCutRow = (idx, field, val) => {
    setCuttingLists((cs) =>
      cs.map((c) =>
        c.id === activeListId
          ? {
              ...c,
              cuts: c.cuts.map((r, i) => (i === idx ? { ...r, [field]: +val } : r)),
            }
          : c
      )
    );
    setHasResult(false);
    setMatches(null);
  };

  // ─────────────────────────────────────────────
  //  RUN SINGLE VIEWER (ACTIVE LOG + ACTIVE LIST)
  // ─────────────────────────────────────────────
  const optimiseActive = useCallback(() => {
    if (!activeLog || !activeList) return;

    const r = optimiseSingleLogWithCuts(activeLog, activeList.cuts, kerfMM);
    if (!r) return;

    setPlaced(r.placed);
    setOffcuts(r.offcuts);
    setAreas(r.areas);
    setStats(r.stats);
    setHasResult(true);
    setActiveTab("visual");
  }, [activeLog, activeList, kerfMM]);

  // ─────────────────────────────────────────────
  //  RUN MULTI MATCHING (BEST LIST PER LOG)
  // ─────────────────────────────────────────────
  const runMatching = useCallback(() => {
    const ms = matchAllLogs(rawLogs, cuttingLists, kerfMM);
    setMatches(ms);
  }, [rawLogs, cuttingLists, kerfMM]);

  const coverageColor = stats
    ? stats.coveragePct > 65
      ? "text-emerald-600"
      : stats.coveragePct > 40
      ? "text-amber-500"
      : "text-red-500"
    : "";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Geist', sans-serif; }
        .mono { font-family: 'Geist Mono', monospace; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.4; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
      `}</style>

      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            CUTTING OPTIMIZER (Multi-Log)
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Add multiple raw logs and multiple cutting lists, then auto-match best yield per log.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Global Kerf (mm)
          </label>
          <input
            type="number"
            value={kerfMM}
            min={0}
            step={0.1}
            onChange={(e) => {
              setKerfMM(+e.target.value);
              setHasResult(false);
              setMatches(null);
            }}
            className="w-32 h-10 border border-gray-200 rounded-lg px-3 text-sm mono text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-gray-50"
          />
        </div>

        {/* Stat Cards */}
        {hasResult && stats && areas && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "COVERAGE",
                val: `${stats.coveragePct.toFixed(1)}%`,
                sub: "of circle area used",
                valClass: coverageColor,
              },
              {
                label: "PIECES",
                val: `${stats.placedCount}/${stats.neededCount}`,
                sub: "placed / needed",
                valClass: "text-gray-900",
              },
              {
                label: "OFFCUTS",
                val: offcuts.length,
                sub: "usable ≥ 2×2 cm",
                valClass: "text-gray-900",
              },
              {
                label: "LOG VOLUME",
                val: `${volumeM3.toFixed(4)} m³`,
                sub: `${volumeCm3.toFixed(0)} cm³`,
                valClass: "text-gray-900",
              },
            ].map((c, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-2">
                  {c.label}
                </p>
                <p className={`text-2xl font-bold mono ${c.valClass}`}>{c.val}</p>
                <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-5 gap-6">
          {/* LEFT PANEL */}
          <div className="col-span-2 space-y-4">
            {/* Logs */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                    Raw Logs
                  </h2>
                </div>
                <button
                  onClick={addLog}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add log
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {rawLogs.map((l) => (
                  <div
                    key={l.id}
                    className={`border rounded-xl p-3 ${activeLogId === l.id ? "border-black" : "border-gray-200"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => {
                          setActiveLogId(l.id);
                          setHasResult(false);
                        }}
                        className={`text-xs font-semibold px-2 py-1 rounded border ${
                          activeLogId === l.id
                            ? "bg-black text-white border-black"
                            : "bg-white text-gray-700 border-gray-200"
                        }`}
                      >
                        Select
                      </button>

                      <input
                        value={l.name}
                        onChange={(e) => updateLog(l.id, "name", e.target.value)}
                        className="flex-1 h-8 border border-gray-200 rounded-lg px-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-gray-50"
                      />

                      <button
                        onClick={() => removeLog(l.id)}
                        className="h-8 w-8 flex items-center justify-center border border-gray-200 rounded-md text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                        title="Remove log"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6" />
                          <path d="M19,6l-1,14H6L5,6" />
                          <path d="M10,11v6" />
                          <path d="M14,11v6" />
                          <path d="M9,6V4h6v2" />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        ["Top ø (cm)", "diaSmall" , l.diaSmall],
                        ["Bottom ø (cm)", "diaLarge" , l.diaLarge],
                        ["Length (cm)", "logLength" , l.logLength],
                      ].map(([lbl, field, val]) => (
                        <div key={field}>
                          <label className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide block mb-1">
                            {lbl}
                          </label>
                          <input
                            type="number"
                            value={val}
                            min={1}
                            step={0.5}
                            className="w-full h-8 border border-gray-200 rounded-lg px-2 text-xs mono text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-gray-50"
                            onChange={(e) => updateLog(l.id, field, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={runMatching}
                className="w-full mt-4 h-11 bg-black text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
              >
                Auto-Match Lists → Logs
              </button>
            </div>

            {/* Cutting Lists */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                    Cutting Lists
                  </h2>
                </div>
                <button
                  onClick={addCuttingList}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add list
                </button>
              </div>

              {/* list selector */}
              <div className="space-y-2 mb-4">
                {cuttingLists.map((cl) => (
                  <div
                    key={cl.id}
                    className={`flex items-center gap-2 border rounded-lg p-2 ${
                      activeListId === cl.id ? "border-black" : "border-gray-200"
                    }`}
                  >
                    <button
                      onClick={() => {
                        setActiveListId(cl.id);
                        setHasResult(false);
                      }}
                      className={`text-xs font-semibold px-2 py-1 rounded border ${
                        activeListId === cl.id
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-200"
                      }`}
                    >
                      Select
                    </button>

                    <input
                      value={cl.name}
                      onChange={(e) => updateCuttingListName(cl.id, e.target.value)}
                      className="flex-1 h-8 border border-gray-200 rounded-lg px-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-gray-50"
                    />

                    <button
                      onClick={() => removeCuttingList(cl.id)}
                      className="h-8 w-8 flex items-center justify-center border border-gray-200 rounded-md text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                      title="Remove list"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6" />
                        <path d="M19,6l-1,14H6L5,6" />
                        <path d="M10,11v6" />
                        <path d="M14,11v6" />
                        <path d="M9,6V4h6v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* cuts editor for active list */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Active list rows
                </p>
                <button
                  onClick={addCutRow}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add row
                </button>
              </div>

              <div className="grid grid-cols-9 gap-1 mb-2 px-1">
                {["L", "W", "T", "Q", ""].map((h, i) => (
                  <div
                    key={i}
                    className={`text-xs text-gray-400 font-medium mono ${
                      i < 4 ? "col-span-2" : "col-span-1"
                    }`}
                  >
                    {h}
                  </div>
                ))}
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {activeList?.cuts?.map((cut, i) => (
                  <div key={i} className="grid grid-cols-9 gap-1 items-center">
                    <div className="col-span-1 flex items-center">
                      <div
                        className="w-1 h-8 rounded-full mr-1"
                        style={{ background: PALETTE[i % PALETTE.length] }}
                      />
                    </div>

                    {(["l", "w", "t", "q"] ).map((field) => (
                      <input
                        key={field}
                        type="number"
                        value={(cut )[field]}
                        min={1}
                        step={field === "q" ? 1 : 0.5}
                        className="col-span-2 h-8 border border-gray-200 rounded-md px-2 text-xs mono text-gray-900 focus:outline-none focus:ring-1 focus:ring-black bg-gray-50 w-full"
                        onChange={(e) => updateCutRow(i, field, e.target.value)}
                      />
                    ))}

                    <button
                      onClick={() => removeCutRow(i)}
                      className="col-span-1 h-8 w-8 flex items-center justify-center border border-gray-200 rounded-md text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                      title="Remove row"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6" />
                        <path d="M19,6l-1,14H6L5,6" />
                        <path d="M10,11v6" />
                        <path d="M14,11v6" />
                        <path d="M9,6V4h6v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={optimiseActive}
                className="w-full mt-4 h-11 bg-black text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
              >
                Optimise (Selected Log + Selected List)
              </button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="col-span-3 space-y-4">
            {/* Matching results */}
            {matches && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                  Best Cutting List Per Log
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="border-b border-gray-200">
                      <tr>
                        {["Log", "Best list", "Used %", "Waste %", "Kerf %", "Placed", "Action"].map((h) => (
                          <th
                            key={h}
                            className="text-left px-2 py-2 text-gray-400 font-semibold uppercase tracking-wide"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {matches.map((m) => {
                        const log = rawLogs.find((l) => l.id === m.logId);
                        const list = cuttingLists.find((c) => c.id === m.listId);
                        if (!log || !list) return null;

                        return (
                          <tr key={`${m.logId}-${m.listId}`} className="hover:bg-gray-50">
                            <td className="px-2 py-2 font-semibold text-gray-900">{log.name}</td>
                            <td className="px-2 py-2 text-gray-700">{list.name}</td>
                            <td className="px-2 py-2 mono font-semibold text-emerald-600">
                              {m.result.areas.usedPct.toFixed(1)}%
                            </td>
                            <td className="px-2 py-2 mono text-gray-500">
                              {m.result.areas.wastePct.toFixed(1)}%
                            </td>
                            <td className="px-2 py-2 mono text-gray-500">
                              {m.result.areas.kerfPct.toFixed(1)}%
                            </td>
                            <td className="px-2 py-2 mono text-gray-500">
                              {m.result.stats.placedCount}/{m.result.stats.neededCount}
                            </td>
                            <td className="px-2 py-2">
                              <button
                                onClick={() => {
                                  setActiveLogId(log.id);
                                  setActiveListId(list.id);
                                  // Show exact layout for that best match
                                  const r = optimiseSingleLogWithCuts(log, list.cuts, kerfMM);
                                  if (r) {
                                    setPlaced(r.placed);
                                    setOffcuts(r.offcuts);
                                    setAreas(r.areas);
                                    setStats(r.stats);
                                    setHasResult(true);
                                    setActiveTab("visual");
                                  }
                                }}
                                className=" py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
                              >
                                View layout
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <p className="text-[11px] text-gray-400 mt-3">
                  Matching chooses the list with highest used wood %, then breaks ties by lower waste %, higher placed ratio, and lower kerf %.
                </p>
              </div>
            )}

            {/* Breakdown */}
            {hasResult && areas && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
                  Wood Usage Breakdown
                </h2>

                <div className="h-8 rounded-lg overflow-hidden flex mb-3">
                  {[
                    { pct: areas.usedPct, color: "#111827" },
                    { pct: areas.offcutPct, color: "#059669" },
                    { pct: areas.kerfPct, color: "#D97706" },
                    { pct: areas.wastePct, color: "#E5E7EB" },
                  ].map((s, i) => (
                    <div
                      key={i}
                      style={{
                        width: `${Math.max(s.pct, 0.4).toFixed(2)}%`,
                        background: s.color,
                        transition: "width 0.6s ease",
                      }}
                      className="flex items-center justify-center text-xs font-medium overflow-hidden"
                    >
                      {s.pct > 8 ? (
                        <span style={{ color: i === 3 ? "#6B7280" : "#fff" }}>
                          {s.pct.toFixed(1)}%
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  {[
                    { label: "Used wood", pct: areas.usedPct, color: "#111827", area: areas.usedArea },
                    { label: "Offcuts", pct: areas.offcutPct, color: "#059669", area: areas.offcutArea },
                    { label: "Kerf", pct: areas.kerfPct, color: "#D97706", area: areas.kerfArea },
                    { label: "True waste", pct: areas.wastePct, color: "#9CA3AF", area: areas.trueWaste },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: s.color }} />
                      <span className="text-xs text-gray-500">{s.label}</span>
                      <span className="text-xs font-bold mono" style={{ color: s.color }}>
                        {s.pct.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: "Used",
                      pct: areas.usedPct,
                      area: areas.usedArea,
                      desc: "Productive wood",
                      border: "border-gray-900",
                    },
                    {
                      label: "Offcut",
                      pct: areas.offcutPct,
                      area: areas.offcutArea,
                      desc: "Recoverable ≥ 2×2cm",
                      border: "border-emerald-300",
                    },
                    {
                      label: "Waste + Kerf",
                      pct: areas.wastePct + areas.kerfPct,
                      area: areas.trueWaste + areas.kerfArea,
                      desc: "Kerf + unrecoverable",
                      border: "border-gray-200",
                    },
                  ].map((b, i) => (
                    <div key={i} className={`border ${b.border} rounded-xl p-3 text-center`}>
                      <div className="text-2xl font-bold mono text-gray-900">
                        {b.pct.toFixed(1)}
                        <span className="text-sm font-medium">%</span>
                      </div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-0.5">
                        {b.label}
                      </div>
                      <div className="text-xs text-gray-400 mono mt-1">{b.area.toFixed(1)} cm²</div>
                      <div className="text-xs text-gray-300 mt-0.5">{b.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs + Log view */}
            {hasResult ? (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex border-b border-gray-200 px-5 pt-4 gap-1">
                  {[
                    ["visual", "Log View"],
                    ["table", "Slab Table"],
                    ["offcuts", `Offcuts (${offcuts.length})`],
                  ].map(([name, label]) => (
                    <button
                      key={name}
                      onClick={() => setActiveTab(name)}
                      className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors -mb-px ${
                        activeTab === name
                          ? "bg-white border border-b-white border-gray-200 text-gray-900"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="p-5">
                  {activeTab === "visual" && (
                    <>
                      <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-medium">
                        Full circle — all-quadrant coverage
                      </p>
                      <LogCanvas
                        placed={placed}
                        offcuts={offcuts}
                        R={R}
                        kerf={kerf}
                        diaSmall={activeLog.diaSmall}
                        diaLarge={activeLog.diaLarge}
                        areas={areas}
                      />
                      <div className="flex flex-wrap gap-3 mt-3">
                        {[...new Map(placed.filter((p) => p.placed).map((p) => [p.ci, p])).values()].map(
                          (p) => (
                            <span key={p.ci} className="flex items-center gap-1.5 text-xs text-gray-600">
                              <span
                                className="w-3 h-3 rounded-sm"
                                style={{ background: PALETTE[p.ci % PALETTE.length] }}
                              />
                              {p.l}×{p.w}×{p.h}cm
                            </span>
                          )
                        )}
                        <span className="flex items-center gap-1.5 text-xs text-gray-600">
                          <span className="w-3 h-3 rounded-sm bg-emerald-400" />
                          offcut ≥2×2
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-gray-600">
                          <span className="w-3 h-3 rounded-sm bg-amber-300" />
                          kerf
                        </span>
                        {placed.some((p) => p.rotated) && (
                          <span className="text-xs text-violet-500 font-medium">↺ = rotated 90°</span>
                        )}
                      </div>
                    </>
                  )}

                  {activeTab === "table" && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="border-b border-gray-200">
                          <tr>
                            {["#", "L", "W", "T", "Pl.W", "Pl.T", "X", "Y", "Area", "Status"].map((h) => (
                              <th
                                key={h}
                                className="text-left px-2 py-2 text-gray-400 font-semibold uppercase tracking-wide"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {placed.map((p, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="px-2 py-2 mono text-gray-400">{i + 1}</td>
                              <td className="px-2 py-2 mono">{p.l}</td>
                              <td className="px-2 py-2 mono">{p.w}</td>
                              <td className="px-2 py-2 mono">{p.h}</td>
                              <td className={`px-2 py-2 mono ${p.rotated ? "text-violet-600" : ""}`}>
                                {p.placed ? p.pw : "—"}
                              </td>
                              <td className={`px-2 py-2 mono ${p.rotated ? "text-violet-600" : ""}`}>
                                {p.placed ? p.ph : "—"}
                              </td>
                              <td className="px-2 py-2 mono text-gray-400">
                                {p.placed ? (p.x ?? 0).toFixed(1) : "—"}
                              </td>
                              <td className="px-2 py-2 mono text-gray-400">
                                {p.placed ? (p.y ?? 0).toFixed(1) : "—"}
                              </td>
                              <td className="px-2 py-2 mono text-gray-500">
                                {p.placed ? ((p.pw ?? 0) * (p.ph ?? 0)).toFixed(1) : "—"}
                              </td>
                              <td className="px-2 py-2">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded font-medium ${
                                    p.placed
                                      ? p.rotated
                                        ? "text-violet-600 bg-violet-50"
                                        : "text-emerald-600 bg-emerald-50"
                                      : "text-red-600 bg-red-50"
                                  }`}
                                >
                                  {p.placed ? (p.rotated ? "PLACED ↺" : "PLACED") : "OVERFLOW"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === "offcuts" &&
                    (offcuts.length === 0 ? (
                      <div className="text-center py-10 text-sm text-gray-400">
                        No offcuts ≥ 2×2 cm — excellent yield ✓
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead className="border-b border-gray-200">
                            <tr>
                              {["#", "Width (cm)", "Height (cm)", "Area (cm²)", "X", "Y"].map((h) => (
                                <th
                                  key={h}
                                  className="text-left px-2 py-2 text-gray-400 font-semibold uppercase tracking-wide"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {offcuts.map((o, i) => (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="px-2 py-2 mono text-gray-400">{i + 1}</td>
                                <td className="px-2 py-2 mono">{o.w.toFixed(1)}</td>
                                <td className="px-2 py-2 mono">{o.h.toFixed(1)}</td>
                                <td className="px-2 py-2 mono text-emerald-600 font-semibold">
                                  {(o.w * o.h).toFixed(1)}
                                </td>
                                <td className="px-2 py-2 mono text-gray-400">{o.x.toFixed(1)}</td>
                                <td className="px-2 py-2 mono text-gray-400">{o.y.toFixed(1)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-dashed border-gray-300 rounded-xl p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">No results yet</p>
                <p className="text-xs text-gray-400">
                  Select a log + cutting list and click Optimise, or run Auto-Match.
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center mt-8 text-xs text-gray-300 tracking-widest uppercase">
          TIMBER.AI — Full Circle Packing (Multi-Log Matching)
        </p>
      </div>
    </div>
  );
}