import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import JSZip from "jszip";
import jsPDF from "jspdf";
import { getAllStaff, searchStaff, getMyDesignations } from "../api/staffApi";
import { getPublicationsByStaff } from "../api/publicationApi";
import { getBooksByStaff } from "../api/bookApi";
import { getAwardsByStaff } from "../api/awardApi";
import { getMembershipByStaff } from "../api/membershipApi";
import { getMyExperiences } from "../api/experienceApi";
import { getMyAdditionalPosts } from "../api/additionalPostApi";
import { getMyQualifications } from "../api/qualificationApi";
import { getMyConferences } from "../api/conferenceApi";
import Sidebar from "./Sidebar";

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const formatDate = (date) => {
  if (!date) return "Present";
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const calcYears = (startDate, endDate = null) => {
  if (!startDate) return 0;
  const start = new Date(startDate);
  const end   = endDate ? new Date(endDate) : new Date();
  let years = end.getFullYear() - start.getFullYear();
  const md = end.getMonth() - start.getMonth();
  if (md < 0 || (md === 0 && end.getDate() < start.getDate())) years--;
  return years;
};

const formatDateShort = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

/* ═══════════════════════════════════════════════
   BUILD PDF  (identical to ViewDetails buildPDF)
═══════════════════════════════════════════════ */
const buildPDF = async (data) => {
  const {
    staff, academicYears, industryYears, currentDesignation, qualificationText,
    publications, conferences, awards, memberships,
    internationalPubs, nationalPubs, bookList, articleList,
    nationalConferences, internationalConferences,
  } = data;

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const W = 210, ML = 14, MR = 14, TW = W - ML - MR;
  let y = 0;

  const IND = { left: ML + 4, bullet: ML + 6, text: ML + 10, hang: ML + 12 };

  const C = {
    navy      : [26, 37, 87],
    blue      : [46, 91, 220],
    blueLight : [235, 241, 255],
    slate     : [74, 85, 104],
    slateLight: [241, 245, 249],
    mid       : [113, 128, 150],
    white     : [255, 255, 255],
    divider   : [220, 226, 240],
    gold      : [255, 195, 0],
    goldBg    : [255, 251, 235],
    goldBdr   : [253, 230, 138],
  };

  const fill   = (c) => doc.setFillColor(...c);
  const stroke = (c) => doc.setDrawColor(...c);
  const color  = (c) => doc.setTextColor(...c);
  const lw     = (w) => doc.setLineWidth(w);
  const txt    = (text, x, cy, opts = {}) => doc.text(String(text ?? ""), x, cy, opts);

  const wrappedText = (text, x, cy, maxW, lineH, indentX = x) => {
    const lines = doc.splitTextToSize(String(text ?? ""), maxW);
    lines.forEach((l, i) => txt(l, i === 0 ? x : indentX, cy + i * lineH));
    return cy + lines.length * lineH;
  };

  const checkPage = (needed = 10) => {
    if (y + needed > 278) { doc.addPage(); y = 14; }
  };

  const sectionTitle = (label) => {
    checkPage(14);
    fill(C.navy); doc.rect(ML, y, TW, 7.5, "F");
    fill(C.blue); doc.rect(ML, y, 3.5, 7.5, "F");
    color(C.white); doc.setFont("helvetica", "bold"); doc.setFontSize(13);
    txt(label.toUpperCase(), ML + 8, y + 5.2);
    y += 11;
    color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(15);
  };

  const subTitle = (label) => {
    checkPage(9);
    fill(C.blueLight); doc.rect(ML, y, TW, 6, "F");
    lw(0); stroke(C.divider);
    color(C.blue); doc.setFont("helvetica", "bolditalic"); doc.setFontSize(8.5);
    txt(label, ML + 5, y + 4.2);
    y += 9;
    doc.setFont("helvetica", "normal"); color(C.slate);
  };

  /* ── HEADER ── */
  const HDR_H = 50;
  fill(C.navy); doc.rect(0, 0, W, HDR_H, "F");
  fill(C.blue); doc.rect(0, HDR_H, W, 2, "F");

  const PHX = ML, PHY = 7, PHR = 18;
  if (staff.photoBase64) {
    try {
      doc.addImage(staff.photoBase64, "JPEG", PHX, PHY, PHR * 2, PHR * 2, "", "FAST");
      stroke(C.blue); lw(0.8); doc.circle(PHX + PHR, PHY + PHR, PHR + 1, "S");
    } catch {
      fill([32, 46, 104]); stroke(C.blue); lw(0.8);
      doc.circle(PHX + PHR, PHY + PHR, PHR, "FD");
      color(C.blueLight); doc.setFont("helvetica", "bold"); doc.setFontSize(14);
      txt(`${staff.firstName?.[0]||""}${staff.lastName?.[0]||""}`, PHX + PHR, PHY + PHR + 4, { align: "center" });
    }
  } else {
    fill([32, 46, 104]); stroke(C.blue); lw(0.8);
    doc.circle(PHX + PHR, PHY + PHR, PHR, "FD");
    color(C.blueLight); doc.setFont("helvetica", "bold"); doc.setFontSize(14);
    txt(`${staff.firstName?.[0]||""}${staff.lastName?.[0]||""}`, PHX + PHR, PHY + PHR + 4, { align: "center" });
  }

  const HX = ML + PHR * 2 + 8;
  color(C.white); doc.setFont("helvetica", "bold"); doc.setFontSize(18);
  txt(`${staff.firstName || ""} ${staff.lastName || ""}`, HX, 17);
  color(C.blueLight); doc.setFont("helvetica", "bold"); doc.setFontSize(9.5);
  txt(currentDesignation || "Faculty Member", HX, 24);
  color([160, 180, 230]); doc.setFont("helvetica", "italic"); doc.setFontSize(8);
  txt(qualificationText || "", HX, 30);
  color([190, 205, 240]); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
  txt(`Email : ${staff.email || "—"}`, HX, 37);
  txt(`Phone : ${staff.mobile || "—"}`, HX, 43);
  y = HDR_H + 6;

  /* ── STATS ROW ── */
  const STAT_H = 18;
  fill(C.white); lw(0.3); stroke(C.divider);
  doc.rect(ML, y, TW, STAT_H, "FD");
  const stats = [
    { v: `${academicYears}+`, l: "Academic Yrs" },
    { v: industryYears,        l: "Industry Yrs"  },
    { v: publications.length,  l: "Publications"  },
    { v: conferences.length,   l: "Conferences"   },
    { v: awards.length,        l: "Awards"        },
    { v: memberships.length,   l: "Memberships"   },
  ];
  const SW = TW / stats.length;
  stats.forEach((s, i) => {
    const sx = ML + i * SW;
    if (i > 0) { lw(0.25); stroke(C.divider); doc.line(sx, y + 2, sx, y + STAT_H - 2); }
    color(C.blue); doc.setFont("helvetica", "bold"); doc.setFontSize(13);
    txt(String(s.v), sx + SW / 2, y + 9.5, { align: "center" });
    color(C.mid); doc.setFont("helvetica", "normal"); doc.setFontSize(6);
    txt(s.l.toUpperCase(), sx + SW / 2, y + 14.5, { align: "center" });
  });
  y += STAT_H + 5;

  /* ── PERSONAL INFO ── */
  const INFO_H = 28;
  fill(C.white); lw(0.3); stroke(C.divider);
  doc.rect(ML, y, TW, INFO_H, "FD");
  fill(C.slateLight); doc.rect(ML, y, TW, 6, "F");
  color(C.navy); doc.setFont("helvetica", "bold"); doc.setFontSize(7.5);
  txt("PERSONAL INFORMATION", ML + 5, y + 4.2);
  const infoPairs = [
    ["Staff ID",        staff.staffId || "—"],
    ["Specialization",  staff.specialization || "—"],
    ["Date of Birth",   formatDate(staff.dob)],
    ["Date of Joining", formatDate(staff.joiningDate)],
    ["Mobile",          staff.mobile || "—"],
  ];
  infoPairs.forEach(([label, value], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const ix = ML + 5 + col * (TW / 2), iy = y + 10 + row * 6;
    color(C.mid); doc.setFont("helvetica", "bold"); doc.setFontSize(7.5);
    txt(label + ":", ix, iy);
    color(C.navy); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
    txt(value, ix + 34, iy);
  });
  y += INFO_H + 5;

  /* ── 1. ADDRESS ── */
  if (staff.street) {
    sectionTitle("1. Contact Address");
    fill(C.slateLight); lw(0); doc.rect(ML, y, TW, 18, "F");
    fill(C.blue); doc.rect(ML, y, 3, 18, "F");
    const addr = [
      staff.street,
      `${staff.city || ""}, ${staff.district || ""} – ${staff.pinCode || ""}`,
      staff.state || "",
    ].filter(Boolean).join("\n");
    color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    wrappedText(addr, IND.text, y + 6, TW - 16, 5.5);
    y += 22;
  }

  /* ── 2. PUBLICATIONS ── */
  if (internationalPubs.length > 0 || nationalPubs.length > 0) {
    sectionTitle("2. Research Publications");
    let idx = 1;
    const renderPub = (pub, n, hasDoi) => {
      checkPage(14);
      const line = hasDoi
        ? `${n}. ${pub.authors || ""}, "${pub.paper_title || ""}", ${pub.journal_name || ""}, Vol.${pub.volume_number || ""}, No.${pub.issue_number || ""}, pp.${pub.page_from || ""}–${pub.page_to || ""}, ${pub.published_month || ""} ${pub.published_year || ""}. DOI: ${pub.publicationYearOrDoi || ""}.`
        : `${n}. ${pub.authors || ""}, "${pub.paper_title || ""}", ${pub.journal_name || ""}, Vol.${pub.volume_number || ""}, No.${pub.issue_number || ""}, pp.${pub.page_from || ""}–${pub.page_to || ""}, ${pub.published_month || ""} ${pub.published_year || ""}.`;
      color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
      y = wrappedText(line, IND.bullet, y, TW - 14, 5, IND.hang) + 4;
    };
    if (internationalPubs.length > 0) { subTitle("International Journals"); internationalPubs.forEach((pub) => renderPub(pub, idx++, !!pub.publicationYearOrDoi)); }
    if (nationalPubs.length > 0)      { subTitle("National Journals");       nationalPubs.forEach((pub) => renderPub(pub, idx++, false)); }
    y += 2;
  }

  /* ── 3. BOOKS ── */
  if (bookList.length > 0) {
    sectionTitle("3. Books Authored");
    bookList.forEach((book, i) => {
      checkPage(14);
      const line = `${i + 1}. ${book.author_name || ""}, ${book.title || ""}${book.publisher_name ? ", " + book.publisher_name : ""}${book.isbn_issn ? ", ISBN: " + book.isbn_issn : ""}${book.page_from && book.page_to ? ", pp." + book.page_from + "–" + book.page_to : ""}, ${book.month || ""} ${book.year || ""}.`;
      color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
      y = wrappedText(line, IND.bullet, y, TW - 14, 5, IND.hang) + 4;
    });
    y += 2;
  }

  /* ── 4. ARTICLES ── */
  if (articleList.length > 0) {
    sectionTitle("4. Popular Articles");
    articleList.forEach((a, i) => {
      checkPage(14);
      const line = `${i + 1}. ${a.author_name || ""}, "${a.title || ""}", ${a.publisher_name || ""}${a.publisher_address ? ", " + a.publisher_address : ""}${a.isbn_issn ? ", " + a.isbn_issn : ""}, ${a.month || ""} ${a.year || ""}.`;
      color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
      y = wrappedText(line, IND.bullet, y, TW - 14, 5, IND.hang) + 4;
    });
    y += 2;
  }

  /* ── 5. CONFERENCES ── */
  if (nationalConferences.length > 0 || internationalConferences.length > 0) {
    sectionTitle("5. Conference Presentations");
    let ci = 1;
    const renderConf = (c, n) => {
      checkPage(12);
      const line = c.activity_type === "Paper Published"
        ? `${n}. ${c.author_name || ""}, "${c.paper_title || ""}", ${c.conference_title || ""}${c.location ? ", " + c.location : ""}.`
        : `${n}. ${c.conference_title || ""}${c.location ? ", " + c.location : ""}.`;
      color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
      y = wrappedText(line, IND.bullet, y, TW - 14, 5, IND.hang) + 4;
    };
    if (nationalConferences.length > 0)      { subTitle("National Conferences");      nationalConferences.forEach((c) => renderConf(c, ci++)); }
    if (internationalConferences.length > 0) { subTitle("International Conferences"); internationalConferences.forEach((c) => renderConf(c, ci++)); }
    y += 2;
  }

  /* ── 6. AWARDS ── */
  if (awards.length > 0) {
    sectionTitle("6. Awards & Honors");
    awards.forEach((a) => {
      checkPage(14);
      fill(C.goldBg); lw(0.3); stroke(C.goldBdr);
      doc.roundedRect(ML, y, TW, 11, 1.5, 1.5, "FD");
      fill(C.gold); lw(0); doc.rect(ML, y, 3, 11, "F");
      color(C.navy); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
      txt(a.award_name || "", IND.text, y + 5);
      color([146, 100, 20]); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
      txt(a.awarding_agent || "", ML + 8, y + 9.2);
      if (a.award_year) {
        fill(C.gold); lw(0);
        doc.roundedRect(ML + TW - 18, y + 2.5, 14, 6, 1, 1, "F");
        color(C.navy); doc.setFont("helvetica", "bold"); doc.setFontSize(8);
        txt(String(a.award_year), ML + TW - 11, y + 7, { align: "center" });
      }
      y += 14;
    });
    y += 2;
  }

  /* ── 7. MEMBERSHIPS ── */
  if (memberships.length > 0) {
    sectionTitle("7. Professional Memberships");
    memberships.forEach((m) => {
      checkPage(14);
      fill(C.blueLight); lw(0.3); stroke(C.divider);
      doc.roundedRect(ML, y, TW, 11, 1.5, 1.5, "FD");
      fill(C.blue); lw(0); doc.rect(ML, y, 3, 11, "F");
      fill(C.blue); doc.circle(ML + 9, y + 5.5, 2, "F");
      color(C.navy); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
      txt(m.membershipType || "", ML + 15, y + 4.8);
      color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
      txt(m.institution || "", ML + 15, y + 9);
      color(C.mid); doc.setFontSize(7.5);
      txt(`ID: ${m.membershipId || ""}`, ML + TW - 4, y + 6.5, { align: "right" });
      y += 14;
    });
    y += 2;
  }

  /* ── FOOTER ── */
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    fill(C.navy); doc.rect(0, 287, W, 10, "F");
    fill(C.blue);  doc.rect(0, 287, W, 1.5, "F");
    color([160, 180, 230]); doc.setFont("helvetica", "normal"); doc.setFontSize(7);
    txt(
      `Generated on ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}  |  Faculty Profile Document`,
      ML, 293
    );
    color(C.blueLight); doc.setFont("helvetica", "bold"); doc.setFontSize(7);
    txt(`Page ${p} of ${totalPages}`, W - MR, 293, { align: "right" });
  }

  return doc;
};

