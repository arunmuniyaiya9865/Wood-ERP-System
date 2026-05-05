import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Download, Save, Package, Layers, BarChart3, IndianRupee } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const SPECIES_OPTIONS = ['Teak', 'Mahogany', 'Pine', 'Acacia', 'Spruce', 'Oak'];
const LOCATION_OPTIONS = ['Yard A', 'Yard B', 'Yard C', 'Warehouse 1', 'Warehouse 2'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getTodayKey = () => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return dd + mm + yy;
};

const codeCounterRef = { current: {} };

const generateWoodCode = () => {
  const base = getTodayKey();
  codeCounterRef.current[base] = (codeCounterRef.current[base] || 0) + 1;
  return `WL-${base}-${String(codeCounterRef.current[base]).padStart(3, '0')}`;
};

const calculateVolume = (topDia, botDia, length) => {
  const d1 = parseFloat(topDia);
  const d2 = parseFloat(botDia);
  const l  = parseFloat(length);
  if (!d1 || !d2 || !l || d1 <= 0 || d2 <= 0 || l <= 0) return '';
  return ((Math.PI / 8) * (d1 * d1 + d2 * d2) * l).toFixed(4);
};

const newLogRow = () => ({
  _id:      Date.now() + Math.random(),
  woodCode: generateWoodCode(),
  species:  '',
  topDia:   '',
  botDia:   '',
  length:   '',
  volume:   '',
  location: '',
});

const newMaterialRow = () => ({
  _id:   Date.now() + Math.random(),
  name:  '',
  qty:   '',
  price: '',
  total: '',
});

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, iconBg, iconColor }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      <Icon size={20} className={iconColor} />
    </div>
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 leading-tight">{value}</p>
    </div>
  </div>
);

const Toast = ({ message }) =>
  message ? (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-medium shadow-xl z-50 flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
      {message}
    </div>
  ) : null;

// ─── Shared input classes ─────────────────────────────────────────────────────
const inputCls =
  'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-150';
const roInputCls =
  'w-full px-3 py-2 text-xs border border-gray-100 rounded-xl bg-gray-50 text-gray-500 cursor-default focus:outline-none font-mono tracking-tight';
const selectCls =
  'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 cursor-pointer transition-all duration-150 appearance-none';

