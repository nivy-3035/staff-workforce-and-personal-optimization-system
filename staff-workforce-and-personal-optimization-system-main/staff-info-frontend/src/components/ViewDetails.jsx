import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import jsPDF from "jspdf";

import { fetchStaffById, getMyDesignations } from "../api/staffApi";
import { getPublicationsByStaff } from "../api/publicationApi";
import { getBooksByStaff } from "../api/bookApi";
import { getAwardsByStaff } from "../api/awardApi";
import { getMembershipByStaff } from "../api/membershipApi";
import { getMyExperiences } from "../api/experienceApi";
import { getMyAdditionalPosts } from "../api/additionalPostApi";
import { getMyQualifications } from "../api/qualificationApi";
import { getMyConferences } from "../api/conferenceApi";

/* ================= HELPER FUNCTIONS ================= */
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
  const end = endDate ? new Date(endDate) : new Date();
  let years = end.getFullYear() - start.getFullYear();
  const md = end.getMonth() - start.getMonth();
  if (md < 0 || (md === 0 && end.getDate() < start.getDate())) years--;
  return Math.max(0, years);
};

/* ================= PDF GENERATOR ================= */
const buildPDF = async (data) => {
  const {
    staff, academicYears, industryYears, currentDesignation, qualificationText,
    publications, conferences, awards, memberships,
    internationalPubs, nationalPubs, bookList, articleList,
    nationalConferences, internationalConferences,
    designations, qualifications, additionalPosts, experiences,
  } = data;

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const W = 210, ML = 14, MR = 14, TW = W - ML - MR;
  let y = 0;

  const C = {
    navy:      [26,  37,  87],
    blue:      [46,  91, 220],
    blueLight: [235, 241, 255],
    slate:     [74,  85, 104],
    slateLight:[241, 245, 249],
    mid:       [113, 128, 150],
    white:     [255, 255, 255],
    divider:   [220, 226, 240],
    gold:      [255, 195,   0],
    goldBg:    [255, 251, 235],
    goldBdr:   [253, 230, 138],
    green:     [ 22, 163,  74],
    greenBg:   [240, 253, 244],
    greenBdr:  [187, 247, 208],
    purple:    [ 99, 102, 241],
    purpleBg:  [238, 242, 255],
    purpleBdr: [199, 210, 254],
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
    color(C.white); doc.setFont("helvetica", "bold"); doc.setFontSize(11);
    txt(label.toUpperCase(), ML + 8, y + 5.2);
    y += 11;
    color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(9);
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

  /* ══════════ HEADER ══════════ */
  const HDR_H = 52;
  fill(C.navy); doc.rect(0, 0, W, HDR_H, "F");
  fill(C.blue); doc.rect(0, HDR_H, W, 2, "F");

  const PHX = ML, PHY = 8, PHR = 18;
  if (staff.photoBase64) {
    try {
      doc.addImage(staff.photoBase64, "JPEG", PHX, PHY, PHR * 2, PHR * 2, "", "FAST");
    } catch {
      fill([32, 46, 104]); lw(0); doc.rect(PHX, PHY, PHR * 2, PHR * 2, "F");
      color(C.blueLight); doc.setFont("helvetica", "bold"); doc.setFontSize(14);
      txt(`${staff.firstName?.[0] || ""}${staff.lastName?.[0] || ""}`, PHX + PHR, PHY + PHR + 4, { align: "center" });
    }
  } else {
    fill([32, 46, 104]); lw(0); doc.rect(PHX, PHY, PHR * 2, PHR * 2, "F");
    color(C.blueLight); doc.setFont("helvetica", "bold"); doc.setFontSize(14);
    txt(`${staff.firstName?.[0] || ""}${staff.lastName?.[0] || ""}`, PHX + PHR, PHY + PHR + 4, { align: "center" });
  }

  const HX = ML + PHR * 2 + 10;
  color(C.white); doc.setFont("helvetica", "bold"); doc.setFontSize(18);
  txt(`${staff.firstName || ""} ${staff.lastName || ""}`, HX, 18);
  color(C.blueLight); doc.setFont("helvetica", "bold"); doc.setFontSize(9.5);
  txt(currentDesignation || "Faculty Member", HX, 26);
  color([160, 180, 230]); doc.setFont("helvetica", "italic"); doc.setFontSize(8);
  txt(qualificationText || "", HX, 33);
  color([190, 205, 240]); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
  txt(`Email : ${staff.email || "—"}`, HX, 40);
  txt(`Phone : ${staff.mobile || "—"}`, HX, 47);
  y = HDR_H + 7;

  /* ══════════ STATS BAR ══════════ */
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
    color(C.blue); doc.setFont("helvetica", "bold"); doc.setFontSize(12);
    txt(String(s.v), sx + SW / 2, y + 9, { align: "center" });
    color(C.mid); doc.setFont("helvetica", "normal"); doc.setFontSize(6);
    txt(s.l.toUpperCase(), sx + SW / 2, y + 14, { align: "center" });
  });
  y += STAT_H + 6;

  /* ══════════ PERSONAL INFO ══════════ */
  const COL_W = TW / 2;
  const LABEL_W = 36;
  const VAL_MAX_W = COL_W - LABEL_W - 6;
  const ROW_H = 6;
  const ROW_PAD = 2;
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);

  const infoPairs = [
    ["Staff ID",        staff.staffId || "—"],
    ["Specialization",  staff.specialization || "—"],
    ["Date of Birth",   formatDate(staff.dob)],
    ["Date of Joining", formatDate(staff.joiningDate)],
    ["Mobile",          staff.mobile || "—"],
    ["Email",           staff.email || "—"],
  ];
  const numRows = Math.ceil(infoPairs.length / 2);
  const rowHeights = Array.from({ length: numRows }, (_, row) => {
    const counts = [0, 1].map((col) => {
      const idx = row * 2 + col;
      if (idx >= infoPairs.length) return 1;
      return doc.splitTextToSize(infoPairs[idx][1], VAL_MAX_W).length;
    });
    return Math.max(...counts);
  });
  let INFO_H = 6 + 4;
  rowHeights.forEach((h) => { INFO_H += h * ROW_H + ROW_PAD; });
  INFO_H += 4;

  fill(C.white); lw(0.3); stroke(C.divider); doc.rect(ML, y, TW, INFO_H, "FD");
  fill(C.slateLight); doc.rect(ML, y, TW, 6, "F");
  color(C.navy); doc.setFont("helvetica", "bold"); doc.setFontSize(7.5);
  txt("PERSONAL INFORMATION", ML + 5, y + 4.2);

  rowHeights.reduce((ry, rowH, row) => {
    [0, 1].forEach((col) => {
      const idx = row * 2 + col;
      if (idx >= infoPairs.length) return;
      const [label, value] = infoPairs[idx];
      const ix = ML + 5 + col * COL_W;
      color(C.mid); doc.setFont("helvetica", "bold"); doc.setFontSize(7.5);
      txt(label + ":", ix, ry);
      color(C.navy); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
      doc.splitTextToSize(value, VAL_MAX_W).forEach((line, li) =>
        txt(line, ix + LABEL_W, ry + li * ROW_H)
      );
    });
    return ry + rowH * ROW_H + ROW_PAD;
  }, y + 10);
  y += INFO_H + 6;

  /* ══════════ 1. CONTACT ADDRESS ══════════ */
  if (staff.street) {
    sectionTitle("1. Contact Address");
    fill(C.slateLight); lw(0); doc.rect(ML, y, TW, 20, "F");
    fill(C.blue); doc.rect(ML, y, 3, 20, "F");
    const addr = [
      staff.street,
      `${staff.city || ""}, ${staff.district || ""} – ${staff.pinCode || ""}`,
      staff.state || "",
    ].filter(Boolean).join("\n");
    color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    wrappedText(addr, ML + 8, y + 6, TW - 14, 5.5);
    y += 25;
  }

  /* ══════════ 2. DESIGNATIONS ══════════ */
  // Only approved (flag === 1) designations are passed in — no status badge shown
  if (designations.length > 0) {
    sectionTitle("2. Designations");

    // Table header
    const COL = { desig: ML + 6, from: ML + TW * 0.52, to: ML + TW * 0.76 };
    fill(C.blueLight); lw(0); doc.rect(ML, y, TW, 7, "F");
    color(C.blue); doc.setFont("helvetica", "bold"); doc.setFontSize(8);
    txt("Designation",  COL.desig, y + 4.8);
    txt("From",         COL.from,  y + 4.8);
    txt("To",           COL.to,    y + 4.8);
    y += 8;

    designations.forEach((d, i) => {
      checkPage(10);
      const rowBg = i % 2 === 0 ? C.white : C.slateLight;
      fill(rowBg); lw(0.15); stroke(C.divider);
      doc.rect(ML, y, TW, 8, "FD");

      // Designation name
      color(C.navy); doc.setFont("helvetica", "bold"); doc.setFontSize(8.5);
      const desigLines = doc.splitTextToSize(d.designation || "—", TW * 0.46);
      txt(desigLines[0], COL.desig, y + 5.2);

      // From date
      color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
      txt(formatDate(d.from_date), COL.from, y + 5.2);

      // To date
      if (!d.to_date) {
        fill(C.greenBg); lw(0); doc.roundedRect(COL.to - 1, y + 1.5, 20, 5, 1, 1, "F");
        color(C.green); doc.setFont("helvetica", "bold"); doc.setFontSize(7);
        txt("Present", COL.to + 9, y + 5, { align: "center" });
      } else {
        color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
        txt(formatDate(d.to_date), COL.to, y + 5.2);
      }

      y += 9;
    });
    y += 5;
  }

  /* ══════════ 3. QUALIFICATIONS ══════════ */
  if (qualifications.length > 0) {
    sectionTitle("3. Qualifications");
    qualifications
      .sort((a, b) => b.completedYear - a.completedYear)
      .forEach((q, i) => {
        checkPage(15);
        fill(i % 2 === 0 ? C.white : C.slateLight); lw(0.2); stroke(C.divider);
        doc.rect(ML, y, TW, 13, "FD");

        // Degree badge
        fill(C.purpleBg); lw(0); doc.roundedRect(ML + 4, y + 2.5, 24, 8, 1, 1, "F");
        color(C.purple); doc.setFont("helvetica", "bold"); doc.setFontSize(7.5);
        txt(q.degree || "", ML + 16, y + 7.5, { align: "center" });

        // Major
        color(C.navy); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
        txt(q.major || "—", ML + 32, y + 6);

        // College
        color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(7.5);
        txt(q.college || "", ML + 32, y + 10.5);

        // University (right-aligned)
        color(C.mid); doc.setFontSize(7.5);
        txt(q.university || "", ML + TW - 4, y + 6, { align: "right" });

        // Year (right-aligned)
        color(C.blue); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
        txt(String(q.completedYear || ""), ML + TW - 4, y + 11, { align: "right" });

        y += 15;
      });
    y += 4;
  }

  /* ══════════ 4. ADDITIONAL POSTS ══════════ */
  if (additionalPosts.length > 0) {
    sectionTitle("4. Additional Posts");

    // Table header
    const COL = { post: ML + 6, from: ML + TW * 0.52, to: ML + TW * 0.76 };
    fill(C.blueLight); lw(0); doc.rect(ML, y, TW, 7, "F");
    color(C.blue); doc.setFont("helvetica", "bold"); doc.setFontSize(8);
    txt("Post",  COL.post, y + 4.8);
    txt("From",  COL.from, y + 4.8);
    txt("To",    COL.to,   y + 4.8);
    y += 8;

    additionalPosts.forEach((p, i) => {
      checkPage(10);
      fill(i % 2 === 0 ? C.white : C.slateLight); lw(0.15); stroke(C.divider);
      doc.rect(ML, y, TW, 8, "FD");

      color(C.navy); doc.setFont("helvetica", "bold"); doc.setFontSize(8.5);
      txt(p.post || "—", COL.post, y + 5.2);

      color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
      txt(formatDate(p.fromDate), COL.from, y + 5.2);

      if (!p.toDate) {
        fill(C.greenBg); lw(0); doc.roundedRect(COL.to - 1, y + 1.5, 20, 5, 1, 1, "F");
        color(C.green); doc.setFont("helvetica", "bold"); doc.setFontSize(7);
        txt("Present", COL.to + 9, y + 5, { align: "center" });
      } else {
        color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
        txt(formatDate(p.toDate), COL.to, y + 5.2);
      }

      y += 9;
    });
    y += 5;
  }

  /* ══════════ 5. EXPERIENCE ══════════ */
  // Only approved experiences passed in — no status badge shown
  if (experiences.length > 0) {
    sectionTitle("5. Experience");

    const academic = experiences.filter((e) => e.type !== "industry");
    const industry = experiences.filter((e) => e.type === "industry");

    const renderExpTable = (list) => {
      // Column positions
      const COL = {
        type:  ML + 4,
        desig: ML + 26,
        inst:  ML + 26,      // institution below designation
        from:  ML + TW * 0.55,
        to:    ML + TW * 0.76,
        yrs:   ML + TW - 4,
      };

      // Header row
      fill(C.blueLight); lw(0); doc.rect(ML, y, TW, 7, "F");
      color(C.blue); doc.setFont("helvetica", "bold"); doc.setFontSize(8);
      txt("Type",             COL.type,  y + 4.8);
      txt("Designation / Role & Institution", COL.desig, y + 4.8);
      txt("From",             COL.from,  y + 4.8);
      txt("To",               COL.to,    y + 4.8);
      txt("Yrs",              COL.yrs,   y + 4.8, { align: "right" });
      y += 8;

      list.forEach((exp, i) => {
        checkPage(16);
        const ROW_H_EXP = 14;
        fill(i % 2 === 0 ? C.white : C.slateLight); lw(0.15); stroke(C.divider);
        doc.rect(ML, y, TW, ROW_H_EXP, "FD");

        // Type pill
        const isInd = exp.type === "industry";
        fill(isInd ? [254, 243, 199] : C.purpleBg); lw(0);
        doc.roundedRect(COL.type, y + 3, 18, 5.5, 1, 1, "F");
        color(isInd ? [146, 100, 20] : C.purple);
        doc.setFont("helvetica", "bold"); doc.setFontSize(6);
        txt(isInd ? "INDUSTRY" : "ACADEMIC", COL.type + 9, y + 6.8, { align: "center" });

        // Designation / Role
        color(C.navy); doc.setFont("helvetica", "bold"); doc.setFontSize(8.5);
        const roleText = exp.designation || exp.role || "—";
        const roleLines = doc.splitTextToSize(roleText, COL.from - COL.desig - 4);
        txt(roleLines[0], COL.desig, y + 5.5);

        // Institution below designation
        color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(7.5);
        const instText = exp.institution || exp.company || "";
        const instLines = doc.splitTextToSize(instText, COL.from - COL.inst - 4);
        txt(instLines[0], COL.inst, y + 10.5);

        // From date
        color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
        txt(formatDate(exp.from_date), COL.from, y + 5.5);

        // To date
        if (!exp.to_date) {
          fill(C.greenBg); lw(0);
          doc.roundedRect(COL.to - 1, y + 2, 20, 5, 1, 1, "F");
          color(C.green); doc.setFont("helvetica", "bold"); doc.setFontSize(7);
          txt("Present", COL.to + 9, y + 5.8, { align: "center" });
        } else {
          color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
          txt(formatDate(exp.to_date), COL.to, y + 5.5);
        }

        // Years (right-aligned)
        const yrs = calcYears(exp.from_date, exp.to_date);
        if (yrs > 0) {
          color(C.blue); doc.setFont("helvetica", "bold"); doc.setFontSize(8);
          txt(`${yrs}y`, COL.yrs, y + 5.5, { align: "right" });
        }

        y += ROW_H_EXP + 1;
      });
    };

    if (academic.length > 0) {
      subTitle("Academic Experience");
      renderExpTable(academic);
      y += 3;
    }
    if (industry.length > 0) {
      subTitle("Industry Experience");
      renderExpTable(industry);
      y += 3;
    }
    y += 3;
  }

  /* ══════════ 6. RESEARCH PUBLICATIONS ══════════ */
  if (internationalPubs.length > 0 || nationalPubs.length > 0) {
    sectionTitle("6. Research Publications");
    let idx = 1;
    const renderPub = (pub, n, hasDoi) => {
      checkPage(14);
      const line = hasDoi
        ? `${n}. ${pub.authors || ""}, "${pub.paper_title || ""}", ${pub.journal_name || ""}, Vol.${pub.volume_number || ""}, No.${pub.issue_number || ""}, pp.${pub.page_from || ""}–${pub.page_to || ""}, ${pub.published_month || ""} ${pub.published_year || ""}. DOI: ${pub.publicationYearOrDoi || ""}.`
        : `${n}. ${pub.authors || ""}, "${pub.paper_title || ""}", ${pub.journal_name || ""}, Vol.${pub.volume_number || ""}, No.${pub.issue_number || ""}, pp.${pub.page_from || ""}–${pub.page_to || ""}, ${pub.published_month || ""} ${pub.published_year || ""}.`;
      color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
      y = wrappedText(line, ML + 8, y, TW - 10, 5, ML + 14) + 4;
    };
    if (internationalPubs.length > 0) {
      subTitle("International Journals");
      internationalPubs.forEach((pub) => renderPub(pub, idx++, !!pub.publicationYearOrDoi));
    }
    if (nationalPubs.length > 0) {
      subTitle("National Journals");
      nationalPubs.forEach((pub) => renderPub(pub, idx++, false));
    }
    y += 3;
  }

  /* ══════════ 7. BOOKS AUTHORED ══════════ */
  if (bookList.length > 0) {
    sectionTitle("7. Books Authored");
    bookList.forEach((book, i) => {
      checkPage(14);
      const line = `${i + 1}. ${book.author_name || ""}, ${book.title || ""}${book.publisher_name ? ", " + book.publisher_name : ""}${book.isbn_issn ? ", ISBN: " + book.isbn_issn : ""}${book.page_from && book.page_to ? ", pp." + book.page_from + "–" + book.page_to : ""}, ${book.month || ""} ${book.year || ""}.`;
      color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
      y = wrappedText(line, ML + 8, y, TW - 10, 5, ML + 14) + 4;
    });
    y += 3;
  }

  /* ══════════ 8. POPULAR ARTICLES ══════════ */
  if (articleList.length > 0) {
    sectionTitle("8. Popular Articles");
    articleList.forEach((a, i) => {
      checkPage(14);
      const line = `${i + 1}. ${a.author_name || ""}, "${a.title || ""}", ${a.publisher_name || ""}${a.publisher_address ? ", " + a.publisher_address : ""}${a.isbn_issn ? ", " + a.isbn_issn : ""}, ${a.month || ""} ${a.year || ""}.`;
      color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
      y = wrappedText(line, ML + 8, y, TW - 10, 5, ML + 14) + 4;
    });
    y += 3;
  }

  /* ══════════ 9. CONFERENCE PRESENTATIONS ══════════ */
  if (nationalConferences.length > 0 || internationalConferences.length > 0) {
    sectionTitle("9. Conference Presentations");
    let ci = 1;
    const renderConf = (c, n) => {
      checkPage(12);
      const line = c.activity_type === "Paper Published"
        ? `${n}. ${c.author_name || ""}, "${c.paper_title || ""}", ${c.conference_title || ""}${c.location ? ", " + c.location : ""}.`
        : `${n}. ${c.conference_title || ""}${c.location ? ", " + c.location : ""}.`;
      color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
      y = wrappedText(line, ML + 8, y, TW - 10, 5, ML + 14) + 4;
    };
    if (nationalConferences.length > 0) {
      subTitle("National Conferences");
      nationalConferences.forEach((c) => renderConf(c, ci++));
    }
    if (internationalConferences.length > 0) {
      subTitle("International Conferences");
      internationalConferences.forEach((c) => renderConf(c, ci++));
    }
    y += 3;
  }

  /* ══════════ 10. AWARDS ══════════ */
  if (awards.length > 0) {
    sectionTitle("10. Awards & Honors");
    awards.forEach((a) => {
      checkPage(14);
      fill(C.goldBg); lw(0.3); stroke(C.goldBdr);
      doc.roundedRect(ML, y, TW, 11, 1.5, 1.5, "FD");
      fill(C.gold); lw(0); doc.rect(ML, y, 3, 11, "F");
      color(C.navy); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
      txt(a.award_name || "", ML + 8, y + 5);
      color([146, 100, 20]); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
      txt(a.awarding_agent || "", ML + 8, y + 9.2);
      if (a.award_year) {
        fill(C.gold); lw(0); doc.roundedRect(ML + TW - 18, y + 2.5, 14, 6, 1, 1, "F");
        color(C.navy); doc.setFont("helvetica", "bold"); doc.setFontSize(8);
        txt(String(a.award_year), ML + TW - 11, y + 7, { align: "center" });
      }
      y += 14;
    });
    y += 3;
  }

  /* ══════════ 11. MEMBERSHIPS ══════════ */
  if (memberships.length > 0) {
    sectionTitle("11. Professional Memberships");
    memberships.forEach((m) => {
      checkPage(14);
      fill(C.blueLight); lw(0.3); stroke(C.divider);
      doc.roundedRect(ML, y, TW, 11, 1.5, 1.5, "FD");
      fill(C.blue); lw(0); doc.rect(ML, y, 3, 11, "F");
      color(C.navy); doc.setFont("helvetica", "bold"); doc.setFontSize(9);
      txt(m.membershipType || "", ML + 8, y + 4.8);
      color(C.slate); doc.setFont("helvetica", "normal"); doc.setFontSize(8);
      txt(m.institution || "", ML + 8, y + 9);
      color(C.mid); doc.setFontSize(7.5);
      txt(`ID: ${m.membershipId || ""}`, ML + TW - 4, y + 6.5, { align: "right" });
      y += 14;
    });
    y += 3;
  }

  /* ══════════ FOOTER ══════════ */
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

