require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Serve the frontend too, so http://localhost:3000 works out of the box.
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const FIELDS = [
  'course_code',
  'course_name',
  'lecturer',
  'day_of_week',
  'start_time',
  'end_time',
  'venue',
  'goal',
  'goal_status',
];
const STATUSES = ['Not Started', 'In Progress', 'Achieved'];

function validate(body, existing = {}) {
  const data = {};
  for (const f of FIELDS) {
    data[f] = body[f] !== undefined ? body[f] : existing[f] ?? null;
    if (typeof data[f] === 'string') data[f] = data[f].trim();
    if (data[f] === '') data[f] = null;
  }
  if (!data.course_code) return { error: 'course_code is required' };
  if (data.course_code.length > 20) return { error: 'course_code must be 20 characters or fewer' };
  if (data.course_name && data.course_name.length > 150)
    return { error: 'course_name must be 150 characters or fewer' };
  if (!data.goal_status) data.goal_status = 'Not Started';
  if (!STATUSES.includes(data.goal_status))
    return { error: `goal_status must be one of: ${STATUSES.join(', ')}` };
  return { data };
}

const getById = (id) => db.prepare('SELECT * FROM timetable WHERE id = ?').get(id);

// GET /api/timetable -> list all
app.get('/api/timetable', (req, res) => {
  const rows = db.prepare('SELECT * FROM timetable ORDER BY id').all();
  res.json(rows);
});

// GET /api/timetable/:id -> one record
app.get('/api/timetable/:id', (req, res) => {
  const row = getById(req.params.id);
  if (!row) return res.status(404).json({ error: 'Record not found' });
  res.json(row);
});

// POST /api/timetable -> create
app.post('/api/timetable', (req, res) => {
  const { data, error } = validate(req.body || {});
  if (error) return res.status(400).json({ error });
  const info = db
    .prepare(
      `INSERT INTO timetable (${FIELDS.join(', ')})
       VALUES (${FIELDS.map((f) => '@' + f).join(', ')})`
    )
    .run(data);
  res.status(201).json(getById(info.lastInsertRowid));
});

// PUT /api/timetable/:id -> update
app.put('/api/timetable/:id', (req, res) => {
  const existing = getById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Record not found' });
  const { data, error } = validate(req.body || {}, existing);
  if (error) return res.status(400).json({ error });
  db.prepare(
    `UPDATE timetable
     SET ${FIELDS.map((f) => `${f} = @${f}`).join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = @id`
  ).run({ ...data, id: existing.id });
  res.json(getById(existing.id));
});

// DELETE /api/timetable/:id -> delete
app.delete('/api/timetable/:id', (req, res) => {
  const existing = getById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Record not found' });
  db.prepare('DELETE FROM timetable WHERE id = ?').run(existing.id);
  res.json({ message: 'Record deleted', deleted: existing });
});

// Unknown API routes and malformed JSON -> JSON errors
app.use('/api', (req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Timetable API running on http://localhost:${PORT}`);
});
