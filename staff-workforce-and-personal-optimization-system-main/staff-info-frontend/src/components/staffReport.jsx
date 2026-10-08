import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import * as XLSX from "xlsx";

// ─── API helpers ───────────────────────────────────────────────────────────────
const STAFF_BASE      = "http://localhost:5000/api/staff";
const AWARD_BASE      = "http://localhost:5000/api/award";
const MEMBERSHIP_BASE = "http://localhost:5000/api/membership";
const QUAL_BASE       = "http://localhost:5000/api/qualifications";
const POST_BASE       = "http://localhost:5000/api/additional-posts";
const DESIG_BASE      = "http://localhost:5000/api/designation";
const PUB_BASE        = "http://localhost:5000/api/publications";
const BOOK_BASE       = "http://localhost:5000/api/books";
const CONF_BASE       = "http://localhost:5000/api/conferences";
const EXP_BASE        = "http://localhost:5000/api/experiences";

const getAllStaff         = ()   => fetch(STAFF_BASE).then(r => r.json());
const getAwards          = (id) => fetch(`${AWARD_BASE}/staff/${id}`).then(r => r.ok ? r.json() : []);
const getMembership      = (id) => fetch(`${MEMBERSHIP_BASE}/staff/${id}`).then(r => r.ok ? r.json() : []);
const getQualifications  = (id) => fetch(`${QUAL_BASE}/staff/${id}`).then(r => r.ok ? r.json() : []);
const getAdditionalPosts = (id) => fetch(`${POST_BASE}/staff/${id}`).then(r => r.ok ? r.json() : []);
const getDesignations    = (id) => fetch(`${DESIG_BASE}/staff/${id}`).then(r => r.ok ? r.json() : []);
const getPublications    = (id) => fetch(`${PUB_BASE}/staff/${id}`).then(r => r.ok ? r.json() : []);
const getBooks           = (id) => fetch(`${BOOK_BASE}/staff/${id}`).then(r => r.ok ? r.json() : []);
const getConferences     = (id) => fetch(`${CONF_BASE}/staff/${id}`).then(r => r.ok ? r.json() : []);
const getExperiences     = (id) => fetch(`${EXP_BASE}/staff/${id}`).then(r => r.ok ? r.json() : []);

// ─── Designation helpers ───────────────────────────────────────────────────────
const getActiveDesignation = (designations = []) => {
  if (!designations.length) return "";
  const active = designations.find(d => !d.to_date) || designations[designations.length - 1];
  return active?.designation || "";
};

const fmtDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt) ? d : dt.toLocaleDateString("en-GB");
};

// ─── Sub-filter helpers ────────────────────────────────────────────────────────
const inDateRange = (dateVal, from, to) => {
  if (!dateVal) return false;
  const d = new Date(dateVal);
  if (isNaN(d)) return false;
  const s = from ? new Date(from) : null;
  const e = to   ? new Date(to)   : null;
  if (e) e.setHours(23, 59, 59);
  if (s && d < s) return false;
  if (e && d > e) return false;
  return true;
};

const inYearRange = (yearVal, fromYear, toYear) => {
  const yr = parseInt(yearVal, 10);
  if (isNaN(yr)) return false;
  if (fromYear && yr < parseInt(fromYear, 10)) return false;
  if (toYear   && yr > parseInt(toYear,   10)) return false;
  return true;
};

// ─── Excel palette ─────────────────────────────────────────────────────────────
const SHEET_COLORS = {
  "Overview":          { bg: "1E3A5F", fg: "FFFFFF" },
  "Designations":      { bg: "155724", fg: "FFFFFF" },
  "Qualifications":    { bg: "5C2D91", fg: "FFFFFF" },
  "Additional Posts":  { bg: "7B3F00", fg: "FFFFFF" },
  "Publications":      { bg: "0D4C73", fg: "FFFFFF" },
  "Books & Articles":  { bg: "6B1F1F", fg: "FFFFFF" },
  "Conferences":       { bg: "1A5276", fg: "FFFFFF" },
  "Awards":            { bg: "7D6608", fg: "FFFFFF" },
  "Memberships":       { bg: "117A65", fg: "FFFFFF" },
};

function applyHeaderStyle(ws, headers, sheetName) {
  const { bg, fg } = SHEET_COLORS[sheetName] || { bg: "2C3E50", fg: "FFFFFF" };
  headers.forEach((_, c) => {
    const addr = XLSX.utils.encode_cell({ r: 0, c });
    if (!ws[addr]) return;
    ws[addr].s = {
      font:      { bold: true, color: { rgb: fg }, name: "Arial", sz: 11 },
      fill:      { fgColor: { rgb: bg }, patternType: "solid" },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: {
        top:    { style: "thin", color: { rgb: "FFFFFF" } },
        bottom: { style: "thin", color: { rgb: "FFFFFF" } },
        left:   { style: "thin", color: { rgb: "FFFFFF" } },
        right:  { style: "thin", color: { rgb: "FFFFFF" } },
      },
    };
  });
}

function applyRowStyles(ws, rowCount, colCount) {
  for (let r = 1; r <= rowCount; r++) {
    const rowBg = r % 2 === 0 ? "EBF5FB" : "FFFFFF";
    for (let c = 0; c < colCount; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      if (!ws[addr]) ws[addr] = { t: "s", v: "" };
      ws[addr].s = {
        font:      { name: "Arial", sz: 10 },
        fill:      { fgColor: { rgb: rowBg }, patternType: "solid" },
        alignment: { vertical: "center" },
        border: {
          bottom: { style: "thin", color: { rgb: "D5D8DC" } },
          right:  { style: "thin", color: { rgb: "D5D8DC" } },
        },
      };
    }
  }
}

