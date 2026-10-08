import * as membershipModel from "../models/membershipModel.js";

// ADD MEMBERSHIP
export async function addMembership(req, res) {
  try {
    const { staffId, membershipType, institution, membershipId } = req.body;

    if (!staffId) {
      return res.status(400).json({ message: "Staff ID required" });
    }

    await membershipModel.addMembership([
      staffId,
      membershipType,
      institution,
      membershipId,
    ]);

    res.status(201).json({ message: "Membership added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add membership" });
  }
}

// GET BY STAFF
export async function getMembershipByStaff(req, res) {
  try {
    const [rows] = await membershipModel.getMembershipByStaffId(
      req.params.staffId
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch memberships" });
  }
}


/* UPDATE + HISTORY */
export async function updateMembershipById(req, res) {
  try {
    const { id } = req.params;
    const { membershipType, institution, membershipId } = req.body;

    // 1️⃣ Get OLD membership (by staffId)
    const [rows] =
      await membershipModel.getMembershipById(id);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Membership not found" });
    }

    const old = rows[0];

    // 2️⃣ Save OLD data to history
    await membershipModel.addMembershipHistory([
      old.id,
      old.staffId,
      old.membershipType,
      old.institution,
      old.membershipId,
    ]);

    // 3️⃣ Update membership using staffId
    const [result] =
      await membershipModel.updateMembershipById(id, [
        membershipType,
        institution,
        membershipId,
      ]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Update failed" });
    }

    res.json({ message: "Membership updated & history saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
}
