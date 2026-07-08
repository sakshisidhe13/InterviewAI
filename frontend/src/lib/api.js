// FILE: src/lib/api.js
// Centralizes all calls to the backend so every page does it the same way.

const API_BASE = "http://localhost:5000/api";

// Reads the saved login token (set after a successful login/signup)
function getToken() {
  return localStorage.getItem("token");
}

// Generic request helper — adds the auth token automatically when present
async function request(path, options = {}) {
  const token = getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }

  return data;
}

export const api = {
  // ── AUTH ────────────────────────────────────────────────────────
  signup: (name, email, password) =>
    request("/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) }),

  login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  getMe: () => request("/auth/me"),

  // ── INTERVIEWS ──────────────────────────────────────────────────
  getInterviews: () => request("/interviews"),

  createInterview: (company, role, score, notes) =>
    request("/interviews", { method: "POST", body: JSON.stringify({ company, role, score, notes }) }),

  // ── RESUMES ─────────────────────────────────────────────────────
  getResumes: () => request("/resumes"),

  createResume: (score, feedback) =>
    request("/resumes", { method: "POST", body: JSON.stringify({ score, feedback }) }),

  // ── AI FEATURES ─────────────────────────────────────────────────
  getInterviewFeedback: (company, role, score, notes) =>
    request("/ai/interview-feedback", { method: "POST", body: JSON.stringify({ company, role, score, notes }) }),

  getResumeFeedback: (score, feedback) =>
    request("/ai/resume-feedback", { method: "POST", body: JSON.stringify({ score, feedback }) }),

  generateQuestions: (company, role) =>
    request("/ai/generate-questions", { method: "POST", body: JSON.stringify({ company, role }) }),

  // ── AI RESUME UPLOAD ────────────────────────────────────────────
  // This one is different — sends a file, not JSON
  analyzeResume: (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    const token = getToken();
    return fetch(`${API_BASE}/ai/analyze-resume`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Something went wrong.");
      return data;
    });
  },
};

export function saveSession(user, token) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function isLoggedIn() {
  return !!getToken();
}

export function getSavedUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}