function makeSheet(headers, rows, sheetName) {
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  applyHeaderStyle(ws, headers, sheetName);
  applyRowStyles(ws, rows.length, headers.length);
  ws["!freeze"] = { xSplit: 0, ySplit: 1, topLeftCell: "A2", activePane: "bottomLeft", state: "frozen" };
  return ws;
}

// ─── Excel Export ──────────────────────────────────────────────────────────────
// staffList is already sorted/filtered from visibleStaff — preserve that order exactly
function exportToExcel(staffList, sections, subFilters) {
  const wb = XLSX.utils.book_new();
  // Use staffList AS-IS (already sorted/filtered by the table view)
  const sorted = staffList;

  const N2 = ["Name", "Designation"];

  if (sections.overview) {
    const h = [...N2, "Staff ID", "Email", "Mobile", "Date of Birth", "Date of Joining", "Specialization", "Street", "City", "District", "State", "Pin Code"];
    const r = sorted.map(s => [
      `${s.firstName} ${s.lastName}`, getActiveDesignation(s._designations),
      s.staffId, s.email, s.mobile, fmtDate(s.dob), fmtDate(s.joiningDate), s.specialization,
      s.street, s.city, s.district, s.state, s.pinCode,
    ]);
    const ws = makeSheet(h, r, "Overview");
    ws["!cols"] = h.map((_, i) => ({ wch: i < 2 ? 28 : 20 }));
    XLSX.utils.book_append_sheet(wb, ws, "Overview");
  }

  if (sections.designations) {
    const sf = subFilters.designations;
    const hasFilter = sf.from || sf.to;
    const h = [...N2, "Staff ID", "From Date", "To Date", "Status"];
    const r = sorted.flatMap(s => (s._designations || [])
      .filter(d => {
        if (!hasFilter) return true;
        return inDateRange(d.from_date, sf.from, sf.to);
      })
      .map(d => [
        `${s.firstName} ${s.lastName}`, d.designation, s.staffId,
        fmtDate(d.from_date), d.to_date ? fmtDate(d.to_date) : "Till Date",
        d.flag === 1 ? "Approved" : "Pending",
      ])
    );
    const ws = makeSheet(h, r, "Designations");
    ws["!cols"] = [{ wch: 28 }, { wch: 28 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws, "Designations");
  }

  if (sections.qualifications) {
    const sf = subFilters.qualifications;
    const hasFilter = sf.fromYear || sf.toYear;
    const h = [...N2, "Staff ID", "Degree", "Major", "College", "University", "Year", "Status"];
    const r = sorted.flatMap(s => (s._qualifications || [])
      .filter(q => {
        if (!hasFilter) return true;
        return inYearRange(q.completedYear, sf.fromYear, sf.toYear);
      })
      .map(q => [
        `${s.firstName} ${s.lastName}`, getActiveDesignation(s._designations), s.staffId,
        q.degree, q.major, q.college, q.university, q.completedYear,
        q.status === 1 ? "Approved" : "Pending",
      ])
    );
    const ws = makeSheet(h, r, "Qualifications");
    ws["!cols"] = [{ wch: 28 }, { wch: 28 }, { wch: 12 }, { wch: 14 }, { wch: 18 }, { wch: 28 }, { wch: 28 }, { wch: 8 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws, "Qualifications");
  }

  if (sections.additionalPosts) {
    const sf = subFilters.additionalPosts;
    const hasFilter = sf.from || sf.to;
    const h = [...N2, "Staff ID", "Post", "From Date", "To Date", "Status"];
    const r = sorted.flatMap(s => (s._additionalPosts || [])
      .filter(p => {
        if (!hasFilter) return true;
        return inDateRange(p.fromDate, sf.from, sf.to);
      })
      .map(p => [
        `${s.firstName} ${s.lastName}`, getActiveDesignation(s._designations), s.staffId,
        p.post, fmtDate(p.fromDate), p.toDate ? fmtDate(p.toDate) : "Till Date",
        p.status === 1 ? "Approved" : "Pending",
      ])
    );
    const ws = makeSheet(h, r, "Additional Posts");
    ws["!cols"] = [{ wch: 28 }, { wch: 28 }, { wch: 12 }, { wch: 28 }, { wch: 14 }, { wch: 14 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, ws, "Additional Posts");
  }

  if (sections.publications) {
    const sf = subFilters.publications;
    const hasFilter = sf.fromYear || sf.toYear;
    const h = [...N2, "Staff ID", "Scope", "Authors", "Paper Title", "Journal Name", "Volume", "Issue", "Page From", "Page To", "Month", "Year", "DOI"];
    const r = sorted.flatMap(s => (s._publications || [])
      .filter(p => {
        if (!hasFilter) return true;
        return inYearRange(p.published_year, sf.fromYear, sf.toYear);
      })
      .map(p => [
        `${s.firstName} ${s.lastName}`, getActiveDesignation(s._designations), s.staffId,
        p.scope, p.authors, p.paper_title, p.journal_name, p.volume_number, p.issue_number,
        p.page_from, p.page_to, p.published_month, p.published_year, p.publicationYearOrDoi,
      ])
    );
    const ws = makeSheet(h, r, "Publications");
    ws["!cols"] = [{ wch: 28 }, { wch: 28 }, { wch: 12 }, { wch: 14 }, { wch: 30 }, { wch: 40 }, { wch: 34 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 10 }, { wch: 8 }, { wch: 26 }];
    XLSX.utils.book_append_sheet(wb, ws, "Publications");
  }

  if (sections.books) {
    const sf = subFilters.books;
    const hasFilter = sf.fromYear || sf.toYear;
    const h = [...N2, "Staff ID", "Type", "Author", "Title", "Publisher", "Publisher Address", "ISBN/ISSN", "Page From", "Page To", "Month", "Year"];
    const r = sorted.flatMap(s => (s._books || [])
      .filter(b => {
        if (!hasFilter) return true;
        return inYearRange(b.year, sf.fromYear, sf.toYear);
      })
      .map(b => [
        `${s.firstName} ${s.lastName}`, getActiveDesignation(s._designations), s.staffId,
        b.type, b.author_name, b.title, b.publisher_name, b.publisher_address, b.isbn_issn,
        b.page_from, b.page_to, b.month, b.year,
      ])
    );
    const ws = makeSheet(h, r, "Books & Articles");
    ws["!cols"] = [{ wch: 28 }, { wch: 28 }, { wch: 12 }, { wch: 18 }, { wch: 26 }, { wch: 36 }, { wch: 28 }, { wch: 28 }, { wch: 18 }, { wch: 8 }, { wch: 8 }, { wch: 10 }, { wch: 8 }];
    XLSX.utils.book_append_sheet(wb, ws, "Books & Articles");
  }

  if (sections.conferences) {
    const sf = subFilters.conferences;
    const hasFilter = sf.from || sf.to;
    const h = [...N2, "Staff ID", "Conference Type", "Activity Type", "Author", "Paper Title", "Conference Title", "Location"];
    const r = sorted.flatMap(s => (s._conferences || [])
      .filter(c => {
        if (!hasFilter) return true;
        return inDateRange(c.conference_date || c.from_date, sf.from, sf.to);
      })
      .map(c => [
        `${s.firstName} ${s.lastName}`, getActiveDesignation(s._designations), s.staffId,
        c.conference_type, c.activity_type, c.author_name, c.paper_title, c.conference_title, c.location,
      ])
    );
    const ws = makeSheet(h, r, "Conferences");
    ws["!cols"] = [{ wch: 28 }, { wch: 28 }, { wch: 12 }, { wch: 16 }, { wch: 18 }, { wch: 26 }, { wch: 36 }, { wch: 36 }, { wch: 22 }];
    XLSX.utils.book_append_sheet(wb, ws, "Conferences");
  }

  if (sections.awards) {
    const sf = subFilters.awards;
    const hasFilter = sf.fromYear || sf.toYear;
    const h = [...N2, "Staff ID", "Award Name", "Awarding Agent", "Year"];
    const r = sorted.flatMap(s => (s._awards || [])
      .filter(a => {
        if (!hasFilter) return true;
        return inYearRange(a.award_year, sf.fromYear, sf.toYear);
      })
      .map(a => [
        `${s.firstName} ${s.lastName}`, getActiveDesignation(s._designations), s.staffId,
        a.award_name, a.awarding_agent, a.award_year,
      ])
    );
    const ws = makeSheet(h, r, "Awards");
    ws["!cols"] = [{ wch: 28 }, { wch: 28 }, { wch: 12 }, { wch: 30 }, { wch: 30 }, { wch: 8 }];
    XLSX.utils.book_append_sheet(wb, ws, "Awards");
  }

  if (sections.memberships) {
    const sf = subFilters.memberships;
    const hasFilter = sf.from || sf.to;
    const h = [...N2, "Staff ID", "Membership Type", "Institution", "Membership ID"];
    const r = sorted.flatMap(s => (s._membership || [])
      .filter(m => {
        if (!hasFilter) return true;
        return inDateRange(m.fromDate || m.from_date, sf.from, sf.to);
      })
      .map(m => [
        `${s.firstName} ${s.lastName}`, getActiveDesignation(s._designations), s.staffId,
        m.membershipType, m.institution, m.membershipId,
      ])
    );
    const ws = makeSheet(h, r, "Memberships");
    ws["!cols"] = [{ wch: 28 }, { wch: 28 }, { wch: 12 }, { wch: 24 }, { wch: 32 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws, "Memberships");
  }

  XLSX.writeFile(wb, `Staff_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

// ─── Section config ────────────────────────────────────────────────────────────
const EXPORT_SECTIONS = [
  { key: "overview",        label: "Overview",         color: "#1E3A5F", filterType: "none" },
  { key: "designations",    label: "Designations",     color: "#155724", filterType: "date" },
  { key: "qualifications",  label: "Qualifications",   color: "#5C2D91", filterType: "year" },
  { key: "additionalPosts", label: "Additional Posts", color: "#7B3F00", filterType: "date" },
  { key: "publications",    label: "Publications",     color: "#0D4C73", filterType: "year" },
  { key: "books",           label: "Books & Articles", color: "#6B1F1F", filterType: "year" },
  { key: "conferences",     label: "Conferences",      color: "#1A5276", filterType: "date" },
  { key: "awards",          label: "Awards",           color: "#7D6608", filterType: "year" },
  { key: "memberships",     label: "Memberships",      color: "#117A65", filterType: "date" },
];

const DEFAULT_SUB_FILTERS = () => ({
  overview:        {},
  designations:    { from: "", to: "" },
  qualifications:  { fromYear: "", toYear: "" },
  additionalPosts: { from: "", to: "" },
  publications:    { fromYear: "", toYear: "" },
  books:           { fromYear: "", toYear: "" },
  conferences:     { from: "", to: "" },
  awards:          { fromYear: "", toYear: "" },
  memberships:     { from: "", to: "" },
});

// ─── SubFilter inline row ──────────────────────────────────────────────────────
const SubFilterRow = ({ sectionKey, filterType, value, onChange }) => {
  const inputStyle = {
    padding: "6px 10px", borderRadius: 7, border: "1.5px solid #c7d2fe",
    fontSize: 12, color: "#1f2937", outline: "none",
    background: "#f8f9ff", width: filterType === "year" ? 85 : 135,
    fontFamily: "inherit",
  };
  const labelStyle = { fontSize: 11, color: "#4f46e5", fontWeight: 700, whiteSpace: "nowrap", letterSpacing: 0.4, textTransform: "uppercase" };

  if (filterType === "year") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 9, flexWrap: "wrap", paddingTop: 9, borderTop: "1px dashed #e0e7ff" }}>
        <span style={labelStyle}>Year Range:</span>
        <input
          type="number"
          placeholder="From"
          min="1900" max="2100"
          value={value.fromYear}
          onChange={e => onChange(sectionKey, { ...value, fromYear: e.target.value })}
          style={inputStyle}
        />
        <span style={{ color: "#a5b4fc", fontSize: 13, fontWeight: 700 }}>→</span>
        <input
          type="number"
          placeholder="To"
          min="1900" max="2100"
          value={value.toYear}
          onChange={e => onChange(sectionKey, { ...value, toYear: e.target.value })}
          style={inputStyle}
        />
        {(value.fromYear || value.toYear) && (
          <button
            onClick={() => onChange(sectionKey, { fromYear: "", toYear: "" })}
            style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: 6, padding: "4px 9px", fontSize: 11, cursor: "pointer", fontWeight: 700 }}>
            ✕
          </button>
        )}
      </div>
    );
  }

  if (filterType === "date") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 9, flexWrap: "wrap", paddingTop: 9, borderTop: "1px dashed #e0e7ff" }}>
        <span style={labelStyle}>Date Range:</span>
        <input
          type="date"
          value={value.from}
          onChange={e => onChange(sectionKey, { ...value, from: e.target.value })}
          style={inputStyle}
        />
        <span style={{ color: "#a5b4fc", fontSize: 13, fontWeight: 700 }}>→</span>
        <input
          type="date"
          value={value.to}
          onChange={e => onChange(sectionKey, { ...value, to: e.target.value })}
          style={inputStyle}
        />
        {(value.from || value.to) && (
          <button
            onClick={() => onChange(sectionKey, { from: "", to: "" })}
            style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", borderRadius: 6, padding: "4px 9px", fontSize: 11, cursor: "pointer", fontWeight: 700 }}>
            ✕
          </button>
        )}
      </div>
    );
  }

  return null;
};

// ─── ExportModal ───────────────────────────────────────────────────────────────
const ExportModal = ({ onConfirm, onCancel, exporting, staffCount }) => {
  const [selected,   setSelected]   = useState(Object.fromEntries(EXPORT_SECTIONS.map(s => [s.key, true])));
  const [subFilters, setSubFilters] = useState(DEFAULT_SUB_FILTERS());

  const toggle    = (key) => setSelected(prev => ({ ...prev, [key]: !prev[key] }));
  const allOn     = Object.values(selected).every(Boolean);
  const anyOn     = Object.values(selected).some(Boolean);
  const toggleAll = () => setSelected(Object.fromEntries(EXPORT_SECTIONS.map(s => [s.key, !allOn])));

  const updateSubFilter = (key, val) => setSubFilters(prev => ({ ...prev, [key]: val }));

  const hasSubFilter = (key) => {
    const sf = subFilters[key];
    if (!sf) return false;
    return Object.values(sf).some(v => v !== "");
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "30px 32px",
        width: 540, maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 40px 100px rgba(0,0,0,0.28)",
        animation: "srFadeUp 0.22s ease",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#166534,#15803d)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(21,128,61,0.3)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#1e3c72" }}>Export to Excel</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
              {staffCount} staff · Select sheets & apply sub-filters
            </div>
          </div>
        </div>

        {/* Info banner */}
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#1d4ed8", lineHeight: 1.6 }}>
          ℹ️ <strong>Sub-filters</strong> narrow rows within each sheet. The staff order in Excel matches what you see in the table (including your sort selection).
        </div>

        {/* Select All */}
        <label style={{
          display: "flex", alignItems: "center", gap: 10, marginBottom: 12,
          cursor: "pointer", padding: "10px 14px", borderRadius: 10,
          background: allOn ? "#f0fdf4" : "#f9fafb",
          border: `1.5px solid ${allOn ? "#86efac" : "#e5e7eb"}`,
          transition: "all 0.15s",
        }}>
          <input type="checkbox" checked={allOn} onChange={toggleAll}
            style={{ width: 16, height: 16, accentColor: "#15803d", cursor: "pointer" }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: "#166534" }}>Select All Sheets</span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#6b7280" }}>
            {Object.values(selected).filter(Boolean).length}/{EXPORT_SECTIONS.length} selected
          </span>
        </label>

        {/* Section list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 20 }}>
          {EXPORT_SECTIONS.map(({ key, label, color, filterType }) => (
            <div key={key} style={{
              borderRadius: 11, border: `1.5px solid ${selected[key] ? "#c7d2fe" : "#e5e7eb"}`,
              background: selected[key] ? "#f8f9ff" : "#fafafa",
              padding: "11px 14px",
              transition: "all 0.15s",
            }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={selected[key]} onChange={() => toggle(key)}
                  style={{ width: 15, height: 15, accentColor: color, cursor: "pointer", flexShrink: 0 }} />
                <span style={{ width: 10, height: 10, borderRadius: 3, background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#374151", fontWeight: selected[key] ? 700 : 400, flex: 1 }}>
                  {label}
                </span>
                {filterType !== "none" && selected[key] && (
                  <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 500 }}>
                    {filterType === "year" ? "📅 Year filter" : "📅 Date filter"}
                  </span>
                )}
                {hasSubFilter(key) && (
                  <span style={{ fontSize: 10, background: "#dbeafe", color: "#1d4ed8", borderRadius: 20, padding: "2px 8px", fontWeight: 700 }}>
                    FILTERED
                  </span>
                )}
              </label>

              {/* Sub-filter only shown when section is selected and has a filter type */}
              {selected[key] && filterType !== "none" && (
                <SubFilterRow
                  sectionKey={key}
                  filterType={filterType}
                  value={subFilters[key]}
                  onChange={updateSubFilter}
                />
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => onConfirm(selected, subFilters)}
            disabled={exporting || !anyOn}
            style={{
              flex: 1, padding: "12px 0", borderRadius: 10,
              background: (exporting || !anyOn) ? "#d1d5db" : "linear-gradient(135deg,#166534,#15803d)",
              color: (exporting || !anyOn) ? "#9ca3af" : "#fff",
              border: "none", fontWeight: 800, fontSize: 14,
              cursor: (exporting || !anyOn) ? "not-allowed" : "pointer",
              boxShadow: (exporting || !anyOn) ? "none" : "0 4px 14px rgba(21,128,61,0.35)",
              transition: "all 0.2s",
            }}>
            {exporting ? "⏳ Exporting…" : `📊 Export ${staffCount} Staff`}
          </button>
          <button onClick={onCancel} disabled={exporting} style={{
            flex: 1, padding: "12px 0", borderRadius: 10,
            background: "#f3f4f6", color: "#374151",
            border: "1.5px solid #d1d5db", fontSize: 14, fontWeight: 600,
            cursor: exporting ? "not-allowed" : "pointer",
          }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── FilterPanel (joining date filter) ────────────────────────────────────────
const FilterPanel = ({ open, onFilter, onReset, isActive }) => {
  const [start, setStart] = useState("");
  const [end,   setEnd]   = useState("");

  useEffect(() => { if (!isActive) { setStart(""); setEnd(""); } }, [isActive]);

  const apply = () => {
    if (!start || !end) { alert("Please select both From and To dates."); return; }
    if (new Date(start) > new Date(end)) { alert("'From Date' must be before 'To Date'."); return; }
    onFilter(start, end);
  };
  const reset = () => { setStart(""); setEnd(""); onReset(); };

  if (!open) return null;

  return (
    <div style={{
      background: "#fff", border: "1.5px solid #c7d2fe", borderRadius: 14,
      padding: "20px 24px", marginBottom: 18,
      boxShadow: "0 4px 20px rgba(79,70,229,0.10)",
      animation: "srFadeDown 0.18s ease",
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#1e3c72", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.2">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Filter by Joining Date
        <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 400 }}>— Filters the staff list shown in the table and exported to Excel</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 160px" }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#4f46e5", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>From Date</label>
          <input type="date" value={start} onChange={e => setStart(e.target.value)}
            style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #c7d2fe", fontSize: 13, outline: "none", boxSizing: "border-box", color: "#1f2937", fontFamily: "inherit" }} />
        </div>
        <div style={{ flex: "1 1 160px" }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#4f46e5", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>To Date</label>
          <input type="date" value={end} onChange={e => setEnd(e.target.value)}
            style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #c7d2fe", fontSize: 13, outline: "none", boxSizing: "border-box", color: "#1f2937", fontFamily: "inherit" }} />
        </div>
        <div style={{ display: "flex", gap: 8, paddingBottom: 1 }}>
          <button onClick={apply} style={{ padding: "9px 22px", borderRadius: 8, background: "#1e3c72", color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
            Apply Filter
          </button>
          {isActive && (
            <button onClick={reset} style={{ padding: "9px 18px", borderRadius: 8, background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
              Clear
            </button>
          )}
        </div>
      </div>
      {isActive && (
        <div style={{ marginTop: 14, fontSize: 12, color: "#4f46e5", background: "#eef2ff", borderRadius: 8, padding: "6px 14px", border: "1px solid #c7d2fe", display: "inline-block" }}>
          ✅ Showing staff who joined between <strong>{fmtDate(start)}</strong> and <strong>{fmtDate(end)}</strong>
        </div>
      )}
    </div>
  );
};

// ─── SortDropdown ──────────────────────────────────────────────────────────────
// Click label → shows a small dropdown: Ascending / Descending / Clear
const SortButton = ({ label, sortKey, currentSort, onSort, onClear }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isActive = currentSort.key === sortKey;
  const dir = isActive ? currentSort.dir : null;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pick = (d) => {
    onSort(sortKey, d);
    setOpen(false);
  };

  const clearSort = (e) => {
    e.stopPropagation();
    onClear();
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          background: isActive ? "#eef2ff" : "none",
          border: isActive ? "1px solid #c7d2fe" : "none",
          borderRadius: 6, cursor: "pointer",
          padding: isActive ? "4px 8px" : "4px 4px",
          fontWeight: 700, fontSize: 13, color: isActive ? "#4f46e5" : "#0a2c5d",
          whiteSpace: "nowrap", transition: "all 0.15s",
        }}>
        {label}
        {isActive && (
          <span style={{ fontSize: 12, marginLeft: 2 }}>
            {dir === "asc" ? "↑" : "↓"}
          </span>
        )}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ marginLeft: 2, opacity: 0.5 }}>
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 200,
          background: "#fff", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.16)",
          border: "1px solid #e0e7ef", minWidth: 170, overflow: "hidden",
          animation: "srFadeUp 0.15s ease",
        }}>
          <div style={{ padding: "6px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", padding: "4px 14px", textTransform: "uppercase", letterSpacing: 0.8 }}>
              Sort by {label}
            </div>
            {[
              { d: "asc",  icon: "↑", text: sortKey === "joiningDate" ? "Oldest First" : "A → Z" },
              { d: "desc", icon: "↓", text: sortKey === "joiningDate" ? "Newest First" : "Z → A" },
            ].map(({ d, icon, text }) => (
              <button key={d} onClick={() => pick(d)} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "9px 14px", background: dir === d ? "#eef2ff" : "transparent",
                border: "none", cursor: "pointer", textAlign: "left", fontSize: 13,
                color: dir === d ? "#4f46e5" : "#374151", fontWeight: dir === d ? 700 : 500,
                transition: "background 0.1s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = dir === d ? "#eef2ff" : "#f9fafb"}
                onMouseLeave={e => e.currentTarget.style.background = dir === d ? "#eef2ff" : "transparent"}
              >
                <span style={{ fontSize: 16, width: 18, textAlign: "center" }}>{icon}</span>
                {text}
                {dir === d && <span style={{ marginLeft: "auto", color: "#4f46e5", fontSize: 12 }}>✓</span>}
              </button>
            ))}
            {isActive && (
              <>
                <div style={{ height: 1, background: "#f3f4f6", margin: "4px 0" }} />
                <button onClick={clearSort} style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "9px 14px", background: "transparent", border: "none",
                  cursor: "pointer", fontSize: 13, color: "#dc2626", fontWeight: 600,
                  transition: "background 0.1s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontSize: 16, width: 18, textAlign: "center" }}>✕</span>
                  Clear Sort
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── ActiveBadges ──────────────────────────────────────────────────────────────
const ActiveBadges = ({ sort, onClearSort, filterRange, isFiltered, onClearFilter }) => {
  const badges = [];
  if (sort.key) {
    const sortLabels = { staffId: "Staff ID", joiningDate: "Joining Date" };
    badges.push(
      <span key="sort" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#7c3aed", background: "#f5f3ff", borderRadius: 20, padding: "5px 12px", border: "1px solid #ddd6fe", fontWeight: 600 }}>
        🔃 {sortLabels[sort.key]} {sort.dir === "asc" ? "↑" : "↓"}
        <button onClick={onClearSort} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontWeight: 800, fontSize: 14, padding: 0, lineHeight: 1 }}>✕</button>
      </span>
    );
  }
  if (isFiltered && filterRange) {
    badges.push(
      <span key="filter" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#4f46e5", background: "#eef2ff", borderRadius: 20, padding: "5px 12px", border: "1px solid #c7d2fe", fontWeight: 600 }}>
        📅 Joined: {fmtDate(filterRange.start)} → {fmtDate(filterRange.end)}
        <button onClick={onClearFilter} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontWeight: 800, fontSize: 14, padding: 0, lineHeight: 1 }}>✕</button>
      </span>
    );
  }
  if (!badges.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
      {badges}
    </div>
  );
};

// ─── AvatarWithHover ───────────────────────────────────────────────────────────
const AvatarWithHover = ({ staff }) => {
  const [show, setShow] = useState(false);
  const [pos,  setPos]  = useState({ x: 0, y: 0 });
  const timer           = useRef(null);
  const photoSrc        = staff.photo ? `http://localhost:5000/uploads/${staff.photo}` : null;
  const initials        = ((staff.firstName || "?")[0] + (staff.lastName || "?")[0]).toUpperCase();

  const onEnter = (e) => {
    if (!photoSrc) return;
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: r.left + r.width / 2, y: r.top });
    timer.current = setTimeout(() => setShow(true), 100);
  };
  const onLeave = () => { clearTimeout(timer.current); setShow(false); };

  return (
    <div style={{ display: "inline-flex", position: "relative" }} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {photoSrc ? (
        <img src={photoSrc} alt={staff.firstName}
          style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", cursor: "pointer", border: "2.5px solid #4f46e5", boxShadow: show ? "0 0 0 3px #e0e7ff" : "none", transition: "box-shadow 0.2s" }}
          onError={e => { e.target.style.display = "none"; }} />
      ) : (
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#4f46e5", border: "2px solid #c7d2fe" }}>
          {initials}
        </div>
      )}
      {show && photoSrc && (
        <div style={{ position: "fixed", left: pos.x - 90, top: pos.y - 180, zIndex: 9999, pointerEvents: "none", animation: "srFadeUp 0.18s ease" }}>
          <div style={{ width: 180, borderRadius: 10, overflow: "hidden", boxShadow: "0 12px 36px rgba(0,0,0,0.22)", border: "2px solid #4f46e5", background: "#fff" }}>
            <img src={photoSrc} alt={staff.firstName} style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }} />
            <div style={{ padding: "8px 10px", background: "#eef2ff" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1e3c72" }}>{staff.firstName} {staff.lastName}</div>
              <div style={{ fontSize: 11, color: "#4f46e5", marginTop: 2 }}>{staff.staffId}</div>
            </div>
          </div>
          <div style={{ width: 0, height: 0, margin: "0 auto", borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderTop: "7px solid #4f46e5" }} />
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// StaffReport — Main Component
// ══════════════════════════════════════════════════════════════════════════════
const StaffReport = () => {
  const [allStaff,     setAllStaff]     = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]); // after joining-date filter
  const [loading,      setLoading]      = useState(true);
  const [exporting,    setExporting]    = useState(false);
  const [showModal,    setShowModal]    = useState(false);
  const [filterOpen,   setFilterOpen]   = useState(false);
  const [isFiltered,   setIsFiltered]   = useState(false);
  const [filterRange,  setFilterRange]  = useState(null);
  const [error,        setError]        = useState("");
  const [sort,         setSort]         = useState({ key: null, dir: "asc" });

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllStaff();
        const list = Array.isArray(data) ? data : [];
        setAllStaff(list);
        setFilteredStaff(list);
      } catch {
        setError("Failed to load staff. Make sure the backend server is running.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Sort handler — explicit direction ──────────────────────────────────────
  const handleSort = (key, dir) => {
    setSort({ key, dir });
  };
  const clearSort = () => setSort({ key: null, dir: "asc" });

  // ── Compute visibleStaff: filteredStaff + sort applied ────────────────────
  const visibleStaff = (() => {
    if (!sort.key) return filteredStaff;
    return [...filteredStaff].sort((a, b) => {
      if (sort.key === "joiningDate") {
        const va = a.joiningDate ? new Date(a.joiningDate).getTime() : 0;
        const vb = b.joiningDate ? new Date(b.joiningDate).getTime() : 0;
        return sort.dir === "asc" ? va - vb : vb - va;
      }
      // staffId
      const va = String(a[sort.key] || "").toLowerCase();
      const vb = String(b[sort.key] || "").toLowerCase();
      return sort.dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  })();

  // ── Filter (joining date) ──────────────────────────────────────────────────
  const handleFilter = (start, end) => {
    const s = new Date(start);
    const e = new Date(end); e.setHours(23, 59, 59);
    setFilteredStaff(allStaff.filter(st => {
      if (!st.joiningDate) return false;
      const d = new Date(st.joiningDate);
      return d >= s && d <= e;
    }));
    setIsFiltered(true);
    setFilterRange({ start, end });
  };

  const handleReset = () => {
    setFilteredStaff(allStaff);
    setIsFiltered(false);
    setFilterRange(null);
  };

  // ── Export ──────────────────────────────────────────────────────────────────
  // visibleStaff is passed directly — it already reflects the joining-date filter
  // AND the current sort order, so Excel output will match exactly what's on screen.
  const handleExportConfirm = async (sections, subFilters) => {
    if (!visibleStaff.length) { alert("No staff to export."); return; }
    setExporting(true);
    try {
      const enriched = await Promise.all(
        visibleStaff.map(async (staff) => {
          const [
            _designations,
            _qualifications,
            _additionalPosts,
            _membership,
            _awards,
            _publications,
            _books,
            _conferences,
          ] = await Promise.all([
            // Always fetch designations (needed for "Designation" column in every sheet)
            getDesignations(staff.staffId).catch(() => []),
            sections.qualifications  ? getQualifications(staff.staffId).catch(() => [])  : Promise.resolve([]),
            sections.additionalPosts ? getAdditionalPosts(staff.staffId).catch(() => []) : Promise.resolve([]),
            sections.memberships     ? getMembership(staff.staffId).catch(() => [])      : Promise.resolve([]),
            sections.awards          ? getAwards(staff.staffId).catch(() => [])          : Promise.resolve([]),
            sections.publications    ? getPublications(staff.staffId).catch(() => [])    : Promise.resolve([]),
            sections.books           ? getBooks(staff.staffId).catch(() => [])           : Promise.resolve([]),
            sections.conferences     ? getConferences(staff.staffId).catch(() => [])     : Promise.resolve([]),
          ]);
          return {
            ...staff,
            _designations,
            _qualifications,
            _additionalPosts,
            _membership,
            _awards,
            _publications,
            _books,
            _conferences,
          };
        })
      );
      // Pass enriched in the exact order of visibleStaff (filter + sort preserved)
      exportToExcel(enriched, sections, subFilters);
      setShowModal(false);
    } catch (err) {
      alert("Export failed: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  // ── Styles ──────────────────────────────────────────────────────────────────
  const th = {
    padding: "14px 16px", background: "#eef2ff", fontWeight: 700, fontSize: 13,
    color: "#0a2c5d", textAlign: "left", whiteSpace: "nowrap",
  };
  const td = {
    padding: "13px 16px", fontSize: 14, color: "#1f2937",
    borderBottom: "1px solid #eee", verticalAlign: "middle",
  };

  return (
    <>
      <style>{`
        @keyframes srFadeUp   { from{opacity:0;transform:translateY(10px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes srFadeDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes srPulse    { 0%,100%{opacity:1} 50%{opacity:0.45} }
        .sr-row:hover td { background: #f0f4ff !important; transition: background 0.12s; }
        .sr-btn { transition: transform 0.18s, box-shadow 0.18s; }
        .sr-btn:hover:not(:disabled) { transform: translateY(-1px); }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fb" }}>
        <Sidebar />

        <div style={{ flex: 1, marginLeft: "260px", padding: "30px 40px" }}>

          {/* ── Title + Toolbar ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ color: "#111", fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Staff Report</h2>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>
                {!loading && (
                  <>
                    {visibleStaff.length} staff member{visibleStaff.length !== 1 ? "s" : ""}
                    {isFiltered && <span style={{ color: "#4f46e5", fontWeight: 600 }}> · filtered</span>}
                    {sort.key && <span style={{ color: "#7c3aed", fontWeight: 600 }}> · sorted</span>}
                  </>
                )}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* Filter toggle */}
              <button
                className="sr-btn"
                onClick={() => setFilterOpen(o => !o)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "9px 18px", borderRadius: 9, cursor: "pointer",
                  border: (filterOpen || isFiltered) ? "2px solid #4f46e5" : "1.5px solid #d1d5db",
                  background: (filterOpen || isFiltered) ? "#eef2ff" : "#fff",
                  color: (filterOpen || isFiltered) ? "#4f46e5" : "#374151",
                  fontWeight: 700, fontSize: 14,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                {filterOpen ? "Hide Filter" : "Filter by Date"}
                {isFiltered && !filterOpen && (
                  <span style={{ background: "#4f46e5", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 11 }}>ON</span>
                )}
              </button>

              {/* Export */}
              <button
                className="sr-btn"
                onClick={() => { if (visibleStaff.length) setShowModal(true); }}
                disabled={visibleStaff.length === 0}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "9px 22px", borderRadius: 9,
                  background: visibleStaff.length === 0 ? "#9ca3af" : "linear-gradient(135deg,#166534,#15803d)",
                  color: "#fff", border: "none", fontWeight: 700, fontSize: 14,
                  cursor: visibleStaff.length === 0 ? "not-allowed" : "pointer",
                  boxShadow: visibleStaff.length === 0 ? "none" : "0 4px 12px rgba(22,101,52,0.28)",
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Excel
                {visibleStaff.length > 0 && (
                  <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "1px 7px", fontSize: 12 }}>
                    {visibleStaff.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ── Filter panel ── */}
          <FilterPanel open={filterOpen} onFilter={handleFilter} onReset={handleReset} isActive={isFiltered} />

          {/* ── Active badges ── */}
          <ActiveBadges
            sort={sort}
            onClearSort={clearSort}
            filterRange={filterRange}
            isFiltered={isFiltered}
            onClearFilter={() => { handleReset(); }}
          />

          {/* ── Error ── */}
          {error && (
            <div style={{ background: "#fee2e2", color: "#dc2626", borderRadius: 10, padding: "12px 18px", fontSize: 14, marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          {/* ── Table ── */}
          <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "#9ca3af" }}>
                <div style={{ fontSize: 32, marginBottom: 10, animation: "srPulse 1.2s infinite" }}>⏳</div>
                <div style={{ fontSize: 15 }}>Loading staff data…</div>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ ...th, textAlign: "center", width: 54 }}>Photo</th>
                      <th style={th}>
                        <SortButton
                          label="Staff ID"
                          sortKey="staffId"
                          currentSort={sort}
                          onSort={handleSort}
                          onClear={clearSort}
                        />
                      </th>
                      <th style={th}>Name</th>
                      <th style={th}>Email</th>
                      <th style={th}>Mobile</th>
                      <th style={th}>Specialization</th>
                      <th style={th}>
                        <SortButton
                          label="Joining Date"
                          sortKey="joiningDate"
                          currentSort={sort}
                          onSort={handleSort}
                          onClear={clearSort}
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleStaff.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", padding: "52px 20px", color: "#9ca3af" }}>
                          <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
                          <div style={{ fontWeight: 700, fontSize: 15, color: "#374151" }}>No staff found</div>
                          <div style={{ fontSize: 13, marginTop: 4 }}>
                            {isFiltered ? "No staff joined in that date range." : "No staff records available."}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      visibleStaff.map((staff, i) => (
                        <tr key={staff.staffId} className="sr-row"
                          style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                          <td style={{ ...td, textAlign: "center", padding: "10px 12px" }}>
                            <AvatarWithHover staff={staff} />
                          </td>
                          <td style={td}>
                            <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, background: "#eef2ff", color: "#1e3c72", padding: "3px 9px", borderRadius: 6, letterSpacing: 0.4 }}>
                              {staff.staffId}
                            </span>
                          </td>
                          <td style={{ ...td, fontWeight: 600 }}>{staff.firstName} {staff.lastName}</td>
                          <td style={td}>
                            <a href={`mailto:${staff.email}`} style={{ color: "#4f46e5", textDecoration: "none", fontSize: 13 }}>
                              {staff.email}
                            </a>
                          </td>
                          <td style={{ ...td, color: "#6b7280", fontSize: 13 }}>{staff.mobile || "—"}</td>
                          <td style={td}>
                            {staff.specialization ? (
                              <span style={{ background: "#f0fdf4", color: "#166534", borderRadius: 20, padding: "3px 11px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                                {staff.specialization}
                              </span>
                            ) : <span style={{ color: "#9ca3af" }}>—</span>}
                          </td>
                          <td style={{ ...td, color: "#6b7280", fontSize: 13 }}>
                            {fmtDate(staff.joiningDate)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Result count */}
          {!loading && visibleStaff.length > 0 && (
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 10, textAlign: "right" }}>
              Showing {visibleStaff.length} staff member{visibleStaff.length !== 1 ? "s" : ""}
              {isFiltered ? " · filtered by joining date" : ""}
              {sort.key ? ` · sorted by ${sort.key === "staffId" ? "Staff ID" : "Joining Date"} (${sort.dir === "asc" ? "↑" : "↓"})` : ""}
            </div>
          )}

        </div>
      </div>

      {/* ── Export Modal ── */}
      {showModal && (
        <ExportModal
          exporting={exporting}
          staffCount={visibleStaff.length}
          onConfirm={handleExportConfirm}
          onCancel={() => { if (!exporting) setShowModal(false); }}
        />
      )}
    </>
  );
};

export default StaffReport;