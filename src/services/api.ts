const API_BASE = "/api";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("parksmart_token");
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// ============ AUTH ============

export interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string };
}

export async function apiSignup(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Signup failed");
  return data;
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
}

export async function apiGetMe(): Promise<{ user: { id: string; name: string; email: string } }> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Auth check failed");
  return data;
}

// ============ SPOTS ============

import { ParkingSpot } from "@/data/parkingSpots";

export async function apiGetSpots(): Promise<ParkingSpot[]> {
  const res = await fetch(`${API_BASE}/spots`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch spots");
  return data;
}

// ============ REPORTS ============

export async function apiSubmitReport(spotId: string, type: "safe" | "fine" | "theft") {
  const res = await fetch(`${API_BASE}/reports`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ spotId, type }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to submit report");
  return data;
}
