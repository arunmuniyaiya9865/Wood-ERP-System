import { useState, useMemo } from "react";
import DataTable from "../components/ui/DataTable";   // your existing component
import Modal from "../components/ui/Modal";           // your existing component
import CostDonutChart from "../components/ui/CostDonutChart";

// ─── Seed Data ────────────────────────────────────────────────────────────────
const initialTransactions = [
  { id: 1,  date: "2025-01-05", category: "Revenue",         name: "Sales - Product A",      amount: 142000 },
  { id: 2,  date: "2025-01-08", category: "Revenue",         name: "Sales - Product B",       amount: 98500  },
  { id: 3,  date: "2025-01-10", category: "Revenue",         name: "Service Revenue",         amount: 34000  },
  { id: 4,  date: "2025-01-12", category: "Production Cost", name: "Raw Materials",           amount: 41200  },
  { id: 5,  date: "2025-01-14", category: "Production Cost", name: "Manufacturing Overhead",  amount: 22800  },
  { id: 6,  date: "2025-01-15", category: "Supplier Cost",   name: "Vendor - Acme Corp",      amount: 31500  },
  { id: 7,  date: "2025-01-16", category: "Supplier Cost",   name: "Vendor - SupplyCo",       amount: 18200  },
  { id: 8,  date: "2025-01-18", category: "Employee Cost",   name: "Supervisor Salaries",     amount: 28000  },
  { id: 9,  date: "2025-01-20", category: "Employee Cost",   name: "Daily Wages",             amount: 19400  },
  { id: 10, date: "2025-01-22", category: "Management Cost", name: "Executive Compensation",  amount: 24000  },
  { id: 11, date: "2025-01-24", category: "Management Cost", name: "Admin & Office",          amount: 8600   },
  { id: 12, date: "2025-01-28", category: "Revenue",         name: "Consulting Income",       amount: 27000  },
];

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  "Revenue":         "#3b82f6",
  "Production Cost": "#6366f1",
  "Supplier Cost":   "#f59e0b",
  "Management Cost": "#10b981",
  "Employee Cost":   "#ef4444",
};

