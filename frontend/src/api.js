import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://punch-in-app-ai.onrender.com/api";

export async function fetchPunches() {
  try {
    const response = await axios.get(`${API_BASE}/punchin`);
    return response.data;
  } catch (err) {
    console.error("Failed to load punches:", err);
    throw new Error("Failed to load punches:" + err.message);
  }
}

export async function postPunch(payload) {
  try {
    const response = await axios.post(`${API_BASE}/punchin`, payload);
    return response.data;
  } catch (err) {
    console.error("Failed to post punch:", err);
    throw new Error("Failed to post punch:" +err.message);
  }
}
