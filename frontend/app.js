// ------------------------------------------------------------------
// API base URL
// - Served by the Express server  -> same origin, works automatically.
// - Opened as a file or hosted separately -> set DEPLOYED_API below
//   (e.g. 'https://your-app.onrender.com').
// ------------------------------------------------------------------
const DEPLOYED_API = '';
const LOCAL_API = 'http://localhost:3000';

const API_ROOT =
  DEPLOYED_API ||
  (location.protocol === 'file:' || location.port !== '3000' && location.hostname === 'localhost'
    ? LOCAL_API
    : '');
const API = `${API_ROOT}/api/timetable`;

const FIELDS = [
  'course_code', 'course_name', 'lecturer', 'day_of_week',
  'start_time', 'end_time', 'venue', 'goal', 'goal_status',
];

const form = document.getElementById('timetable-form');
const rowsEl = document.getElementById('rows');
const messageEl = document.getElementById('message');
const formTitle = document.getElementById('form-title');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const idInput = document.getElementById('id');

let records = [];

function showMessage(text, type = 'ok') {
  messageEl.textContent = text;
  messageEl.className = type;
  if (text) setTimeout(() => { if (messageEl.textContent === text) messageEl.textContent = ''; }, 4000);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
  return body;
}

function render() {
  if (!records.length) {
    rowsEl.innerHTML = '<tr><td colspan="8" class="empty">No records yet. Add your first class above.</td></tr>';
    return;
  }
  rowsEl.innerHTML = records.map((r) => `
    <tr>
      <td>${r.id}</td>
      <td><strong>${escapeHtml(r.course_code)}</strong><br>${escapeHtml(r.course_name)}</td>
      <td>${escapeHtml(r.lecturer)}</td>
      <td>${escapeHtml(r.day_of_week)}<br>${escapeHtml(r.start_time)}${r.end_time ? ' – ' + escapeHtml(r.end_time) : ''}</td>
      <td>${escapeHtml(r.venue)}</td>
      <td>${escapeHtml(r.goal)}</td>
      <td><span class="badge ${escapeHtml(r.goal_status)}">${escapeHtml(r.goal_status)}</span></td>
      <td>
        <button class="small edit" data-edit="${r.id}">Edit</button>
        <button class="small del" data-delete="${r.id}">Delete</button>
      </td>
    </tr>`).join('');
}

async function loadRecords() {
  try {
    records = await request(API);
    render();
  } catch (err) {
    showMessage(`Could not load records: ${err.message}`, 'err');
  }
}

function resetForm() {
  form.reset();
  idInput.value = '';
  formTitle.textContent = 'Add a new class';
  saveBtn.textContent = 'Save';
  cancelBtn.hidden = true;
}

function startEdit(id) {
  const rec = records.find((r) => r.id === id);
  if (!rec) return;
  idInput.value = rec.id;
  FIELDS.forEach((f) => { document.getElementById(f).value = rec[f] ?? ''; });
  formTitle.textContent = `Edit record #${rec.id}`;
  saveBtn.textContent = 'Update';
  cancelBtn.hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {};
  FIELDS.forEach((f) => { payload[f] = document.getElementById(f).value; });
  const id = idInput.value;
  try {
    if (id) {
      await request(`${API}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      showMessage('Record updated.');
    } else {
      await request(API, { method: 'POST', body: JSON.stringify(payload) });
      showMessage('Record created.');
    }
    resetForm();
    await loadRecords();
  } catch (err) {
    showMessage(err.message, 'err');
  }
});

cancelBtn.addEventListener('click', resetForm);

rowsEl.addEventListener('click', async (e) => {
  const editId = e.target.dataset.edit;
  const delId = e.target.dataset.delete;
  if (editId) startEdit(Number(editId));
  if (delId) {
    if (!confirm('Delete this record?')) return;
    try {
      await request(`${API}/${delId}`, { method: 'DELETE' });
      showMessage('Record deleted.');
      if (idInput.value === delId) resetForm();
      await loadRecords();
    } catch (err) {
      showMessage(err.message, 'err');
    }
  }
});

loadRecords();