/* ═══════════════════════════════════════════════
   PHOTO → BASE64
═══════════════════════════════════════════════ */
const photoToBase64 = (url) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = img.width;
      canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });

/* ═══════════════════════════════════════════════
   FETCH ALL DATA FOR ONE STAFF MEMBER
═══════════════════════════════════════════════ */
const fetchStaffFullData = async (staffId) => {
  const [des, qual, addPosts, pubs, bks, awds, mems, exps, confs] =
    await Promise.all([
      getMyDesignations(staffId),
      getMyQualifications(staffId),
      getMyAdditionalPosts(staffId),
      getPublicationsByStaff(staffId),
      getBooksByStaff(staffId),
      getAwardsByStaff(staffId),
      getMembershipByStaff(staffId),
      getMyExperiences(staffId),
      getMyConferences(staffId),
    ]);

  const designations    = des.filter((d) => d.flag === 1);
  const qualifications  = qual.filter((q) => q.status === 1);
  const additionalPosts = addPosts.filter((p) => p.status === 1);
  const experiences     = exps;
  const publications    = pubs;
  const conferences     = confs;
  const awards          = awds;
  const memberships     = mems;
  const books           = bks;

  const industryYears = experiences
    .filter((e) => e.type === "industry")
    .reduce((t, e) => t + calcYears(e.from_date, e.to_date), 0);

  const qualificationText = qualifications
    .sort((a, b) => b.completedYear - a.completedYear)
    .map((q) => `${q.degree}${q.major ? ` (${q.major})` : ""}`)
    .join(", ");

  const currentDesignation = [...designations, ...additionalPosts]
    .filter((d) => !d.to_date && !d.toDate)
    .map((d) => d.designation || d.post)
    .join(" & ");

  const internationalPubs        = publications.filter((p) => p.scope === "International");
  const nationalPubs             = publications.filter((p) => p.scope === "National");
  const bookList                 = books.filter((b) => b.type?.toLowerCase() === "book");
  const articleList              = books.filter((b) => b.type?.toLowerCase() === "popular article");
  const nationalConferences      = conferences.filter((c) => c.conference_type === "National");
  const internationalConferences = conferences.filter((c) => c.conference_type === "International");

  return {
    industryYears, qualificationText, currentDesignation,
    publications, conferences, awards, memberships,
    internationalPubs, nationalPubs, bookList, articleList,
    nationalConferences, internationalConferences,
  };
};

