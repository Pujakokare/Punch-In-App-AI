import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";

export async function fetchPunches() {
  try {
    const res = await axios.get(`${API_URL}/api/punches`);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to load punches:", err.message);
    return [];
  }
}

export async function postPunch(punch) {
  try {
    const res = await axios.post(`${API_URL}/api/punchin`, punch);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to post punch:", err.message);
    throw err;
  }
}
