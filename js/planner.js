// ============================================================
// EXAM PLANNER ENGINE
// Smart rule-based recommendation system:
//   - Calculates time remaining to exam date
//   - Assigns intensity (relaxed / moderate / intensive / critical)
//   - Generates phase-based roadmap with actual calendar dates
//   - Generates day/week/month/year graphical schedules
//   - Renders Chart.js timeline chart
//   - Pulls curated resources per subject from data/exams.json
// ============================================================

const EXAM_ICONS = {
  GATE_CS: '💻', JEE_MAIN: '📐', JEE_ADV: '🔬',
  UPSC_CSE: '🏛️', CAT: '📊', GATE_EC: '📡', GATE_ME: '⚙️'
};

const EXAM_VARIANTS = [
  { id: 'GATE_CS', dataKey: 'GATE_CS', label: 'GATE CS', full: 'Graduate Aptitude Test — Computer Science' },
  { id: 'JEE_MAIN', dataKey: 'JEE_MAIN', label: 'JEE Main', full: 'Joint Entrance Examination — Main' },
  { id: 'UPSC_CSE', dataKey: 'UPSC_CSE', label: 'UPSC CSE', full: 'Civil Services Examination' },
  { id: 'CAT', dataKey: 'CAT', label: 'CAT', full: 'Common Admission Test' },
];

let examData = {};
let selectedExam = null;
let selectedYear = null;
let planChart = null;

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  try {
    const res = await fetch('data/exams.json');
    examData = await res.json();
  } catch (e) {
    console.error('Could not load exam data:', e);
  }

  buildExamGrid();
  buildYearPicker();
  wireNavigation();
});

