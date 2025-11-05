import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "";

export const getPunches = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/punches`);
    return res.data;
  } catch (error) {
    console.error("Failed to load punches:", error.message);
    throw error;
  }
};

export const postPunch = async (punchTime) => {
  try {
    const res = await axios.post(`${API_URL}/api/punchin`, { punchTime });
    return res.data;
  } catch (error) {
    console.error("Failed to post punch:", error.message);
    throw error;
  }
};



// import axios from "axios";

// // If running on Render, this will be your backend base URL
// const API_BASE = process.env.REACT_APP_API_URL || "";

// // ✅ Fetch all punches
// export async function fetchPunches() {
//   try {
//     const response = await axios.get(`${API_BASE}/api/punches`);
//     const contentType = response.headers["content-type"] || "";
//     if (contentType.includes("text/html")) {
//       console.error("Unexpected API response (HTML instead of JSON):", response.data);
//       throw new Error("Unexpected API response — check backend routes");
//     }
//     return response.data;
//   } catch (err) {
//     console.error("Failed to load punches:", err);
//     throw new Error("Failed to load punches: " + err.message);
//   }
// }

// // ✅ Save a new punch
// export async function postPunch(payload) {
//   try {
//     const response = await axios.post(`${API_BASE}/api/punchin`, payload);
//     const contentType = response.headers["content-type"] || "";
//     if (contentType.includes("text/html")) {
//       console.error("Unexpected API response (HTML instead of JSON):", response.data);
//       throw new Error("Unexpected API response — check backend routes");
//     }
//     return response.data;
//   } catch (err) {
//     console.error("Failed to post punch:", err);
//     throw new Error("Failed to post punch: " + err.message);
//   }
// }




// import axios from "axios";

// const API_BASE = process.env.REACT_APP_API_URL || " ";

// export async function fetchPunches() {
//   try {
//     const response = await axios.get(`${API_BASE}/punches`);
//     return response.data;
//   } catch (err) {
//     console.error("Failed to load punches:", err);
//     throw new Error("Failed to load punches:" + err.message);
//   }
// }

// export async function postPunch(payload) {
//   try {
//     const response = await axios.post(`${API_BASE}/punchin`, payload);
//     return response.data;
//   } catch (err) {
//     console.error("Failed to post punch:", err);
//     throw new Error("Failed to post punch:" +err.message);
//   }
// }
