const BASE_URL = "http://localhost:5000/api/qualifications";

/* ================================
   ADD QUALIFICATION (STAFF)
   ================================ */
export async function addQualification(formData) {
  const response = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    body: formData, // multipart/form-data (image upload)
  });

  if (!response.ok) {
    throw new Error("Failed to add qualification");
  }

  return response.json();
}

/* ================================
   GET MY QUALIFICATIONS (STAFF)
   ================================ */
export async function getMyQualifications(staffId) {
  const response = await fetch(`${BASE_URL}/staff/${staffId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch qualifications");
  }

  return response.json();
}

/* ================================
   GET ALL QUALIFICATIONS (ADMIN)
   ================================ */
export async function getAllQualifications() {
  const response = await fetch(`${BASE_URL}/admin/all`);

  if (!response.ok) {
    throw new Error("Failed to fetch qualification list");
  }

  return response.json();
}

/* ================================
   UPDATE STATUS (ADMIN)
   status:
   0 = Awaiting
   1 = Approved
   2 = Rejected
   ================================ */
export async function updateQualificationStatus(id, status) {
  const response = await fetch(
    `${BASE_URL}/admin/status/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update status");
  }

  return response.json();
}
/* UPDATE QUALIFICATION */
export async function updateQualification(id, formData) {
  const res = await fetch(`${BASE_URL}/update/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) throw new Error("Update failed");
  return res.json();
}