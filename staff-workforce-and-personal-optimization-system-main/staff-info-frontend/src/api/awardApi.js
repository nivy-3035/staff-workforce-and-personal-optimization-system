const BASE_URL = "http://localhost:5000/api/award";

export async function addAward(data) {
  const res = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to add award");
  return res.json();
}

export async function getAwardsByStaff(staffId) {
  const res = await fetch(`${BASE_URL}/staff/${staffId}`);
  if (!res.ok) throw new Error("Failed to fetch awards");
  return res.json();
}

export async function updateAward(id, data) {
  const res = await fetch(`${BASE_URL}/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update award");
  return res.json();
}

