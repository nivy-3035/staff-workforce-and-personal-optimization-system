import * as conferenceModel from "../models/conferenceModel.js";
import path from "path";
import fs from "fs";

export async function createConference(req, res) {
  try {
    const {
      staffId,
      conference_type,
      activity_type,
      author_name,
      publication_year,
      paper_title,
      conference_title,
      conference_from,
      conference_to,
      location,
      page_from,
      page_to,
      place_of_publication,
      publisher,
    } = req.body;

    let fileName = null;

    /* ===== FILE RENAME (LIKE DESIGNATION) ===== */
    if (req.file) {
      const ext = path.extname(req.file.originalname);

      const [rows] = await conferenceModel.getConferenceCountByStaff(staffId);
      const count = rows[0].count + 1;

      const type =
        activity_type === "Paper Published"
          ? "paper-published"
          : "conference-attended";

      fileName = `${staffId}-${type}-${count}${ext}`;

      fs.renameSync(
        req.file.path,
        path.join("copies", fileName)
      );
    }

    /* ===== NULLIFICATION LOGIC ===== */
    const isAttended = activity_type === "Conference Attended";

    const data = [
      staffId,
      conference_type,
      activity_type,

      isAttended ? null : author_name,
      isAttended ? null : publication_year,
      isAttended ? null : paper_title,

      conference_title,
      conference_from,
      conference_to,
      location,

      isAttended ? null : page_from,
      isAttended ? null : page_to,
      isAttended ? null : place_of_publication,
      isAttended ? null : publisher,

      fileName,
    ];

    await conferenceModel.addConference(data);

    res.json({ message: "Conference details submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

export async function getMyConferences(req, res) {
  try {
    const [rows] = await conferenceModel.getConferenceByStaffId(
      req.params.staffId
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


/* ================= UPDATE ================= */
export async function updateConference(req, res) {
  try {
    const { id } = req.params;

    /* 1️⃣ Get existing record */
    const [rows] = await conferenceModel.getConferenceById(id);
    if (!rows.length) {
      return res.status(404).json({ message: "Conference not found" });
    }

    const old = rows[0];

    /* 2️⃣ Move old data to history */
    await conferenceModel.moveConferenceToHistory(id);

    const {
      conference_type,
      activity_type,
      author_name,
      publication_year,
      paper_title,
      conference_title,
      conference_from,
      conference_to,
      location,
      page_from,
      page_to,
      place_of_publication,
      publisher,
    } = req.body;

    let fileName = old.file_path;

    /* 3️⃣ Optional new file */
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      fileName = `${old.staffId}-conference-updated-${Date.now()}${ext}`;
      fs.renameSync(req.file.path, path.join("copies", fileName));
    }

    const isAttended = activity_type === "Conference Attended";

    const data = [
      conference_type,
      activity_type,
      isAttended ? null : author_name,
      isAttended ? null : publication_year,
      isAttended ? null : paper_title,
      conference_title,
      conference_from,
      conference_to,
      location,
      isAttended ? null : page_from,
      isAttended ? null : page_to,
      isAttended ? null : place_of_publication,
      isAttended ? null : publisher,
      fileName,
    ];

    await conferenceModel.updateConference(id, data);

    res.json({
      message: "Conference updated and history saved",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}