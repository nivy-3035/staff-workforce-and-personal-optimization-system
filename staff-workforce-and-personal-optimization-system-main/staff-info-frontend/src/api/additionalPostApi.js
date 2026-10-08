const BASE_URL = "http://localhost:5000/api/additional-posts";

export async function addAdditionalPost(formData) {
  const res = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function getMyAdditionalPosts(staffId) {
  const res = await fetch(`${BASE_URL}/staff/${staffId}`);
  return res.json();
}

export async function getAllAdditionalPosts() {
  const res = await fetch(`${BASE_URL}/admin/all`);
  return res.json();
}

export async function updateAdditionalPostStatus(id, status) {
  const res = await fetch(`${BASE_URL}/admin/status/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function updateAdditionalPost(id, formData) {
  const res = await fetch(`${BASE_URL}/update/${id}`, {
    method: "PUT",
    body: formData,
  });
  return res.json();
}
