const BASE_URL = "http://localhost:5000/api/membership";

export async function addMembership(data) {
  const res = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to add membership");
  return res.json();
}

export async function getMembershipByStaff(staffId) {
  const res = await fetch(`${BASE_URL}/staff/${staffId}`);
  if (!res.ok) throw new Error("Failed to fetch membership");
  return res.json();
}

export async function updateMembership(id, data) {
  const res = await fetch(`${BASE_URL}/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Update failed");
  return res.json();
}
