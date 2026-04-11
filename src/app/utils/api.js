// utils/cmnapi.js

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://gujarat-national-news-backend.onrender.com";

// ✅ Safety check — log in dev to confirm it's correct
if (typeof window !== "undefined") {
}

// ---------------- LOGIN ----------------
export async function loginUser(username, password) {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/access`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Login failed");
    }

    return data;
  } catch (err) {
    console.error("Login Error:", err);
    throw err;
  }
}

// ---------------- HOMEPAGE NEWS ----------------
export async function getHomePageNews() {
  try {
    const res = await fetch(`${BASE_URL}/api/homepage`, {
      cache: "no-store", // always fresh data
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch homepage news");
    }

    return data;
  } catch (err) {
    console.error("Homepage API Error:", err);
    throw err;
  }
}

// ---------------- STORY NEWS ----------------
export async function fetchStoryNews() {
  try {
    const res = await fetch(`${BASE_URL}/api/homepage/story`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch story news");
    }

    return await res.json();
  } catch (err) {
    console.error("Story API Error:", err);
    throw err;
  }
}

// ---------------- DIGITAL NEWS ----------------
export async function fetchDigitalNews() {
  try {
    const res = await fetch(`${BASE_URL}/api/homepage/digital`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch digital news");
    }

    return await res.json();
  } catch (err) {
    console.error("Digital API Error:", err);
    throw err;
  }
}

// ---------------- GET FULL URL ----------------
export const getFullUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_URL}${cleanPath}`;
};

// ---------------- SINGLE NEWS BY ID ----------------
export async function fetchNewsById(id) {
  try {
    const res = await fetch(`${BASE_URL}/api/homepage/news/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("News not found");

    return await res.json();
  } catch (err) {
    console.error("News Detail API Error:", err);
    return null;
  }
}
