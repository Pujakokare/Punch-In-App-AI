import React, { useState, useEffect } from "react";
import { fetchPunches, postPunch } from "./api";

function App() {
  const [punches, setPunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPunches();
  }, []);

  async function loadPunches() {
    const data = await fetchPunches();
    setPunches(data);
    setLoading(false);
  }

  async function handlePunchIn() {
    const now = new Date().toLocaleString();
    const newPunch = { time: now };

    try {
      await postPunch(newPunch);
      setPunches(prev => [newPunch, ...prev]);
    } catch (err) {
      alert("❌ Error saving punch");
    }
  }

  if (loading) return <h3>Loading...</h3>;

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
      <h1>🕒 Punch-In App</h1>
      <button
        onClick={handlePunchIn}
        style={{ padding: "10px 20px", fontSize: "18px", cursor: "pointer", borderRadius: "8px" }}
      >
        Punch In
      </button>

      <h3 style={{ marginTop: "40px" }}>📅 Your Punches</h3>
      {punches.length === 0 ? (
        <p>No punches yet!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {punches.map((p, i) => (
            <li key={i} style={{ marginBottom: "8px" }}>{p.time}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
