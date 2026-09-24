import { useState, useEffect } from 'react';

export default function App() {
  const [hours, setHours] = useState(''), [rating, setRating] = useState(3), [note, setNote] = useState('');
  const [result, setResult] = useState(null), [history, setHistory] = useState([]), [insight, setInsight] = useState({});

  const load = () => {
    fetch('http://localhost:5000/api/history').then(r => r.json()).then(setHistory);
    fetch('http://localhost:5000/api/insight').then(r => r.json()).then(setInsight);
  };
  useEffect(() => { load(); }, []);

  const handleLog = async (e) => {
    e.preventDefault();
    const h = parseFloat(hours);
    if (!hours || isNaN(h) || h <= 0) return;
    const res = await fetch('http://localhost:5000/api/log', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ effort_hours: h, result_rating: Number(rating), note: note.trim() })
    });
    setResult(await res.json());
    setHours(''); setNote(''); load();
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>🎭 DECOY</h1>
        <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 4 }}>Busy isn't always productive. Log your hours vs your real result.</p>
      </div>
      <form onSubmit={handleLog} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input type="number" step="any" min="0.01" value={hours} onChange={e => setHours(e.target.value)} required placeholder="Hours worked (e.g. 4.5)" />
        <div>
          <div className="row" style={{ fontSize: 13, marginBottom: 4 }}><span>Result Rating:</span><b className="badge">{rating}/5</b></div>
          <input type="range" min="1" max="5" value={rating} onChange={e => setRating(Number(e.target.value))} />
        </div>
        <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Note (optional)" />
        <button type="submit">Log It</button>
      </form>
      {result && (
        <>
          <div className="card" style={{ background: '#131d33', borderColor: '#1d4ed8', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 6px', color: '#93c5fd', fontSize: 20 }}>{result.verdict}</h2>
            <div style={{ fontSize: 14 }}>Efficiency: <b>{result.efficiency}</b> | Avg: <b>{result.avgEfficiency}</b></div>
          </div>
          {result.streak >= 3 && (
            <div className="card" style={{ background: '#E63946', color: '#fff', fontWeight: 'bold', textAlign: 'center', border: 'none' }}>
              🚨 {result.streak}-Day Decoy Streak — You're Stuck in a Loop
            </div>
          )}
        </>
      )}
      {insight.best && (
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="card" style={{ flex: 1, margin: 0, background: '#062817', borderColor: '#059669' }}>
            <div style={{ color: '#34d399', fontWeight: 'bold', fontSize: 12 }}>Best Day 💎</div>
            <div style={{ fontSize: 13 }}><b>{insight.best.effort_hours}h</b> → {insight.best.result_rating}/5 ({Number(insight.best.efficiency || 0).toFixed(2)})</div>
            {insight.best.note && <div style={{ fontSize: 11, color: '#9ca3af' }}>"{insight.best.note}"</div>}
          </div>
          <div className="card" style={{ flex: 1, margin: 0, background: '#2d0f14', borderColor: '#dc2626' }}>
            <div style={{ color: '#f87171', fontWeight: 'bold', fontSize: 12 }}>Most Decoy 🎭</div>
            <div style={{ fontSize: 13 }}><b>{insight.worst.effort_hours}h</b> → {insight.worst.result_rating}/5 ({Number(insight.worst.efficiency || 0).toFixed(2)})</div>
            {insight.worst.note && <div style={{ fontSize: 11, color: '#9ca3af' }}>"{insight.worst.note}"</div>}
          </div>
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: 15, margin: '0 0 8px' }}>Recent History (Last 10)</h3>
        {history.length === 0 ? <p style={{ color: '#6b7280', fontSize: 13 }}>No logs yet.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {history.map(item => (
              <div key={item.id} className="card row" style={{ margin: 0, padding: '10px 12px' }}>
                <div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className="badge" style={{ color: '#93c5fd' }}>⏱️ {item.effort_hours}h</span>
                    <span className="badge" style={{ color: '#fde047' }}>⭐ {item.result_rating}/5</span>
                  </div>
                  {item.note && <div style={{ fontSize: 12, color: '#94a3af', marginTop: 4 }}>"{item.note}"</div>}
                </div>
                <span style={{ fontSize: 12, color: '#64748b' }}>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
