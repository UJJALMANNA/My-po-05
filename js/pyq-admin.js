// ════════════════════════════════════════════════════════════
// PYQ Admin — Add single questions, bulk CSV import, list/delete
// Expects: window.supabaseClient already initialised by js/config.js
// (same pattern as your existing admin.js / dashboard.html)
// ════════════════════════════════════════════════════════════

const PYQ_EXAM_LABELS = {
  GATE_CS: 'GATE CS', GATE_EC: 'GATE EC', JEE_MAIN: 'JEE Main',
  UPSC_CSE: 'UPSC CSE', CAT: 'CAT'
};

// ── helper: build options jsonb from the 4 input fields ──
function buildOptionsFromForm() {
  const opts = [];
  const map = [['A', 'pf_optA'], ['B', 'pf_optB'], ['C', 'pf_optC'], ['D', 'pf_optD']];
  map.forEach(([key, id]) => {
    const val = document.getElementById(id).value.trim();
    if (val) opts.push({ key, text: val });
  });
  return opts.length ? opts : null;
}

// ════════════════════════════════════════════════════════════
// SINGLE QUESTION FORM
// ════════════════════════════════════════════════════════════
function initPyqForm() {
  const form = document.getElementById('pyqForm');
  if (!form) return;
  const msg = document.getElementById('pf_msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = ''; msg.className = 'pyq-form-msg';

    const payload = {
      exam_key:       document.getElementById('pf_exam').value,
      year:           parseInt(document.getElementById('pf_year').value),
      marks:          parseFloat(document.getElementById('pf_marks').value),
      subject:        document.getElementById('pf_subject').value.trim(),
      topic:          document.getElementById('pf_topic').value.trim(),
      difficulty:     document.getElementById('pf_difficulty').value,
      question_type:  document.getElementById('pf_type').value,
      question_text:  document.getElementById('pf_question').value.trim(),
      options:        buildOptionsFromForm(),
      correct_answer: document.getElementById('pf_correct').value.trim(),
      explanation:    document.getElementById('pf_explanation').value.trim() || null,
      source_note:    document.getElementById('pf_source').value.trim() || null,
    };

    if (!payload.subject || !payload.topic || !payload.question_text || !payload.correct_answer || !payload.year) {
      msg.textContent = 'Please fill in all required fields.';
      msg.classList.add('err');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Saving…';

    try {
      const { error } = await supabaseClient.from('pyq_questions').insert(payload);
      if (error) throw error;
      msg.textContent = '✓ Question saved successfully.';
      msg.classList.add('ok');
      form.reset();
      document.getElementById('pf_marks').value = 1;
    } catch (err) {
      console.error(err);
      msg.textContent = 'Failed to save: ' + (err.message || 'unknown error');
      msg.classList.add('err');
    } finally {
      btn.disabled = false; btn.textContent = 'Save Question';
    }
  });
}

// ════════════════════════════════════════════════════════════
// CSV BULK IMPORT
// ════════════════════════════════════════════════════════════
const CSV_REQUIRED_COLS = [
  'exam_key','subject','topic','year','difficulty','marks','question_type',
  'question_text','option_a','option_b','option_c','option_d',
  'correct_answer','explanation','source_note'
];
const VALID_EXAMS = Object.keys(PYQ_EXAM_LABELS);
const VALID_DIFFICULTY = ['easy','medium','hard'];
const VALID_TYPES = ['mcq','msq','numerical'];

let parsedCsvRows = []; // { data: {...}, errors: [...] }

function parseCsvText(text) {
  // Simple CSV parser handling quoted fields with commas/newlines
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], next = text[i+1];
    if (inQuotes) {
      if (c === '"' && next === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { field += c; }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n' || c === '\r') {
        if (field !== '' || row.length) { row.push(field); rows.push(row); row = []; field = ''; }
        if (c === '\r' && next === '\n') i++;
      } else { field += c; }
    }
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.length && r.some(c => c.trim() !== ''));
}

