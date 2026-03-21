const API_BASE_URL = "https://tharagai-api.onrender.com";
// const API_BASE_URL = "http://localhost:3001";


async function parseResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      data?.error ||
      data?.message ||
      data?.errors?.[0]?.msg ||
      "Request failed";
    throw new Error(message);
  }
  return data;
}

export async function loginApi(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseResponse(res);
}

export async function registerApi({ email, password, firstName, lastName }) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, firstName, lastName }),
  });
  return parseResponse(res);
}
