// Helper to call backend
const API_BASE = process.env.REACT_APP_API_URL || '';

export async function fetchPunches() {
  const res = await fetch(`${API_BASE}/punches`);
  if (!res.ok) throw new Error('Failed to fetch punches');
  return res.json();
}

export async function postPunch(payload) {
  const res = await fetch(`${API_BASE}/punch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error('Failed to post punch: ' + text);
  }
  return res.json();
}