function buildExamGrid() {
  const grid = document.getElementById('examGrid');
  grid.innerHTML = EXAM_VARIANTS.map(ex => `
    <div class="exam-card" data-exam="${ex.id}" role="button" tabindex="0" aria-label="Select ${ex.label}">
      <div class="exam-card__icon">${EXAM_ICONS[ex.id] || '📝'}</div>
      <div class="exam-card__name">${ex.label}</div>
      <div class="exam-card__full">${ex.full}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.exam-card').forEach(card => {
    const select = () => {
      grid.querySelectorAll('.exam-card').forEach(c => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
      selectedExam = card.dataset.exam;
      document.getElementById('toStep2').disabled = false;
    };
    card.addEventListener('click', select);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') select(); });
  });
}

function buildYearPicker() {
  const picker = document.getElementById('yearPicker');
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3];
  picker.innerHTML = years.map(y => `
    <button class="year-btn" data-year="${y}">${y}</button>
  `).join('');

  picker.querySelectorAll('.year-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      picker.querySelectorAll('.year-btn').forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      selectedYear = parseInt(btn.dataset.year);
      document.getElementById('toStep3').disabled = false;
    });
  });
}

function wireNavigation() {
  document.getElementById('toStep2').addEventListener('click', () => goToStep(2));
  document.getElementById('backToStep1').addEventListener('click', () => goToStep(1));
  document.getElementById('toStep3').addEventListener('click', () => {
    goToStep(3);
    buildPlan();
  });
  document.getElementById('backToStep2').addEventListener('click', () => goToStep(2));
}

function goToStep(n) {
  document.querySelectorAll('.panel').forEach((p, i) => p.classList.toggle('is-active', i + 1 === n));
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.toggle('is-active', i + 1 === n);
    s.classList.toggle('is-done', i + 1 < n);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- TIME CALCULATION ----
function calcTimeRemaining(examKey, year) {
  const data = examData[examKey];
  const examMonth = data ? data.examMonth : 2;
  const examDate = new Date(year, examMonth - 1, 15); // 15th of exam month
  const today = new Date();
  const msPerDay = 86400000;
  const totalDays = Math.max(0, Math.floor((examDate - today) / msPerDay));
  return {
    days: totalDays,
    weeks: Math.floor(totalDays / 7),
    months: Math.floor(totalDays / 30),
    years: (totalDays / 365).toFixed(1),
    examDate
  };
}

function getIntensity(months) {
  if (months >= 18) return { label: 'Relaxed', color: 'relaxed', advice: 'You have plenty of time. Build deep conceptual clarity without rushing.' };
  if (months >= 10) return { label: 'Moderate', color: 'moderate', advice: 'Good time ahead. Follow a steady structured plan with weekly targets.' };
  if (months >= 5)  return { label: 'Intensive', color: 'intensive', advice: 'Time is limited. Focus hard on high-weight topics and start mock tests early.' };
  return { label: 'Critical', color: 'critical', advice: 'Very limited time. Focus only on high-yield topics, PYQs, and daily mock practice.' };
}

// ---- ROADMAP GENERATION ----
function generateRoadmap(examKey, time) {
  const data = examData[examKey];
  if (!data) return [];
  const { phases } = data;
  const totalDays = time.days;
  const phaseColors = ['', '--warm', '--cool', '--gold'];
  let cursor = new Date();

  return phases.map((phase, i) => {
    const phaseDays = Math.floor(totalDays * phase.weight);
    const start = new Date(cursor);
    const end = new Date(cursor.getTime() + phaseDays * 86400000);
    cursor = new Date(end);
    return {
      ...phase,
      startDate: start,
      endDate: end,
      days: phaseDays,
      colorClass: phaseColors[i] || ''
    };
  });
}

// ---- SCHEDULE CARDS ----
function generateScheduleCards(intensity, examKey) {
  const ex = examData[examKey];
  const subjectList = ex ? ex.subjects.slice(0, 4).join(', ') : 'core subjects';

  const schedules = {
    relaxed: [
      { period: 'Daily', title: '4–5 hrs study', desc: `2 hrs concept building + 2 hrs practice on ${subjectList}.` },
      { period: 'Weekly', title: 'Topic completion', desc: 'Finish one full topic per week, with a mini-test on Sunday.' },
      { period: 'Monthly', title: 'Phase checkpoint', desc: 'Complete one roadmap phase per month. Take a full-length mock at month end.' },
      { period: 'Yearly', title: 'Full coverage', desc: 'Year 1: full syllabus. Year 2: revision + mocks. Enter exam fully prepared.' }
    ],
    moderate: [
      { period: 'Daily', title: '6–7 hrs study', desc: `3 hrs new concepts + 2 hrs PYQs + 1 hr revision on ${subjectList}.` },
      { period: 'Weekly', title: '2 topics + 1 mock', desc: 'Cover 2 topics, attempt one sectional mock, review errors on Sunday.' },
      { period: 'Monthly', title: 'Syllabus thirds', desc: 'Divide syllabus into 3 equal parts, one per month. Mock test at each end.' },
      { period: 'Yearly', title: 'Targeted preparation', desc: 'Steady concept-to-revision cycle across available time.' }
    ],
    intensive: [
      { period: 'Daily', title: '8–9 hrs study', desc: `4 hrs high-yield topics + 2 hrs PYQs + 2 hrs mock analysis.` },
      { period: 'Weekly', title: '3 topics + 2 mocks', desc: 'Cover 3 topics/week, 2 mocks on weekends, ruthless error analysis.' },
      { period: 'Monthly', title: 'Half-syllabus monthly', desc: 'Month 1–2: full coverage. Month 3+: pure revision and mocks.' },
      { period: 'Yearly', title: 'Sprint mode', desc: 'No time to waste — every week counts. Track daily targets strictly.' }
    ],
    critical: [
      { period: 'Daily', title: '10+ hrs study', desc: 'Focus only on high-yield topics. Skip low-weight areas entirely.' },
      { period: 'Weekly', title: 'PYQ-first approach', desc: 'Solve last 10 years of PYQs first — they reveal what actually comes in exams.' },
      { period: 'Monthly', title: 'Full mock every week', desc: 'Weekly full-length mocks with analysis are non-negotiable now.' },
      { period: 'Yearly', title: 'Final lap', desc: "You're in the home stretch. Confidence, stamina, and consistency win." }
    ]
  };

  return schedules[intensity.color] || schedules.moderate;
}

// ---- CHART GENERATION ----
function buildChart(roadmap) {
  if (planChart) { planChart.destroy(); planChart = null; }
  const ctx = document.getElementById('planChart');
  if (!ctx || !roadmap.length) return;

  const labels = roadmap.map(p => p.name);
  const durations = roadmap.map(p => p.days);
  const colors = ['rgba(108,92,231,0.8)', 'rgba(243,104,176,0.8)', 'rgba(79,209,197,0.8)', 'rgba(255,159,90,0.8)'];

  planChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Days allocated',
        data: durations,
        backgroundColor: colors,
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.parsed.y} days (${Math.round(ctx.parsed.y / 7)} weeks)`
          }
        }
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#A8A3C2' } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#A8A3C2', callback: v => `${v}d` } }
      }
    }
  });
}

