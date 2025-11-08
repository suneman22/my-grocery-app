require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const { searchColes } = require('./src/services/coles');
const { searchWoolworths } = require('./src/services/woolworths');
const { searchAldi } = require('./src/services/aldi');
const { searchIGA } = require('./src/services/iga');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const CACHE_TTL = parseInt(process.env.CACHE_TTL_SECONDS || '3600', 10);
const HISTORY_FILE = path.join(__dirname, 'data', 'price_history.json');

if (!fs.existsSync(path.join(__dirname, 'data'))) fs.mkdirSync(path.join(__dirname, 'data'));
if (!fs.existsSync(HISTORY_FILE)) fs.writeFileSync(HISTORY_FILE, JSON.stringify([]));

/**
 * Simple in-memory cache to avoid repeated RapidAPI calls for the same query
 * cache key: q -> { timestamp, result }
 */
const cache = new Map();

async function fetchFromAll(q) {
  const env = process.env;
  const calls = [];
  calls.push(searchColes(q, env).catch(e => ({ store: 'Coles', error: e.message })));
  calls.push(searchWoolworths(q, env).catch(e => ({ store: 'Woolworths', error: e.message })));
  calls.push(searchAldi(q, env).catch(e => ({ store: 'Aldi', error: e.message })));
  calls.push(searchIGA(q, env).catch(e => ({ store: 'IGA', error: e.message })));
  const results = await Promise.all(calls);
  return results;
}

function appendHistory(q, aggregated) {
  try {
    const now = new Date().toISOString();
    const blob = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    blob.push({
      query: q,
      timestamp: now,
      results: aggregated.map(r => ({
        store: r.store,
        items: (r.items || []).map(it => ({ name: it.name, price: it.price, size: it.size, url: it.url }))
      }))
    });
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(blob, null, 2));
  } catch (err) {
    console.error('appendHistory error', err);
  }
}

app.get('/api/prices', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'Missing q parameter' });

  const cacheKey = q.toLowerCase();
  const cached = cache.get(cacheKey);
  const now = Date.now();
  if (cached && (now - cached.ts) < CACHE_TTL * 1000) {
    return res.json({ fromCache: true, data: cached.data });
  }

  try {
    const aggregated = await fetchFromAll(q);

    // pick the top hit (first item) for each store if present
    const summarized = aggregated.map(storeRes => {
      if (storeRes.error) return { store: storeRes.store, error: storeRes.error };
      const hit = (storeRes.items && storeRes.items.length) ? storeRes.items[0] : null;
      return { store: storeRes.store, item: hit };
    });

    // Save a history snapshot
    appendHistory(q, aggregated);

    // store in cache
    cache.set(cacheKey, { ts: now, data: summarized });

    res.json({ fromCache: false, data: summarized });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'internal' });
  }
});

/**
 * Basic history endpoint: returns all snapshots for a given item query
 */
app.get('/api/history', (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  const raw = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  const filtered = q ? raw.filter(s => s.query.toLowerCase() === q) : raw;
  res.json(filtered);
});

app.listen(PORT, () => console.log(`✅ groceries-backend listening on ${PORT}`));