function validateCsvRow(obj) {
  const errors = [];
  if (!VALID_EXAMS.includes(obj.exam_key)) errors.push(`invalid exam_key "${obj.exam_key}"`);
  if (!obj.subject) errors.push('missing subject');
  if (!obj.topic) errors.push('missing topic');
  if (!obj.year || isNaN(parseInt(obj.year))) errors.push('invalid year');
  if (!VALID_DIFFICULTY.includes(obj.difficulty)) errors.push(`invalid difficulty "${obj.difficulty}"`);
  if (!obj.marks || isNaN(parseFloat(obj.marks))) errors.push('invalid marks');
  if (!VALID_TYPES.includes(obj.question_type)) errors.push(`invalid question_type "${obj.question_type}"`);
  if (!obj.question_text) errors.push('missing question_text');
  if (!obj.correct_answer) errors.push('missing correct_answer');
  return errors;
}

function renderCsvPreview() {
  const wrap = document.getElementById('csvPreviewWrap');
  const summary = document.getElementById('csvSummary');
  const table = document.getElementById('csvPreviewTable');
  wrap.style.display = 'block';

  const okCount = parsedCsvRows.filter(r => r.errors.length === 0).length;
  const errCount = parsedCsvRows.length - okCount;
  summary.innerHTML = `<span class="ok-count">${okCount} valid</span> · <span class="err-count">${errCount} with errors</span> (errors will be skipped on import)`;

  let html = '<tr><th>#</th><th>Exam</th><th>Subject</th><th>Topic</th><th>Year</th><th>Question</th><th>Status</th></tr>';
  parsedCsvRows.forEach((r, i) => {
    const cls = r.errors.length ? 'csv-row-error' : '';
    const status = r.errors.length ? '❌ ' + r.errors.join('; ') : '✓ OK';
    const qPreview = (r.data.question_text || '').slice(0, 40) + ((r.data.question_text||'').length > 40 ? '…' : '');
    html += `<tr class="${cls}"><td>${i+1}</td><td>${r.data.exam_key||''}</td><td>${r.data.subject||''}</td><td>${r.data.topic||''}</td><td>${r.data.year||''}</td><td>${qPreview}</td><td>${status}</td></tr>`;
  });
  table.innerHTML = html;
}

function handleCsvFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const rows = parseCsvText(e.target.result);
    if (!rows.length) { alert('CSV appears empty.'); return; }

    const header = rows[0].map(h => h.trim().toLowerCase());
    const missing = CSV_REQUIRED_COLS.filter(c => !header.includes(c));
    if (missing.length) {
      alert('CSV is missing required columns: ' + missing.join(', '));
      return;
    }

    parsedCsvRows = rows.slice(1).map(cols => {
      const obj = {};
      header.forEach((colName, i) => { obj[colName] = (cols[i] || '').trim(); });
      const errors = validateCsvRow(obj);
      return { data: obj, errors };
    });

    renderCsvPreview();
  };
  reader.readAsText(file);
}

function initCsvImport() {
  const dropzone = document.getElementById('csvDropzone');
  const fileInput = document.getElementById('csvFileInput');
  const importBtn = document.getElementById('csvImportBtn');
  if (!dropzone) return;

  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('is-dragover'); });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('is-dragover');
    if (e.dataTransfer.files.length) handleCsvFile(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleCsvFile(fileInput.files[0]);
  });

  importBtn.addEventListener('click', async () => {
    const validRows = parsedCsvRows.filter(r => r.errors.length === 0);
    if (!validRows.length) { alert('No valid rows to import.'); return; }

    const csvMsg = document.getElementById('csvMsg');
    importBtn.disabled = true; importBtn.textContent = `Importing ${validRows.length} rows…`;
    csvMsg.textContent = ''; csvMsg.className = 'pyq-form-msg';

    const payloads = validRows.map(r => {
      const d = r.data;
      const options = [];
      if (d.option_a) options.push({ key: 'A', text: d.option_a });
      if (d.option_b) options.push({ key: 'B', text: d.option_b });
      if (d.option_c) options.push({ key: 'C', text: d.option_c });
      if (d.option_d) options.push({ key: 'D', text: d.option_d });
      return {
        exam_key: d.exam_key,
        subject: d.subject,
        topic: d.topic,
        year: parseInt(d.year),
        difficulty: d.difficulty,
        marks: parseFloat(d.marks),
        question_type: d.question_type,
        question_text: d.question_text,
        options: options.length ? options : null,
        correct_answer: d.correct_answer,
        explanation: d.explanation || null,
        source_note: d.source_note || null,
      };
    });

    try {
      const { error } = await supabaseClient.from('pyq_questions').insert(payloads);
      if (error) throw error;
      csvMsg.textContent = `✓ Imported ${payloads.length} questions successfully.`;
      csvMsg.classList.add('ok');
      parsedCsvRows = [];
      fileInput.value = '';
      document.getElementById('csvPreviewWrap').style.display = 'none';
    } catch (err) {
      console.error(err);
      csvMsg.textContent = 'Import failed: ' + (err.message || 'unknown error');
      csvMsg.classList.add('err');
    } finally {
      importBtn.disabled = false; importBtn.textContent = 'Import Valid Rows';
    }
  });
}

