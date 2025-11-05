import React, { useState, useEffect } from "react";
import "./App.css";
import { getPunches, addPunch } from "./api";

function App() {
  const [punches, setPunches] = useState([]);
  const [useLocalTime, setUseLocalTime] = useState(true);
  const [note, setNote] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("");
  const [motivationalMessage, setMotivationalMessage] = useState("");

  useEffect(() => {
    updateGreeting();
    loadPunches();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateGreeting();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("🌞 Good Morning!");
      setMotivationalMessage("Start your day with energy and purpose. Let’s make it count!");
    } else if (hour < 18) {
      setGreeting("🌤 Good Afternoon!");
      setMotivationalMessage("Keep going! You’re doing amazing things today.");
    } else {
      setGreeting("🌙 Good Evening!");
      setMotivationalMessage("You’ve worked hard today. Reflect and recharge for tomorrow.");
    }
  };

  const loadPunches = async () => {
    const data = await getPunches();
    setPunches(data);
  };

  const handlePunchIn = async () => {
    const time = useLocalTime ? new Date().toISOString() : new Date().toISOString();
    await addPunch({ time, note });
    setNote("");
    await loadPunches();
    updateGreeting();
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="app-title">⏰ Punch-In Dashboard</h1>
        <p className="time-display">{currentTime.toLocaleString()}</p>
        <h2 className="greeting">{greeting}</h2>
        <p className="motivation">{motivationalMessage}</p>
      </header>

      <section className="punch-section">
        <div className="punch-card">
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={useLocalTime}
                onChange={() => setUseLocalTime(!useLocalTime)}
              />{" "}
              Use local time
            </label>
          </div>

          <div className="form-group">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)"
              className="note-input"
            />
          </div>

          <button onClick={handlePunchIn} className="btn-punch">
            🕒 Punch In
          </button>
        </div>
      </section>

      <section className="punch-history">
        <h2>📅 Recent Punches</h2>
        {punches.length === 0 ? (
          <p>No punches yet — your journey starts with the first click!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Punch Time</th>
                <th>Note</th>
                <th>Recorded At</th>
              </tr>
            </thead>
            <tbody>
              {punches
                .slice()
                .reverse()
                .map((p, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{new Date(p.time).toLocaleString()}</td>
                    <td>{p.note || "—"}</td>
                    <td>{new Date(p.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
        <p className="footer-note">
          Times stored in UTC (ISO). Displayed in your local time zone.
        </p>
      </section>
    </div>
  );
}

export default App;






// import React, { useState, useEffect } from "react";
// import { fetchPunches, postPunch } from "./api";

// function App() {
//   const [punches, setPunches] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadPunches();
//   }, []);

//   async function loadPunches() {
//     const data = await fetchPunches();
//     setPunches(data);
//     setLoading(false);
//   }

//   async function handlePunchIn() {
//     const now = new Date().toLocaleString();
//     const newPunch = { time: now };

//     try {
//       await postPunch(newPunch);
//       setPunches(prev => [newPunch, ...prev]);
//     } catch (err) {
//       alert("❌ Error saving punch");
//     }
//   }

//   if (loading) return <h3>Loading...</h3>;

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
//       <h1>🕒 Punch-In App</h1>
//       <button
//         onClick={handlePunchIn}
//         style={{ padding: "10px 20px", fontSize: "18px", cursor: "pointer", borderRadius: "8px" }}
//       >
//         Punch In
//       </button>

//       <h3 style={{ marginTop: "40px" }}>📅 Your Punches</h3>
//       {punches.length === 0 ? (
//         <p>No punches yet!</p>
//       ) : (
//         <ul style={{ listStyle: "none", padding: 0 }}>
//           {punches.map((p, i) => (
//             <li key={i} style={{ marginBottom: "8px" }}>{p.time}</li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default App;