// Column headers fed directly into your DataTable
const TABLE_HEADERS = ["Date", "Category", "Name", "Amount", "Action"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

const fmtDateLong = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

// ─── Finance (root) ───────────────────────────────────────────────────────────
export default function Finance() {
  const [transactions, setTransactions] = useState(initialTransactions);

  // Modal state — all kept here, not in a separate file
  const [editingTx,  setEditingTx]  = useState(null);
  const [editName,   setEditName]   = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [amountErr,  setAmountErr]  = useState("");

  // ── Derived totals (live — recalculates on every edit) ──
  const summary = useMemo(() => {
    const sum = (cat) =>
      transactions
        .filter((t) => t.category === cat)
        .reduce((acc, t) => acc + t.amount, 0);

    const revenue        = sum("Revenue");
    const productionCost = sum("Production Cost");
    const supplierCost   = sum("Supplier Cost");
    const managementCost = sum("Management Cost");
    const employeeCost   = sum("Employee Cost");
    const totalCost      = productionCost + supplierCost + managementCost + employeeCost;
    const netProfit      = revenue - totalCost;

    return { revenue, productionCost, supplierCost, managementCost, employeeCost, totalCost, netProfit };
  }, [transactions]);

  const profitPct =
    summary.revenue > 0 ? Math.round((summary.netProfit / summary.revenue) * 100) : 0;

  // ── Cost breakdown (shared by cards + chart) ──
  const costBreakdown = [
    { label: "Production Cost", value: summary.productionCost, color: CATEGORY_COLORS["Production Cost"], icon: "⚙️" },
    { label: "Supplier Cost",   value: summary.supplierCost,   color: CATEGORY_COLORS["Supplier Cost"],   icon: "📦" },
    { label: "Management Cost", value: summary.managementCost, color: CATEGORY_COLORS["Management Cost"], icon: "🏢" },
    { label: "Employee Cost",   value: summary.employeeCost,   color: CATEGORY_COLORS["Employee Cost"],   icon: "👥" },
  ];

  // ── Modal open / close ──
  const openEdit = (tx) => {
    setEditingTx(tx);
    setEditName(tx.name);
    setEditAmount(String(tx.amount));
    setAmountErr("");
  };

  const closeEdit = () => {
    setEditingTx(null);
    setAmountErr("");
  };

  // ── Save ──
  const handleSave = () => {
    const parsed = parseFloat(editAmount);
    if (isNaN(parsed) || parsed <= 0) {
      setAmountErr("Enter a valid positive amount.");
      return;
    }
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === editingTx.id
          ? { ...t, name: editName.trim() || t.name, amount: parsed }
          : t
      )
    );
    closeEdit();
  };

  const handleAmountChange = (val) => {
    setEditAmount(val);
    const p = parseFloat(val);
    setAmountErr(isNaN(p) || p <= 0 ? "Enter a valid positive amount." : "");
  };

  // ── renderRow — plugs directly into your DataTable's renderRow prop ──
  // Returns one <td> per column in the same order as TABLE_HEADERS
  const renderRow = (tx) => (
    <>
      {/* Date */}
      <td className="px-5 py-4 text-[13px] text-[#334155] whitespace-nowrap">
        {fmtDate(tx.date)}
      </td>

      {/* Category — coloured pill */}
      <td className="px-5 py-4 whitespace-nowrap">
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
          style={{
            background: CATEGORY_COLORS[tx.category] + "1a",
            color: CATEGORY_COLORS[tx.category],
          }}
        >
          {tx.category}
        </span>
      </td>

      {/* Name */}
      <td className="px-5 py-4 text-[13px] text-[#334155] font-medium max-w-[200px] truncate">
        {tx.name}
      </td>

      {/* Amount */}
      <td className="px-5 py-4 text-[13px] font-bold text-[#0f172a] whitespace-nowrap tabular-nums">
        {fmt(tx.amount)}
      </td>

      {/* Action — Edit ONLY, no delete */}
      <td className="px-5 py-4 whitespace-nowrap">
        <button
          onClick={() => openEdit(tx)}
          title="Edit transaction"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold
                     text-[#64748b] hover:text-indigo-600 hover:bg-indigo-50/60
                     px-2.5 py-1.5 rounded-lg transition-all duration-150"
        >
          {/* Pencil icon */}
          <svg
            width="13" height="13" viewBox="0 0 24 24"
            fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit
        </button>
      </td>
    </>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen font-sans">

      {/* ── Page Header ── */}
      <div className="px-8 py-5 border-b border-white/30 mb-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#0f172a] tracking-tight">Finance</h1>
            <p className="text-sm text-[#64748b] mt-0.5">
              Read-only overview · Edit rows to correct values
            </p>
          </div>
          <div
            className="flex items-center gap-2 text-xs font-semibold text-[#64748b]
                       bg-white/40 backdrop-blur-sm px-3 py-1.5 rounded-full
                       border border-white/50"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Jan 2025
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6 space-y-6">

        {/* ── 3 KPI Cards ── */}
        <div className="grid grid-cols-3 gap-5">
          <KpiCard
            label="Total Revenue"
            value={fmt(summary.revenue)}
            sub="From Sales module"
            accent="#3b82f6"
            badge={`+${profitPct}% margin`}
          />
          <KpiCard
            label="Total Cost"
            value={fmt(summary.totalCost)}
            sub="All categories combined"
            accent="#ef4444"
            badge={`${Math.round((summary.totalCost / summary.revenue) * 100)}% of revenue`}
          />
          <KpiCard
            label="Net Profit"
            value={fmt(summary.netProfit)}
            sub="Revenue − Total Cost · auto-calculated"
            accent={summary.netProfit >= 0 ? "#10b981" : "#ef4444"}
            badge={`${profitPct}% margin`}
            valueColor={summary.netProfit >= 0 ? "#10b981" : "#ef4444"}
          />
        </div>

        {/* ── 4 Cost Cards + Donut ── */}
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 grid grid-cols-2 gap-4">
            {costBreakdown.map((c) => (
              <CostCard key={c.label} {...c} total={summary.totalCost} />
            ))}
          </div>

          {/* Donut chart card — same glass style as DataTable */}
          <div
            className="rounded-2xl border border-white/45
                       shadow-[inset_0_0_0_1px_rgba(156,169,203,0.25)]
                       bg-white/30 backdrop-blur-sm p-5 flex flex-col"
          >
            <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest mb-4">
              Cost Distribution
            </p>
            <CostDonutChart data={costBreakdown} />
          </div>
        </div>

        {/* ── Transaction Table ── */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <div>
              <h2 className="text-sm font-bold text-[#0f172a]">Transactions</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                {transactions.length} records · click Edit on any row to correct a value
              </p>
            </div>
          </div>

          {/*
            ↓ YOUR DataTable — we pass:
              headers  = column label array
              data     = transaction objects
              renderRow = function that returns <td> elements per row
          */}
          <DataTable
            headers={TABLE_HEADERS}
            data={transactions}
            renderRow={renderRow}
          />
        </div>
      </div>

      {/* ── Edit Modal (YOUR Modal component) ── */}
      <Modal
        isOpen={!!editingTx}
        onClose={closeEdit}
        title="Edit Transaction"
      >
        {editingTx && (
          <div className="space-y-4">

            {/* Read-only info strip */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/20 border border-white/30">
              <div>
                <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">
                  Date
                </p>
                <p className="text-[13px] font-semibold text-[#334155]">
                  {fmtDateLong(editingTx.date)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">
                  Category
                </p>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{
                    background: CATEGORY_COLORS[editingTx.category] + "20",
                    color: CATEGORY_COLORS[editingTx.category],
                  }}
                >
                  {editingTx.category}
                </span>
              </div>
            </div>

            {/* Lock hint */}
            <p className="flex items-center gap-1.5 text-[11px] text-[#94a3b8]">
              <svg
                width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Date and category are locked
            </p>

            {/* Editable: Name */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] mb-1.5">
                Name
                <span className="ml-1 font-normal text-[#94a3b8]">(optional)</span>
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder={editingTx.name}
                className="w-full bg-white/50 border border-white/60 rounded-xl
                           px-4 py-2.5 text-[13px] text-[#334155] placeholder-[#cbd5e1]
                           focus:outline-none focus:ring-2 focus:ring-indigo-400/50
                           focus:border-indigo-300 transition-all"
              />
            </div>

            {/* Editable: Amount */}
            <div>
              <label className="block text-[11px] font-bold text-[#64748b] mb-1.5">
                Amount <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] text-[13px] font-semibold select-none">
                  $
                </span>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  min="0"
                  step="0.01"
                  className={`w-full bg-white/50 border rounded-xl pl-8 pr-4 py-2.5
                              text-[13px] text-[#334155]
                              focus:outline-none focus:ring-2
                              focus:border-indigo-300 transition-all
                              ${amountErr
                                ? "border-red-300 bg-red-50/40 focus:ring-red-300/50"
                                : "border-white/60 focus:ring-indigo-400/50"
                              }`}
                />
              </div>
              {amountErr && (
                <p className="mt-1.5 text-[11px] text-red-500 flex items-center gap-1">
                  <svg
                    width="11" height="11" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {amountErr}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={closeEdit}
                className="px-4 py-2 text-[13px] font-semibold text-[#64748b]
                           hover:bg-white/40 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!!amountErr}
                className="px-5 py-2 text-[13px] font-semibold text-white
                           bg-indigo-500 hover:bg-indigo-600
                           disabled:opacity-40 disabled:cursor-not-allowed
                           rounded-xl shadow-sm transition-all"
              >
                Save Changes
              </button>
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── KpiCard ──────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, accent, badge, valueColor }) {
  return (
    <div
      className="rounded-2xl border border-white/45
                 shadow-[inset_0_0_0_1px_rgba(156,169,203,0.25)]
                 bg-white/30 backdrop-blur-sm p-6"
    >
      <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">
        {label}
      </p>
      <p
        className="text-3xl font-bold mt-2 tracking-tight"
        style={{ color: valueColor ?? "#0f172a" }}
      >
        {value}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px] text-[#94a3b8]">{sub}</span>
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: accent + "18", color: accent }}
        >
          {badge}
        </span>
      </div>
    </div>
  );
}

// ─── CostCard ─────────────────────────────────────────────────────────────────
function CostCard({ label, value, color, icon, total }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div
      className="rounded-2xl border border-white/45
                 shadow-[inset_0_0_0_1px_rgba(156,169,203,0.25)]
                 bg-white/30 backdrop-blur-sm p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">
          {label}
        </span>
        <span className="text-base">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-[#0f172a] tracking-tight">{fmt(value)}</p>
      <div className="mt-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-[#94a3b8]">of total cost</span>
          <span className="text-[10px] font-bold" style={{ color }}>{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/40 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
      </div>
    </div>
  );
}