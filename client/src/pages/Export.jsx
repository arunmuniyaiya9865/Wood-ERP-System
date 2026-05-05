// ═══════════════════════════════════════════════════════════════
//  WoodExportERP.jsx  —  Production ERP for Wood Export Business
//  Stack : React functional components + Tailwind CSS
//  Modules: Create Logistics (Exports / Domestic) · Orders Tables
// ═══════════════════════════════════════════════════════════════

import { useState, useMemo, useRef, useCallback, useEffect } from "react";

// ─────────────────────────────────────────────────────────────
//  CONSTANTS & MOCK DATA
// ─────────────────────────────────────────────────────────────

const COUNTRY_CERT_RULES = {
  USA:          ["Phytosanitary Certificate", "Fumigation Certificate"],
  Australia:    ["Phytosanitary Certificate", "Fumigation Certificate", "Certificate of Origin"],
  UK:           ["Phytosanitary Certificate", "Certificate of Origin"],
  Germany:      ["Phytosanitary Certificate", "Certificate of Origin"],
  Japan:        ["Phytosanitary Certificate", "Fumigation Certificate", "Certificate of Origin"],
  China:        ["Phytosanitary Certificate", "Fumigation Certificate"],
  UAE:          ["Certificate of Origin"],
  Singapore:    ["Certificate of Origin", "Fumigation Certificate"],
  Canada:       ["Phytosanitary Certificate", "Fumigation Certificate"],
  "New Zealand":["Phytosanitary Certificate","Fumigation Certificate","Certificate of Origin"],
  DEFAULT:      ["Certificate of Origin"],
};

const COUNTRIES = [
  "USA","Australia","UK","Germany","Japan","China",
  "UAE","Singapore","Canada","New Zealand","India",
  "Malaysia","Indonesia","Thailand","Vietnam",
];

const WOOD_TYPES = [
  "Teak","Rosewood","Mahogany","Pine","Cedar","Walnut",
  "Oak","Bamboo Plank","Eucalyptus","Rubber Wood","Mango Wood",
];

const PORTS = [
  "Chennai Port","Mumbai Port","Nhava Sheva","Cochin Port",
  "Kolkata Port","Tuticorin","Vizag Port","Mundra Port",
];

const INDIAN_STATES = [
  "Tamil Nadu","Karnataka","Maharashtra","Gujarat","Rajasthan",
  "Andhra Pradesh","Telangana","Kerala","Odisha","West Bengal",
  "Punjab","Haryana","Uttar Pradesh","Madhya Pradesh","Bihar",
];

const INDIAN_CITIES = {
  "Tamil Nadu":    ["Chennai","Coimbatore","Madurai","Salem","Trichy"],
  "Karnataka":     ["Bangalore","Mysore","Hubli","Mangalore","Belgaum"],
  "Maharashtra":   ["Mumbai","Pune","Nagpur","Nashik","Aurangabad"],
  "Gujarat":       ["Ahmedabad","Surat","Vadodara","Rajkot","Gandhinagar"],
  "Andhra Pradesh":["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool"],
  "Kerala":        ["Kochi","Thiruvananthapuram","Kozhikode","Thrissur","Kollam"],
  "DEFAULT":       ["City"],
};

const DELIVERY_VEHICLES = ["Truck","Mini Truck","Container","Tempo","Train Wagon"];

const STATUS_OPTIONS    = ["Processing","Packing","In Transit","Delivered","Cancelled"];
const DOM_STATUS_OPTIONS = ["Pending","Dispatched","Out for Delivery","Delivered","Cancelled"];

