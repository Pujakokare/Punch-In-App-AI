import React, { useEffect, useState } from 'react';
import { fetchPunches, postPunch } from './api';

// Format Date -> local datetime-local value "YYYY-MM-DDTHH:MM"
function toLocalDatetimeInputValue(date = new Date()) {
  const pad = n => String(n).padStart(2, '0');
  const YYYY = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const DD = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
}

export default function App() {
  const [punches, setPunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manualMode, setManualMode] = useState(false);
  const [manualTime, setManualTime] = useState(toLocalDatetimeInputValue());
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');

  async function load() {
    try {
      setLoading(true);
      const data = await fetchPunches();

      // ✅ Ensure we only set valid arrays
      if (Array.isArray(data)) {
        setPunches(data);
      } else {
        console.warn('Unexpected API response:', data);
        setPunches([]);
        setStatus('Invalid response from server');
      }
    } catch (e) {
      console.error(e);
      setStatus('Failed to load punches: ' + e.message);
      setPunches([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handlePunch(e) {
    e.preventDefault();
    setStatus('Sending...');

    const payload = {
      manual: manualMode,
      note: note || ''
    };

    if (manualMode) {
      // Send ISO string with local offset
      const local = new Date(manualTime);
      payload.localTime = local.toISOString();
    } else {
      payload.localTime = new Date().toISOString();
    }

    try {
      await postPunch(payload);
      setStatus('✅ Punch saved!');
      setNote('');
      setManualTime(toLocalDatetimeInputValue());
      await load();
    } catch (err) {
      console.error(err);
      setStatus('Error saving punch: ' + err.message);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Punch In App</h1>

      <form onSubmit={handlePunch} style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={manualMode}
            onChange={e => setManualMode(e.target.checked)}
          />{' '}
          Use manual time
        </label>

        {manualMode ? (
          <input
            type="datetime-local"
            value={manualTime}
            onChange={e => setManualTime(e.target.value)}
            style={{ padding: 8, fontSize: 16 }}
          />
        ) : (
          <div style={{ marginBottom: 10 }}>
            <strong>Local time will be used:</strong>{' '}
            {new Date().toLocaleString()}
          </div>
        )}

        <div style={{ marginTop: 10 }}>
          <input
            placeholder="Optional note"
            value={note}
            onChange={e => setNote(e.target.value)}
            style={{ padding: 8, width: '100%', fontSize: 16 }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit" style={{ padding: '8px 16px', fontSize: 16 }}>
            Punch In
          </button>
          <span style={{ marginLeft: 10 }}>{status}</span>
        </div>
      </form>

      <h2>Recent punches</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                Time (server)
              </th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                Local time
              </th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                Manual
              </th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                Note
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(punches) && punches.length === 0 && (
              <tr>
                <td colSpan="4">No punches yet</td>
              </tr>
            )}
            {Array.isArray(punches) &&
              punches.map(p => (
                <tr key={p.id || p.timestamp}>
                  <td
                    style={{
                      padding: 6,
                      borderBottom: '1px solid #f3f3f3'
                    }}
                  >
                    {p.timestamp
                      ? new Date(p.timestamp).toLocaleString()
                      : '-'}
                  </td>
                  <td
                    style={{
                      padding: 6,
                      borderBottom: '1px solid #f3f3f3'
                    }}
                  >
                    {p.localTime
                      ? new Date(p.localTime).toLocaleString()
                      : '-'}
                  </td>
                  <td
                    style={{
                      padding: 6,
                      borderBottom: '1px solid #f3f3f3'
                    }}
                  >
                    {p.manual ? 'Yes' : 'No'}
                  </td>
                  <td
                    style={{
                      padding: 6,
                      borderBottom: '1px solid #f3f3f3'
                    }}
                  >
                    {p.note || '-'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
























// import React, { useEffect, useState } from 'react';
// import { fetchPunches, postPunch } from './api';

// // Format Date -> local datetime-local value "YYYY-MM-DDTHH:MM"
// function toLocalDatetimeInputValue(date = new Date()) {
//   const pad = n => String(n).padStart(2, '0');
//   const YYYY = date.getFullYear();
//   const MM = pad(date.getMonth() + 1);
//   const DD = pad(date.getDate());
//   const hh = pad(date.getHours());
//   const mm = pad(date.getMinutes());
//   return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
// }

// export default function App() {
//   const [punches, setPunches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [manualMode, setManualMode] = useState(false);
//   const [manualTime, setManualTime] = useState(toLocalDatetimeInputValue());
//   const [note, setNote] = useState('');
//   const [status, setStatus] = useState('');

//   async function load() {
//     try {
//       setLoading(true);
//       const data = await fetchPunches();
//       setPunches(data);
//     } catch (e) {
//       console.error(e);
//       setStatus('Failed to load punches: ' + e.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => { load(); }, []);

//   async function handlePunch(e) {
//     e.preventDefault();
//     setStatus('Sending...');
//     const payload = {
//       manual: manualMode,
//       note: note || ''
//     };
//     if (manualMode) {
//       // Send ISO string with local offset
//       const local = new Date(manualTime);
//       payload.localTime = local.toISOString();
//     } else {
//       payload.localTime = new Date().toISOString();
//     }

//     try {
//       await postPunch(payload);
//       setStatus('Punch saved!');
//       setNote('');
//       setManualTime(toLocalDatetimeInputValue());
//       await load();
//     } catch (err) {
//       console.error(err);
//       setStatus('Error saving punch: ' + err.message);
//     }
//   }

//   return (
//     <div style={{ maxWidth: 800, margin: 20, fontFamily: 'Arial, sans-serif' }}>
//       <h1>Punch In App</h1>

//       <form onSubmit={handlePunch} style={{ marginBottom: 20 }}>
//         <label style={{ display:'block', marginBottom:8 }}>
//           <input
//             type="checkbox"
//             checked={manualMode}
//             onChange={e => setManualMode(e.target.checked)}
//           /> Use manual time
//         </label>

//         {manualMode ? (
//           <input
//             type="datetime-local"
//             value={manualTime}
//             onChange={e => setManualTime(e.target.value)}
//             style={{ padding:8, fontSize:16 }}
//           />
//         ) : (
//           <div style={{ marginBottom: 10 }}>
//             <strong>Local time will be used:</strong> {new Date().toLocaleString()}
//           </div>
//         )}

//         <div style={{ marginTop:10 }}>
//           <input
//             placeholder="Optional note"
//             value={note}
//             onChange={e => setNote(e.target.value)}
//             style={{ padding:8, width:'100%', fontSize:16 }}
//           />
//         </div>

//         <div style={{ marginTop:12 }}>
//           <button type="submit" style={{ padding:'8px 16px', fontSize:16 }}>
//             Punch In
//           </button>
//           <span style={{ marginLeft:10 }}>{status}</span>
//         </div>
//       </form>

//       <h2>Recent punches</h2>
//       {loading ? <div>Loading...</div> : (
//         <table style={{ width:'100%', borderCollapse:'collapse' }}>
//           <thead>
//             <tr>
//               <th style={{ textAlign:'left', borderBottom:'1px solid #ddd' }}>Time (server)</th>
//               <th style={{ textAlign:'left', borderBottom:'1px solid #ddd' }}>Local time</th>
//               <th style={{ textAlign:'left', borderBottom:'1px solid #ddd' }}>Manual</th>
//               <th style={{ textAlign:'left', borderBottom:'1px solid #ddd' }}>Note</th>
//             </tr>
//           </thead>
//           <tbody>
//             {punches.length === 0 && <tr><td colSpan="4">No punches yet</td></tr>}
//             {Array.isArray(punches) && punches.map(punch => (
//               <tr key={p.id || p.timestamp}>
//                 <td style={{ padding:6, borderBottom:'1px solid #f3f3f3' }}>{new Date(p.timestamp).toLocaleString()}</td>
//                 <td style={{ padding:6, borderBottom:'1px solid #f3f3f3' }}>{p.localTime ? new Date(p.localTime).toLocaleString() : '-'}</td>
//                 <td style={{ padding:6, borderBottom:'1px solid #f3f3f3' }}>{p.manual ? 'Yes' : 'No'}</td>
//                 <td style={{ padding:6, borderBottom:'1px solid #f3f3f3' }}>{p.note || '-'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
