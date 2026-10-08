import * as publicationModel from "../models/publicationModel.js";

export async function addPublication(req, res) {
  try {
    await publicationModel.addPublication(req.body);
    res.json({ message: "Publication added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getPublicationsByStaff(req, res) {
  try {
    const [rows] = await publicationModel.getByStaffId(req.params.staffId);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


/* UPDATE */
export async function updatePublication(req, res) {
  try {
    const { id } = req.params;

    /* 1️⃣ Get existing publication */
    const [rows] = await publicationModel.getById(id);
    if (!rows.length) {
      return res.status(404).json({ message: "Publication not found" });
    }

    /* 2️⃣ Move old data to history */
    await publicationModel.moveToHistory(id);

    /* 3️⃣ Update with new data */
    await publicationModel.updatePublication(id, req.body);

    res.json({ message: "Publication updated and history saved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}