// ─── Main Component ───────────────────────────────────────────────────────────
const LogsRawMaterials = () => {
  const [activeTab, setActiveTab]           = useState('logs');
  const [logRows, setLogRows]               = useState([newLogRow()]);
  const [materialRows, setMaterialRows]     = useState([newMaterialRow()]);
  const [savedLogs, setSavedLogs]           = useState([]);
  const [savedMaterials, setSavedMaterials] = useState([]);
  const [toast, setToast]                   = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  }, []);

  const totalVolume   = savedLogs.reduce((s, l) => s + (parseFloat(l.volume) || 0), 0).toFixed(3);
  const totalMatValue = savedMaterials.reduce((s, m) => s + (parseFloat(m.total) || 0), 0).toFixed(2);
  const pendingLogVol = logRows.reduce((s, r) => s + (parseFloat(r.volume) || 0), 0).toFixed(4);
  const pendingMatTot = materialRows.reduce((s, r) => s + (parseFloat(r.total) || 0), 0).toFixed(2);

  // ── Log row handlers ──────────────────────────────────────────────────────
  const handleAddLogRow = () => setLogRows(prev => [...prev, newLogRow()]);

  const handleRemoveLogRow = (id) => {
    const base = getTodayKey();
    if (codeCounterRef.current[base] > 0) codeCounterRef.current[base]--;
    setLogRows(prev => prev.filter(r => r._id !== id));
  };

  const handleLogInputChange = (id, field, value) => {
    setLogRows(prev => prev.map(row => {
      if (row._id !== id) return row;
      const updated = { ...row, [field]: value };
      if (['topDia', 'botDia', 'length'].includes(field)) {
        updated.volume = calculateVolume(updated.topDia, updated.botDia, updated.length);
      }
      return updated;
    }));
  };

  const handleSaveLogs = () => {
    if (logRows.length === 0) { showToast('Add at least one log row'); return; }
    for (const r of logRows) {
      if (!r.species)                              { showToast('Select species for all rows'); return; }
      if (!r.topDia || parseFloat(r.topDia) <= 0) { showToast('Enter valid top diameter'); return; }
      if (!r.botDia || parseFloat(r.botDia) <= 0) { showToast('Enter valid bottom diameter'); return; }
      if (!r.length || parseFloat(r.length) <= 0) { showToast('Enter valid length'); return; }
      if (!r.location)                             { showToast('Select location for all rows'); return; }
    }
    const batch = {
      arrivalDate: new Date().toISOString(),
      logs: logRows.map(r => ({
        woodCode:       r.woodCode,
        species:        r.species,
        topDiameter:    parseFloat(r.topDia),
        bottomDiameter: parseFloat(r.botDia),
        length:         parseFloat(r.length),
        volume:         parseFloat(r.volume),
        location:       r.location,
      })),
    };
    console.log('[ERP] Log batch saved:', batch);
    setSavedLogs(prev => [...prev, ...batch.logs]);
    setLogRows([newLogRow()]);
    showToast(`${batch.logs.length} log(s) saved successfully`);
  };

  // ── Material row handlers ─────────────────────────────────────────────────
  const handleAddMatRow = () => setMaterialRows(prev => [...prev, newMaterialRow()]);

  const handleRemoveMatRow = (id) => setMaterialRows(prev => prev.filter(r => r._id !== id));

  const handleMatInputChange = (id, field, value) => {
    setMaterialRows(prev => prev.map(row => {
      if (row._id !== id) return row;
      const updated = { ...row, [field]: value };
      if (field === 'qty' || field === 'price') {
        const q = parseFloat(updated.qty)   || 0;
        const p = parseFloat(updated.price) || 0;
        updated.total = q > 0 && p > 0 ? (q * p).toFixed(2) : '';
      }
      return updated;
    }));
  };

  const handleSaveMaterials = () => {
    if (materialRows.length === 0) { showToast('Add at least one material row'); return; }
    for (const r of materialRows) {
      if (!r.name.trim())                        { showToast('Enter material name for all rows'); return; }
      if (!r.qty || parseFloat(r.qty) <= 0)      { showToast('Enter valid quantity'); return; }
      if (!r.price || parseFloat(r.price) <= 0)  { showToast('Enter valid price'); return; }
    }
    const batch = {
      savedAt: new Date().toISOString(),
      materials: materialRows.map(r => ({
        name:     r.name,
        quantity: parseFloat(r.qty),
        price:    parseFloat(r.price),
        total:    parseFloat(r.total),
      })),
    };
    console.log('[ERP] Materials batch saved:', batch);
    setSavedMaterials(prev => [...prev, ...batch.materials]);
    setMaterialRows([newMaterialRow()]);
    showToast(`${batch.materials.length} material(s) saved successfully`);
  };

  // ── Export ────────────────────────────────────────────────────────────────
  const handleExport = () => {
    const data = activeTab === 'logs'
      ? { savedLogs, pendingRows: logRows.length }
      : { savedMaterials, pendingRows: materialRows.length };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `erp-${activeTab}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported successfully');
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full min-h-screen  p-6">

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Raw Material Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Register arrivals and manage raw materials</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-700 transition-colors shadow-sm"
          >
            <Download size={15} /> Export
          </button>
          {activeTab === 'logs' ? (
            <>
              <button
                onClick={handleAddLogRow}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm"
              >
                <Plus size={15} /> Add Row
              </button>
              <button
                onClick={handleSaveLogs}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors shadow-sm"
              >
                <Save size={15} /> Save Arrival
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleAddMatRow}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm"
              >
                <Plus size={15} /> Add Row
              </button>
              <button
                onClick={handleSaveMaterials}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors shadow-sm"
              >
                <Save size={15} /> Save Materials
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Stat Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Logs Saved"      value={savedLogs.length}                                    icon={Package}    iconBg="bg-green-50"  iconColor="text-green-700" />
        <StatCard label="Total Volume"    value={`${totalVolume} m³`}                                 icon={BarChart3}  iconBg="bg-blue-50"   iconColor="text-blue-700" />
        <StatCard label="Materials Saved" value={savedMaterials.length}                               icon={Layers}     iconBg="bg-violet-50" iconColor="text-violet-700" />
        <StatCard label="Materials Value" value={`₹${Number(totalMatValue).toLocaleString('en-IN')}`} icon={IndianRupee} iconBg="bg-amber-50"  iconColor="text-amber-700" />
      </div>

      {/* ── Tab Bar ─────────────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-0">
        {[
          { key: 'logs',      label: 'Wood Logs' },
          { key: 'materials', label: 'Raw Materials' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-6 py-2.5 text-sm font-semibold rounded-t-2xl border border-b-0 transition-all duration-150 ${
              activeTab === key
                ? 'bg-white border-gray-200 text-gray-900 shadow-sm'
                : 'bg-gray-100 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Main Card ───────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-b-2xl rounded-tr-2xl overflow-hidden shadow-sm">

        {/* Card Header */}
        <div className="flex items-center justify-between flex-wrap gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50/70">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-800">
              {activeTab === 'logs' ? 'Wood Log Arrivals' : 'Raw Materials Entry'}
            </span>
            <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full font-medium">
              {activeTab === 'logs'
                ? `${logRows.length + savedLogs.length} total`
                : `${materialRows.length + savedMaterials.length} total`}
            </span>
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">
            Pending rows above · Saved records shown faded below
          </span>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto" style={{ maxHeight: '420px', overflowY: 'auto' }}>

          {activeTab === 'logs' ? (
            /* ── LOGS TABLE ──────────────────────────────────────────── */
            <table className="w-full text-sm" style={{ minWidth: '880px' }}>
              <thead className="sticky top-0 z-10">
                <tr className="bg-green-50 border-b-2 border-green-200">
                  {['Wood Code', 'Species', 'Top Ø (cm)', 'Bot Ø (cm)', 'Length (m)', 'Volume (m³)', 'Location', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logRows.map((row, idx) => (
                  <tr key={row._id} className={`border-b border-gray-100 hover:bg-green-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                    <td className="px-4 py-2.5" style={{ minWidth: '140px' }}>
                      <input readOnly value={row.woodCode} className={roInputCls} />
                    </td>
                    <td className="px-4 py-2.5" style={{ minWidth: '130px' }}>
                      <div className="relative">
                        <select
                          className={selectCls}
                          value={row.species}
                          onChange={e => handleLogInputChange(row._id, 'species', e.target.value)}
                        >
                          <option value="">Select species</option>
                          {SPECIES_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                    <td className="px-4 py-2.5" style={{ minWidth: '100px' }}>
                      <input type="number" min="0" placeholder="30"
                        className={inputCls} value={row.topDia}
                        onChange={e => handleLogInputChange(row._id, 'topDia', e.target.value)} />
                    </td>
                    <td className="px-4 py-2.5" style={{ minWidth: '100px' }}>
                      <input type="number" min="0" placeholder="40"
                        className={inputCls} value={row.botDia}
                        onChange={e => handleLogInputChange(row._id, 'botDia', e.target.value)} />
                    </td>
                    <td className="px-4 py-2.5" style={{ minWidth: '100px' }}>
                      <input type="number" min="0" step="0.01" placeholder="3.5"
                        className={inputCls} value={row.length}
                        onChange={e => handleLogInputChange(row._id, 'length', e.target.value)} />
                    </td>
                    <td className="px-4 py-2.5" style={{ minWidth: '110px' }}>
                      <div className="px-3 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-xl text-center border border-blue-100">
                        {row.volume || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-2.5" style={{ minWidth: '130px' }}>
                      <select
                        className={selectCls}
                        value={row.location}
                        onChange={e => handleLogInputChange(row._id, 'location', e.target.value)}
                      >
                        <option value="">Select location</option>
                        {LOCATION_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => handleRemoveLogRow(row._id)}
                        className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors border border-transparent hover:border-red-200"
                        title="Remove row"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Saved rows */}
                {savedLogs.slice().reverse().map((log, i) => (
                  <tr key={`saved-log-${i}`} className="border-b border-gray-100 opacity-45">
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{log.woodCode}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-block px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-lg font-semibold border border-green-100">
                        {log.species}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-gray-500">{log.topDiameter}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-500">{log.bottomDiameter}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-500">{log.length}</td>
                    <td className="px-4 py-2.5">
                      <div className="px-3 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-xl text-center border border-blue-100">
                        {log.volume}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-gray-500">{log.location}</td>
                    <td />
                  </tr>
                ))}

                {logRows.length === 0 && savedLogs.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-sm text-gray-400">
                      No logs yet — click "+ Add Row" to register an arrival
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            /* ── MATERIALS TABLE ─────────────────────────────────────── */
            <table className="w-full text-sm" style={{ minWidth: '620px' }}>
              <thead className="sticky top-0 z-10">
                <tr className="bg-green-50 border-b-2 border-green-200">
                  {['Material Name', 'Quantity', 'Unit Price (₹)', 'Total (₹)', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {materialRows.map((row, idx) => (
                  <tr key={row._id} className={`border-b border-gray-100 hover:bg-green-50/30 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                    <td className="px-4 py-2.5" style={{ minWidth: '200px' }}>
                      <input type="text" placeholder="Enter material name"
                        className={inputCls} value={row.name}
                        onChange={e => handleMatInputChange(row._id, 'name', e.target.value)} />
                    </td>
                    <td className="px-4 py-2.5" style={{ minWidth: '110px' }}>
                      <input type="number" min="0" placeholder="50"
                        className={inputCls} value={row.qty}
                        onChange={e => handleMatInputChange(row._id, 'qty', e.target.value)} />
                    </td>
                    <td className="px-4 py-2.5" style={{ minWidth: '130px' }}>
                      <input type="number" min="0" step="0.01" placeholder="1200"
                        className={inputCls} value={row.price}
                        onChange={e => handleMatInputChange(row._id, 'price', e.target.value)} />
                    </td>
                    <td className="px-4 py-2.5" style={{ minWidth: '130px' }}>
                      <div className="px-3 py-2 bg-amber-50 text-amber-700 text-sm font-semibold rounded-xl text-center border border-amber-100">
                        {row.total ? `₹${Number(row.total).toLocaleString('en-IN')}` : '—'}
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => handleRemoveMatRow(row._id)}
                        className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors border border-transparent hover:border-red-200"
                        title="Remove row"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Saved rows */}
                {savedMaterials.slice().reverse().map((m, i) => (
                  <tr key={`saved-mat-${i}`} className="border-b border-gray-100 opacity-45">
                    <td className="px-4 py-2.5 text-sm text-gray-500">{m.name}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-500">{m.quantity}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-500">₹{Number(m.price).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2.5">
                      <div className="px-3 py-2 bg-amber-50 text-amber-600 text-sm font-semibold rounded-xl text-center border border-amber-100">
                        ₹{Number(m.total).toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td />
                  </tr>
                ))}

                {materialRows.length === 0 && savedMaterials.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-sm text-gray-400">
                      No materials yet — click "+ Add Row" to add entries
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Footer Bar ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3.5 border-t border-gray-100 bg-gray-50/70">
          {activeTab === 'logs' ? (
            <>
              <p className="text-sm text-gray-500">
                Pending: <strong className="text-gray-800 font-semibold">{logRows.length} rows</strong>
                <span className="mx-2 text-gray-300">·</span>
                Volume: <strong className="text-blue-700 font-semibold">{pendingLogVol} m³</strong>
                <span className="mx-2 text-gray-300">·</span>
                Saved: <strong className="text-gray-800 font-semibold">{savedLogs.length} logs</strong>
              </p>
              <div className="flex gap-2">
                <button onClick={handleAddLogRow}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors">
                  <Plus size={13} /> Add Row
                </button>
                <button onClick={handleSaveLogs}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors">
                  <Save size={13} /> Save Arrival
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                Pending: <strong className="text-gray-800 font-semibold">{materialRows.length} rows</strong>
                <span className="mx-2 text-gray-300">·</span>
                Total: <strong className="text-amber-700 font-semibold">₹{Number(pendingMatTot).toLocaleString('en-IN')}</strong>
                <span className="mx-2 text-gray-300">·</span>
                Saved: <strong className="text-gray-800 font-semibold">{savedMaterials.length} items</strong>
              </p>
              <div className="flex gap-2">
                <button onClick={handleAddMatRow}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors">
                  <Plus size={13} /> Add Row
                </button>
                <button onClick={handleSaveMaterials}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors">
                  <Save size={13} /> Save Materials
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Toast message={toast} />
    </div>
  );
};

export default LogsRawMaterials;