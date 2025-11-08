import React, { useState } from 'react';
import axios from 'axios';
import PricesTable from './components/PricesTable';

export default function App() {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [history, setHistory] = useState(null);

  async function search() {
    if (!q) return;
    setLoading(true);
    try {
      const resp = await axios.get(`http://localhost:3001/api/prices?q=${encodeURIComponent(q)}`);
      setData(resp.data.data);
      // fetch history too
      const hist = await axios.get(`http://localhost:3001/api/history?q=${encodeURIComponent(q)}`);
      setHistory(hist.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching prices — check backend logs and .env.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>🛒 Grocery Price Checker</h1>
      <div style={{ marginBottom: 12 }}>
        <input placeholder="Search item (e.g. milk)" value={q} onChange={e => setQ(e.target.value)} style={{ padding: 8, width: 300 }} />
        <button onClick={search} style={{ padding: 8, marginLeft: 8 }}>Search</button>
      </div>

      {loading && <div>Loading…</div>}

      {data && <PricesTable rows={data} />}

      {history && (
        <>
          <h3>Price history snapshots ({history.length})</h3>
          <ul>
            {history.map((snap, i) => (
              <li key={i}>
                {new Date(snap.timestamp).toLocaleString()} — {snap.results.map(r => `${r.store}: ${r.items[0]?.price ?? 'N/A'}`).join(' | ')}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