/* ================= UI SECTION COMPONENT ================= */
const Section = ({ title, children, icon, index }) => (
  <div style={styles.section} className="profile-section">
    <div style={styles.sectionHeader}>
      <div style={styles.sectionHeaderInner}>
        <div style={styles.sectionIconWrap}>
          <span>{icon}</span>
        </div>
        <h3 style={styles.sectionTitle}>{title}</h3>
      </div>
      <div style={styles.sectionIndex}>{String(index).padStart(2, "0")}</div>
    </div>
    <div style={styles.sectionContent}>{children}</div>
  </div>
);

const StatCard = ({ value, label, color }) => (
  <div style={{ ...styles.statCard, borderTopColor: color }}>
    <div style={{ ...styles.statNum, color }}>{value}</div>
    <div style={styles.statLabel}>{label}</div>
  </div>
);

const DesignationRow = ({ d, i }) => (
  <div style={{ ...styles.timelineRow, background: i % 2 === 0 ? "#fff" : "#f8faff" }}>
    <div style={styles.timelineDot} />
    <div style={styles.timelineMain}>
      <div style={styles.timelineTitle}>{d.designation || "—"}</div>
      <div style={styles.timelineDates}>
        {formatDate(d.from_date)} &nbsp;→&nbsp; {d.to_date ? formatDate(d.to_date) : <span style={styles.presentBadge}>Present</span>}
      </div>
    </div>
    <div style={{ ...styles.statusChip, ...(d.flag === 1 ? styles.statusApproved : styles.statusPending) }}>
      {d.flag === 1 ? "✓ Approved" : "⏳ Pending"}
    </div>
  </div>
);