// ---- RESOURCES ----
function buildResources(examKey) {
  const data = examData[examKey];
  if (!data || !data.resources) return '<p style="color:var(--ink-dim)">Resources coming soon for this exam.</p>';

  return Object.entries(data.resources).map(([subject, res]) => `
    <div class="resource-subject">
      <div class="resource-subject__name">${subject}</div>
      <div class="resource-list">
        ${(res.videos || []).map(v => `
          <div class="resource-item">
            <span class="resource-badge resource-badge--video">▶ Video</span>
            <a href="${v.url}" target="_blank" rel="noopener">${v.title}</a>
          </div>
        `).join('')}
        ${(res.notes || []).map(n => `
          <div class="resource-item">
            <span class="resource-badge resource-badge--notes">📄 Notes</span>
            <a href="${n.url}" target="_blank" rel="noopener">${n.title}</a>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ---- MAIN BUILD ----
function buildPlan() {
  const examVariant = EXAM_VARIANTS.find(e => e.id === selectedExam);
  const examKey = examVariant?.dataKey || selectedExam;
  const examInfo = examData[examKey] || { name: selectedExam, subjects: [] };
  const time = calcTimeRemaining(examKey, selectedYear);
  const intensity = getIntensity(time.months);
  const roadmap = generateRoadmap(examKey, time);
  const schedule = generateScheduleCards(intensity, examKey);

  const fmt = d => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const planHTML = `
    <!-- Time banner -->
    <div class="time-banner">
      <div class="time-stat">
        <div class="time-stat__num">${time.days.toLocaleString()}</div>
        <div class="time-stat__label">Days remaining</div>
      </div>
      <div class="time-stat">
        <div class="time-stat__num">${time.weeks}</div>
        <div class="time-stat__label">Weeks</div>
      </div>
      <div class="time-stat">
        <div class="time-stat__num">${time.months}</div>
        <div class="time-stat__label">Months</div>
      </div>
      <div class="time-stat">
        <div class="time-stat__num">${time.years}</div>
        <div class="time-stat__label">Years</div>
      </div>
    </div>

    <!-- Intensity -->
    <div class="intensity-banner">
      <div class="intensity-dot intensity-dot--${intensity.color}"></div>
      <div class="intensity-text"><strong>${intensity.label} mode</strong> — ${intensity.advice}</div>
    </div>

    <!-- Roadmap phases -->
    <div class="section__head" style="margin-bottom:var(--space-3)">
      <span class="section__num">Roadmap</span>
      <h3>Phase-by-Phase Plan for ${examInfo.name} ${selectedYear}</h3>
    </div>
    <div class="roadmap">
      ${roadmap.map((phase, i) => `
        <div class="roadmap-phase roadmap-phase${phase.colorClass}">
          <div class="roadmap-phase__header">
            <div class="roadmap-phase__name">Phase ${i + 1}: ${phase.name}</div>
            <div class="roadmap-phase__dates">${fmt(phase.startDate)} → ${fmt(phase.endDate)} (${phase.days} days)</div>
          </div>
          <div class="roadmap-phase__topics">
            ${phase.topics.map(t => `<span class="topic-tag">${t}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Chart -->
    <div class="chart-wrap">
      <h3>📊 Time Allocation by Phase</h3>
      <div class="chart-container">
        <canvas id="planChart"></canvas>
      </div>
    </div>

    <!-- Schedule -->
    <div class="section__head" style="margin-bottom:var(--space-3)">
      <span class="section__num">Schedule</span>
      <h3>Daily · Weekly · Monthly · Yearly Targets</h3>
    </div>
    <div class="schedule-grid">
      ${schedule.map(s => `
        <div class="schedule-card">
          <div class="schedule-card__period">${s.period}</div>
          <div class="schedule-card__title">${s.title}</div>
          <div class="schedule-card__desc">${s.desc}</div>
        </div>
      `).join('')}
    </div>

    <!-- Resources -->
    <div class="section__head" style="margin-bottom:var(--space-3)">
      <span class="section__num">Resources</span>
      <h3>Curated Videos &amp; Notes for ${examInfo.name}</h3>
    </div>
    <div class="resources-grid">
      ${buildResources(examKey)}
    </div>
  `;

  document.getElementById('planContent').innerHTML = planHTML;

  // Build chart after DOM insertion
  setTimeout(() => buildChart(roadmap), 50);
}
