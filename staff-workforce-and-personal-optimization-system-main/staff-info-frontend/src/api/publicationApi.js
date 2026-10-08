const BASE_URL = "http://localhost:5000/api/publication";

export async function addPublication(data) {
  const res = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to add publication");
  return res.json();
}

export async function getPublicationsByStaff(staffId) {
  const res = await fetch(`${BASE_URL}/staff/${staffId}`);
  return res.json();
}


export async function updatePublication(id, data) {
  const res = await fetch(`${BASE_URL}/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update publication");
  }

  return res.json();
}

export async function deletePublication(id) {
  return fetch(`${BASE_URL}/delete/${id}`, { method: "DELETE" });
}