const QualCard = ({ q }) => (
  <div style={styles.qualCard}>
    <div style={styles.qualDegree}>{q.degree}</div>
    <div style={styles.qualMajor}>{q.major || "—"}</div>
    <div style={styles.qualInst}>{q.college}</div>
    <div style={styles.qualUniv}>{q.university}</div>
    <div style={styles.qualYear}>{q.completedYear}</div>
  </div>
);

const ExpRow = ({ e, i }) => {
  const isIndustry = e.type === "industry";
  const yrs = calcYears(e.from_date, e.to_date);
  return (
    <div style={{ ...styles.expRow, background: i % 2 === 0 ? "#fff" : "#f8faff" }}>
      <div style={{ ...styles.expTypeBadge, ...(isIndustry ? styles.expIndustry : styles.expAcademic) }}>
        {isIndustry ? "Industry" : "Academic"}
      </div>
      <div style={styles.expMain}>
        <div style={styles.expTitle}>{e.designation || e.role || "—"}</div>
        <div style={styles.expInst}>{e.institution || e.company || ""}</div>
      </div>
      <div style={styles.expRight}>
        <div style={styles.expDates}>
          {formatDate(e.from_date)} → {e.to_date ? formatDate(e.to_date) : <span style={styles.presentBadge}>Present</span>}
        </div>
        {yrs > 0 && <div style={styles.expYears}>{yrs} yr{yrs !== 1 ? "s" : ""}</div>}
      </div>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
const ViewDetails = () => {
  const { id } = useParams();
  const [staff,           setStaff]           = useState(null);
  const [designations,    setDesignations]    = useState([]);
  const [qualifications,  setQualifications]  = useState([]);
  const [additionalPosts, setAdditionalPosts] = useState([]);
  const [publications,    setPublications]    = useState([]);
  const [books,           setBooks]           = useState([]);
  const [awards,          setAwards]          = useState([]);
  const [memberships,     setMemberships]     = useState([]);
  const [experiences,     setExperiences]     = useState([]);
  const [conferences,     setConferences]     = useState([]);
  const [isExporting,     setIsExporting]     = useState(false);
  const [loaded,          setLoaded]          = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const staffData = await fetchStaffById(id);
        setStaff(staffData);
        const [des, qual, addPosts, pubs, bks, awds, mems, exps, confs] = await Promise.all([
          getMyDesignations(id),
          getMyQualifications(id),
          getMyAdditionalPosts(id),
          getPublicationsByStaff(id),
          getBooksByStaff(id),
          getAwardsByStaff(id),
          getMembershipByStaff(id),
          getMyExperiences(id),
          getMyConferences(id),
        ]);
        // Only approved records are stored in state
        setDesignations(des.filter((d) => d.flag === 1));
        setQualifications(qual.filter((q) => q.status === 1));
        setAdditionalPosts(addPosts.filter((p) => p.status === 1));
        setPublications(pubs);
        setBooks(bks);
        setAwards(awds);
        setMemberships(mems);
        // Only approved experiences (flag === 1 or status === 1 — adjust field name as needed)
        setExperiences(exps.filter((e) => e.flag === 1 || e.status === 1));
        setConferences(confs);
        setTimeout(() => setLoaded(true), 100);
      } catch (err) {
        console.error("Error loading staff data:", err);
      }
    };
    loadData();
  }, [id]);

  const academicYears  = staff ? calcYears(staff.joiningDate) : 0;
  const industryYears  = experiences
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
  const academicExp              = experiences.filter((e) => e.type !== "industry");
  const industryExp              = experiences.filter((e) => e.type === "industry");

  const photoToBase64 = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width; canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      let photoBase64 = null;
      if (staff.photo)
        photoBase64 = await photoToBase64(`http://localhost:5000/uploads/${staff.photo}`);
      const pdfDoc = await buildPDF({
        staff: { ...staff, photoBase64 },
        academicYears, industryYears, currentDesignation, qualificationText,
        publications, conferences, awards, memberships,
        internationalPubs, nationalPubs, bookList, articleList,
        nationalConferences, internationalConferences,
        designations, qualifications, additionalPosts, experiences,
      });
      pdfDoc.save(`${staff.firstName}_${staff.lastName}_Faculty_Profile.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
    }
    setIsExporting(false);
  };

  if (!staff)
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingInner}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading Faculty Profile…</p>
        </div>
      </div>
    );

  const initials = `${staff.firstName?.[0] || ""}${staff.lastName?.[0] || ""}`;

  return (
    <div style={styles.pageContainer}>
      <Sidebar />
      <div style={styles.main}>
        <div style={styles.bgDeco1} />
        <div style={styles.bgDeco2} />

        {/* TOP BAR */}
        <div style={styles.topBar}>
          <div />
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            style={isExporting ? { ...styles.exportBtn, ...styles.exportBtnDisabled } : styles.exportBtn}
          >
            {isExporting
              ? (<><span style={styles.btnSpinner} /> Generating PDF…</>)
              : (<><span>⬇</span> Export PDF</>)}
          </button>
        </div>

        <div style={{
          ...styles.pageContent,
          opacity: loaded ? 1 : 0,
          transform: loaded ? "none" : "translateY(20px)",
          transition: "all 0.5s ease",
        }}>

          {/* HERO */}
          <div style={styles.heroCard}>
            <div style={styles.heroGradient} />
            <div style={styles.heroLeft}>
              <div style={styles.photoRing}>
                {staff.photo
                  ? <img src={`http://localhost:5000/uploads/${staff.photo}`} alt="Profile" style={styles.heroPhoto} crossOrigin="anonymous" />
                  : <div style={styles.heroInitials}>{initials}</div>}
              </div>
            </div>
            <div style={styles.heroRight}>
              <div style={styles.heroName}>{staff.firstName} {staff.lastName}</div>
              <div style={styles.heroDesig}>{currentDesignation || "Faculty Member"}</div>
              <div style={styles.heroQual}>{qualificationText}</div>
              <div style={styles.heroMeta}>
                <div style={styles.heroPill}>✉ {staff.email}</div>
                <div style={styles.heroPill}>📞 {staff.mobile}</div>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div style={styles.statsRow}>
            <StatCard value={`${academicYears}+`} label="Academic Years"  color="#6366f1" />
            <StatCard value={industryYears}        label="Industry Years"  color="#8b5cf6" />
            <StatCard value={publications.length}  label="Publications"    color="#06b6d4" />
            <StatCard value={conferences.length}   label="Conferences"     color="#10b981" />
            <StatCard value={awards.length}        label="Awards"          color="#f59e0b" />
            <StatCard value={memberships.length}   label="Memberships"     color="#ef4444" />
          </div>

          {/* PERSONAL INFO */}
          <div style={styles.infoCard}>
            <div style={styles.infoCardTitle}>Personal Information</div>
            <div style={styles.infoGrid}>
              {[
                ["Staff ID",        staff.staffId || id],
                ["Specialization",  staff.specialization || "—"],
                ["Date of Birth",   formatDate(staff.dob)],
                ["Date of Joining", formatDate(staff.joiningDate)],
                ["Email",           staff.email],
                ["Phone",           staff.mobile],
              ].map(([label, value]) => (
                <div key={label} style={styles.infoItem}>
                  <span style={styles.infoLabel}>{label}</span>
                  <span style={styles.infoColon}>:</span>
                  <span style={styles.infoValue}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ADDRESS */}
          <Section title="Contact Address" icon="📍" index={1}>
            <div style={styles.addressBox}>
              <div style={styles.addressLine}>{staff.street}</div>
              <div style={styles.addressLine}>{staff.city}, {staff.district} — {staff.pinCode}</div>
              <div style={styles.addressLine}>{staff.state}</div>
            </div>
          </Section>

          {/* DESIGNATIONS */}
          {designations.length > 0 && (
            <Section title="Designations" icon="🎓" index={2}>
              <div style={styles.timeline}>
                {designations.map((d, i) => <DesignationRow key={d.id || i} d={d} i={i} />)}
              </div>
            </Section>
          )}

          {/* QUALIFICATIONS */}
          {qualifications.length > 0 && (
            <Section title="Qualifications" icon="🏫" index={3}>
              <div style={styles.qualGrid}>
                {qualifications
                  .sort((a, b) => b.completedYear - a.completedYear)
                  .map((q, i) => <QualCard key={q.id || i} q={q} />)}
              </div>
            </Section>
          )}

          {/* ADDITIONAL POSTS */}
          {additionalPosts.length > 0 && (
            <Section title="Additional Posts" icon="📌" index={4}>
              <div style={styles.timeline}>
                {additionalPosts.map((p, i) => (
                  <div key={p.id || i} style={{ ...styles.timelineRow, background: i % 2 === 0 ? "#fff" : "#f8faff" }}>
                    <div style={{ ...styles.timelineDot, background: "#8b5cf6" }} />
                    <div style={styles.timelineMain}>
                      <div style={styles.timelineTitle}>{p.post || "—"}</div>
                      <div style={styles.timelineDates}>
                        {formatDate(p.fromDate)} &nbsp;→&nbsp;{" "}
                        {p.toDate ? formatDate(p.toDate) : <span style={styles.presentBadge}>Present</span>}
                      </div>
                    </div>
                    <div style={{ ...styles.statusChip, ...(p.status === 1 ? styles.statusApproved : styles.statusPending) }}>
                      {p.status === 1 ? "✓ Approved" : "⏳ Pending"}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* EXPERIENCE */}
          {experiences.length > 0 && (
            <Section title="Experience" icon="💼" index={5}>
              {academicExp.length > 0 && (
                <>
                  <div style={styles.subHead}>
                    Academic Experience <span style={styles.countBadge}>{academicExp.length}</span>
                  </div>
                  {academicExp.map((e, i) => <ExpRow key={e.id || i} e={e} i={i} />)}
                </>
              )}
              {industryExp.length > 0 && (
                <>
                  <div style={{ ...styles.subHead, marginTop: academicExp.length > 0 ? 20 : 0 }}>
                    Industry Experience <span style={styles.countBadge}>{industryExp.length}</span>
                  </div>
                  {industryExp.map((e, i) => <ExpRow key={e.id || i} e={e} i={i} />)}
                </>
              )}
            </Section>
          )}

          {/* PUBLICATIONS */}
          {(internationalPubs.length > 0 || nationalPubs.length > 0) && (
            <Section title="Research Publications" icon="📚" index={6}>
              {internationalPubs.length > 0 && (
                <>
                  <div style={styles.subHead}>International Journals <span style={styles.countBadge}>{internationalPubs.length}</span></div>
                  <ol style={styles.pubList}>
                    {internationalPubs.map((pub) => (
                      <li key={pub.id} style={styles.pubItem}>
                        {pub.authors}, "<strong>{pub.paper_title}</strong>", <em>{pub.journal_name}</em>, Vol. {pub.volume_number}, No. {pub.issue_number}, pp. {pub.page_from}–{pub.page_to}, {pub.published_month} {pub.published_year}{pub.publicationYearOrDoi && <> · {pub.publicationYearOrDoi}</>}.
                      </li>
                    ))}
                  </ol>
                </>
              )}
              {nationalPubs.length > 0 && (
                <>
                  <div style={{ ...styles.subHead, marginTop: internationalPubs.length > 0 ? 20 : 0 }}>
                    National Journals <span style={styles.countBadge}>{nationalPubs.length}</span>
                  </div>
                  <ol style={styles.pubList} start={internationalPubs.length + 1}>
                    {nationalPubs.map((pub) => (
                      <li key={pub.id} style={styles.pubItem}>
                        {pub.authors}, "<strong>{pub.paper_title}</strong>", <em>{pub.journal_name}</em>, Vol. {pub.volume_number}, No. {pub.issue_number}, pp. {pub.page_from}–{pub.page_to}, {pub.published_month} {pub.published_year}.
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </Section>
          )}

          {/* BOOKS */}
          {bookList.length > 0 && (
            <Section title="Books Authored" icon="📖" index={7}>
              <ol style={styles.pubList}>
                {bookList.map((book) => (
                  <li key={book.id} style={styles.pubItem}>
                    {book.author_name}, <strong>{book.title}</strong>
                    {book.publisher_address && `, ${book.publisher_address}`}
                    {book.publisher_name && `: ${book.publisher_name}`}
                    {book.isbn_issn && `, ${book.isbn_issn}`}
                    {book.page_from && book.page_to && `, pp. ${book.page_from}–${book.page_to}`}, {book.month} {book.year}.
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {/* ARTICLES */}
          {articleList.length > 0 && (
            <Section title="Popular Articles" icon="📰" index={8}>
              <ol style={styles.pubList}>
                {articleList.map((a) => (
                  <li key={a.id} style={styles.pubItem}>
                    {a.author_name}, "<strong>{a.title}</strong>", <em>{a.publisher_name}</em>
                    {a.publisher_address && `, ${a.publisher_address}`}
                    {a.isbn_issn && `, ${a.isbn_issn}`}
                    {a.page_from && a.page_to && `, pp. ${a.page_from}–${a.page_to}`}, {a.month} {a.year}.
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {/* CONFERENCES */}
          {(nationalConferences.length > 0 || internationalConferences.length > 0) && (
            <Section title="Conferences" icon="🎤" index={9}>
              {nationalConferences.length > 0 && (
                <>
                  <div style={styles.subHead}>National <span style={styles.countBadge}>{nationalConferences.length}</span></div>
                  <ol style={styles.pubList}>
                    {nationalConferences.map((c) => (
                      <li key={c.id} style={styles.pubItem}>
                        {c.activity_type === "Paper Published"
                          ? <>{c.author_name}, <em>{c.conference_title}</em>{c.location && `, ${c.location}`}.</>
                          : <><strong>{c.conference_title}</strong>{c.location && `, ${c.location}`}.</>}
                      </li>
                    ))}
                  </ol>
                </>
              )}
              {internationalConferences.length > 0 && (
                <>
                  <div style={{ ...styles.subHead, marginTop: nationalConferences.length > 0 ? 20 : 0 }}>
                    International <span style={styles.countBadge}>{internationalConferences.length}</span>
                  </div>
                  <ol style={styles.pubList} start={nationalConferences.length + 1}>
                    {internationalConferences.map((c) => (
                      <li key={c.id} style={styles.pubItem}>
                        {c.activity_type === "Paper Published"
                          ? <>{c.author_name}, <strong>{c.paper_title}</strong>, <em>{c.conference_title}</em>{c.location && `, ${c.location}`}.</>
                          : <><strong>{c.conference_title}</strong>{c.location && `, ${c.location}`}.</>}
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </Section>
          )}

          {/* AWARDS */}
          {awards.length > 0 && (
            <Section title="Awards & Honors" icon="🏆" index={10}>
              <div style={styles.awardGrid}>
                {awards.map((a) => (
                  <div key={a.id} style={styles.awardCard}>
                    <div style={{ fontSize: "28px", flexShrink: 0 }}>🏆</div>
                    <div>
                      <div style={styles.awardName}>{a.award_name}</div>
                      <div style={styles.awardMeta}>{a.awarding_agent} · {a.award_year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* MEMBERSHIPS */}
          {memberships.length > 0 && (
            <Section title="Professional Memberships" icon="🤝" index={11}>
              <div style={styles.memGrid}>
                {memberships.map((m) => (
                  <div key={m.id} style={styles.memCard}>
                    <div style={styles.memDot} />
                    <div>
                      <div style={styles.memType}>{m.membershipType}</div>
                      <div style={styles.memInst}>{m.institution}</div>
                      <div style={styles.memId}>ID: {m.membershipId}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        .profile-section { transition: box-shadow 0.2s ease; }
        .profile-section:hover { box-shadow: 0 12px 48px rgba(99,102,241,0.15) !important; }
        button:hover:not(:disabled) { transform: translateY(-2px) !important; filter: brightness(1.07); }
      `}</style>
    </div>
  );
};

/* ================= STYLES ================= */
const styles = {
  pageContainer: { display: "flex", minHeight: "100vh", background: "#f0f2f8" },
  main: {
    flex: 1, marginLeft: "260px", minHeight: "100vh",
    padding: "32px 28px 60px",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    position: "relative", overflow: "hidden",
  },
  bgDeco1: {
    position: "fixed", top: "-200px", right: "-200px", width: "600px", height: "600px",
    background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
    borderRadius: "50%", pointerEvents: "none", zIndex: 0,
  },
  bgDeco2: {
    position: "fixed", bottom: "-150px", left: "100px", width: "500px", height: "500px",
    background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)",
    borderRadius: "50%", pointerEvents: "none", zIndex: 0,
  },
  topBar: {
    display: "flex", justifyContent: "flex-end", alignItems: "center",
    marginBottom: "28px", position: "relative", zIndex: 10,
  },
  exportBtn: {
    display: "flex", alignItems: "center", gap: "8px", padding: "12px 24px",
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "white", border: "none", borderRadius: "12px", fontSize: "14px",
    fontWeight: "600", cursor: "pointer", boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
    transition: "all 0.2s ease",
  },
  exportBtnDisabled: { opacity: 0.65, cursor: "not-allowed" },
  btnSpinner: {
    width: "14px", height: "14px",
    border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid white",
    borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite",
  },
  pageContent: {},
  heroCard: {
    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 60%, #1a1a3e 100%)",
    borderRadius: "24px", padding: "40px 44px",
    display: "flex", alignItems: "center", gap: "36px",
    marginBottom: "20px", position: "relative", overflow: "hidden",
    boxShadow: "0 20px 60px rgba(15,12,41,0.4)",
  },
  heroGradient: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    background: "radial-gradient(ellipse at top right, rgba(99,102,241,0.25) 0%, transparent 60%)",
    pointerEvents: "none",
  },
  heroLeft: { flexShrink: 0, position: "relative", zIndex: 1 },
  photoRing: {
    padding: "4px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)",
    borderRadius: "50%", boxShadow: "0 0 40px rgba(99,102,241,0.5)",
  },
  heroPhoto: { width: "130px", height: "130px", borderRadius: "50%", objectFit: "cover", display: "block" },
  heroInitials: {
    width: "130px", height: "130px", borderRadius: "50%",
    background: "linear-gradient(135deg, #1e1b4b, #312e81)",
    color: "#a5b4fc", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "48px", fontWeight: "700",
  },
  heroRight: { position: "relative", zIndex: 1 },
  heroName:  { fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "32px", fontWeight: "400", color: "#f8fafc", letterSpacing: "-0.5px", marginBottom: "6px" },
  heroDesig: { fontSize: "15px", color: "#a5b4fc", fontWeight: "600", marginBottom: "4px" },
  heroQual:  { fontSize: "13px", color: "#64748b", marginBottom: "16px" },
  heroMeta:  { display: "flex", gap: "12px", flexWrap: "wrap" },
  heroPill:  {
    display: "inline-flex", alignItems: "center", gap: "6px",
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "20px", padding: "5px 14px", color: "#cbd5e1", fontSize: "12.5px",
  },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "14px", marginBottom: "20px" },
  statCard: {
    background: "white", borderRadius: "16px", padding: "20px 16px",
    textAlign: "center", borderTop: "3px solid",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)", transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  statNum:   { fontFamily: "'DM Serif Display', serif", fontSize: "28px", fontWeight: "400", marginBottom: "4px" },
  statLabel: { fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" },
  infoCard: { background: "white", borderRadius: "20px", padding: "28px 32px", marginBottom: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" },
  infoCardTitle: { fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "20px" },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 40px" },
  infoItem: { display: "flex", alignItems: "baseline", padding: "6px 0", borderBottom: "1px solid #f1f5f9" },
  infoLabel: { fontSize: "13px", fontWeight: "700", color: "#64748b", minWidth: "130px", flexShrink: 0 },
  infoColon: { color: "#cbd5e1", margin: "0 10px", fontSize: "13px" },
  infoValue: { fontSize: "14px", color: "#1e293b", fontWeight: "500" },
  section: { background: "white", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: "20px", overflow: "hidden" },
  sectionHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 28px",
    background: "linear-gradient(135deg, #fafbff 0%, #f0f2ff 100%)",
    borderBottom: "1px solid #e8eaf6",
  },
  sectionHeaderInner: { display: "flex", alignItems: "center", gap: "14px" },
  sectionIconWrap: {
    width: "40px", height: "40px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: "12px", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "18px",
    boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
  },
  sectionTitle: { fontSize: "17px", fontWeight: "700", color: "#1e293b", margin: 0 },
  sectionIndex: { fontSize: "11px", fontWeight: "800", color: "#c7d2fe", letterSpacing: "1px" },
  sectionContent: { padding: "24px 28px" },
  timeline: { display: "flex", flexDirection: "column", gap: "2px" },
  timelineRow: {
    display: "flex", alignItems: "center", gap: "14px",
    padding: "12px 16px", borderRadius: "10px", transition: "background 0.1s",
  },
  timelineDot: {
    width: "10px", height: "10px", borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)", flexShrink: 0,
  },
  timelineMain: { flex: 1 },
  timelineTitle: { fontSize: "14px", fontWeight: "700", color: "#1e293b" },
  timelineDates: { fontSize: "12px", color: "#64748b", marginTop: "2px" },
  presentBadge: {
    background: "#dcfce7", color: "#16a34a", borderRadius: "10px",
    padding: "1px 8px", fontSize: "11px", fontWeight: "700",
  },
  statusChip: { borderRadius: "20px", padding: "4px 12px", fontSize: "11px", fontWeight: "700", whiteSpace: "nowrap" },
  statusApproved: { background: "#dcfce7", color: "#15803d" },
  statusPending:  { background: "#fef9c3", color: "#a16207" },
  qualGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px" },
  qualCard: {
    background: "linear-gradient(135deg, #f8f9ff, #eef2ff)",
    border: "1.5px solid #e0e7ff", borderRadius: "14px",
    padding: "18px 20px", position: "relative",
  },
  qualDegree: {
    display: "inline-block", background: "#6366f1", color: "white",
    borderRadius: "8px", padding: "3px 12px", fontSize: "11px",
    fontWeight: "700", letterSpacing: "0.5px", marginBottom: "10px",
  },
  qualMajor: { fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "4px" },
  qualInst:  { fontSize: "13px", color: "#475569", marginBottom: "2px" },
  qualUniv:  { fontSize: "12px", color: "#94a3b8", marginBottom: "8px" },
  qualYear:  { fontSize: "14px", fontWeight: "800", color: "#6366f1" },
  expRow: { display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px", borderRadius: "10px", marginBottom: "2px" },
  expTypeBadge: { borderRadius: "8px", padding: "4px 10px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.6px", flexShrink: 0 },
  expAcademic: { background: "#eef2ff", color: "#4338ca" },
  expIndustry: { background: "#fef3c7", color: "#92400e" },
  expMain: { flex: 1 },
  expTitle: { fontSize: "14px", fontWeight: "700", color: "#1e293b" },
  expInst:  { fontSize: "12px", color: "#64748b", marginTop: "2px" },
  expRight: { textAlign: "right", flexShrink: 0 },
  expDates: { fontSize: "12px", color: "#64748b" },
  expYears: { fontSize: "12px", fontWeight: "700", color: "#6366f1", marginTop: "2px" },
  subHead: {
    display: "flex", alignItems: "center", gap: "10px",
    fontSize: "13px", fontWeight: "700", color: "#4338ca",
    textTransform: "uppercase", letterSpacing: "0.8px",
    marginBottom: "12px", marginTop: "8px",
  },
  countBadge: { background: "#eef2ff", color: "#4338ca", borderRadius: "20px", padding: "2px 10px", fontSize: "11px" },
  pubList: { paddingLeft: "22px", margin: 0 },
  pubItem: { fontSize: "14px", lineHeight: "1.8", color: "#334155", marginBottom: "14px", textAlign: "justify" },
  addressBox: {
    background: "linear-gradient(135deg, #fafbff, #f0f4ff)",
    border: "1px solid #e0e7ff", borderRadius: "12px",
    padding: "20px 24px", borderLeft: "4px solid #6366f1",
  },
  addressLine: { fontSize: "15px", color: "#334155", lineHeight: "2", fontWeight: "500" },
  awardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" },
  awardCard: {
    display: "flex", alignItems: "flex-start", gap: "14px",
    background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
    border: "1px solid #fde68a", borderRadius: "14px", padding: "16px 18px",
    transition: "transform 0.2s ease",
  },
  awardName: { fontSize: "14px", fontWeight: "700", color: "#78350f", marginBottom: "3px" },
  awardMeta: { fontSize: "12.5px", color: "#92400e" },
  memGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" },
  memCard: { display: "flex", alignItems: "flex-start", gap: "12px", background: "#f8faff", border: "1px solid #e0e7ff", borderRadius: "12px", padding: "14px 16px" },
  memDot: { width: "10px", height: "10px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", flexShrink: 0, marginTop: "4px" },
  memType: { fontSize: "14px", fontWeight: "700", color: "#1e293b" },
  memInst: { fontSize: "13px", color: "#475569", marginTop: "2px" },
  memId:   { fontSize: "11px", color: "#94a3b8", marginTop: "2px" },
  loadingScreen: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f8" },
  loadingInner: { textAlign: "center" },
  loadingSpinner: {
    width: "48px", height: "48px", margin: "0 auto 16px",
    border: "4px solid #e0e7ff", borderTop: "4px solid #6366f1",
    borderRadius: "50%", animation: "spin 0.8s linear infinite",
  },
  loadingText: { color: "#6366f1", fontWeight: "600", fontSize: "16px" },
};

export default ViewDetails;