function genId(prefix) {
  return `${prefix}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
}

const MOCK_EXPORTS = [
  { id:"EXP-4821", buyerName:"Harrington Timber Co", country:"USA",        product:"Teak",        quantity:120, unit:"CBM",  status:"In Transit", date:"2025-04-10", port:"Chennai Port" },
  { id:"EXP-3317", buyerName:"Oakfield Industries",  country:"Australia",  product:"Rosewood",    quantity:85,  unit:"Tons", status:"Processing", date:"2025-04-15", port:"Mumbai Port"  },
  { id:"EXP-7762", buyerName:"Nippon Wood Ltd",      country:"Japan",      product:"Mahogany",    quantity:200, unit:"CBM",  status:"Delivered",  date:"2025-03-28", port:"Cochin Port"  },
  { id:"EXP-2203", buyerName:"Bundesholz GmbH",      country:"Germany",    product:"Pine",        quantity:300, unit:"Tons", status:"Packing",    date:"2025-04-18", port:"Nhava Sheva"  },
  { id:"EXP-9945", buyerName:"Gulf Timber LLC",      country:"UAE",        product:"Cedar",       quantity:60,  unit:"CBM",  status:"Delivered",  date:"2025-03-15", port:"Mumbai Port"  },
  { id:"EXP-5531", buyerName:"SG Timber Pte",        country:"Singapore",  product:"Teak",        quantity:95,  unit:"CBM",  status:"In Transit", date:"2025-04-22", port:"Chennai Port" },
  { id:"EXP-1188", buyerName:"Maple Wood Corp",      country:"Canada",     product:"Walnut",      quantity:140, unit:"Tons", status:"Processing", date:"2025-04-25", port:"Mundra Port"  },
  { id:"EXP-6674", buyerName:"Kiwi Timber NZ",       country:"New Zealand",product:"Eucalyptus",  quantity:75,  unit:"CBM",  status:"Packing",    date:"2025-04-19", port:"Vizag Port"   },
];

const MOCK_DOMESTIC = [
  { id:"DOM-2241", customerName:"Sri Ram Timber",     location:"Chennai, Tamil Nadu",       product:"Teak",         quantity:80,  unit:"CBM",  deliveryStatus:"Delivered",       date:"2025-04-05", vehicle:"Truck"       },
  { id:"DOM-3388", customerName:"Vijaya Wood Works",  location:"Bangalore, Karnataka",      product:"Rosewood",     quantity:120, unit:"Tons", deliveryStatus:"Dispatched",      date:"2025-04-12", vehicle:"Container"   },
  { id:"DOM-5519", customerName:"Lakshmi Traders",    location:"Mumbai, Maharashtra",       product:"Pine",         quantity:60,  unit:"CBM",  deliveryStatus:"Pending",         date:"2025-04-20", vehicle:"Mini Truck"  },
  { id:"DOM-7721", customerName:"Murugan Depot",      location:"Visakhapatnam, Andhra Pradesh",product:"Mahogany", quantity:200, unit:"Tons", deliveryStatus:"Out for Delivery",date:"2025-04-17", vehicle:"Truck"       },
  { id:"DOM-8832", customerName:"Karthik Builders",   location:"Kochi, Kerala",             product:"Teak",         quantity:45,  unit:"CBM",  deliveryStatus:"Delivered",       date:"2025-03-30", vehicle:"Tempo"       },
  { id:"DOM-1104", customerName:"Anand Enterprises",  location:"Ahmedabad, Gujarat",        product:"Bamboo Plank", quantity:300, unit:"Tons", deliveryStatus:"Dispatched",      date:"2025-04-22", vehicle:"Container"   },
  { id:"DOM-4453", customerName:"Rathi Wood House",   location:"Coimbatore, Tamil Nadu",    product:"Cedar",        quantity:55,  unit:"CBM",  deliveryStatus:"Pending",         date:"2025-04-26", vehicle:"Mini Truck"  },
  { id:"DOM-6610", customerName:"Prestige Interiors", location:"Pune, Maharashtra",         product:"Walnut",       quantity:90,  unit:"Tons", deliveryStatus:"Out for Delivery",date:"2025-04-24", vehicle:"Truck"       },
];

const CERT_STATUS_CONFIG = {
  Pending:  { bg:"bg-gray-100",   text:"text-gray-600",   dot:"bg-gray-400"   },
  Uploaded: { bg:"bg-blue-50",    text:"text-blue-700",   dot:"bg-blue-500"   },
  Verified: { bg:"bg-emerald-50", text:"text-emerald-700",dot:"bg-emerald-500" },
};

const ORDER_STATUS_CONFIG = {
  "Processing":      { bg:"bg-blue-50",    text:"text-blue-700",    dot:"bg-blue-500"    },
  "Packing":         { bg:"bg-indigo-50",  text:"text-indigo-700",  dot:"bg-indigo-500"  },
  "In Transit":      { bg:"bg-amber-50",   text:"text-amber-700",   dot:"bg-amber-500"   },
  "Delivered":       { bg:"bg-emerald-50", text:"text-emerald-700", dot:"bg-emerald-500" },
  "Cancelled":       { bg:"bg-red-50",     text:"text-red-700",     dot:"bg-red-500"     },
  "Pending":         { bg:"bg-slate-100",  text:"text-slate-600",   dot:"bg-slate-400"   },
  "Dispatched":      { bg:"bg-cyan-50",    text:"text-cyan-700",    dot:"bg-cyan-500"    },
  "Out for Delivery":{ bg:"bg-orange-50",  text:"text-orange-700",  dot:"bg-orange-500"  },
};

// ─────────────────────────────────────────────────────────────
//  REUSABLE ATOMS
// ─────────────────────────────────────────────────────────────

function FormInput({ label, required, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <input
        {...props}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-white outline-none transition-all duration-200
          focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400
          ${error ? "border-rose-400 bg-rose-50/30" : "border-slate-200 hover:border-slate-300"}
          ${props.disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}`}
      />
      {error && <span className="text-xs text-rose-500 flex items-center gap-1">⚠ {error}</span>}
    </div>
  );
}

