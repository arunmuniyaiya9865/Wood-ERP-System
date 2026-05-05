// ═══════════════════════════════════════════════════════════════
//  SettingsModule.jsx  —  Complete Settings UI for Wood Export ERP
//  Matches: Global Wood Software / Command Center UI style
//  Sections: General · Users · Export Rules · Certs · Products
//            Logistics · Notifications · Security
// ═══════════════════════════════════════════════════════════════

import { useState, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────────────────────

const INIT_GENERAL = {
  companyName: "Global Wood Software",
  businessType: "Wood Export",
  timezone: "Asia/Kolkata",
  currency: "INR",
  dateFormat: "DD/MM/YYYY",
  logoFile: null,
  logoPreview: null,
};

const INIT_USERS = [
  { id: 1, name: "Admin User",      email: "admin@globalwood.com",   role: "Admin",   status: "Active"   },
  { id: 2, name: "Rajesh Kumar",    email: "rajesh@globalwood.com",  role: "Manager", status: "Active"   },
  { id: 3, name: "Priya Sharma",    email: "priya@globalwood.com",   role: "Staff",   status: "Active"   },
  { id: 4, name: "Suresh Babu",     email: "suresh@globalwood.com",  role: "Staff",   status: "Inactive" },
  { id: 5, name: "Anitha Rajan",    email: "anitha@globalwood.com",  role: "Manager", status: "Active"   },
];

const CERT_OPTIONS = [
  "Phytosanitary Certificate",
  "Fumigation Certificate",
  "Certificate of Origin",
  "Quality Inspection Certificate",
  "Wood Treatment Certificate",
];

const INIT_EXPORT_RULES = [
  { id: 1, country: "USA",         certs: ["Phytosanitary Certificate", "Fumigation Certificate"] },
  { id: 2, country: "Australia",   certs: ["Phytosanitary Certificate", "Fumigation Certificate", "Certificate of Origin"] },
  { id: 3, country: "UK",          certs: ["Phytosanitary Certificate", "Certificate of Origin"] },
  { id: 4, country: "Germany",     certs: ["Phytosanitary Certificate", "Certificate of Origin"] },
  { id: 5, country: "Japan",       certs: ["Phytosanitary Certificate", "Fumigation Certificate", "Certificate of Origin"] },
  { id: 6, country: "China",       certs: ["Phytosanitary Certificate", "Fumigation Certificate"] },
  { id: 7, country: "UAE",         certs: ["Certificate of Origin"] },
  { id: 8, country: "Singapore",   certs: ["Certificate of Origin", "Fumigation Certificate"] },
  { id: 9, country: "Canada",      certs: ["Phytosanitary Certificate", "Fumigation Certificate"] },
  { id:10, country: "New Zealand",  certs: ["Phytosanitary Certificate", "Fumigation Certificate", "Certificate of Origin"] },
];

const INIT_CERT_MASTER = [
  { id: 1, name: "Phytosanitary Certificate",    description: "Confirms wood is free from pests and diseases", mandatory: true  },
  { id: 2, name: "Fumigation Certificate",        description: "Proof that timber has been fumigated per ISPM-15", mandatory: true  },
  { id: 3, name: "Certificate of Origin",         description: "Documents the country of origin of exported goods", mandatory: false },
  { id: 4, name: "Quality Inspection Certificate",description: "Third-party quality verification of wood products", mandatory: false },
  { id: 5, name: "Wood Treatment Certificate",    description: "Certifies heat treatment or chemical treatment applied", mandatory: false },
];

const INIT_PRODUCTS = [
  { id: 1, name: "Teak",         unit: "CBM",  category: "Hardwood"   },
  { id: 2, name: "Rosewood",     unit: "CBM",  category: "Hardwood"   },
  { id: 3, name: "Mahogany",     unit: "CBM",  category: "Hardwood"   },
  { id: 4, name: "Pine",         unit: "Tons", category: "Softwood"   },
  { id: 5, name: "Cedar",        unit: "CBM",  category: "Softwood"   },
  { id: 6, name: "Walnut",       unit: "Tons", category: "Hardwood"   },
  { id: 7, name: "Bamboo Plank", unit: "Tons", category: "Engineered" },
  { id: 8, name: "Eucalyptus",   unit: "CBM",  category: "Plantation" },
  { id: 9, name: "Rubber Wood",  unit: "Tons", category: "Plantation" },
];

const INIT_LOGISTICS = {
  defaultPort: "Chennai Port",
  shippingMethods: { sea: true, air: false, road: true },
  containerTypes: ["20ft Standard", "40ft Standard", "40ft High Cube"],
};

const INIT_NOTIFICATIONS = {
  emailAlerts:      true,
  expiryAlerts:     true,
  shipmentUpdates:  true,
  dailyDigest:      false,
  smsAlerts:        false,
  expiryDaysBefore: "7",
};

const COUNTRIES_LIST = [
  "USA","Australia","UK","Germany","Japan","China","UAE","Singapore",
  "Canada","New Zealand","Malaysia","Indonesia","Thailand","Vietnam","Brazil","France",
];

// ─────────────────────────────────────────────────────────────
//  ATOMS
// ─────────────────────────────────────────────────────────────

function Toast({ msg, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-emerald-200 shadow-xl rounded-2xl px-5 py-3.5 animate-slide-up">
      <span className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm font-bold">✓</span>
      <span className="text-sm font-semibold text-slate-700">{msg}</span>
      <button onClick={onClose} className="ml-2 text-slate-300 hover:text-slate-500 text-xs">✕</button>
    </div>
  );
}

function SectionCard({ title, description, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-lg">{icon}</div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function SettingInput({ label, required, error, hint, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <input
        {...props}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-white outline-none transition-all
          focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400
          ${error ? "border-rose-400 bg-rose-50/30" : "border-slate-200 hover:border-slate-300"}`}
      />
      {hint && !error && <span className="text-[11px] text-slate-400">{hint}</span>}
      {error && <span className="text-xs text-rose-500 flex items-center gap-1">⚠ {error}</span>}
    </div>
  );
}

function SettingSelect({ label, required, error, options, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <select
        value={value} onChange={onChange}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-white outline-none transition-all cursor-pointer appearance-none
          focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400
          ${error ? "border-rose-400 bg-rose-50/30" : "border-slate-200 hover:border-slate-300"}`}
        style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center" }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => typeof o === "string"
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>
        )}
      </select>
      {error && <span className="text-xs text-rose-500 flex items-center gap-1">⚠ {error}</span>}
    </div>
  );
}

