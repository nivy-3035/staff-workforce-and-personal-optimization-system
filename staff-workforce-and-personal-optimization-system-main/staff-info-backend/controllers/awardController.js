import * as awardModel from "../models/awardModel.js";

export async function addAward(req, res) {
  try {
    
    const { staffId, awardName, awardingAgent, awardYear } = req.body;
    if (!staffId) {
      return res.status(400).json({ message: "Staff ID required" });
    }

    // ✅ Pass as array directly to model (like membership does)
    await awardModel.addAward([
      staffId,
      awardName,
      awardingAgent,
      awardYear,
    ]);

    res.status(201).json({ message: "Award added successfully" });
  } catch (err) {
    console.error(" Error:", err);
    res.status(500).json({ message: "Failed to add award" });
  }
}

export async function getAwardsByStaff(req, res) {
  try {
    const [rows] = await awardModel.getAwardsByStaffId(req.params.staffId);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateAward(req, res) {
  try {
    const { id } = req.params;

    const {
      awardName,
      awardingAgent,
      awardYear,
    } = req.body;

    if (!awardName || !awardingAgent || !awardYear) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await awardModel.updateAward([
      awardName,
      awardingAgent,
      awardYear,
      id,
    ]);

    res.json({ message: "Award updated successfully (history saved)" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Failed to update award" });
  }
}