function SelectDropdown({ label, required, error, options, placeholder, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-white outline-none transition-all duration-200 cursor-pointer
          focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400 appearance-none
          ${error ? "border-rose-400 bg-rose-50/30" : "border-slate-200 hover:border-slate-300"}`}
        style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center" }}
      >
        <option value="">{placeholder || "Select..."}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <span className="text-xs text-rose-500 flex items-center gap-1">⚠ {error}</span>}
    </div>
  );
}

function StatusBadge({ status, type = "order" }) {
  const cfg = type === "cert" ? CERT_STATUS_CONFIG[status] : ORDER_STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

function FileUpload({ label, onChange, hasFile, error }) {
  const ref = useRef();
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <button
        type="button"
        onClick={() => ref.current.click()}
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm transition-all duration-200 cursor-pointer
          ${hasFile
            ? "border-teal-400 bg-teal-50 text-teal-700"
            : error
              ? "border-rose-400 bg-rose-50/30 text-rose-500"
              : "border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-teal-400 hover:bg-teal-50/30"}`}
      >
        <span className="text-base">{hasFile ? "✓" : "↑"}</span>
        <span className="text-xs font-medium">{hasFile ? "File Uploaded" : "Upload PDF / Image"}</span>
      </button>
      <input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={onChange} />
      {error && <span className="text-xs text-rose-500">⚠ {error}</span>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  CERTIFICATE CARD
// ─────────────────────────────────────────────────────────────

function CertificateCard({ cert, index, onChange, errors }) {
  const isHighlighted = errors?.missingUpload || errors?.missingNumber;
  return (
    <div className={`rounded-2xl border p-5 transition-all duration-300 ${isHighlighted ? "border-rose-300 bg-rose-50/40 shadow-rose-100 shadow-sm" : "border-slate-200 bg-white shadow-sm hover:shadow-md"}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg">📋</span>
            <h4 className="text-sm font-bold text-slate-800">{cert.name}</h4>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 ml-7">Required Document #{index + 1}</p>
        </div>
        <StatusBadge status={cert.status} type="cert" />
      </div>
      {isHighlighted && (
        <div className="mb-3 px-3 py-2 bg-rose-100 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium flex items-center gap-1.5">
          ⚠ This certificate is required before submission
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FileUpload
          label="Upload Document"
          hasFile={!!cert.file}
          error={errors?.missingUpload ? "File required" : null}
          onChange={e => onChange(index, "file", e.target.files[0])}
        />
        <FormInput
          label="Certificate Number"
          placeholder="e.g. CERT-2025-001"
          value={cert.certNumber}
          error={errors?.missingNumber ? "Certificate number required" : null}
          onChange={e => onChange(index, "certNumber", e.target.value)}
        />
        <FormInput label="Issue Date"  type="date" value={cert.issueDate}  onChange={e => onChange(index, "issueDate",  e.target.value)} />
        <FormInput label="Expiry Date" type="date" value={cert.expiryDate} onChange={e => onChange(index, "expiryDate", e.target.value)} />
      </div>
      {cert.file && cert.certNumber && (
        <div className="mt-3 flex justify-end">
          <button type="button" onClick={() => onChange(index, "status", "Uploaded")}
            className="text-xs font-semibold px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            Mark as Uploaded
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  LOGISTICS DROPDOWN
// ─────────────────────────────────────────────────────────────

function LogisticsDropdown({ selectedModule, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const options = [
    { id:"exports",  label:"Exports",  icon:"🚢", desc:"International shipments" },
    { id:"domestic", label:"Domestic", icon:"🚚", desc:"Domestic deliveries"     },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
          open
            ? "border-teal-600 text-teal-700"
            : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
        }`}
      >
        <span>➕</span>
        <span>Create Logistics</span>
        <span className={`text-[10px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▼</span>
      </button>

      {/* Dropdown panel */}
      <div
        className={`absolute left-0 top-full mt-1 z-50 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden transition-all duration-200 origin-top
          ${open ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"}`}
        style={{ transformOrigin: "top" }}
      >
        <div className="py-1.5">
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => { onSelect(opt.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-teal-50 group
                ${selectedModule === opt.id ? "bg-teal-50" : ""}`}
            >
              <span className="text-xl">{opt.icon}</span>
              <div>
                <p className={`text-sm font-semibold ${selectedModule === opt.id ? "text-teal-700" : "text-slate-700 group-hover:text-teal-700"}`}>
                  {opt.label}
                </p>
                <p className="text-[11px] text-slate-400">{opt.desc}</p>
              </div>
              {selectedModule === opt.id && (
                <span className="ml-auto text-teal-600 text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  EXPORT FORM
// ─────────────────────────────────────────────────────────────

const EMPTY_EXPORT_FORM = { buyerName:"", country:"", port:"", product:"", quantity:"", unit:"CBM" };

function ExportForm({ onCreated }) {
  const [form, setForm]             = useState(EMPTY_EXPORT_FORM);
  const [certs, setCerts]           = useState([]);
  const [errors, setErrors]         = useState({});
  const [certErrors, setCertErrors] = useState({});
  const [submitted, setSubmitted]   = useState(false);
  const [prevCountry, setPrevCountry] = useState("");

  const getCertsForCountry = (country) => {
    const rules = COUNTRY_CERT_RULES[country] || COUNTRY_CERT_RULES.DEFAULT;
    return rules.map(name => ({ name, file:null, certNumber:"", issueDate:"", expiryDate:"", status:"Pending" }));
  };

  const handleField = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: "" }));
    if (field === "country" && value !== prevCountry) {
      setCerts(getCertsForCountry(value));
      setCertErrors({});
      setPrevCountry(value);
    }
  };

  const handleCertChange = (i, field, value) => {
    setCerts(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c));
    setCertErrors(e => ({ ...e, [i]: {} }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.buyerName.trim()) newErrors.buyerName = "Buyer name is required";
    if (!form.country)          newErrors.country   = "Country is required";
    if (!form.port)             newErrors.port      = "Port is required";
    if (!form.product)          newErrors.product   = "Product is required";
    if (!form.quantity || isNaN(form.quantity) || +form.quantity <= 0)
                                newErrors.quantity  = "Valid quantity required";
    const newCertErrors = {};
    certs.forEach((c, i) => {
      const ce = {};
      if (!c.file)       ce.missingUpload = true;
      if (!c.certNumber) ce.missingNumber = true;
      if (Object.keys(ce).length) newCertErrors[i] = ce;
    });
    setErrors(newErrors);
    setCertErrors(newCertErrors);
    return Object.keys(newErrors).length === 0 && Object.keys(newCertErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onCreated({
      id: genId("EXP"), buyerName: form.buyerName, country: form.country,
      product: form.product, quantity: +form.quantity, unit: form.unit,
      port: form.port, status: "Processing", date: new Date().toISOString().slice(0, 10),
    });
    setSubmitted(true);
    setTimeout(() => {
      setForm(EMPTY_EXPORT_FORM); setCerts([]); setCertErrors({});
      setErrors({}); setSubmitted(false); setPrevCountry("");
    }, 2500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-4xl">✓</div>
        <h3 className="text-xl font-bold text-slate-800">Export Created Successfully!</h3>
        <p className="text-sm text-slate-400">Redirecting to form...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white text-base">📦</div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Export Shipment Details</h3>
            <p className="text-xs text-slate-400">Fill in the international export information</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormInput label="Buyer Name" required placeholder="e.g. Harrington Timber Co"
            value={form.buyerName} error={errors.buyerName} onChange={e => handleField("buyerName", e.target.value)} />
          <SelectDropdown label="Country" required options={COUNTRIES} placeholder="Select country..."
            value={form.country} error={errors.country} onChange={e => handleField("country", e.target.value)} />
          <SelectDropdown label="Port" required options={PORTS} placeholder="Select port..."
            value={form.port} error={errors.port} onChange={e => handleField("port", e.target.value)} />
          <SelectDropdown label="Product (Wood Type)" required options={WOOD_TYPES} placeholder="Select wood type..."
            value={form.product} error={errors.product} onChange={e => handleField("product", e.target.value)} />
          <FormInput label="Quantity" required type="number" min="1" placeholder="e.g. 120"
            value={form.quantity} error={errors.quantity} onChange={e => handleField("quantity", e.target.value)} />
          <SelectDropdown label="Unit" required options={["CBM", "Tons"]}
            value={form.unit} onChange={e => handleField("unit", e.target.value)} />
        </div>
      </div>

      {form.country && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white text-base">📄</div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Required Certificates for {form.country}</h3>
              <p className="text-xs text-slate-400">{certs.length} certificate{certs.length !== 1 ? "s" : ""} required</p>
            </div>
          </div>
          {Object.keys(certErrors).length > 0 && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 font-medium">
              ⚠ Please upload all required certificates before submitting.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certs.map((cert, i) => (
              <CertificateCard key={cert.name} cert={cert} index={i} onChange={handleCertChange} errors={certErrors[i]} />
            ))}
          </div>
        </div>
      )}

      {!form.country && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-400">
          <div className="text-4xl mb-3">🌍</div>
          <p className="text-sm font-medium">Select a country above to see required certificates</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <button type="button"
          onClick={() => { setForm(EMPTY_EXPORT_FORM); setCerts([]); setErrors({}); setCertErrors({}); setPrevCountry(""); }}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
          Reset Form
        </button>
        <button type="submit"
          className="px-7 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 active:scale-95 transition-all duration-150 shadow-sm shadow-teal-200 flex items-center gap-2">
          <span>Create Export</span><span>→</span>
        </button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
//  DOMESTIC FORM
// ─────────────────────────────────────────────────────────────

const EMPTY_DOM_FORM = { customerName:"", state:"", city:"", product:"", quantity:"", unit:"CBM", vehicle:"Truck", address:"" };

function DomesticForm({ onCreated }) {
  const [form, setForm]   = useState(EMPTY_DOM_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const cities = form.state ? (INDIAN_CITIES[form.state] || INDIAN_CITIES.DEFAULT) : [];

  const handleField = (field, value) => {
    setForm(f => ({ ...f, [field]: value, ...(field === "state" ? { city: "" } : {}) }));
    setErrors(e => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = "Customer name is required";
    if (!form.state)               e.state        = "State is required";
    if (!form.city)                e.city         = "City is required";
    if (!form.product)             e.product      = "Product is required";
    if (!form.quantity || isNaN(form.quantity) || +form.quantity <= 0)
                                   e.quantity     = "Valid quantity required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onCreated({
      id: genId("DOM"), customerName: form.customerName,
      location: `${form.city}, ${form.state}`,
      product: form.product, quantity: +form.quantity, unit: form.unit,
      vehicle: form.vehicle, deliveryStatus: "Pending",
      date: new Date().toISOString().slice(0, 10),
    });
    setSubmitted(true);
    setTimeout(() => { setForm(EMPTY_DOM_FORM); setErrors({}); setSubmitted(false); }, 2500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-4xl">✓</div>
        <h3 className="text-xl font-bold text-slate-800">Domestic Order Created!</h3>
        <p className="text-sm text-slate-400">Redirecting to form...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-base">🚚</div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Domestic Delivery Details</h3>
            <p className="text-xs text-slate-400">Fill in the domestic shipment information</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormInput label="Customer Name" required placeholder="e.g. Sri Ram Timber"
            value={form.customerName} error={errors.customerName} onChange={e => handleField("customerName", e.target.value)} />
          <SelectDropdown label="State" required options={INDIAN_STATES} placeholder="Select state..."
            value={form.state} error={errors.state} onChange={e => handleField("state", e.target.value)} />
          <SelectDropdown label="City" required options={cities} placeholder="Select city..."
            value={form.city} error={errors.city} onChange={e => handleField("city", e.target.value)} />
          <SelectDropdown label="Product (Wood Type)" required options={WOOD_TYPES} placeholder="Select wood type..."
            value={form.product} error={errors.product} onChange={e => handleField("product", e.target.value)} />
          <FormInput label="Quantity" required type="number" min="1" placeholder="e.g. 80"
            value={form.quantity} error={errors.quantity} onChange={e => handleField("quantity", e.target.value)} />
          <SelectDropdown label="Unit" required options={["CBM", "Tons"]}
            value={form.unit} onChange={e => handleField("unit", e.target.value)} />
          <SelectDropdown label="Delivery Vehicle" required options={DELIVERY_VEHICLES}
            value={form.vehicle} onChange={e => handleField("vehicle", e.target.value)} />
          <div className="sm:col-span-2">
            <FormInput label="Delivery Address (Optional)" placeholder="Full delivery address..."
              value={form.address} onChange={e => handleField("address", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button type="button"
          onClick={() => { setForm(EMPTY_DOM_FORM); setErrors({}); }}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
          Reset Form
        </button>
        <button type="submit"
          className="px-7 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 active:scale-95 transition-all duration-150 shadow-sm shadow-indigo-200 flex items-center gap-2">
          <span>Create Domestic Order</span><span>→</span>
        </button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
//  FILTERS
// ─────────────────────────────────────────────────────────────

function Filters({ moduleType, data, filterState, onFilterChange }) {
  const { filterA, filterB, search } = filterState;

  const optionsA = [...new Set(data.map(r => moduleType === "exports" ? r.country : r.location?.split(",")[1]?.trim()))].filter(Boolean);
  const optionsB = [...new Set(data.map(r => moduleType === "exports" ? r.status : r.deliveryStatus))].filter(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 min-w-[200px] flex-1 max-w-xs shadow-sm">
        <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 16 16">
          <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder={moduleType === "exports" ? "Search buyer, product, ID..." : "Search customer, product, ID..."}
          value={search}
          onChange={e => onFilterChange("search", e.target.value)}
          className="bg-transparent outline-none text-sm text-slate-700 placeholder-slate-300 w-full"
        />
        {search && <button onClick={() => onFilterChange("search", "")} className="text-slate-300 hover:text-slate-500 text-xs">✕</button>}
      </div>

      <select value={filterA} onChange={e => onFilterChange("filterA", e.target.value)}
        className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-600 outline-none shadow-sm cursor-pointer hover:border-slate-300">
        <option value="">{moduleType === "exports" ? "All Countries" : "All States"}</option>
        {optionsA.map(c => <option key={c}>{c}</option>)}
      </select>

      <select value={filterB} onChange={e => onFilterChange("filterB", e.target.value)}
        className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-600 outline-none shadow-sm cursor-pointer hover:border-slate-300">
        <option value="">{moduleType === "exports" ? "All Statuses" : "All Delivery Statuses"}</option>
        {optionsB.map(s => <option key={s}>{s}</option>)}
      </select>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  DATA TABLE
// ─────────────────────────────────────────────────────────────

const PER_PAGE = 5;

function DataTable({ data, moduleType }) {
  const [filterState, setFilterState] = useState({ search:"", filterA:"", filterB:"" });
  const [sort, setSort] = useState({ col:"date", dir:"desc" });
  const [page, setPage] = useState(1);

  const handleFilterChange = (key, value) => {
    setFilterState(f => ({ ...f, [key]: value }));
    setPage(1);
  };

  const isExport = moduleType === "exports";

  const EXPORT_COLS = [
    { key:"id",        label:"Order ID"  },
    { key:"buyerName", label:"Buyer"     },
    { key:"country",   label:"Country"   },
    { key:"product",   label:"Product"   },
    { key:"quantity",  label:"Quantity"  },
    { key:"status",    label:"Status"    },
    { key:"date",      label:"Date"      },
  ];

  const DOMESTIC_COLS = [
    { key:"id",             label:"Order ID"        },
    { key:"customerName",   label:"Customer Name"   },
    { key:"location",       label:"Location"        },
    { key:"product",        label:"Product"         },
    { key:"quantity",       label:"Quantity"        },
    { key:"deliveryStatus", label:"Delivery Status" },
    { key:"date",           label:"Date"            },
  ];

  const COLS = isExport ? EXPORT_COLS : DOMESTIC_COLS;

  const processed = useMemo(() => {
    const { search, filterA, filterB } = filterState;
    let rows = [...data];

    if (search) {
      const q = search.toLowerCase();
      if (isExport) {
        rows = rows.filter(r => r.buyerName?.toLowerCase().includes(q) || r.product?.toLowerCase().includes(q) || r.id?.toLowerCase().includes(q));
      } else {
        rows = rows.filter(r => r.customerName?.toLowerCase().includes(q) || r.product?.toLowerCase().includes(q) || r.id?.toLowerCase().includes(q));
      }
    }

    if (filterA) {
      if (isExport) rows = rows.filter(r => r.country === filterA);
      else          rows = rows.filter(r => r.location?.includes(filterA));
    }

    if (filterB) {
      if (isExport) rows = rows.filter(r => r.status === filterB);
      else          rows = rows.filter(r => r.deliveryStatus === filterB);
    }

    rows.sort((a, b) => {
      const av = a[sort.col] ?? "", bv = b[sort.col] ?? "";
      const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? cmp : -cmp;
    });

    return rows;
  }, [data, filterState, sort, isExport]);

  const totalPages = Math.max(1, Math.ceil(processed.length / PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const slice      = processed.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const handleSort = col => {
    setSort(s => ({ col, dir: s.col === col && s.dir === "asc" ? "desc" : "asc" }));
    setPage(1);
  };

  const SortIcon = ({ col }) => {
    if (sort.col !== col) return <span className="text-slate-300 text-xs">↕</span>;
    return <span className="text-teal-500 text-xs">{sort.dir === "asc" ? "↑" : "↓"}</span>;
  };

  const downloadCSV = () => {
    const cols = COLS.map(c => c.key);
    const header = cols.join(",");
    const rows = processed.map(r => cols.map(c => `"${r[c] ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([header + "\n" + rows], { type:"text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${moduleType}_${Date.now()}.csv`;
    a.click();
  };

  const downloadExcel = () => {
    const cols = COLS.map(c => c.key);
    const header = `<tr>${cols.map(c=>`<th>${c}</th>`).join("")}</tr>`;
    const rows = processed.map(r => `<tr>${cols.map(c=>`<td>${r[c]??""}</td>`).join("")}</tr>`).join("");
    const table = `<table>${header}${rows}</table>`;
    const blob = new Blob([`<html><body>${table}</body></html>`], { type:"application/vnd.ms-excel" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${moduleType}_${Date.now()}.xls`;
    a.click();
  };

  const statusKey = isExport ? "status" : "deliveryStatus";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Filters moduleType={moduleType} data={data} filterState={filterState} onFilterChange={handleFilterChange} />
        <div className="flex-1" />
        <button onClick={downloadCSV} className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          <span>📥</span> CSV
        </button>
        <button onClick={downloadExcel} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors shadow-sm ${isExport ? "bg-teal-600 hover:bg-teal-700 shadow-teal-200" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"}`}>
          <span>📊</span> Excel
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {COLS.map(col => (
                  <th key={col.key} onClick={() => handleSort(col.key)}
                    className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap cursor-pointer hover:text-slate-600 select-none">
                    <span className="flex items-center gap-1.5">{col.label} <SortIcon col={col.key} /></span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={COLS.length} className="text-center py-16 text-slate-300 text-sm">No records found</td></tr>
              ) : slice.map((row, i) => (
                <tr key={row.id} className={`border-b border-slate-50 hover:bg-teal-50/20 transition-colors cursor-pointer ${i % 2 === 0 ? "" : "bg-slate-50/30"}`}>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-mono text-[12px] text-slate-500 font-medium">{row.id}</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-semibold text-slate-800 text-[13px]">{isExport ? row.buyerName : row.customerName}</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-slate-600 text-[13px]">{isExport ? row.country : row.location}</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-slate-600 text-[13px]">{row.product}</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-semibold text-slate-800">{row.quantity}
                      <span className="text-[11px] text-slate-400 ml-1">{row.unit}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={row[statusKey]} type="order" />
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="text-slate-500 text-[13px]">{row.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs text-slate-400">
            Showing {Math.min((safePage-1)*PER_PAGE+1, processed.length)}–{Math.min(safePage*PER_PAGE, processed.length)} of {processed.length} records
          </span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={safePage===1}
              className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 text-sm disabled:opacity-30 hover:bg-white transition-colors flex items-center justify-center">←</button>
            {Array.from({length: totalPages}, (_,i) => i+1).filter(n => Math.abs(n-safePage)<=2).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center ${n===safePage ? "bg-teal-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-white"}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={safePage===totalPages}
              className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 text-sm disabled:opacity-30 hover:bg-white transition-colors flex items-center justify-center">→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  TOP NAV
// ─────────────────────────────────────────────────────────────

function TopNav({ activeTab, selectedModule, onTabChange, onModuleSelect }) {
  const staticTabs = [
    { id:"exports",  label:"Export Orders",   icon:"🚢" },
    { id:"domestic", label:"Domestic Orders", icon:"🚚" },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-0 flex items-center gap-1">
      {/* Create Logistics dropdown */}
      <LogisticsDropdown selectedModule={selectedModule} onSelect={(module) => { onModuleSelect(module); onTabChange("create"); }} />

      {/* Static tabs */}
      {staticTabs.map(t => (
        <button key={t.id} onClick={() => onTabChange(t.id)}
          className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === t.id
              ? "border-teal-600 text-teal-700"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
          }`}>
          <span>{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────
//  STATS BAR
// ─────────────────────────────────────────────────────────────

function StatsBar({ exports, domestic }) {
  const stats = [
    { label:"Total Exports",     value: exports.length,                                               color:"text-teal-700",   bg:"bg-teal-50",   icon:"📦" },
    { label:"In Transit",        value: exports.filter(e=>e.status==="In Transit").length,             color:"text-amber-700",  bg:"bg-amber-50",  icon:"🚢" },
    { label:"Delivered (Export)",value: exports.filter(e=>e.status==="Delivered").length,              color:"text-emerald-700",bg:"bg-emerald-50",icon:"✅" },
    { label:"Domestic Orders",   value: domestic.length,                                               color:"text-indigo-700", bg:"bg-indigo-50", icon:"🚚" },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map(s => (
        <div key={s.label} className={`${s.bg} rounded-2xl p-4 border border-white shadow-sm flex items-center gap-4`}>
          <div className="text-2xl">{s.icon}</div>
          <div>
            <p className={`text-2xl font-bold ${s.color} leading-none`}>{s.value}</p>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  ROOT APP
// ─────────────────────────────────────────────────────────────

export default function WoodExportERP() {
  const [activeTab,      setActiveTab]      = useState("exports");   // "create" | "exports" | "domestic"
  const [selectedModule, setSelectedModule] = useState("exports");   // "exports" | "domestic" (for create form)
  const [exportData,     setExportData]     = useState(MOCK_EXPORTS);
  const [domesticData,   setDomesticData]   = useState(MOCK_DOMESTIC);

  const handleExportCreated   = useCallback(exp  => setExportData(prev   => [exp,  ...prev]), []);
  const handleDomesticCreated = useCallback(dom  => setDomesticData(prev => [dom,  ...prev]), []);

  return (
    <div className="min-h-screen font-sans bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center text-white text-lg font-bold">🪵</div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-none">WoodExport ERP</h1>
            <p className="text-[11px] text-slate-400 mt-0.5">Timber & Wood Products — Export Management</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <span className="hidden sm:inline">🗓 {new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"})}</span>
          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">EX</div>
        </div>
      </header>

      {/* Nav */}
      <TopNav
        activeTab={activeTab}
        selectedModule={selectedModule}
        onTabChange={setActiveTab}
        onModuleSelect={setSelectedModule}
      />

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
        <StatsBar exports={exportData} domestic={domesticData} />

        {/* ── CREATE LOGISTICS ── */}
        {activeTab === "create" && selectedModule === "exports" && (
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="w-2 h-6 bg-teal-600 rounded-full" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">Create New Export</h2>
                <p className="text-sm text-slate-400 mt-0.5">Fill in shipment details. Certificates are auto-populated based on destination country.</p>
              </div>
            </div>
            <ExportForm onCreated={handleExportCreated} />
          </div>
        )}

        {activeTab === "create" && selectedModule === "domestic" && (
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="w-2 h-6 bg-indigo-600 rounded-full" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">Create Domestic Order</h2>
                <p className="text-sm text-slate-400 mt-0.5">Fill in domestic delivery details including customer location and vehicle type.</p>
              </div>
            </div>
            <DomesticForm onCreated={handleDomesticCreated} />
          </div>
        )}

        {/* ── EXPORT ORDERS TABLE ── */}
        {activeTab === "exports" && (
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="w-2 h-6 bg-teal-600 rounded-full" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">Export Orders</h2>
                <p className="text-sm text-slate-400 mt-0.5">Search, filter, sort and download all export shipments.</p>
              </div>
            </div>
            <DataTable data={exportData} moduleType="exports" />
          </div>
        )}

        {/* ── DOMESTIC ORDERS TABLE ── */}
        {activeTab === "domestic" && (
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="w-2 h-6 bg-indigo-600 rounded-full" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">Domestic Orders</h2>
                <p className="text-sm text-slate-400 mt-0.5">Search, filter, sort and download all domestic delivery orders.</p>
              </div>
            </div>
            <DataTable data={domesticData} moduleType="domestic" />
          </div>
        )}
      </main>
    </div>
  );
}