// ════════════════════════════════════════════════════════════
// QUESTION LIST + DELETE
// ════════════════════════════════════════════════════════════
async function loadPyqList(examFilter) {
  const wrap = document.getElementById('pyqListWrap');
  if (!wrap) return;
  wrap.innerHTML = '<p class="news__loading">Loading…</p>';

  try {
    let query = supabaseClient.from('pyq_questions').select('*').order('created_at', { ascending: false }).limit(100);
    if (examFilter) query = query.eq('exam_key', examFilter);
    const { data, error } = await query;
    if (error) throw error;

    if (!data || !data.length) {
      wrap.innerHTML = '<p style="color:var(--ink-dim)">No questions found.</p>';
      return;
    }

    wrap.innerHTML = data.map(q => `
      <div class="pyq-list-item" data-id="${q.id}">
        <div class="pyq-list-item__tags">
          <span class="pyq-tag">${PYQ_EXAM_LABELS[q.exam_key] || q.exam_key}</span>
          <span class="pyq-tag">${q.subject}</span>
          <span class="pyq-tag">${q.topic}</span>
          <span class="pyq-tag">${q.year}</span>
          <span class="pyq-tag">${q.marks} marks</span>
          <span class="pyq-tag">${q.difficulty}</span>
        </div>
        <div class="pyq-list-item__q">${q.question_text}</div>
        <div class="pyq-list-item__actions">
          <button class="btn btn--delete btn--small pyq-delete-btn" data-id="${q.id}">Delete</button>
        </div>
      </div>
    `).join('');

    wrap.querySelectorAll('.pyq-delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this question permanently?')) return;
        const id = btn.dataset.id;
        btn.disabled = true; btn.textContent = 'Deleting…';
        try {
          const { error } = await supabaseClient.from('pyq_questions').delete().eq('id', id);
          if (error) throw error;
          document.querySelector(`.pyq-list-item[data-id="${id}"]`).remove();
        } catch (err) {
          console.error(err);
          alert('Failed to delete: ' + (err.message || 'unknown error'));
          btn.disabled = false; btn.textContent = 'Delete';
        }
      });
    });
  } catch (err) {
    console.error(err);
    wrap.innerHTML = '<p style="color:#E74C3C">Failed to load questions.</p>';
  }
}

function initPyqList() {
  const filter = document.getElementById('listExamFilter');
  if (!filter) return;
  filter.addEventListener('change', () => loadPyqList(filter.value));

  // Load the list the first time the "All Questions" tab is opened
  const listTabBtn = document.querySelector('.admin-tab[data-tab="pyq-list"]');
  if (listTabBtn) {
    let loaded = false;
    listTabBtn.addEventListener('click', () => {
      if (!loaded) { loadPyqList(''); loaded = true; }
    });
  }
}

// ════════════════════════════════════════════════════════════
// INIT — runs once admin.js has unlocked the panel.
// We just wire up listeners on DOMContentLoaded; the panel's
// visibility is controlled separately by admin.js's password gate.
// ════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initPyqForm();
  initCsvImport();
  initPyqList();
});
