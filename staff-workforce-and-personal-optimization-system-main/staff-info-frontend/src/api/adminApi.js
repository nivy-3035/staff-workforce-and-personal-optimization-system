export async function adminSignin(username, password) {
  return fetch("http://localhost:5000/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}

export async function adminSendOtp(email) {
  return fetch("http://localhost:5000/api/admin/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}
export async function getPendingApprovals() {
  const res = await fetch("http://localhost:5000/api/admin/pending-counts");
  return res.json(); // { designation: 2, qualification: 1, additionalPost: 0 }
}
