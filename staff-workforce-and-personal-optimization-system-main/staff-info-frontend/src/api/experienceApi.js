const BASE_URL = "http://localhost:5000/api/experience";

/* ================================
// ADD EXPERIENCE (STAFF)
=============================== */
export async function addExperience(formData) {
  const response = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to add experience");
  return response.json();
}

/* ================================
// GET MY EXPERIENCES (STAFF)
=============================== */
export async function getMyExperiences(staffId) {
  const response = await fetch(`${BASE_URL}/staff/${staffId}`); // ✅ fixed
  if (!response.ok) throw new Error("Failed to fetch experiences");
  return response.json();
}

/* ================================
// GET ALL EXPERIENCES (ADMIN)
=============================== */
export async function getAllExperiences() {
  const response = await fetch(`${BASE_URL}/admin/all`); // ✅ fixed
  if (!response.ok) throw new Error("Failed to fetch experience list");
  return response.json();
}

/* ================================
// UPDATE STATUS (ADMIN)
=============================== */
export async function updateExperienceStatus(id, flag) { // use flag
  const response = await fetch(`${BASE_URL}/admin/status/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flag }), // <-- must match DB column
  });

  if (!response.ok) throw new Error("Failed to update experience status");
  return response.json();
}


export async function updateExperience(id, data) {
  const response = await fetch(`${BASE_URL}/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error("Failed to update experience");
  return response.json();
}

