import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express(), db = new Database('decoy.db');
app.use(cors(), express.json());
db.exec(`CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, effort_hours REAL, result_rating INTEGER, efficiency REAL, note TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
try { db.exec('ALTER TABLE logs ADD COLUMN efficiency REAL'); } catch {}

const isDecoy = (r, eff) => r < 3 || eff < 0.4;
const verdict = (r, eff) => r <= 1 || eff < 0.4 ? 'Pure Decoy — Busy, Not Productive 🚨' : r < 3 || eff < 0.8 ? 'Mostly Decoy 🎭' : eff >= 1.5 ? 'Real Work 💎' : 'Fair Trade ⚖️';

app.post('/api/log', (req, res) => {
  const { effort_hours, result_rating, note = '' } = req.body;
  const hours = parseFloat(effort_hours), rating = parseInt(result_rating, 10);
  if (!hours || isNaN(hours) || hours <= 0 || !rating || isNaN(rating) || rating < 1 || rating > 5) return res.status(400).json({ error: 'Invalid' });
  const efficiency = Number(((rating / 5) * (1 / (1 + Math.log10(Math.max(hours, 0.2)))) * 5).toFixed(2));
  db.prepare('INSERT INTO logs (effort_hours, result_rating, efficiency, note) VALUES (?, ?, ?, ?)').run(hours, rating, efficiency, note);
  const avgEfficiency = Number((db.prepare('SELECT AVG(efficiency) as a FROM logs').get().a || 0).toFixed(2));
  const recent = db.prepare('SELECT result_rating, efficiency FROM logs ORDER BY id DESC LIMIT 10').all();
  let streak = 0;
  for (const r of recent) { if (isDecoy(r.result_rating, r.efficiency)) streak++; else break; }
  res.json({ efficiency, verdict: verdict(rating, efficiency), avgEfficiency, streak });
});
app.get('/api/history', (_, res) => res.json(db.prepare('SELECT * FROM logs ORDER BY id DESC LIMIT 10').all()));
app.get('/api/insight', (_, res) => res.json({ best: db.prepare('SELECT * FROM logs ORDER BY efficiency DESC LIMIT 1').get() || null, worst: db.prepare('SELECT * FROM logs ORDER BY efficiency ASC LIMIT 1').get() || null }));
app.listen(5000, () => console.log('Server on 5000'));