/* ═══════════════════════════════════════════════
   STAFF LIST COMPONENT
═══════════════════════════════════════════════ */
const StaffList = () => {
  const [staffList,    setStaffList]    = useState([]);
  const [allStaff,     setAllStaff]     = useState([]);
  const [search,       setSearch]       = useState("");
  const [error,        setError]        = useState(null);
  const [bulkProgress, setBulkProgress] = useState(null);

  const fetchStaffData = async () => {
    try {
      const staff = await getAllStaff();
      setStaffList(staff);
      setAllStaff(staff);
      setError(null);
    } catch (e) {
      setError(e.message || "Failed to load staff");
    }
  };

  useEffect(() => { fetchStaffData(); }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
    try {
      const trimmed = value.trim();
      if (!trimmed) { await fetchStaffData(); }
      else {
        const results = await searchStaff(trimmed);
        setStaffList(results);
      }
    } catch (err) {
      console.error("Search error:", err);
      setStaffList([]);
    }
  };

  /* ── Excel export ── */
  const handleExport = () => {
    const headers = [
      "Staff ID","First Name","Last Name","Email","Mobile",
      "Date of Birth","Joining Date","Specialization",
      "Street","City","District","State","Pin Code","Status",
    ];
    const rows = allStaff.map((s) => [
      s.staffId, s.firstName, s.lastName, s.email || "", s.mobile || "",
      formatDateShort(s.dob), formatDateShort(s.joiningDate),
      s.specialization || "", s.street || "", s.city || "",
      s.district || "", s.state || "", s.pinCode || "",
      s.flag === 1 ? "Inactive" : "Active",
    ]);
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    worksheet["!cols"] = [
      {wch:12},{wch:15},{wch:15},{wch:28},{wch:14},
      {wch:16},{wch:16},{wch:20},{wch:20},{wch:14},
      {wch:14},{wch:14},{wch:10},{wch:12},
    ];
    headers.forEach((_, ci) => {
      const ref = XLSX.utils.encode_cell({ r: 0, c: ci });
      if (!worksheet[ref]) worksheet[ref] = {};
      worksheet[ref].s = {
        font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
        fill: { fgColor: { rgb: "4F46E5" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top:{style:"thin",color:{rgb:"CCCCCC"}}, bottom:{style:"thin",color:{rgb:"CCCCCC"}},
          left:{style:"thin",color:{rgb:"CCCCCC"}}, right:{style:"thin",color:{rgb:"CCCCCC"}},
        },
      };
    });
    rows.forEach((row, ri) => {
      const status = row[13];
      const ref = XLSX.utils.encode_cell({ r: ri + 1, c: 13 });
      if (!worksheet[ref]) worksheet[ref] = {};
      worksheet[ref].s = {
        font: { bold: true, color: { rgb: status === "Active" ? "166534" : "991B1B" } },
        fill: { fgColor: { rgb: status === "Active" ? "DCFCE7" : "FEE2E2" } },
        alignment: { horizontal: "center" },
      };
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Faculty Members");
    XLSX.writeFile(workbook, "Faculty_Members.xlsx", { cellStyles: true });
  };

  /* ── Bulk PDF → ZIP export ── */
  const handleBulkPDFExport = async () => {
    if (allStaff.length === 0) return;
    setBulkProgress({ done: 0, total: allStaff.length });

    const zip    = new JSZip();
    const folder = zip.folder("Faculty_Profiles");

    for (let i = 0; i < allStaff.length; i++) {
      const staff = allStaff[i];
      try {
        const fullData      = await fetchStaffFullData(staff.staffId);
        const academicYears = calcYears(staff.joiningDate);

        let photoBase64 = null;
        if (staff.photo) {
          photoBase64 = await photoToBase64(
            `http://localhost:5000/uploads/${staff.photo}`
          );
        }

        const doc = await buildPDF({
          staff: { ...staff, photoBase64 },
          academicYears,
          industryYears:             fullData.industryYears,
          currentDesignation:        fullData.currentDesignation,
          qualificationText:         fullData.qualificationText,
          publications:              fullData.publications,
          conferences:               fullData.conferences,
          awards:                    fullData.awards,
          memberships:               fullData.memberships,
          internationalPubs:         fullData.internationalPubs,
          nationalPubs:              fullData.nationalPubs,
          bookList:                  fullData.bookList,
          articleList:               fullData.articleList,
          nationalConferences:       fullData.nationalConferences,
          internationalConferences:  fullData.internationalConferences,
        });

        const pdfBlob = doc.output("arraybuffer");
        const fileName = `${staff.firstName}_${staff.lastName}_${staff.staffId}.pdf`;
        folder.file(fileName, pdfBlob);
      } catch (err) {
        console.error(`Failed PDF for ${staff.staffId}:`, err);
      }

      setBulkProgress({ done: i + 1, total: allStaff.length });
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Faculty_Profiles.zip";
    a.click();
    URL.revokeObjectURL(url);

    setBulkProgress(null);
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const isBulkRunning = bulkProgress !== null;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "260px", flexShrink: 0 }}>
        <Sidebar />
      </div>

      <div style={{ flex: 1, background: "#f3f4f6", padding: "40px", overflowY: "auto" }}>

        {/* ── Header card ── */}
        <div
          style={{
            maxWidth: "1400px", margin: "0 auto 30px",
            background: "#fff", padding: "30px 40px",
            borderRadius: "24px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", flexWrap: "wrap", gap: "20px",
            }}
          >
            <h2
              style={{
                margin: 0, fontSize: "32px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                fontWeight: "700",
              }}
            >
              👥 Faculty Members
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              {/* Search */}
              <div style={{ position: "relative", width: "350px" }}>
                <input
                  type="text"
                  placeholder=" Search by Name or staffId"
                  value={search}
                  onChange={handleSearch}
                  style={{
                    width: "100%", padding: "12px 16px 12px 45px",
                    borderRadius: "12px", border: "2px solid #e2e8f0",
                    fontSize: "15px", transition: "all 0.3s ease",
                    outline: "none", background: "#f8fafc", boxSizing: "border-box",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#667eea"; e.target.style.background = "#fff"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                />
                <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "18px" }}>🔍</span>
              </div>

              {/* Excel Export */}
              <button
                onClick={handleExport}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "12px 24px", borderRadius: "12px", border: "none",
                  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                  color: "#fff", fontWeight: "600", fontSize: "15px",
                  cursor: "pointer", boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
                  transition: "all 0.3s ease", whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(34,197,94,0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "0 4px 12px rgba(34,197,94,0.3)"; }}
              >
                <span style={{ fontSize: "18px" }}>📥</span> Export Excel
              </button>

              {/* Bulk PDF Export */}
              <button
                onClick={handleBulkPDFExport}
                disabled={isBulkRunning}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "12px 24px", borderRadius: "12px", border: "none",
                  background: isBulkRunning
                    ? "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)"
                    : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#fff", fontWeight: "600", fontSize: "15px",
                  cursor: isBulkRunning ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
                  transition: "all 0.3s ease", whiteSpace: "nowrap",
                  opacity: isBulkRunning ? 0.85 : 1,
                }}
                onMouseEnter={(e) => { if (!isBulkRunning) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(99,102,241,0.5)"; } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(99,102,241,0.35)"; }}
              >
                {isBulkRunning ? (
                  <>
                    <span style={spinnerStyle}></span>
                    {bulkProgress.done}/{bulkProgress.total} Generating…
                  </>
                ) : (
                  <><span style={{ fontSize: "18px" }}>📦</span> Export All PDFs</>
                )}
              </button>
            </div>
          </div>

          {/* Progress bar */}
          {isBulkRunning && (
            <div style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
                  Generating PDF {bulkProgress.done} of {bulkProgress.total}…
                </span>
                <span style={{ fontSize: "13px", color: "#6366f1", fontWeight: "600" }}>
                  {Math.round((bulkProgress.done / bulkProgress.total) * 100)}%
                </span>
              </div>
              <div style={{ background: "#e2e8f0", borderRadius: "999px", height: "8px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%", borderRadius: "999px",
                    background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                    width: `${(bulkProgress.done / bulkProgress.total) * 100}%`,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          )}

          {/* Staff count */}
          <div style={{ marginTop: "20px", fontSize: "15px", color: "#64748b", fontWeight: "500" }}>
            Total Faculty:{" "}
            <span style={{ color: "#667eea", fontWeight: "600" }}>{staffList.length}</span>
          </div>
        </div>

        {/* ── Cards Grid ── */}
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {staffList.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px",
              }}
            >
              {staffList.map((staff) => (
                <div
                  key={staff.staffId}
                  style={{
                    background: "#fff", borderRadius: "20px", padding: "30px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)", textAlign: "center",
                    transition: "all 0.3s ease", cursor: "pointer",
                    position: "relative", overflow: "hidden",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(102,126,234,0.2)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.08)"; }}
                >
                  <div
                    style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: "80px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      opacity: 0.1, borderRadius: "20px 20px 0 0",
                    }}
                  />

                  <div style={{ position: "relative", display: "inline-block", marginBottom: "16px" }}>
                    {staff.photo ? (
                      <img
                        src={`http://localhost:5000/uploads/${staff.photo}`}
                        alt="Profile"
                        style={{
                          width: "100px", height: "100px", borderRadius: "50%",
                          objectFit: "cover", border: "4px solid #fff",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      style={{
                        display: staff.photo ? "none" : "flex",
                        width: "100px", height: "100px", borderRadius: "50%",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        alignItems: "center", justifyContent: "center",
                        fontSize: "40px", color: "#fff", fontWeight: "700",
                        border: "4px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      {staff.firstName?.[0]}{staff.lastName?.[0]}
                    </div>
                  </div>

                  <div style={{ fontWeight: "700", fontSize: "20px", marginBottom: "8px", color: "#1e293b", lineHeight: "1.3" }}>
                    {staff.firstName} {staff.lastName}
                  </div>
                  <div style={{ fontSize: "16px", color: "#525456", fontWeight: "500", marginBottom: "12px" }}>
                    Staff ID: {staff.staffId}
                  </div>

                  <Link
                    to={`/staff/${staff.staffId}`}
                    style={{
                      display: "inline-block",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "#fff", padding: "10px 24px", borderRadius: "20px",
                      textDecoration: "none", fontWeight: "600", fontSize: "14px",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 12px rgba(102,126,234,0.3)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(102,126,234,0.4)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.boxShadow = "0 4px 12px rgba(102,126,234,0.3)"; }}
                  >
                    View Profile →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                background: "#fff", padding: "60px", borderRadius: "24px",
                textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ fontSize: "64px", marginBottom: "16px" }}>👥</div>
              <div style={{ fontSize: "18px", color: "#64748b", fontWeight: "500" }}>
                No faculty members found
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const spinnerStyle = {
  width: "14px", height: "14px", display: "inline-block",
  border: "2px solid rgba(255,255,255,0.35)", borderTop: "2px solid #fff",
  borderRadius: "50%", animation: "spin 0.7s linear infinite",
  verticalAlign: "middle",
};

export default StaffList;