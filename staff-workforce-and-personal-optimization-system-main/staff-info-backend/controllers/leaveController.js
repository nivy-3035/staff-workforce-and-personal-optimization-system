import * as leaveModel from "../models/leaveModel.js";

/* APPLY LEAVE */
export async function applyLeave(req, res) {
  try {
    const { staffId, leaveType, fromDate, toDate, reason } = req.body;

    await leaveModel.createBalanceIfNotExists(staffId);

    await leaveModel.applyLeave([
      staffId,
      leaveType,
      fromDate,
      toDate,
      reason,
    ]);

    res.json({ message: "Leave applied successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

/* STAFF VIEW */
export async function getMyLeave(req, res) {
  const [rows] = await leaveModel.getLeaveByStaff(req.params.staffId);
  res.json(rows);
}

/* ADMIN VIEW */
export async function getAllLeave(req, res) {
  const [rows] = await leaveModel.getAllLeave();
  res.json(rows);
}

/* ADMIN APPROVAL */
export async function updateLeaveStatus(req, res) {
  const { id } = req.params;
  const { status, staffId, leaveType } = req.body;

  await leaveModel.updateLeaveStatus(id, status);

  if (status == 1) {
    await leaveModel.deductLeave(staffId, leaveType);
  }

  res.json({ message: "Status updated" });
}

/* ADMIN - Pending Leave Count */
export async function getPendingLeaveCount(req, res) {
  try {
    const [rows] = await leaveModel.getPendingLeaveCount();
    res.json({ count: rows[0].count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}