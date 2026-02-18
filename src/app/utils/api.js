// utils/cmnapi.js

// ✅ Auto switch local / production
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ---------------- LOGIN ----------------
export async function loginUser(username, password) {
  try {
    const res = await fetch(`${BASE_URL}/auth/access`, {
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
    const res = await fetch(`${BASE_URL}/homepage`, {
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
    const res = await fetch(`${BASE_URL}/homepage/story`, {
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
    const res = await fetch(`${BASE_URL}/homepage/digital`, {
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
