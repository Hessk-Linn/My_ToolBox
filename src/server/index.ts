import express from 'express';
import { db, appUsers, batteryReadings24v, homeSolarReadings48v, fuelTrips, fuelPrices } from '../db/index';
import { eq, desc } from 'drizzle-orm';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-User-Name');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/battery/readings', async (req, res) => {
  try {
    const rows = await db.select().from(batteryReadings24v).orderBy(desc(batteryReadings24v.createdAt));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch readings' });
  }
});

app.post('/api/battery/readings', async (req, res) => {
  try {
    const b = req.body;
    if (!b.voltage || typeof b.voltage !== 'number' || b.voltage < 18 || b.voltage > 32) {
      return res.status(400).json({ error: 'Invalid voltage (must be 18-32V)' });
    }
    if (!b.pct || typeof b.pct !== 'number' || b.pct < 0 || b.pct > 100) {
      return res.status(400).json({ error: 'Invalid percentage (must be 0-100)' });
    }
    const [row] = await db.insert(batteryReadings24v).values({
      id: b.id, voltage: b.voltage, pct: b.pct, alert: b.alert, ts: b.ts,
    }).returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save reading' });
  }
});

app.delete('/api/battery/readings/:id', async (req, res) => {
  try {
    await db.delete(batteryReadings24v).where(eq(batteryReadings24v.id, req.params.id));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete reading' });
  }
});

app.get('/api/home-solar/readings', async (req, res) => {
  try {
    const rows = await db.select().from(homeSolarReadings48v).orderBy(desc(homeSolarReadings48v.createdAt));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch readings' });
  }
});

app.post('/api/home-solar/readings', async (req, res) => {
  try {
    const b = req.body;
    if (!b.voltage || typeof b.voltage !== 'number' || b.voltage < 40 || b.voltage > 58) {
      return res.status(400).json({ error: 'Invalid voltage (must be 40-58V)' });
    }
    if (!b.pct || typeof b.pct !== 'number' || b.pct < 0 || b.pct > 100) {
      return res.status(400).json({ error: 'Invalid percentage (must be 0-100)' });
    }
    const [row] = await db.insert(homeSolarReadings48v).values({
      id: b.id, voltage: b.voltage, pct: b.pct, alert: b.alert, ts: b.ts,
    }).returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save reading' });
  }
});

app.delete('/api/home-solar/readings/:id', async (req, res) => {
  try {
    await db.delete(homeSolarReadings48v).where(eq(homeSolarReadings48v.id, req.params.id));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete reading' });
  }
});

app.get('/api/fuel/trips', async (req, res) => {
  try {
    const rows = await db.select().from(fuelTrips).orderBy(desc(fuelTrips.tripTimestamp));
    res.json(rows.map(r => ({ ...r, timestamp: Number(r.tripTimestamp) })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

app.post('/api/fuel/trips', async (req, res) => {
  try {
    const t = req.body;
    const [row] = await db.insert(fuelTrips).values({
      id: t.id, name: t.name, distance: t.distance, unit: t.unit,
      efficiency: t.efficiency, pricePerLiter: t.pricePerLiter,
      cost: t.cost, liters: t.liters, tripTimestamp: t.timestamp,
    }).returning();
    res.json({ ...row, timestamp: Number(row.tripTimestamp) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save trip' });
  }
});

app.put('/api/fuel/trips/:id', async (req, res) => {
  try {
    const t = req.body;
    const [row] = await db.update(fuelTrips).set({
      name: t.name, distance: t.distance, unit: t.unit,
      efficiency: t.efficiency, pricePerLiter: t.pricePerLiter,
      cost: t.cost, liters: t.liters, tripTimestamp: t.timestamp,
      updatedAt: new Date(),
    }).where(eq(fuelTrips.id, req.params.id)).returning();
    res.json({ ...row, timestamp: Number(row.tripTimestamp) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update trip' });
  }
});

app.delete('/api/fuel/trips/:id', async (req, res) => {
  try {
    await db.delete(fuelTrips).where(eq(fuelTrips.id, req.params.id));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

app.get('/api/fuel/prices', async (req, res) => {
  try {
    const rows = await db.select().from(fuelPrices).orderBy(desc(fuelPrices.recordedAt));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

app.post('/api/fuel/prices', async (req, res) => {
  try {
    const p = req.body;
    const [row] = await db.insert(fuelPrices).values({
      id: p.id, priceMmk: p.priceMmk, note: p.note || null,
    }).returning();
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save price' });
  }
});

app.delete('/api/fuel/prices/:id', async (req, res) => {
  try {
    await db.delete(fuelPrices).where(eq(fuelPrices.id, req.params.id));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete price' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
