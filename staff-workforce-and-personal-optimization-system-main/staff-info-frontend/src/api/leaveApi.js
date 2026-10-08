const BASE = "http://localhost:5000/api/leave";

export async function applyLeave(data) {
  const res = await fetch(`${BASE}/apply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getMyLeave(staffId) {
  const res = await fetch(`${BASE}/staff/${staffId}`);
  return res.json();
}

export async function getAllLeave() {
  const res = await fetch(`${BASE}/admin/all`);
  return res.json();
}

export async function updateLeaveStatus(id, data) {
  const res = await fetch(`${BASE}/admin/status/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getPendingLeaveCount() {
  const res = await fetch(`${BASE}/admin/pending-count`);
  return res.json();
}