function Toggle({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        {desc && <p className="text-xs text-slate-400 mt-0.5">{desc}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${checked ? "bg-indigo-500" : "bg-slate-200"}`}
      >
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${checked ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}

function SaveBar({ onSave, saving }) {
  return (
    <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
      <button
        onClick={onSave}
        disabled={saving}
        className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 active:scale-95 transition-all duration-150 shadow-sm shadow-indigo-200 flex items-center gap-2 disabled:opacity-60"
      >
        {saving ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><span>💾</span>Save Changes</>}
      </button>
    </div>
  );
}

function RoleBadge({ role }) {
  const cfg = {
    Admin:   "bg-rose-50 text-rose-700",
    Manager: "bg-indigo-50 text-indigo-700",
    Staff:   "bg-slate-100 text-slate-600",
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${cfg[role] || "bg-slate-100 text-slate-500"}`}>{role}</span>;
}

function StatusDot({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${status === "Active" ? "text-emerald-600" : "text-slate-400"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "Active" ? "bg-emerald-500" : "bg-slate-300"}`} />
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
//  1. GENERAL SETTINGS
// ─────────────────────────────────────────────────────────────

function GeneralSettings({ onSave }) {
  const [form, setForm] = useState(INIT_GENERAL);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const logoRef = useRef();

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => set("logoPreview", ev.target.result);
    reader.readAsDataURL(file);
    set("logoFile", file);
  };

  const validate = () => {
    const e = {};
    if (!form.companyName.trim()) e.companyName = "Company name is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave("General settings saved!"); }, 900);
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Company Profile" description="Basic company identity and branding" icon="🏢">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <SettingInput label="Company Name" required value={form.companyName} error={errors.companyName}
            onChange={e => set("companyName", e.target.value)} />
          <SettingSelect label="Business Type" required value={form.businessType}
            options={["Wood Export","Timber Trading","Plywood Manufacturing","Furniture Export","Bamboo Products"]}
            onChange={e => set("businessType", e.target.value)} />
        </div>

        <div className="mt-5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Company Logo</label>
          <div className="flex items-center gap-4">
            {form.logoPreview
              ? <img src={form.logoPreview} alt="logo" className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm" />
              : <div className="w-16 h-16 rounded-xl bg-indigo-50 border-2 border-dashed border-indigo-200 flex items-center justify-center text-2xl">🪵</div>
            }
            <div>
              <button type="button" onClick={() => logoRef.current.click()}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                {form.logoPreview ? "Change Logo" : "Upload Logo"}
              </button>
              <p className="text-[11px] text-slate-400 mt-1.5">PNG, JPG up to 2MB. Recommended 200×200px.</p>
            </div>
            <input ref={logoRef} type="file" accept=".png,.jpg,.jpeg" className="hidden" onChange={handleLogo} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Regional Settings" description="Timezone, currency and date preferences" icon="🌐">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <SettingSelect label="Timezone" value={form.timezone}
            options={["Asia/Kolkata","UTC","America/New_York","Europe/London","Asia/Dubai","Asia/Singapore","Asia/Tokyo"]}
            onChange={e => set("timezone", e.target.value)} />
          <SettingSelect label="Currency" value={form.currency}
            options={[{value:"INR",label:"₹ INR"},{value:"USD",label:"$ USD"},{value:"EUR",label:"€ EUR"},{value:"GBP",label:"£ GBP"},{value:"AED",label:"AED"}]}
            onChange={e => set("currency", e.target.value)} />
          <SettingSelect label="Date Format" value={form.dateFormat}
            options={["DD/MM/YYYY","MM/DD/YYYY","YYYY-MM-DD","DD-MM-YYYY"]}
            onChange={e => set("dateFormat", e.target.value)} />
        </div>
      </SectionCard>

      <SaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  2. USER MANAGEMENT
// ─────────────────────────────────────────────────────────────

function UserManagement({ onSave }) {
  const [users, setUsers] = useState(INIT_USERS);
  const [modal, setModal] = useState(null); // null | {mode:"add"|"edit", user}
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const emptyUser = { name:"", email:"", role:"Staff", status:"Active" };
  const [form, setForm] = useState(emptyUser);
  const [formErrors, setFormErrors] = useState({});

  const openAdd  = () => { setForm(emptyUser); setFormErrors({}); setModal({ mode:"add" }); };
  const openEdit = (u) => { setForm({ ...u }); setFormErrors({}); setModal({ mode:"edit", user:u }); };

  const validateForm = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Name required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    setFormErrors(e);
    return !Object.keys(e).length;
  };

  const handleModalSave = () => {
    if (!validateForm()) return;
    if (modal.mode === "add") {
      setUsers(u => [...u, { ...form, id: Date.now() }]);
    } else {
      setUsers(u => u.map(x => x.id === modal.user.id ? { ...x, ...form } : x));
    }
    setModal(null);
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave("User management updated!"); }, 600);
  };

  const handleDelete = (id) => {
    setUsers(u => u.filter(x => x.id !== id));
    setDeleteConfirm(null);
    onSave("User removed.");
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Team Members" description={`${users.length} users across all roles`} icon="👥">
        <div className="flex justify-end mb-4">
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
            <span>+</span> Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Name","Email","Role","Status","Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${i%2===0?"":"bg-slate-50/20"}`}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                        {u.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-800 text-[13px]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 text-[13px]">{u.email}</td>
                  <td className="px-4 py-3.5"><RoleBadge role={u.role} /></td>
                  <td className="px-4 py-3.5"><StatusDot status={u.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(u)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                        Edit
                      </button>
                      <button onClick={() => setDeleteConfirm(u.id)}
                        className="px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-colors">
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800">{modal.mode === "add" ? "Add New User" : "Edit User"}</h4>
              <button onClick={() => setModal(null)} className="text-slate-300 hover:text-slate-500">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <SettingInput label="Full Name" required placeholder="e.g. Rajesh Kumar"
                value={form.name} error={formErrors.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
              <SettingInput label="Email Address" required placeholder="user@company.com" type="email"
                value={form.email} error={formErrors.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
              <SettingSelect label="Role" required value={form.role}
                options={["Admin","Manager","Staff"]} onChange={e => setForm(f => ({...f, role: e.target.value}))} />
              <SettingSelect label="Status" value={form.status}
                options={["Active","Inactive"]} onChange={e => setForm(f => ({...f, status: e.target.value}))} />
            </div>
            <div className="px-6 pb-5 flex gap-3 justify-end">
              <button onClick={() => setModal(null)}
                className="px-5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleModalSave}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors">
                {modal.mode === "add" ? "Add User" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-2xl mx-auto mb-4">⚠️</div>
            <h4 className="text-base font-bold text-slate-800 mb-2">Remove User?</h4>
            <p className="text-sm text-slate-400 mb-5">This action cannot be undone. The user will lose all access.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  3. EXPORT RULES
// ─────────────────────────────────────────────────────────────

function ExportRules({ onSave }) {
  const [rules, setRules] = useState(INIT_EXPORT_RULES);
  const [modal, setModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyRule = { country: "", certs: [] };
  const [form, setForm] = useState(emptyRule);
  const [formErrors, setFormErrors] = useState({});

  const usedCountries = rules.map(r => r.country);
  const availableCountries = COUNTRIES_LIST.filter(c => !usedCountries.includes(c) || (modal?.rule && modal.rule.country === c));

  const openAdd  = () => { setForm(emptyRule); setFormErrors({}); setModal({ mode:"add" }); };
  const openEdit = (r) => { setForm({ country:r.country, certs:[...r.certs] }); setFormErrors({}); setModal({ mode:"edit", rule:r }); };

  const toggleCert = (cert) => {
    setForm(f => ({
      ...f,
      certs: f.certs.includes(cert) ? f.certs.filter(c => c !== cert) : [...f.certs, cert]
    }));
  };

  const validateRule = () => {
    const e = {};
    if (!form.country) e.country = "Country required";
    if (!form.certs.length) e.certs = "Select at least one certificate";
    setFormErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = () => {
    if (!validateRule()) return;
    if (modal.mode === "add") {
      setRules(r => [...r, { ...form, id: Date.now() }]);
    } else {
      setRules(r => r.map(x => x.id === modal.rule.id ? { ...x, ...form } : x));
    }
    setModal(null);
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave("Export rules saved!"); }, 600);
  };

  const certColor = (cert) => {
    if (cert.includes("Phyto"))   return "bg-green-50 text-green-700 border-green-200";
    if (cert.includes("Fumig"))   return "bg-orange-50 text-orange-700 border-orange-200";
    if (cert.includes("Origin"))  return "bg-blue-50 text-blue-700 border-blue-200";
    if (cert.includes("Quality")) return "bg-purple-50 text-purple-700 border-purple-200";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Country Certificate Rules" description="Define required documents per destination country" icon="🌍">
        <div className="flex justify-end mb-4">
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
            <span>+</span> Add Country Rule
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map(rule => (
            <div key={rule.id} className="rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🏳️</span>
                  <span className="font-bold text-slate-800">{rule.country}</span>
                  <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{rule.certs.length} cert{rule.certs.length!==1?"s":""}</span>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(rule)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50">Edit</button>
                  <button onClick={() => setDeleteId(rule.id)}
                    className="px-2.5 py-1 rounded-lg border border-rose-200 text-xs font-semibold text-rose-500 hover:bg-rose-50">✕</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {rule.certs.map(cert => (
                  <span key={cert} className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${certColor(cert)}`}>
                    {cert.replace(" Certificate","").replace("Certificate of ","")}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800">{modal.mode==="add" ? "Add Country Rule" : `Edit Rule: ${modal.rule.country}`}</h4>
              <button onClick={() => setModal(null)} className="text-slate-300 hover:text-slate-500">✕</button>
            </div>
            <div className="p-6 space-y-5">
              {modal.mode === "add" && (
                <SettingSelect label="Destination Country" required placeholder="Select country..."
                  value={form.country} error={formErrors.country}
                  options={availableCountries} onChange={e => setForm(f => ({...f, country: e.target.value}))} />
              )}

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                  Required Certificates <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-2">
                  {CERT_OPTIONS.map(cert => (
                    <label key={cert}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all
                        ${form.certs.includes(cert) ? "border-indigo-300 bg-indigo-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                      <input type="checkbox" checked={form.certs.includes(cert)} onChange={() => toggleCert(cert)}
                        className="w-4 h-4 rounded accent-indigo-600" />
                      <span className={`text-sm font-semibold ${form.certs.includes(cert) ? "text-indigo-700" : "text-slate-700"}`}>{cert}</span>
                    </label>
                  ))}
                </div>
                {formErrors.certs && <p className="text-xs text-rose-500 mt-2">⚠ {formErrors.certs}</p>}
              </div>
            </div>
            <div className="px-6 pb-5 flex gap-3 justify-end">
              <button onClick={() => setModal(null)}
                className="px-5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700">Save Rule</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm mx-4 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-2xl mx-auto mb-4">🗑️</div>
            <h4 className="text-base font-bold text-slate-800 mb-2">Delete Rule?</h4>
            <p className="text-sm text-slate-400 mb-5">This country will no longer have certificate requirements.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={() => { setRules(r => r.filter(x => x.id !== deleteId)); setDeleteId(null); onSave("Rule deleted."); }}
                className="flex-1 px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  4. CERTIFICATE MASTER
// ─────────────────────────────────────────────────────────────

function CertificateMaster({ onSave }) {
  const [certs, setCerts] = useState(INIT_CERT_MASTER);
  const [modal, setModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const empty = { name:"", description:"", mandatory:false };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  const openAdd  = () => { setForm(empty); setErrors({}); setModal({ mode:"add" }); };
  const openEdit = (c) => { setForm({ name:c.name, description:c.description, mandatory:c.mandatory }); setErrors({}); setModal({ mode:"edit", cert:c }); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Certificate name required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (modal.mode === "add") setCerts(c => [...c, { ...form, id: Date.now() }]);
    else setCerts(c => c.map(x => x.id === modal.cert.id ? { ...x, ...form } : x));
    setModal(null);
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave("Certificate master saved!"); }, 600);
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Certificate Types" description="Manage all valid certificate types in the system" icon="📋">
        <div className="flex justify-end mb-4">
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
            <span>+</span> Add Certificate
          </button>
        </div>

        <div className="space-y-3">
          {certs.map(cert => (
            <div key={cert.id} className="flex items-start justify-between p-4 rounded-2xl border border-slate-200 hover:shadow-sm transition-all bg-white">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-base mt-0.5">📄</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{cert.name}</span>
                    {cert.mandatory && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full border border-rose-100">MANDATORY</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{cert.description}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0 ml-4">
                <button onClick={() => openEdit(cert)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50">Edit</button>
                <button onClick={() => { setCerts(c => c.filter(x => x.id !== cert.id)); onSave("Certificate removed."); }}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 text-xs font-semibold text-rose-500 hover:bg-rose-50">✕</button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800">{modal.mode==="add" ? "Add Certificate Type" : "Edit Certificate"}</h4>
              <button onClick={() => setModal(null)} className="text-slate-300 hover:text-slate-500">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <SettingInput label="Certificate Name" required placeholder="e.g. Phytosanitary Certificate"
                value={form.name} error={errors.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none transition-all focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 resize-none"
                  placeholder="Brief description of this certificate..." />
              </div>
              <Toggle checked={form.mandatory} onChange={v => setForm(f => ({...f, mandatory: v}))}
                label="Mandatory Certificate" desc="Mark as required for all shipments to applicable countries" />
            </div>
            <div className="px-6 pb-5 flex gap-3 justify-end">
              <button onClick={() => setModal(null)}
                className="px-5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  5. PRODUCT SETTINGS
// ─────────────────────────────────────────────────────────────

function ProductSettings({ onSave }) {
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [modal, setModal] = useState(null);

  const empty = { name:"", unit:"CBM", category:"Hardwood" };
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  const openAdd  = () => { setForm(empty); setErrors({}); setModal({ mode:"add" }); };
  const openEdit = (p) => { setForm({ name:p.name, unit:p.unit, category:p.category }); setErrors({}); setModal({ mode:"edit", product:p }); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (modal.mode === "add") setProducts(p => [...p, { ...form, id: Date.now() }]);
    else setProducts(p => p.map(x => x.id === modal.product.id ? { ...x, ...form } : x));
    setModal(null);
    onSave("Product settings saved!");
  };

  const catColor = {
    Hardwood:   "bg-amber-50 text-amber-700",
    Softwood:   "bg-green-50 text-green-700",
    Engineered: "bg-blue-50 text-blue-700",
    Plantation: "bg-teal-50 text-teal-700",
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Wood Product Types" description="Manage available products for orders" icon="🌲">
        <div className="flex justify-end mb-4">
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
            <span>+</span> Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map(p => (
            <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:shadow-sm transition-all bg-white group">
              <div className="flex items-center gap-3">
                <span className="text-xl">🪵</span>
                <div>
                  <p className="text-sm font-bold text-slate-800">{p.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{p.unit}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${catColor[p.category]||"bg-slate-50 text-slate-500"}`}>{p.category}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(p)} className="w-7 h-7 rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 flex items-center justify-center text-xs transition-colors">✎</button>
                <button onClick={() => { setProducts(pr => pr.filter(x => x.id !== p.id)); onSave("Product removed."); }}
                  className="w-7 h-7 rounded-lg border border-rose-100 text-rose-400 hover:bg-rose-50 flex items-center justify-center text-xs transition-colors">✕</button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-800">{modal.mode==="add" ? "Add Product" : "Edit Product"}</h4>
              <button onClick={() => setModal(null)} className="text-slate-300 hover:text-slate-500">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <SettingInput label="Product Name" required placeholder="e.g. Teak"
                value={form.name} error={errors.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
              <SettingSelect label="Unit" value={form.unit} options={["CBM","Tons"]} onChange={e => setForm(f => ({...f, unit: e.target.value}))} />
              <SettingSelect label="Category" value={form.category} options={["Hardwood","Softwood","Engineered","Plantation"]} onChange={e => setForm(f => ({...f, category: e.target.value}))} />
            </div>
            <div className="px-6 pb-5 flex gap-3 justify-end">
              <button onClick={() => setModal(null)} className="px-5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  6. LOGISTICS SETTINGS
// ─────────────────────────────────────────────────────────────

function LogisticsSettings({ onSave }) {
  const [form, setForm] = useState(INIT_LOGISTICS);
  const [saving, setSaving] = useState(false);
  const [newContainer, setNewContainer] = useState("");

  const PORTS = ["Chennai Port","Mumbai Port","Nhava Sheva","Cochin Port","Kolkata Port","Tuticorin","Vizag Port","Mundra Port"];

  const addContainer = () => {
    if (!newContainer.trim()) return;
    setForm(f => ({ ...f, containerTypes: [...f.containerTypes, newContainer.trim()] }));
    setNewContainer("");
  };

  const removeContainer = (idx) => setForm(f => ({ ...f, containerTypes: f.containerTypes.filter((_, i) => i !== idx) }));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave("Logistics settings saved!"); }, 900);
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Port & Shipping" description="Configure default port and shipping method preferences" icon="⚓">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <SettingSelect label="Default Port" value={form.defaultPort} options={PORTS}
            onChange={e => setForm(f => ({...f, defaultPort: e.target.value}))} />
        </div>

        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">Shipping Methods</label>
        <div className="space-y-1">
          <Toggle checked={form.shippingMethods.sea} onChange={v => setForm(f => ({...f, shippingMethods:{...f.shippingMethods, sea:v}}))}
            label="🚢 Sea Freight" desc="Standard ocean container shipping" />
          <Toggle checked={form.shippingMethods.air} onChange={v => setForm(f => ({...f, shippingMethods:{...f.shippingMethods, air:v}}))}
            label="✈️ Air Freight" desc="Express air cargo for smaller shipments" />
          <Toggle checked={form.shippingMethods.road} onChange={v => setForm(f => ({...f, shippingMethods:{...f.shippingMethods, road:v}}))}
            label="🚚 Road Transport" desc="Domestic and regional truck delivery" />
        </div>
      </SectionCard>

      <SectionCard title="Container Types" description="Manage available container specifications" icon="📦">
        <div className="flex gap-3 mb-4">
          <input value={newContainer} onChange={e => setNewContainer(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addContainer()}
            placeholder='e.g. 20ft Flat Rack'
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400" />
          <button onClick={addContainer}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.containerTypes.map((ct, i) => (
            <span key={i} className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold">
              {ct}
              <button onClick={() => removeContainer(i)} className="text-slate-400 hover:text-rose-500 text-xs transition-colors">✕</button>
            </span>
          ))}
        </div>
      </SectionCard>

      <SaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  7. NOTIFICATION SETTINGS
// ─────────────────────────────────────────────────────────────

function NotificationSettings({ onSave }) {
  const [form, setForm] = useState(INIT_NOTIFICATIONS);
  const [saving, setSaving] = useState(false);

  const toggle = k => setForm(f => ({ ...f, [k]: !f[k] }));

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); onSave("Notification preferences saved!"); }, 900);
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Alert Preferences" description="Control what events trigger notifications" icon="🔔">
        <Toggle checked={form.emailAlerts} onChange={() => toggle("emailAlerts")}
          label="Email Alerts" desc="Receive order and shipment updates via email" />
        <Toggle checked={form.expiryAlerts} onChange={() => toggle("expiryAlerts")}
          label="Certificate Expiry Alerts" desc="Get notified before certificates expire" />
        <Toggle checked={form.shipmentUpdates} onChange={() => toggle("shipmentUpdates")}
          label="Shipment Status Updates" desc="Real-time status change notifications" />
        <Toggle checked={form.dailyDigest} onChange={() => toggle("dailyDigest")}
          label="Daily Digest Email" desc="Receive a daily summary of all activities" />
        <Toggle checked={form.smsAlerts} onChange={() => toggle("smsAlerts")}
          label="SMS Alerts" desc="Critical alerts via SMS (additional charges may apply)" />
      </SectionCard>

      <SectionCard title="Expiry Alert Timing" description="How many days before expiry to send alerts" icon="📅">
        <div className="max-w-xs">
          <SettingSelect label="Days Before Expiry" value={form.expiryDaysBefore}
            options={[{value:"3",label:"3 days before"},{value:"7",label:"7 days before"},{value:"14",label:"14 days before"},{value:"30",label:"30 days before"}]}
            onChange={e => setForm(f => ({...f, expiryDaysBefore: e.target.value}))} />
        </div>
        <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
          <span className="text-amber-500 text-lg">⚠️</span>
          <p className="text-xs text-amber-700 font-medium">Alerts will be sent {form.expiryDaysBefore} days before any certificate expires. Ensure your email is up to date in General Settings.</p>
        </div>
      </SectionCard>

      <SaveBar onSave={handleSave} saving={saving} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  8. SECURITY SETTINGS
// ─────────────────────────────────────────────────────────────

function SecuritySettings({ onSave }) {
  const [pwForm, setPwForm] = useState({ current:"", newPw:"", confirm:"" });
  const [pwErrors, setPwErrors] = useState({});
  const [twoFA, setTwoFA] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [saving, setSaving] = useState(false);
  const [showPw, setShowPw] = useState({ current:false, newPw:false, confirm:false });

  const validatePw = () => {
    const e = {};
    if (!pwForm.current) e.current = "Current password required";
    if (pwForm.newPw.length < 8) e.newPw = "Minimum 8 characters";
    if (pwForm.newPw !== pwForm.confirm) e.confirm = "Passwords do not match";
    setPwErrors(e);
    return !Object.keys(e).length;
  };

  const handleSavePw = () => {
    if (!validatePw()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setPwForm({ current:"", newPw:"", confirm:"" });
      onSave("Password changed successfully!");
    }, 900);
  };

  const pwStrength = (pw) => {
    if (!pw) return null;
    const score = [pw.length>=8, /[A-Z]/.test(pw), /[0-9]/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
    if (score <= 1) return { label:"Weak", color:"bg-rose-400", w:"w-1/4" };
    if (score === 2) return { label:"Fair", color:"bg-amber-400", w:"w-2/4" };
    if (score === 3) return { label:"Good", color:"bg-teal-400",  w:"w-3/4" };
    return { label:"Strong", color:"bg-emerald-500", w:"w-full" };
  };

  const strength = pwStrength(pwForm.newPw);

  return (
    <div className="space-y-6">
      <SectionCard title="Change Password" description="Update your account password" icon="🔑">
        <div className="max-w-md space-y-4">
          {["current","newPw","confirm"].map(field => (
            <div key={field} className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {field==="current" ? "Current Password" : field==="newPw" ? "New Password" : "Confirm New Password"}
                <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPw[field] ? "text" : "password"}
                  value={pwForm[field]}
                  onChange={e => setPwForm(f => ({...f, [field]: e.target.value}))}
                  placeholder={field==="current" ? "Enter current password" : "Enter password"}
                  className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm text-slate-800 bg-white outline-none transition-all focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400
                    ${pwErrors[field] ? "border-rose-400 bg-rose-50/30" : "border-slate-200 hover:border-slate-300"}`}
                />
                <button type="button" onClick={() => setShowPw(s => ({...s, [field]:!s[field]}))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm">
                  {showPw[field] ? "🙈" : "👁"}
                </button>
              </div>
              {pwErrors[field] && <span className="text-xs text-rose-500">⚠ {pwErrors[field]}</span>}
              {field === "newPw" && strength && (
                <div className="mt-1">
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all ${strength.color} ${strength.w}`} />
                  </div>
                  <p className={`text-[11px] font-semibold mt-1 ${strength.color.replace("bg-","text-")}`}>{strength.label} password</p>
                </div>
              )}
            </div>
          ))}
          <button onClick={handleSavePw} disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 flex items-center gap-2 disabled:opacity-60">
            {saving ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : "Update Password"}
          </button>
        </div>
      </SectionCard>

      <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security to your account" icon="🛡️">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <p className="text-sm font-bold text-slate-700">Enable 2FA</p>
            <p className="text-xs text-slate-400 mt-0.5">Require a verification code on each login</p>
          </div>
          <div className="flex items-center gap-3">
            {twoFA && <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">ENABLED</span>}
            <button type="button" onClick={() => setTwoFA(v => !v)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${twoFA ? "bg-indigo-500" : "bg-slate-200"}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${twoFA ? "left-6" : "left-1"}`} />
            </button>
          </div>
        </div>
        {twoFA && (
          <div className="mt-3 p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700 font-medium">
            📱 2FA is enabled. You will need to verify using your authenticator app on next login.
          </div>
        )}
      </SectionCard>

      <SectionCard title="Session Settings" description="Control automatic logout behavior" icon="⏱️">
        <div className="max-w-xs">
          <SettingSelect label="Session Timeout" value={sessionTimeout}
            options={[{value:"15",label:"15 minutes"},{value:"30",label:"30 minutes"},{value:"60",label:"1 hour"},{value:"120",label:"2 hours"},{value:"never",label:"Never"}]}
            onChange={e => setSessionTimeout(e.target.value)} />
          <p className="text-xs text-slate-400 mt-2">Automatically log out after period of inactivity.</p>
        </div>
        <SaveBar onSave={() => onSave("Security settings saved!")} saving={false} />
      </SectionCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  SETTINGS SIDEBAR
// ─────────────────────────────────────────────────────────────

const SIDEBAR_ITEMS = [
  { id:"general",       label:"General",             icon:"⚙️",  desc:"Company & region"     },
  { id:"users",         label:"User Management",     icon:"👥",  desc:"Roles & permissions"  },
  { id:"exportRules",   label:"Export Rules",        icon:"🌍",  desc:"Country certificates" },
  { id:"certificates",  label:"Certificate Master",  icon:"📋",  desc:"Document types"       },
  { id:"products",      label:"Product Settings",    icon:"🌲",  desc:"Wood types & units"   },
  { id:"logistics",     label:"Logistics",           icon:"⚓",  desc:"Ports & containers"   },
  { id:"notifications", label:"Notifications",       icon:"🔔",  desc:"Alerts & emails"      },
  { id:"security",      label:"Security",            icon:"🛡️",  desc:"Password & 2FA"       },
];

function SettingsSidebar({ active, onChange }) {
  return (
    <aside className="w-64 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-4 py-4 border-b border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Settings</p>
        </div>
        <nav className="py-2">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 group
                ${active === item.id
                  ? "bg-indigo-50 border-r-2 border-indigo-500"
                  : "hover:bg-slate-50 border-r-2 border-transparent"}`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-colors
                ${active === item.id ? "bg-indigo-100" : "bg-slate-100 group-hover:bg-slate-200"}`}>
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className={`text-sm font-semibold truncate transition-colors
                  ${active === item.id ? "text-indigo-700" : "text-slate-700 group-hover:text-slate-900"}`}>
                  {item.label}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{item.desc}</p>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────
//  SETTINGS LAYOUT
// ─────────────────────────────────────────────────────────────

function SettingsLayout() {
  const [activeSection, setActiveSection] = useState("general");
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const activeItem = SIDEBAR_ITEMS.find(i => i.id === activeSection);

  const renderSection = () => {
    const props = { onSave: showToast };
    switch (activeSection) {
      case "general":       return <GeneralSettings      {...props} />;
      case "users":         return <UserManagement       {...props} />;
      case "exportRules":   return <ExportRules          {...props} />;
      case "certificates":  return <CertificateMaster    {...props} />;
      case "products":      return <ProductSettings      {...props} />;
      case "logistics":     return <LogisticsSettings    {...props} />;
      case "notifications": return <NotificationSettings {...props} />;
      case "security":      return <SecuritySettings     {...props} />;
      default:              return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Page header */}
      {/* <div className="bg-white border-b border-slate-200 px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-slate-400">
          <span>Modules</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-700">Settings</span>
          {activeItem && (
            <>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-indigo-600">{activeItem.label}</span>
            </>
          )}
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page title */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-slate-900">⚙️ Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Configure your ERP system preferences and rules</p>
        </div>

        {/* Layout: sidebar + content */}
        <div className="flex gap-7 items-start">
          <SettingsSidebar active={activeSection} onChange={setActiveSection} />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Section header */}
            <div className="mb-5 flex items-center gap-3">
              <div className="w-2 h-7 bg-indigo-500 rounded-full" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">{activeItem?.label}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{activeItem?.desc}</p>
              </div>
            </div>

            {/* Animated section */}
            <div key={activeSection} className="animate-fade-in">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      <style>{`
        @keyframes fade-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes slide-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        .animate-fade-in { animation: fade-in 0.22s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(.2,.8,.4,1); }
      `}</style>
    </div>
  );
}

export default SettingsLayout;