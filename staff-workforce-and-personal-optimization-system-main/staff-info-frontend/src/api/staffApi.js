const BASE_URL = "http://localhost:5000/api/staff";

export async function addstaff(data){
  const response = await fetch(BASE_URL, {
    method: "POST",
    body: data,
  });
  if (!response.ok) throw new Error("Failed to add staff");
  return response.json();
}
export async function getStaffByStaffId(staffId) {
  const response = await fetch(`http://localhost:5000/api/staff/${staffId}`);
  if (!response.ok) throw new Error("Failed to fetch staff");
  return response.json();
}

export async function updateStaffByStaffId(staffId, data) {
  const response = await fetch(`${BASE_URL}/staff/${staffId}`, {
    method: "PUT",
    body: data, // FormData
  });
  if (!response.ok) throw new Error("Failed to update staff");
  return response.json();
}


/* ================= UPDATE DESIGNATION ================= */
export async function updateDesignation(id, data) {
  const res = await fetch(
    `http://localhost:5000/api/designation/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}



export async function getAllStaff() {
  const response = await fetch(`${BASE_URL}`);
  if (!response.ok) {
    throw new Error("Failed to fetch staff list");
  }
  return response.json();
}

// 2. Search staff
export async function searchStaff(query) {
  const response = await fetch(`${BASE_URL}/search/${query}`);
  if (!response.ok) {
    throw new Error("Failed to search staff");
  }
  return response.json();
}

export async function editStaff(staffId, formData) {
  const response = await fetch(`${BASE_URL}/${staffId}`, {
    method: "PUT",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to update staff");

  return response.json();
}

export async function fetchStaffList() {
  const response = await fetch(`http://localhost:5000/api/staff/`);
  if (!response.ok) throw new Error("Failed to fetch staff list");
  return response.json();
}

export async function fetchStaffById(staffId) {
  const response = await fetch(`http://localhost:5000/api/staff/${staffId}`);
  if (!response.ok) throw new Error("Failed to fetch staff details");
  return response.json();
}


export async function deleteStaff(staffId) {
  const response = await fetch(`http://localhost:5000/api/staff/${staffId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (!response.ok) {
    throw new Error("Failed to delete staff");
  }

  return response.json();
}




export async function changePassword(username, oldPassword, newPassword) {
  const res = await fetch(`${BASE_URL}/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, oldPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok){
	throw new Error(data.message);
}
 return data;
}


export async function signin(username, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Login failed");
  }

  return response.json();
}
export async function updateStaffById(id, formData){
  const res = await fetch(`http://localhost:5000/staff/${id}`, {
    method: "PUT",
    body: formData,
  });
  return res.json();
};


export async function staffSignin(username, password) {
  const res = await fetch("http://localhost:5000/api/staff/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
}


export async function staffSendOtp(email) {
  return fetch("http://localhost:5000/api/staff/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function updateStaffContact(staffId, data) {
  const response = await fetch(
    `http://localhost:5000/api/staff/contact/${staffId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) throw new Error("Failed to update contact");

  return response.json();
}


  const BASE = "http://localhost:5000/api/designation";

export async function addDesignation(formData) {
  const res = await fetch(BASE, { method: "POST", body: formData });
  return res.json();
}

export async function getMyDesignations(staffId) {
  const res = await fetch(`${BASE}/staff/${staffId}`);
  return res.json();
}

/* ✅ ADD THIS (ADMIN) */
export async function getAllDesignations() {
  const res = await fetch(`${BASE}/admin`);
  return res.json();
}

export async function updateDesignationStatus(id, flag) {
  const res = await fetch(`${BASE}/status/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ flag }),
  });
  return res.json();
}
