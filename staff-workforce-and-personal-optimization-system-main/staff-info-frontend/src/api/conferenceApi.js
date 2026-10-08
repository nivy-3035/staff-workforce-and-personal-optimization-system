const BASE = "http://localhost:5000/api/conference";

export async function addConference(formData) {
  const res = await fetch(BASE, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function getMyConferences(staffId) {
  const res = await fetch(`${BASE}/staff/${staffId}`);
  return res.json();
}


export async function updateConference(id, formData) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    body: formData,
  });
  return res.json();
}