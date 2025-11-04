import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";

export async function getPunches() {
  try {
    const response = await axios.get(`${API_URL}/punchin`);
    return response.data;
  } catch (err) {
    console.error("Failed to load punches:", err);
    throw new Error("Failed to load punches");
  }
}

export async function savePunch(time, note) {
  try {
    const response = await axios.post(`${API_URL}/punchin`, { time, note });
    return response.data;
  } catch (err) {
    console.error("Failed to post punch:", err);
    throw new Error("Failed to post punch");
  }
}
