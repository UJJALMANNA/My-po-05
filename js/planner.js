// ============================================================
// EXAM PLANNER ENGINE v2 — Ujjal Manna
// Full All-India exam database: 10 categories, 30+ exams
// Flow: Category → Exam → Branch/Dept → Year → Plan + Diagram
// ============================================================

// ---- DATA ----

const CATEGORIES = [
  { id: 'Engineering',     label: 'Engineering',      icon: '⚙️' },
  { id: 'Medical',         label: 'Medical / Nursing', icon: '🏥' },
  { id: 'CivilServices',   label: 'Civil Services',    icon: '🏛️' },
  { id: 'SSC',             label: 'SSC',               icon: '📋' },
  { id: 'Banking',         label: 'Banking',           icon: '🏦' },
  { id: 'Defence',         label: 'Defence',           icon: '🛡️' },
  { id: 'PSU',             label: 'PSU',               icon: '🏭' },
  { id: 'Railway',         label: 'Railway',           icon: '🚆' },
  { id: 'Intelligence',    label: 'Intelligence',      icon: '🔍' },
  { id: 'Teaching',        label: 'Teaching',          icon: '📚' },
];

const EXAMS = {
  Engineering: [
    {
      id: 'GATE', label: 'GATE', full: 'Graduate Aptitude Test in Engineering',
      freq: 'Annual', examMonth: 2,
      hasDept: true,
      dept: ['Civil (CE)','CS & IT (CS)','Electronics (EC)','Electrical (EE)',
             'Mechanical (ME)','Chemical (CH)','Aerospace (AE)','Biotechnology (BT)',
             'Environmental (ES)','Physics (PH)','Mathematics (MA)','Mining (MN)',
             'Metallurgy (MT)','Instrumentation (IN)','Architecture (AR)',
             'Petroleum (PE)','Textile (TF)','Engineering Sciences (XE)'],
      syllabus: ['Engineering Mathematics','Core Branch Subject','General Aptitude'],
      phases: [
        { name: 'Foundation', weight: 0.30, topics: ['Engineering Mathematics','Basic concepts','NPTEL lectures'] },
        { name: 'Subject Deep-Dive', weight: 0.35, topics: ['Core branch chapters','Topic-wise PYQs','Practice sets'] },
        { name: 'Revision', weight: 0.20, topics: ['Formula sheets','Mind maps','Weak area focus'] },
        { name: 'Mock Tests', weight: 0.15, topics: ['Full mocks','Virtual calculator practice','Error analysis'] },
      ],
      resources: {
        'Engineering Mathematics': {
          videos: [{ title: 'NPTEL Engineering Maths', url: 'https://www.youtube.com/results?search_query=NPTEL+Engineering+Mathematics+GATE' },
                   { title: 'Khan Academy Maths', url: 'https://www.khanacademy.org/math' }],
          notes:  [{ title: 'MADE Easy Free PDFs', url: 'https://www.google.com/search?q=MADE+Easy+Engineering+Mathematics+free+PDF' },
                   { title: 'Gate Academy Notes', url: 'https://www.google.com/search?q=Gate+Academy+Maths+notes+free+PDF' }]
        },
        'General Aptitude': {
          videos: [{ title: 'Unacademy GATE GA', url: 'https://www.youtube.com/results?search_query=Unacademy+GATE+General+Aptitude' }],
          notes:  [{ title: 'GATE GA Previous Papers', url: 'https://www.google.com/search?q=GATE+General+Aptitude+previous+year+papers+free+PDF' }]
        },
        'Core Branch': {
          videos: [{ title: 'NPTEL Branch Lectures', url: 'https://www.youtube.com/results?search_query=NPTEL+GATE+branch+lectures' },
                   { title: 'Unacademy GATE Branch', url: 'https://www.youtube.com/results?search_query=Unacademy+GATE+branch+preparation' }],
          notes:  [{ title: 'NPTEL Notes Free', url: 'https://nptel.ac.in/' },
                   { title: 'Made Easy Branch PDF', url: 'https://www.google.com/search?q=Made+Easy+GATE+branch+notes+free+PDF' }]
        }
      }
    },
    {
      id: 'JEE_MAIN', label: 'JEE Main', full: 'Joint Entrance Exam – Undergraduate Engineering',
      freq: 'Twice a year', examMonth: 1,
      hasDept: false, dept: [],
      syllabus: ['Physics','Chemistry','Mathematics'],
      phases: [
        { name: 'NCERT Foundation', weight: 0.30, topics: ['NCERT Physics','NCERT Chemistry','NCERT Maths','Basic concepts'] },
        { name: 'Advanced Concepts', weight: 0.35, topics: ['HC Verma Physics','Organic Chemistry','Calculus & Algebra'] },
        { name: 'Revision', weight: 0.20, topics: ['Formula revision','Short notes','Chapter-wise PYQs'] },
        { name: 'Full Mocks', weight: 0.15, topics: ['NTA mock tests','Time management','Error log'] },
      ],
      resources: {
        'Physics': {
          videos: [{ title: 'Physics Wallah JEE', url: 'https://www.youtube.com/results?search_query=Physics+Wallah+JEE+Main+Physics' },
                   { title: 'Vedantu JEE Physics', url: 'https://www.youtube.com/results?search_query=Vedantu+JEE+Main+Physics' }],
          notes:  [{ title: 'DC Pandey Free PDF', url: 'https://www.google.com/search?q=DC+Pandey+JEE+physics+free+PDF' },
                   { title: 'HC Verma Solutions', url: 'https://www.google.com/search?q=HC+Verma+solutions+free+PDF' }]
        },
        'Chemistry': {
          videos: [{ title: 'Chemistry Wallah', url: 'https://www.youtube.com/results?search_query=Chemistry+Wallah+JEE+Main' },
                   { title: 'NCERT Chemistry Lectures', url: 'https://www.youtube.com/results?search_query=NCERT+Chemistry+JEE+Main+Arvind+Arora' }],
          notes:  [{ title: 'NCERT Chemistry Free', url: 'https://ncert.nic.in/textbook.php' },
                   { title: 'OP Tandon Organic Free', url: 'https://www.google.com/search?q=OP+Tandon+Organic+Chemistry+free+PDF' }]
        },
        'Mathematics': {
          videos: [{ title: 'Mathongo JEE Maths', url: 'https://www.youtube.com/results?search_query=Mathongo+JEE+Maths' },
                   { title: 'Vedantu JEE Maths', url: 'https://www.youtube.com/results?search_query=Vedantu+JEE+Main+Mathematics' }],
          notes:  [{ title: 'RD Sharma Solutions Free', url: 'https://www.google.com/search?q=RD+Sharma+JEE+solutions+free+PDF' },
                   { title: 'NCERT Exemplar Free', url: 'https://ncert.nic.in/exemplar-problems.php' }]
        }
      }
    },
    {
      id: 'JEE_ADV', label: 'JEE Advanced', full: 'IIT Entrance – Top 2.5L JEE Main Qualifiers',
      freq: 'Annual', examMonth: 5,
      hasDept: false, dept: [],
      syllabus: ['Physics (Advanced)','Chemistry (Advanced)','Mathematics (Advanced)'],
      phases: [
        { name: 'JEE Main Base', weight: 0.25, topics: ['NCERT mastery','JEE Main level problems','All 3 subjects'] },
        { name: 'Advanced Concepts', weight: 0.40, topics: ['Irodov Physics','JD Lee Chemistry','SL Loney Maths','Subjective problems'] },
        { name: 'PYQ Intensive', weight: 0.20, topics: ['IIT JEE PYQs 20 years','Pattern analysis','Integer type Qs'] },
        { name: 'Mock & Analysis', weight: 0.15, topics: ['Full JEE Advanced mocks','Paper 1 & 2 strategy','Error analysis'] },
      ],
      resources: {
        'Physics': {
          videos: [{ title: 'Physics Wallah Advanced', url: 'https://www.youtube.com/results?search_query=Physics+Wallah+JEE+Advanced' },
                   { title: 'NV Sir IIT Physics', url: 'https://www.youtube.com/results?search_query=NV+Sir+IIT+JEE+Physics' }],
          notes:  [{ title: 'Irodov Solutions Free', url: 'https://www.google.com/search?q=Irodov+solutions+free+PDF' },
                   { title: 'IIT JEE Previous Papers', url: 'https://www.google.com/search?q=IIT+JEE+previous+year+papers+free+PDF' }]
        },
        'Chemistry': {
          videos: [{ title: 'VK Jaiswal Organic', url: 'https://www.youtube.com/results?search_query=VK+Jaiswal+Organic+Chemistry+JEE' }],
          notes:  [{ title: 'JD Lee Notes Free', url: 'https://www.google.com/search?q=JD+Lee+Inorganic+Chemistry+notes+free+PDF' }]
        },
        'Mathematics': {
          videos: [{ title: 'Cengage Maths Solutions', url: 'https://www.youtube.com/results?search_query=Cengage+Maths+JEE+Advanced' }],
          notes:  [{ title: 'SL Loney Trigonometry Free', url: 'https://www.google.com/search?q=SL+Loney+Trigonometry+free+PDF' }]
        }
      }
    },
  ],

  Medical: [
    {
      id: 'NEET_UG', label: 'NEET UG', full: 'Undergraduate Medical & Dental Admission',
      freq: 'Annual', examMonth: 5,
      hasDept: false, dept: [],
      syllabus: ['Biology – Zoology & Botany','Physics','Chemistry'],
      phases: [
        { name: 'NCERT Mastery', weight: 0.35, topics: ['NCERT Biology Cl 11 & 12','NCERT Physics','NCERT Chemistry'] },
        { name: 'Topic-wise Practice', weight: 0.30, topics: ['Chapter PYQs','MCQ practice','Diagram-based Qs'] },
        { name: 'Revision', weight: 0.20, topics: ['Biology flashcards','Formula revision','Weak chapters'] },
        { name: 'Mock Tests', weight: 0.15, topics: ['NTA full mocks','OMR practice','Time management'] },
      ],
      resources: {
        'Biology': {
          videos: [{ title: 'Biology by Sachin Sir', url: 'https://www.youtube.com/results?search_query=Sachin+Sir+NEET+Biology' },
                   { title: 'Unacademy NEET Biology', url: 'https://www.youtube.com/results?search_query=Unacademy+NEET+Biology' },
                   { title: 'Vedantu NEET Bio', url: 'https://www.youtube.com/results?search_query=Vedantu+NEET+Biology' }],
          notes:  [{ title: 'NCERT Biology Free', url: 'https://ncert.nic.in/textbook.php' },
                   { title: 'Allen NEET Biology Notes', url: 'https://www.google.com/search?q=Allen+NEET+Biology+notes+free+PDF' }]
        },
        'Physics': {
          videos: [{ title: 'Physics Wallah NEET', url: 'https://www.youtube.com/results?search_query=Physics+Wallah+NEET+Physics' }],
          notes:  [{ title: 'NEET Physics Notes Free', url: 'https://www.google.com/search?q=NEET+Physics+notes+free+PDF' }]
        },
        'Chemistry': {
          videos: [{ title: 'VK Jaiswal Chemistry NEET', url: 'https://www.youtube.com/results?search_query=VK+Jaiswal+NEET+Chemistry' }],
          notes:  [{ title: 'NCERT Chemistry Free', url: 'https://ncert.nic.in/textbook.php' }]
        }
      }
    },
    {
      id: 'NEET_PG', label: 'NEET PG', full: 'Postgraduate Medical Entrance',
      freq: 'Annual', examMonth: 3,
      hasDept: false, dept: [],
      syllabus: ['All MBBS Subjects','Clinical Subjects','PSM'],
      phases: [
        { name: 'Subject-wise Coverage', weight: 0.35, topics: ['Medicine','Surgery','Obstetrics','Pediatrics','PSM'] },
        { name: 'Clinical Deep-Dive', weight: 0.30, topics: ['High-yield clinical Qs','Image-based Qs','Recent advances'] },
        { name: 'Revision', weight: 0.20, topics: ['PrepLadder revision','DAMS notes','Subject-wise PYQs'] },
        { name: 'Grand Tests', weight: 0.15, topics: ['Full grand tests','NEET PG pattern mocks','Rank analysis'] },
      ],
      resources: {
        'General Medicine': {
          videos: [{ title: 'DAMS NEET PG', url: 'https://www.youtube.com/results?search_query=DAMS+NEET+PG+Medicine' },
                   { title: 'PrepLadder Medicine', url: 'https://www.youtube.com/results?search_query=PrepLadder+NEET+PG+Medicine' }],
          notes:  [{ title: 'PrepLadder Free Notes', url: 'https://www.google.com/search?q=PrepLadder+NEET+PG+notes+free' },
                   { title: 'DAMS Free PDFs', url: 'https://www.google.com/search?q=DAMS+NEET+PG+notes+free+PDF' }]
        },
        'Surgery': {
          videos: [{ title: 'PrepLadder Surgery', url: 'https://www.youtube.com/results?search_query=PrepLadder+Surgery+NEET+PG' }],
          notes:  [{ title: "Bailey & Love Short Notes", url: 'https://www.google.com/search?q=Bailey+Love+Surgery+short+notes+free+PDF' }]
        },
        'PSM': {
          videos: [{ title: 'PrepLadder PSM', url: 'https://www.youtube.com/results?search_query=PrepLadder+PSM+Community+Medicine' }],
          notes:  [{ title: "Park's PSM Summary", url: 'https://www.google.com/search?q=Park+PSM+summary+notes+free+PDF' }]
        }
      }
    },
    {
      id: 'NORCET', label: 'NORCET', full: 'AIIMS Nursing Officer Recruitment Common Eligibility Test',
      freq: 'Annual', examMonth: 8,
      hasDept: true,
      dept: ['B.Sc Nursing','M.Sc Nursing – Medical Surgical','M.Sc Nursing – Obstetric',
             'M.Sc Nursing – Pediatric','M.Sc Nursing – Psychiatric','Post Basic B.Sc Nursing'],
      syllabus: ['Medical Surgical Nursing','Community Health Nursing','Obstetric Nursing','Pediatric Nursing','Psychiatric Nursing','Pharmacology'],
      phases: [
        { name: 'Nursing Fundamentals', weight: 0.30, topics: ['Basic Nursing','Anatomy & Physiology','Nutrition','Microbiology'] },
        { name: 'Speciality Nursing', weight: 0.35, topics: ['Medical Surgical','Community Health','Obstetric & Gynae','Pediatric','Psychiatric'] },
        { name: 'Pharmacology & PYQs', weight: 0.20, topics: ['Drug categories','Nursing pharmacology','NORCET previous papers'] },
        { name: 'Mock Tests', weight: 0.15, topics: ['Full-length mocks','MCQ practice','Time management'] },
      ],
      resources: {
        'Medical Surgical Nursing': {
          videos: [{ title: 'Nursing Officer AIIMS Prep', url: 'https://www.youtube.com/results?search_query=NORCET+Nursing+Officer+AIIMS+preparation' },
                   { title: 'Nursing Wallah YouTube', url: 'https://www.youtube.com/results?search_query=Nursing+Wallah+NORCET' }],
          notes:  [{ title: 'NORCET Previous Papers Free', url: 'https://www.google.com/search?q=NORCET+previous+year+papers+free+PDF' },
                   { title: 'Nursing Officer Notes Free', url: 'https://www.google.com/search?q=Nursing+Officer+AIIMS+notes+free+PDF' }]
        },
        'Community Health Nursing': {
          videos: [{ title: 'PHN Lectures YouTube', url: 'https://www.youtube.com/results?search_query=Community+Health+Nursing+lectures' }],
          notes:  [{ title: "Park's PSM Nursing Notes", url: 'https://www.google.com/search?q=Park+PSM+nursing+notes+free+PDF' }]
        },
        'Pharmacology': {
          videos: [{ title: 'Pharmacology for Nurses', url: 'https://www.youtube.com/results?search_query=Pharmacology+for+nurses+NORCET' }],
          notes:  [{ title: 'Nursing Pharmacology Notes', url: 'https://www.google.com/search?q=Nursing+pharmacology+notes+free+PDF' }]
        }
      }
    },
    {
      id: 'BSC_NURSING', label: 'B.Sc Nursing Entrance', full: 'JIPMER / AIIMS / BHU / State BSc Nursing',
      freq: 'Annual', examMonth: 6,
      hasDept: true,
      dept: ['JIPMER B.Sc Nursing','AIIMS B.Sc Nursing','BHU B.Sc Nursing','IGNOU B.Sc Nursing','State Nursing Entrance'],
      syllabus: ['Biology','Chemistry','Physics','English','General Knowledge'],
      phases: [
        { name: 'NCERT Foundation', weight: 0.35, topics: ['NCERT Class 11 & 12 Biology','NCERT Chemistry','NCERT Physics'] },
        { name: 'Practice & PYQs', weight: 0.35, topics: ['MCQ practice sets','Previous papers','GK current affairs'] },
        { name: 'Revision', weight: 0.20, topics: ['Biology diagrams','Formula revision','Weak subjects'] },
        { name: 'Mock Tests', weight: 0.10, topics: ['Entrance-pattern mocks','Time management'] },
      ],
      resources: {
        'Biology & Science': {
          videos: [{ title: 'NCERT Biology YouTube', url: 'https://www.youtube.com/results?search_query=NCERT+Biology+Class+12+nursing+entrance' },
                   { title: 'Nursing Entrance Biology', url: 'https://www.youtube.com/results?search_query=BSc+Nursing+entrance+Biology+preparation' }],
          notes:  [{ title: 'NCERT Class 12 Free PDFs', url: 'https://ncert.nic.in/textbook.php' },
                   { title: 'BSc Nursing Entrance Guide', url: 'https://www.google.com/search?q=BSc+Nursing+entrance+guide+free+PDF' }]
        },
        'GK & English': {
          videos: [{ title: 'Lucent GK YouTube', url: 'https://www.youtube.com/results?search_query=Lucent+GK+nursing+entrance' }],
          notes:  [{ title: 'Lucent GK Free PDF', url: 'https://www.google.com/search?q=Lucent+GK+free+PDF' }]
        }
      }
    },
    {
      id: 'MSC_NURSING', label: 'M.Sc Nursing Entrance', full: 'Postgraduate Nursing Specialisation Entrance',
      freq: 'Annual', examMonth: 6,
      hasDept: true,
      dept: ['Medical Surgical','Obstetrics & Gynecology','Pediatric','Psychiatric','Community Health','Oncology Nursing'],
      syllabus: ['Advanced Nursing Science','Nursing Research','Healthcare Management'],
      phases: [
        { name: 'BSc Nursing Review', weight: 0.25, topics: ['Fundamentals review','All nursing specialities','Basic sciences'] },
        { name: 'Advanced Nursing', weight: 0.40, topics: ['Speciality-wise advanced topics','Evidence-based practice','Nursing theories'] },
        { name: 'Research & Management', weight: 0.20, topics: ['Research methodology','Statistics','Healthcare management'] },
        { name: 'Mock Tests', weight: 0.15, topics: ['Previous papers','Full mocks','Interview prep'] },
      ],
      resources: {
        'Advanced Nursing': {
          videos: [{ title: 'MSc Nursing Lectures YouTube', url: 'https://www.youtube.com/results?search_query=MSc+Nursing+entrance+preparation' },
                   { title: 'Nursing Research YouTube', url: 'https://www.youtube.com/results?search_query=Nursing+Research+methodology+YouTube' }],
          notes:  [{ title: 'MSc Nursing Previous Papers', url: 'https://www.google.com/search?q=MSc+Nursing+entrance+previous+papers+free+PDF' }]
        },
        'Nursing Research': {
          videos: [{ title: 'IGNOU MSc Nursing', url: 'https://www.youtube.com/results?search_query=IGNOU+MSc+Nursing+lectures' }],
          notes:  [{ title: 'Nursing Research Notes Free', url: 'https://www.google.com/search?q=Nursing+research+notes+free+PDF' }]
        }
      }
    },
    {
      id: 'ESIC_NURSING', label: 'ESIC Nursing', full: 'Employee State Insurance Nursing Recruitment',
      freq: 'As per vacancy', examMonth: 10,
      hasDept: false, dept: [],
      syllabus: ['Nursing Fundamentals','Medical Surgical','Pharmacology','Community Health'],
      phases: [
        { name: 'Nursing Fundamentals', weight: 0.30, topics: ['Basic Nursing','Anatomy','Physiology','Nutrition'] },
        { name: 'Clinical Nursing', weight: 0.40, topics: ['Medical Surgical Nursing','Community Health','Pharmacology'] },
        { name: 'PYQs & Practice', weight: 0.20, topics: ['ESIC previous papers','MCQ sets','Mock tests'] },
        { name: 'Final Revision', weight: 0.10, topics: ['Quick revision','High-yield Qs'] },
      ],
      resources: {
        'All Nursing Subjects': {
          videos: [{ title: 'ESIC Nursing Prep YouTube', url: 'https://www.youtube.com/results?search_query=ESIC+Nursing+Officer+preparation' },
                   { title: 'Nursing Officer Lectures', url: 'https://www.youtube.com/results?search_query=Nursing+Officer+exam+preparation+lectures' }],
          notes:  [{ title: 'ESIC Nursing Previous Papers', url: 'https://www.google.com/search?q=ESIC+Nursing+Officer+previous+papers+free+PDF' },
                   { title: 'Fundamentals of Nursing Notes', url: 'https://www.google.com/search?q=Fundamentals+of+Nursing+notes+free+PDF' }]
        }
      }
    },
  ],

  CivilServices: [
    {
      id: 'UPSC_CSE', label: 'UPSC CSE', full: 'IAS / IPS / IFS — Civil Services Examination',
      freq: 'Annual', examMonth: 5,
      hasDept: true,
      dept: ['IAS (Administrative)','IPS (Police)','IFS (Foreign)','IRS (Revenue)',
             'IRTS (Railway Traffic)','IAAS (Audit)','IPoS (Postal)'],
      syllabus: ['General Studies 1–4','CSAT','Optional Subject','Essay','Interview'],
      phases: [
        { name: 'Foundation & NCERT', weight: 0.25, topics: ['NCERT Cl 6–12 all subjects','Laxmikanth Polity','Geography NCERT'] },
        { name: 'GS Deep-Dive', weight: 0.35, topics: ['History','Polity','Economy','Geography','Environment','Science & Tech'] },
        { name: 'Optional & Essay', weight: 0.20, topics: ['Optional subject coverage','Essay writing practice','Ethics GS4'] },
        { name: 'Mocks & Interview', weight: 0.20, topics: ['Prelims mocks','Mains answer writing','Interview prep'] },
      ],
      resources: {
        'General Studies': {
          videos: [{ title: 'Vision IAS YouTube', url: 'https://www.youtube.com/results?search_query=Vision+IAS+General+Studies+UPSC' },
                   { title: 'StudyIQ IAS', url: 'https://www.youtube.com/results?search_query=StudyIQ+IAS+UPSC+General+Studies' },
                   { title: 'Unacademy UPSC', url: 'https://www.youtube.com/results?search_query=Unacademy+UPSC+General+Studies' }],
          notes:  [{ title: 'Vision IAS PT 365 Free', url: 'https://www.google.com/search?q=Vision+IAS+PT+365+free+PDF' },
                   { title: 'NCERT Free PDFs', url: 'https://ncert.nic.in/textbook.php' }]
        },
        'Current Affairs': {
          videos: [{ title: 'Drishti IAS Current Affairs', url: 'https://www.youtube.com/results?search_query=Drishti+IAS+Current+Affairs' }],
          notes:  [{ title: 'PIB Summary PDFs Free', url: 'https://pib.gov.in/' },
                   { title: 'The Hindu Epaper Free', url: 'https://www.thehindu.com/' }]
        },
        'Optional Subject': {
          videos: [{ title: 'Unacademy Optional Lectures', url: 'https://www.youtube.com/results?search_query=Unacademy+UPSC+optional+subject' }],
          notes:  [{ title: 'UPSC Mains Previous Papers', url: 'https://www.google.com/search?q=UPSC+mains+previous+year+papers+free+PDF' }]
        }
      }
    },
    {
      id: 'UPSC_CAPF', label: 'UPSC CAPF', full: 'Central Armed Police Forces – Assistant Commandant',
      freq: 'Annual', examMonth: 8,
      hasDept: true,
      dept: ['CRPF','BSF','ITBP','SSB','CISF'],
      syllabus: ['General Ability','General Science','Current Events','Indian Polity','History','Geography'],
      phases: [
        { name: 'Foundation', weight: 0.30, topics: ['NCERT History','NCERT Geography','Indian Polity basics'] },
        { name: 'GS Coverage', weight: 0.35, topics: ['Current affairs','Science & Tech','Defence & Security'] },
        { name: 'Revision', weight: 0.20, topics: ['Previous year papers','Short notes','Weak areas'] },
        { name: 'Physical & Interview', weight: 0.15, topics: ['Physical standards','SSB prep','Personality development'] },
      ],
      resources: {
        'General Studies': {
          videos: [{ title: 'Vision IAS CAPF', url: 'https://www.youtube.com/results?search_query=Vision+IAS+CAPF+AC+preparation' },
                   { title: 'Unacademy CAPF AC', url: 'https://www.youtube.com/results?search_query=Unacademy+CAPF+AC+preparation' }],
          notes:  [{ title: 'CAPF Previous Papers Free', url: 'https://www.google.com/search?q=UPSC+CAPF+previous+year+papers+free+PDF' }]
        }
      }
    },
    {
      id: 'STATE_PSC', label: 'State PSC', full: 'State Civil Services – UPPSC / MPPSC / BPSC etc.',
      freq: 'Annual', examMonth: 3,
      hasDept: true,
      dept: ['UPPSC','MPPSC','BPSC','RPSC','HPSC','MPSC','TNPSC','GPSC','KPSC','APSC'],
      syllabus: ['State GK','National GK','History','Geography','Polity','Economy','Science'],
      phases: [
        { name: 'Foundation', weight: 0.25, topics: ['NCERT all subjects','State history','State geography'] },
        { name: 'GS & State GK', weight: 0.35, topics: ['State-specific topics','National GK','Current affairs'] },
        { name: 'Revision', weight: 0.25, topics: ['State PYQs','Short notes','MCQ practice'] },
        { name: 'Mocks', weight: 0.15, topics: ['State PSC mock tests','Answer writing','Interview'] },
      ],
      resources: {
        'State GK': {
          videos: [{ title: 'Drishti IAS State PCS', url: 'https://www.youtube.com/results?search_query=Drishti+IAS+State+PCS+preparation' },
                   { title: 'Unacademy State PCS', url: 'https://www.youtube.com/results?search_query=Unacademy+State+PCS+preparation' }],
          notes:  [{ title: 'State-Specific Notes Free', url: 'https://www.google.com/search?q=State+PSC+notes+free+PDF' },
                   { title: 'Lucent GK Free PDF', url: 'https://www.google.com/search?q=Lucent+GK+free+PDF+download' }]
        }
      }
    },
  ],

  SSC: [
    {
      id: 'SSC_CGL', label: 'SSC CGL', full: 'Combined Graduate Level Examination',
      freq: 'Annual', examMonth: 9,
      hasDept: true,
      dept: ['Income Tax Inspector','Excise Inspector','Statistical Investigator',
             'Auditor','Accountant','Assistant Section Officer','Sub-Inspector CBI','Inspector Customs'],
      syllabus: ['Quantitative Aptitude','English Language','General Intelligence','General Awareness'],
      phases: [
        { name: 'Basics & Concepts', weight: 0.25, topics: ['Arithmetic basics','English grammar','Reasoning patterns','GK overview'] },
        { name: 'Topic-wise Practice', weight: 0.35, topics: ['Maths chapter-wise','English Qs','GK current affairs','Reasoning puzzles'] },
        { name: 'PYQ Solving', weight: 0.25, topics: ['Tier 1 PYQs','Tier 2 PYQs','Speed building'] },
        { name: 'Mock Tests', weight: 0.15, topics: ['SSC CGL full mocks','Error analysis','Time management'] },
      ],
      resources: {
        'Quantitative Aptitude': {
          videos: [{ title: 'Rakesh Yadav Maths YouTube', url: 'https://www.youtube.com/results?search_query=Rakesh+Yadav+Maths+SSC+CGL' },
                   { title: 'Arun Sharma Shortcuts', url: 'https://www.youtube.com/results?search_query=Arun+Sharma+Maths+shortcuts+SSC' }],
          notes:  [{ title: 'Rakesh Yadav Class Notes Free', url: 'https://www.google.com/search?q=Rakesh+Yadav+SSC+Maths+class+notes+free+PDF' },
                   { title: 'SSC CGL Previous Papers', url: 'https://www.google.com/search?q=SSC+CGL+previous+year+papers+free+PDF' }]
        },
        'English Language': {
          videos: [{ title: 'Neetu Singh English SSC', url: 'https://www.youtube.com/results?search_query=Neetu+Singh+English+SSC+CGL' }],
          notes:  [{ title: 'Neetu Singh English Notes', url: 'https://www.google.com/search?q=Neetu+Singh+English+notes+SSC+free+PDF' }]
        },
        'General Awareness': {
          videos: [{ title: 'StudyIQ GK', url: 'https://www.youtube.com/results?search_query=StudyIQ+GK+SSC+CGL' },
                   { title: 'Mahendra GK', url: 'https://www.youtube.com/results?search_query=Mahendra+GK+SSC' }],
          notes:  [{ title: 'Lucent GK Free PDF', url: 'https://www.google.com/search?q=Lucent+GK+free+PDF' }]
        }
      }
    },
    {
      id: 'SSC_CHSL', label: 'SSC CHSL', full: 'Combined Higher Secondary Level Examination',
      freq: 'Annual', examMonth: 3,
      hasDept: false, dept: [],
      syllabus: ['Quantitative Aptitude','English','General Intelligence','General Awareness'],
      phases: [
        { name: 'Concepts', weight: 0.30, topics: ['Maths basics','English grammar','GK basics'] },
        { name: 'Practice', weight: 0.35, topics: ['MCQ sets','PYQs','Speed drills'] },
        { name: 'Revision', weight: 0.20, topics: ['Short notes','Weak topics','Formula revision'] },
        { name: 'Mocks', weight: 0.15, topics: ['Full mocks','Analysis','Time management'] },
      ],
      resources: {
        'All Subjects': {
          videos: [{ title: 'SSC Adda YouTube', url: 'https://www.youtube.com/results?search_query=SSC+Adda+CHSL+preparation' },
                   { title: 'Unacademy SSC CHSL', url: 'https://www.youtube.com/results?search_query=Unacademy+SSC+CHSL' }],
          notes:  [{ title: 'CHSL Previous Papers Free', url: 'https://www.google.com/search?q=SSC+CHSL+previous+year+papers+free+PDF' }]
        }
      }
    },
    {
      id: 'SSC_MTS', label: 'SSC MTS', full: 'Multi-Tasking Staff Examination',
      freq: 'Annual', examMonth: 7,
      hasDept: false, dept: [],
      syllabus: ['Numerical Aptitude','Reasoning','General English','General Knowledge'],
      phases: [
        { name: 'Basics', weight: 0.35, topics: ['Arithmetic','Basic reasoning','English grammar','GK'] },
        { name: 'Practice', weight: 0.35, topics: ['MCQ sets','PYQs','Short tricks'] },
        { name: 'Revision & Mocks', weight: 0.30, topics: ['Full mocks','Revision','Error analysis'] },
      ],
      resources: {
        'All Subjects': {
          videos: [{ title: 'Adda247 SSC MTS', url: 'https://www.youtube.com/results?search_query=Adda247+SSC+MTS+preparation' },
                   { title: 'Career Power SSC', url: 'https://www.youtube.com/results?search_query=Career+Power+SSC+MTS' }],
          notes:  [{ title: 'SSC MTS Previous Papers Free', url: 'https://www.google.com/search?q=SSC+MTS+previous+year+papers+free+PDF' },
                   { title: 'Reasoning Tricks PDF Free', url: 'https://www.google.com/search?q=Reasoning+tricks+PDF+free+SSC' }]
        }
      }
    },
    {
      id: 'SSC_CPO', label: 'SSC CPO', full: 'Central Police Organisation – Sub-Inspector',
      freq: 'Annual', examMonth: 6,
      hasDept: true,
      dept: ['CRPF','BSF','CISF','ITBP','SSB'],
      syllabus: ['General Intelligence','General Knowledge','Quantitative Aptitude','English','Physical'],
      phases: [
        { name: 'Concepts', weight: 0.25, topics: ['GK basics','Maths','English','Reasoning'] },
        { name: 'Practice', weight: 0.35, topics: ['PYQs','MCQ sets','Physical prep'] },
        { name: 'Revision', weight: 0.25, topics: ['Short notes','Current affairs','Weak topics'] },
        { name: 'Mocks & Physical', weight: 0.15, topics: ['Full mocks','Physical training'] },
      ],
      resources: {
        'All Subjects': {
          videos: [{ title: 'Unacademy SSC CPO', url: 'https://www.youtube.com/results?search_query=Unacademy+SSC+CPO+preparation' },
                   { title: 'Adda247 CPO', url: 'https://www.youtube.com/results?search_query=Adda247+SSC+CPO' }],
          notes:  [{ title: 'SSC CPO Previous Papers Free', url: 'https://www.google.com/search?q=SSC+CPO+previous+year+papers+free+PDF' }]
        }
      }
    },
  ],

  Banking: [
    {
      id: 'IBPS_PO', label: 'IBPS PO', full: 'Probationary Officer – Nationalised Banks',
      freq: 'Annual', examMonth: 10,
      hasDept: false, dept: [],
      syllabus: ['Reasoning Ability','Quantitative Aptitude','English Language','General Awareness','Computer Aptitude'],
      phases: [
        { name: 'Concept Building', weight: 0.25, topics: ['Reasoning basics','Maths basics','English grammar','Banking awareness'] },
        { name: 'Topic-wise Practice', weight: 0.35, topics: ['Puzzles','DI sets','Reading comprehension','Current affairs'] },
        { name: 'PYQ Solving', weight: 0.25, topics: ['IBPS PO PYQs','Mains level Qs','Descriptive writing'] },
        { name: 'Mocks & GD/Interview', weight: 0.15, topics: ['Full mocks','GD prep','Interview prep'] },
      ],
      resources: {
        'Reasoning Ability': {
          videos: [{ title: 'Oliveboard Reasoning', url: 'https://www.youtube.com/results?search_query=Oliveboard+Reasoning+IBPS+PO' },
                   { title: 'Adda247 Reasoning', url: 'https://www.youtube.com/results?search_query=Adda247+Reasoning+IBPS+PO' }],
          notes:  [{ title: 'Reasoning Puzzles PDF Free', url: 'https://www.google.com/search?q=Reasoning+puzzles+PDF+free+banking' },
                   { title: 'IBPS PO Previous Papers', url: 'https://www.google.com/search?q=IBPS+PO+previous+year+papers+free+PDF' }]
        },
        'Quantitative Aptitude': {
          videos: [{ title: 'Arun Sharma Banking Maths', url: 'https://www.youtube.com/results?search_query=Arun+Sharma+Banking+Maths+IBPS' },
                   { title: 'Adda247 DI', url: 'https://www.youtube.com/results?search_query=Adda247+Data+Interpretation+banking' }],
          notes:  [{ title: 'DI PDF Free', url: 'https://www.google.com/search?q=Data+Interpretation+PDF+free+banking' }]
        },
        'General Awareness': {
          videos: [{ title: 'Banking Awareness Mahendra', url: 'https://www.youtube.com/results?search_query=Mahendra+Banking+Awareness' },
                   { title: 'Adda247 GA', url: 'https://www.youtube.com/results?search_query=Adda247+General+Awareness+banking' }],
          notes:  [{ title: 'Banking Awareness PDF Free', url: 'https://www.google.com/search?q=Banking+Awareness+PDF+free' }]
        }
      }
    },
    {
      id: 'IBPS_CLERK', label: 'IBPS Clerk', full: 'Clerical Cadre – Public Sector Banks',
      freq: 'Annual', examMonth: 12,
      hasDept: false, dept: [],
      syllabus: ['Reasoning','Numerical Ability','English','General Awareness','Computer'],
      phases: [
        { name: 'Basics', weight: 0.30, topics: ['Reasoning basics','Maths','English','Banking basics'] },
        { name: 'Practice', weight: 0.35, topics: ['MCQ sets','PYQs','Speed building'] },
        { name: 'Revision', weight: 0.20, topics: ['Short notes','Current affairs','Weak areas'] },
        { name: 'Mocks', weight: 0.15, topics: ['Full mocks','Analysis'] },
      ],
      resources: {
        'All Subjects': {
          videos: [{ title: 'Adda247 IBPS Clerk', url: 'https://www.youtube.com/results?search_query=Adda247+IBPS+Clerk+preparation' },
                   { title: 'Unacademy Banking Clerk', url: 'https://www.youtube.com/results?search_query=Unacademy+IBPS+Clerk' }],
          notes:  [{ title: 'IBPS Clerk Previous Papers', url: 'https://www.google.com/search?q=IBPS+Clerk+previous+year+papers+free+PDF' }]
        }
      }
    },
    {
      id: 'SBI_PO', label: 'SBI PO', full: 'State Bank of India Probationary Officer',
      freq: 'Annual', examMonth: 12,
      hasDept: false, dept: [],
      syllabus: ['Reasoning','Quantitative Aptitude','English','Data Analysis','General Awareness'],
      phases: [
        { name: 'Concept Building', weight: 0.25, topics: ['Reasoning','Maths','English','Economy awareness'] },
        { name: 'SBI-Specific Practice', weight: 0.35, topics: ['SBI PO pattern Qs','DI','Caselet','Mains descriptive'] },
        { name: 'PYQ Solving', weight: 0.25, topics: ['SBI PO PYQs','Mains papers','GD/PI prep'] },
        { name: 'Mocks & Interview', weight: 0.15, topics: ['Full mocks','Group discussion','Interview practice'] },
      ],
      resources: {
        'All Subjects': {
          videos: [{ title: 'Unacademy SBI PO', url: 'https://www.youtube.com/results?search_query=Unacademy+SBI+PO+preparation' },
                   { title: 'Oliveboard SBI PO', url: 'https://www.youtube.com/results?search_query=Oliveboard+SBI+PO' }],
          notes:  [{ title: 'SBI PO Previous Papers Free', url: 'https://www.google.com/search?q=SBI+PO+previous+year+papers+free+PDF' }]
        }
      }
    },
    {
      id: 'RBI_GRADE_B', label: 'RBI Grade B', full: 'Reserve Bank of India Officer Grade B',
      freq: 'Annual', examMonth: 8,
      hasDept: true,
      dept: ['General (DR)','DEPR (Economics)','DSIM (Statistics)'],
      syllabus: ['General Awareness','English','Quantitative Aptitude','Economics & Social Issues','Finance & Management'],
      phases: [
        { name: 'Foundation', weight: 0.25, topics: ['Economics basics','Finance basics','Banking awareness'] },
        { name: 'Phase 1 Prep', weight: 0.30, topics: ['Reasoning','Maths','English','GA'] },
        { name: 'Phase 2 Prep', weight: 0.30, topics: ['ESI','Finance & Management','Descriptive paper'] },
        { name: 'Mocks & Interview', weight: 0.15, topics: ['Full mocks','RBI Grade B pattern','Interview'] },
      ],
      resources: {
        'Economics & Finance': {
          videos: [{ title: 'RBI Grade B Economics Unacademy', url: 'https://www.youtube.com/results?search_query=RBI+Grade+B+Economics+preparation' },
                   { title: 'Oliveboard RBI Grade B', url: 'https://www.youtube.com/results?search_query=Oliveboard+RBI+Grade+B' }],
          notes:  [{ title: 'RBI Grade B Previous Papers', url: 'https://www.google.com/search?q=RBI+Grade+B+previous+year+papers+free+PDF' },
                   { title: 'ESI Notes Free PDF', url: 'https://www.google.com/search?q=RBI+Grade+B+ESI+notes+free+PDF' }]
        }
      }
    },
    {
      id: 'NABARD_A', label: 'NABARD Grade A', full: 'National Bank for Agriculture & Rural Development',
      freq: 'Annual', examMonth: 8,
      hasDept: true,
      dept: ['General Stream','Agriculture Stream','IT Stream','Rajbhasha Stream'],
      syllabus: ['Economic & Social Issues','Agriculture','English','Computer','Reasoning'],
      phases: [
        { name: 'Foundation', weight: 0.25, topics: ['Agriculture basics','Rural economy','English'] },
        { name: 'Main Coverage', weight: 0.40, topics: ['Agriculture Science','ESI','Computer awareness','Reasoning'] },
        { name: 'Revision', weight: 0.20, topics: ['PYQs','Short notes','Current agri affairs'] },
        { name: 'Mocks', weight: 0.15, topics: ['Full mocks','Descriptive paper','Interview'] },
      ],
      resources: {
        'Agriculture & Rural Dev': {
          videos: [{ title: 'NABARD Prep YouTube', url: 'https://www.youtube.com/results?search_query=NABARD+Grade+A+preparation' },
                   { title: 'Agriculture Notes Unacademy', url: 'https://www.youtube.com/results?search_query=Unacademy+Agriculture+NABARD' }],
          notes:  [{ title: 'NABARD Previous Papers Free', url: 'https://www.google.com/search?q=NABARD+Grade+A+previous+year+papers+free+PDF' }]
        }
      }
    },
    {
      id: 'SBI_CLERK', label: 'SBI Clerk', full: 'State Bank of India Junior Associate',
      freq: 'Annual', examMonth: 1,
      hasDept: false, dept: [],
      syllabus: ['Reasoning Ability','Numerical Ability','English Language','General Awareness'],
      phases: [
        { name: 'Basics', weight: 0.30, topics: ['Reasoning','Maths basics','English','Banking basics'] },
        { name: 'Practice', weight: 0.35, topics: ['PYQs','MCQ sets','Speed drills'] },
        { name: 'Revision', weight: 0.20, topics: ['Weak areas','Current affairs','Short notes'] },
        { name: 'Mocks', weight: 0.15, topics: ['Full mocks','Analysis'] },
      ],
      resources: {
        'All Subjects': {
          videos: [{ title: 'Adda247 SBI Clerk', url: 'https://www.youtube.com/results?search_query=Adda247+SBI+Clerk+preparation' },
                   { title: 'Career Power SBI', url: 'https://www.youtube.com/results?search_query=Career+Power+SBI+Clerk' }],
          notes:  [{ title: 'SBI Clerk Previous Papers Free', url: 'https://www.google.com/search?q=SBI+Clerk+previous+year+papers+free+PDF' }]
        }
      }
    },
  ],

  Defence: [
    {
      id: 'NDA', label: 'NDA', full: 'National Defence Academy – 10+2 Level',
      freq: 'Twice a year', examMonth: 9,
      hasDept: true,
      dept: ['Army','Navy','Air Force'],
      syllabus: ['Mathematics','General Ability Test – English + GK + Science','SSB Interview'],
      phases: [
        { name: 'Maths Foundation', weight: 0.30, topics: ['Algebra','Trigonometry','Calculus','Statistics'] },
        { name: 'GAT Preparation', weight: 0.30, topics: ['English','Physics','Chemistry','History','Geography','GK'] },
        { name: 'PYQ & Practice', weight: 0.25, topics: ['NDA PYQs 10 years','Speed practice','Mock tests'] },
        { name: 'SSB Prep', weight: 0.15, topics: ['OIR test','PPDT','Psychology tests','Interview'] },
      ],
      resources: {
        'Mathematics': {
          videos: [{ title: 'NDA Maths CareerLauncher', url: 'https://www.youtube.com/results?search_query=NDA+Mathematics+preparation+CareerLauncher' },
                   { title: 'Unacademy NDA Maths', url: 'https://www.youtube.com/results?search_query=Unacademy+NDA+Mathematics' }],
          notes:  [{ title: 'NDA Previous Papers Free', url: 'https://www.google.com/search?q=NDA+previous+year+papers+free+PDF' }]
        },
        'General Ability': {
          videos: [{ title: 'NDA GAT Adda247', url: 'https://www.youtube.com/results?search_query=Adda247+NDA+General+Ability' }],
          notes:  [{ title: 'Lucent GK PDF Free', url: 'https://www.google.com/search?q=Lucent+GK+free+PDF' }]
        }
      }
    },
    {
      id: 'CDS', label: 'CDS', full: 'Combined Defence Services – Graduate Level',
      freq: 'Twice a year', examMonth: 9,
      hasDept: true,
      dept: ['IMA (Army)','INA (Navy)','AFA (Air Force)','OTA'],
      syllabus: ['English','General Knowledge','Elementary Mathematics'],
      phases: [
        { name: 'Basics', weight: 0.30, topics: ['English grammar','Maths basics','GK overview'] },
        { name: 'Practice', weight: 0.35, topics: ['CDS PYQs','English comprehension','Current affairs'] },
        { name: 'Revision', weight: 0.20, topics: ['Short notes','Weak areas','Speed building'] },
        { name: 'SSB Prep', weight: 0.15, topics: ['SSB rounds','Interview prep','Psychology tests'] },
      ],
      resources: {
        'All Subjects': {
          videos: [{ title: 'CDS Prep Unacademy', url: 'https://www.youtube.com/results?search_query=Unacademy+CDS+preparation' },
                   { title: 'Adda247 CDS', url: 'https://www.youtube.com/results?search_query=Adda247+CDS+preparation' }],
          notes:  [{ title: 'CDS Previous Papers Free', url: 'https://www.google.com/search?q=CDS+previous+year+papers+free+PDF' }]
        }
      }
    },
    {
      id: 'AFCAT', label: 'AFCAT', full: 'Air Force Common Admission Test',
      freq: 'Twice a year', examMonth: 2,
      hasDept: true,
      dept: ['Flying Branch','Ground Duty Technical','Ground Duty Non-Tech'],
      syllabus: ['Verbal Ability','Numerical Ability','Reasoning','Military Aptitude','General Awareness'],
      phases: [
        { name: 'Basics', weight: 0.25, topics: ['English','Maths','Reasoning','GK basics'] },
        { name: 'Military Aptitude', weight: 0.30, topics: ['Spatial reasoning','Military terms','Current defence affairs'] },
        { name: 'PYQs & Mocks', weight: 0.30, topics: ['AFCAT PYQs','Speed tests','Mock tests'] },
        { name: 'AFSB Prep', weight: 0.15, topics: ['AFSB rounds','CPSS if Flying branch','Interview'] },
      ],
      resources: {
        'All Subjects': {
          videos: [{ title: 'AFCAT Unacademy', url: 'https://www.youtube.com/results?search_query=Unacademy+AFCAT+preparation' },
                   { title: 'Career Launcher AFCAT', url: 'https://www.youtube.com/results?search_query=Career+Launcher+AFCAT' }],
          notes:  [{ title: 'AFCAT Previous Papers Free', url: 'https://www.google.com/search?q=AFCAT+previous+year+papers+free+PDF' }]
        }
      }
    },
    {
      id: 'AGNIVEER', label: 'Agniveer', full: 'Army / Navy / Air Force Agniveer Scheme',
      freq: 'Annual', examMonth: 4,
      hasDept: true,
      dept: ['Army (CEE)','Navy MR / NMR / AA','Air Force Group X / Y'],
      syllabus: ['Physics','Mathematics','English','General Science','GK'],
      phases: [
        { name: 'Foundation', weight: 0.30, topics: ['Physics Class 10/12','Maths','English','General Science'] },
        { name: 'Practice', weight: 0.35, topics: ['Agniveer PYQs','MCQ sets','Speed tests'] },
        { name: 'Revision & Physical', weight: 0.20, topics: ['Short notes','Physical fitness','Weak topics'] },
        { name: 'Mocks', weight: 0.15, topics: ['Full mocks','Rally preparation'] },
      ],
      resources: {
        'All Subjects': {
          videos: [{ title: 'Agniveer Prep YouTube', url: 'https://www.youtube.com/results?search_query=Agniveer+exam+preparation' },
                   { title: 'Adda247 Agniveer', url: 'https://www.youtube.com/results?search_query=Adda247+Agniveer' }],
          notes:  [{ title: 'Agniveer Previous Papers Free', url: 'https://www.google.com/search?q=Agniveer+previous+year+papers+free+PDF' }]
        }
      }
    },
  ],

  PSU: [
    {
      id: 'BHEL', label: 'BHEL Recruitment', full: 'Bharat Heavy Electricals Limited',
      freq: 'As per vacancy', examMonth: 10,
      hasDept: true,
      dept: ['Mechanical','Electrical','Electronics','Civil','IT/CS','HR/Finance'],
      syllabus: ['Core Engineering Subject','Aptitude','Technical GK'],
      phases: [
        { name: 'Technical Foundation', weight: 0.35, topics: ['Core branch subjects','Engineering fundamentals'] },
        { name: 'Aptitude Prep', weight: 0.30, topics: ['Verbal ability','Numerical aptitude','Reasoning'] },
        { name: 'PYQs & Technical GK', weight: 0.25, topics: ['BHEL PYQs','PSU GK','Industry knowledge'] },
        { name: 'Mocks', weight: 0.10, topics: ['Full mocks','Interview prep'] },
      ],
      resources: {
        'Technical': {
          videos: [{ title: 'BHEL Exam Prep YouTube', url: 'https://www.youtube.com/results?search_query=BHEL+recruitment+exam+preparation' },
                   { title: 'PSU Preparation Channel', url: 'https://www.youtube.com/results?search_query=PSU+technical+exam+preparation' }],
          notes:  [{ title: 'BHEL Previous Papers Free', url: 'https://www.google.com/search?q=BHEL+previous+year+papers+free+PDF' }]
        }
      }
    },
    {
      id: 'DRDO', label: 'DRDO Scientist', full: 'Defence R&D Organisation – CEPTAM / SET',
      freq: 'Annual', examMonth: 9,
      hasDept: true,
      dept: ['CS/IT','Electronics','Mechanical','Aerospace','Naval Architecture','Chemistry','Physics','Mathematics'],
      syllabus: ['Core Technical Subject','Reasoning','General Science'],
      phases: [
        { name: 'Technical Foundation', weight: 0.35, topics: ['Core branch mastery','Advanced technical topics'] },
        { name: 'Aptitude & Science', weight: 0.30, topics: ['Reasoning','General Science','Maths aptitude'] },
        { name: 'PYQ Solving', weight: 0.25, topics: ['DRDO CEPTAM PYQs','SET papers','Pattern analysis'] },
        { name: 'Mocks & Interview', weight: 0.10, topics: ['Full mocks','Interview prep','Security clearance awareness'] },
      ],
      resources: {
        'Technical': {
          videos: [{ title: 'DRDO CEPTAM Prep YouTube', url: 'https://www.youtube.com/results?search_query=DRDO+CEPTAM+SET+preparation' },
                   { title: 'Made Easy DRDO', url: 'https://www.youtube.com/results?search_query=Made+Easy+DRDO+preparation' }],
          notes:  [{ title: 'DRDO Previous Papers Free', url: 'https://www.google.com/search?q=DRDO+CEPTAM+previous+year+papers+free+PDF' }]
        }
      }
    },
    {
      id: 'ONGC', label: 'ONGC Recruitment', full: 'Oil and Natural Gas Corporation',
      freq: 'As per vacancy', examMonth: 11,
      hasDept: true,
      dept: ['Petroleum Engineering','Chemical','Mechanical','Electrical','Geophysics','Geology','IT'],
      syllabus: ['Technical Subject','Aptitude','GK'],
      phases: [
        { name: 'Technical Prep', weight: 0.40, topics: ['Core branch','Petroleum industry basics','Technical GK'] },
        { name: 'Aptitude', weight: 0.30, topics: ['Numerical aptitude','Reasoning','English'] },
        { name: 'PYQs', weight: 0.20, topics: ['ONGC PYQs','PSU patterns'] },
        { name: 'Interview', weight: 0.10, topics: ['Technical interview','HR questions','Industry knowledge'] },
      ],
      resources: {
        'Technical': {
          videos: [{ title: 'ONGC Exam Prep YouTube', url: 'https://www.youtube.com/results?search_query=ONGC+recruitment+exam+preparation' }],
          notes:  [{ title: 'ONGC Previous Papers Free', url: 'https://www.google.com/search?q=ONGC+previous+year+papers+free+PDF' }]
        }
      }
    },
  ],

  Railway: [
    {
      id: 'RRB_JE', label: 'RRB JE', full: 'Junior Engineer – Indian Railways',
      freq: 'As per notification', examMonth: 5,
      hasDept: true,
      dept: ['Civil','Electrical','Mechanical','Electronics','IT','Depot Material Superintendent'],
      syllabus: ['Mathematics','General Intelligence','General Awareness','General Science','Technical Subject'],
      phases: [
        { name: 'Basics & Technical', weight: 0.30, topics: ['Maths basics','GK','Technical subject fundamentals'] },
        { name: 'Subject-wise Practice', weight: 0.35, topics: ['Core branch topics','Science Qs','CBT pattern'] },
        { name: 'PYQs & Revision', weight: 0.25, topics: ['RRB JE PYQs','Short notes','Weak areas'] },
        { name: 'Mocks', weight: 0.10, topics: ['Full mocks','CBT 1 & 2 strategy'] },
      ],
      resources: {
        'All Subjects': {
          videos: [{ title: 'RRB JE by Adda247', url: 'https://www.youtube.com/results?search_query=Adda247+RRB+JE+preparation' },
                   { title: 'Unacademy Railways JE', url: 'https://www.youtube.com/results?search_query=Unacademy+RRB+JE' }],
          notes:  [{ title: 'RRB JE Previous Papers Free', url: 'https://www.google.com/search?q=RRB+JE+previous+year+papers+free+PDF' }]
        }
      }
    },
    {
      id: 'RRB_NTPC', label: 'RRB NTPC', full: 'Non-Technical Popular Categories',
      freq: 'As per notification', examMonth: 12,
      hasDept: true,
      dept: ['Junior Clerk','Accounts Clerk','Commercial Apprentice','Station Master','Goods Guard','Traffic Assistant'],
      syllabus: ['Mathematics','General Intelligence','General Awareness'],
      phases: [
        { name: 'Basics', weight: 0.30, topics: ['Maths','Reasoning','GK basics'] },
        { name: 'Practice', weight: 0.35, topics: ['PYQs','MCQ sets','Speed drills'] },
        { name: 'Revision', weight: 0.20, topics: ['Current affairs','Short notes'] },
        { name: 'Mocks', weight: 0.15, topics: ['Full mocks','CBT 1 & 2 strategy'] },
      ],
      resources: {
        'All Subjects': {
          videos: [{ title: 'RRB NTPC Adda247', url: 'https://www.youtube.com/results?search_query=Adda247+RRB+NTPC+preparation' },
                   { title: 'Mahendra NTPC', url: 'https://www.youtube.com/results?search_query=Mahendra+RRB+NTPC' }],
          notes:  [{ title: 'NTPC Previous Papers Free', url: 'https://www.google.com/search?q=RRB+NTPC+previous+year+papers+free+PDF' }]
        }
      }
    },
    {
      id: 'RRB_GROUP_D', label: 'RRB Group D', full: 'Level 1 – Railway Staff Recruitment',
      freq: 'As per notification', examMonth: 9,
      hasDept: false, dept: [],
      syllabus: ['Mathematics','General Intelligence','General Science','General Awareness'],
      phases: [
        { name: 'Basics', weight: 0.35, topics: ['Maths','Reasoning','Science','GK'] },
        { name: 'Practice', weight: 0.35, topics: ['PYQs','MCQ sets'] },
        { name: 'Revision & Mocks', weight: 0.30, topics: ['Full mocks','Short notes'] },
      ],
      resources: {
        'All Subjects': {
          videos: [{ title: 'Group D Prep YouTube', url: 'https://www.youtube.com/results?search_query=RRB+Group+D+preparation' },
                   { title: 'Adda247 Group D', url: 'https://www.youtube.com/results?search_query=Adda247+RRB+Group+D' }],
          notes:  [{ title: 'Group D Previous Papers Free', url: 'https://www.google.com/search?q=RRB+Group+D+previous+year+papers+free+PDF' }]
        }
      }
    },
    {
      id: 'RRB_ALP', label: 'RRB ALP', full: 'Assistant Loco Pilot – Indian Railways',
      freq: 'As per notification', examMonth: 8,
      hasDept: true,
      dept: ['Electrical','Mechanical','Electronics','Automobile','Fitter'],
      syllabus: ['Mathematics','General Intelligence','Basic Science','Technical Trade'],
      phases: [
        { name: 'Basics & Technical', weight: 0.30, topics: ['Maths','Science','Technical trade basics'] },
        { name: 'Trade-wise Practice', weight: 0.35, topics: ['Trade-specific Qs','CBT 2 prep','PYQs'] },
        { name: 'Revision', weight: 0.20, topics: ['Short notes','Weak areas'] },
        { name: 'Mocks', weight: 0.15, topics: ['Full mocks','CBT 1 & 2 strategy'] },
      ],
      resources: {
        'All Subjects': {
          videos: [{ title: 'ALP Prep Unacademy', url: 'https://www.youtube.com/results?search_query=Unacademy+RRB+ALP+preparation' },
                   { title: 'Adda247 ALP', url: 'https://www.youtube.com/results?search_query=Adda247+RRB+ALP' }],
          notes:  [{ title: 'ALP Previous Papers Free', url: 'https://www.google.com/search?q=RRB+ALP+previous+year+papers+free+PDF' }]
        }
      }
    },
  ],

  Intelligence: [
    {
      id: 'IB_ACIO', label: 'IB ACIO', full: 'Intelligence Bureau – Asst Central Intelligence Officer',
      freq: 'As per notification', examMonth: 10,
      hasDept: true,
      dept: ['Grade II Executive','Technical'],
      syllabus: ['General Awareness','Quantitative Aptitude','Logical Ability','English','Interview'],
      phases: [
        { name: 'Foundation', weight: 0.25, topics: ['GK basics','Maths','English','Reasoning'] },
        { name: 'Practice', weight: 0.40, topics: ['IB ACIO PYQs','Current affairs','MCQ sets'] },
        { name: 'Revision', weight: 0.20, topics: ['Short notes','Weak areas','Speed building'] },
        { name: 'Mocks & Interview', weight: 0.15, topics: ['Full mocks','Interview prep','Personality'] },
      ],
      resources: {
        'All Subjects': {
          videos: [{ title: 'IB ACIO Prep YouTube', url: 'https://www.youtube.com/results?search_query=IB+ACIO+preparation' },
                   { title: 'Unacademy IB ACIO', url: 'https://www.youtube.com/results?search_query=Unacademy+IB+ACIO' }],
          notes:  [{ title: 'IB ACIO Previous Papers Free', url: 'https://www.google.com/search?q=IB+ACIO+previous+year+papers+free+PDF' }]
        }
      }
    },
  ],

  Teaching: [
    {
      id: 'UGC_NET', label: 'UGC NET', full: 'National Eligibility Test – Asst Professor / JRF',
      freq: 'Twice a year', examMonth: 6,
      hasDept: true,
      dept: ['Computer Science','Management','Commerce','Political Science','History','Geography',
             'Economics','Sociology','Psychology','Education','Philosophy','English Literature',
             'Hindi','Sanskrit','Law','Physical Education','Library Science','Environmental Science',
             'Mass Communication','Electronic Science'],
      syllabus: ['Paper 1 – Teaching Aptitude & Research','Paper 2 – Subject Specific'],
      phases: [
        { name: 'Paper 1 Mastery', weight: 0.25, topics: ['Teaching aptitude','Research methodology','Logical reasoning','Communication','ICT'] },
        { name: 'Paper 2 Coverage', weight: 0.40, topics: ['Subject-wise full syllabus','Unit-wise notes','Subject PYQs'] },
        { name: 'Revision', weight: 0.20, topics: ['Paper 1 revision','Paper 2 key topics','Previous year analysis'] },
        { name: 'Mocks', weight: 0.15, topics: ['Full mock tests','Time management','Error analysis'] },
      ],
      resources: {
        'Paper 1': {
          videos: [{ title: 'UGC NET Paper 1 KVS Madaan', url: 'https://www.youtube.com/results?search_query=KVS+Madaan+UGC+NET+Paper+1' },
                   { title: 'Unacademy UGC NET Paper 1', url: 'https://www.youtube.com/results?search_query=Unacademy+UGC+NET+Paper+1' }],
          notes:  [{ title: 'KVS Madaan Notes Free', url: 'https://www.google.com/search?q=KVS+Madaan+UGC+NET+Paper+1+notes+free+PDF' },
                   { title: 'UGC NET Paper 1 PYQs', url: 'https://www.google.com/search?q=UGC+NET+Paper+1+previous+year+papers+free+PDF' }]
        },
        'Paper 2 – Subject': {
          videos: [{ title: 'Subject-Specific YouTube Channel', url: 'https://www.youtube.com/results?search_query=UGC+NET+subject+specific+preparation' }],
          notes:  [{ title: 'Subject PYQs Free PDF', url: 'https://www.google.com/search?q=UGC+NET+subject+previous+year+papers+free+PDF' }]
        }
      }
    },
    {
      id: 'CTET', label: 'CTET / STET', full: 'Central / State Teacher Eligibility Test',
      freq: 'Twice a year', examMonth: 12,
      hasDept: true,
      dept: ['Paper 1 – Class 1–5','Paper 2 – Science & Maths','Paper 2 – Social Studies','Paper 2 – Language'],
      syllabus: ['Child Development & Pedagogy','Language 1 & Language 2','Mathematics / Science / SST'],
      phases: [
        { name: 'CDP Foundation', weight: 0.30, topics: ['Child Development','Learning theories','Piaget','Vygotsky'] },
        { name: 'Language & Subject', weight: 0.35, topics: ['Language pedagogy','Content subject','Teaching methods'] },
        { name: 'Revision', weight: 0.20, topics: ['CDP revision','Subject revision','Pedagogy MCQs'] },
        { name: 'Mocks', weight: 0.15, topics: ['Full mocks','CTET/STET PYQs','Time management'] },
      ],
      resources: {
        'All Subjects': {
          videos: [{ title: 'CTET by Himanshi Singh', url: 'https://www.youtube.com/results?search_query=Himanshi+Singh+CTET+preparation' },
                   { title: 'Unacademy CTET', url: 'https://www.youtube.com/results?search_query=Unacademy+CTET' }],
          notes:  [{ title: 'CTET Previous Papers Free', url: 'https://www.google.com/search?q=CTET+previous+year+papers+free+PDF' },
                   { title: 'CTET Notes PDF Free', url: 'https://www.google.com/search?q=CTET+notes+free+PDF' }]
        }
      }
    },
  ],
};

// ---- STATE ----
let selectedCategory = null;
let selectedExamObj  = null;
let selectedDept     = null;
let selectedYear     = null;
let planChart        = null;

// ---- STEP TRACKING ----
// planner.html has 3 panels (panel1, panel2, panel3) and 3 steps.
// We repurpose them and inject extra sub-steps via JS inside panel1 & panel2.

const STEP_LABELS = ['Choose Exam', 'Appearing Year', 'Your Plan'];
let currentMajorStep = 1; // 1=category/exam/dept, 2=year, 3=plan
let subStep = 'category';  // 'category' | 'exam' | 'dept'

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  updateStepUI(1);
  renderCategoryGrid();
  wireNavigation();
});

// ---- STEP UI ----
function updateStepUI(majorStep) {
  currentMajorStep = majorStep;
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.toggle('is-active', i + 1 === majorStep);
    s.classList.toggle('is-done', i + 1 < majorStep);
  });
  document.querySelectorAll('.panel').forEach((p, i) => {
    p.classList.toggle('is-active', i + 1 === majorStep);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- NAVIGATION ----
function wireNavigation() {
  document.getElementById('toStep2').addEventListener('click', () => {
    updateStepUI(2);
    renderYearPicker();
  });
  document.getElementById('backToStep1').addEventListener('click', () => {
    updateStepUI(1);
    // Go back to appropriate sub-step
    if (selectedExamObj && selectedExamObj.hasDept) {
      renderDeptGrid();
    } else if (selectedExamObj) {
      renderExamGrid(selectedCategory);
    } else {
      renderCategoryGrid();
    }
  });
  document.getElementById('toStep3').addEventListener('click', () => {
    updateStepUI(3);
    buildPlan();
    localStorage.setItem('um_exam', selectedExamObj?.id || '');
    localStorage.setItem('um_year', selectedYear);
  });
  document.getElementById('backToStep2').addEventListener('click', () => {
    updateStepUI(2);
    renderYearPicker();
  });
}

// ---- PANEL 1: CATEGORY → EXAM → DEPT ----

function renderCategoryGrid() {
  subStep = 'category';
  document.getElementById('toStep2').disabled = true;
  const panel = document.getElementById('panel1');
  panel.innerHTML = `
    <h3 style="margin-bottom:var(--space-3)">Which category are you preparing for?</h3>
    <div class="exam-grid" id="catGrid"></div>
    <button class="btn btn--solid" id="toStep2" disabled>Continue →</button>
  `;
  const grid = document.getElementById('catGrid');
  grid.innerHTML = CATEGORIES.map(cat => `
    <div class="exam-card" data-cat="${cat.id}" role="button" tabindex="0" aria-label="Select ${cat.label}">
      <div class="exam-card__icon">${cat.icon}</div>
      <div class="exam-card__name">${cat.label}</div>
      <div class="exam-card__full">${EXAMS[cat.id].length} exam${EXAMS[cat.id].length > 1 ? 's' : ''}</div>
    </div>
  `).join('');
  grid.querySelectorAll('.exam-card').forEach(card => {
    const go = () => {
      selectedCategory = card.dataset.cat;
      renderExamGrid(selectedCategory);
    };
    card.addEventListener('click', go);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') go(); });
  });
  // Re-wire toStep2 (re-rendered)
  document.getElementById('toStep2').addEventListener('click', () => {
    updateStepUI(2);
    renderYearPicker();
  });
}

function renderExamGrid(catId) {
  subStep = 'exam';
  document.getElementById('toStep2').disabled = true;
  const catInfo = CATEGORIES.find(c => c.id === catId);
  const panel = document.getElementById('panel1');
  panel.innerHTML = `
    <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3)">
      <button class="btn btn--ghost" id="backToCat" style="padding:0.4em 0.9em;font-size:0.85rem">← Categories</button>
      <h3>${catInfo.icon} ${catInfo.label}</h3>
    </div>
    <input class="search-box-planner" id="examSearch" placeholder="Search exams..." style="width:100%;padding:0.6em 1em;border:1px solid var(--line);border-radius:var(--radius-sm);background:var(--surface);color:var(--ink);font-family:var(--font-body);font-size:0.9rem;margin-bottom:var(--space-3);outline:none;">
    <div class="exam-grid" id="examGrid"></div>
    <button class="btn btn--solid" id="toStep2" disabled>Continue →</button>
  `;
  document.getElementById('backToCat').addEventListener('click', renderCategoryGrid);
  document.getElementById('examSearch').addEventListener('input', function() {
    populateExamGrid(catId, this.value.toLowerCase());
  });
  populateExamGrid(catId, '');
  document.getElementById('toStep2').addEventListener('click', () => {
    updateStepUI(2);
    renderYearPicker();
  });
}

function populateExamGrid(catId, filter) {
  const grid = document.getElementById('examGrid');
  const list = EXAMS[catId].filter(e =>
    e.label.toLowerCase().includes(filter) || e.full.toLowerCase().includes(filter)
  );
  grid.innerHTML = list.map(ex => `
    <div class="exam-card" data-exam="${ex.id}" role="button" tabindex="0" aria-label="Select ${ex.label}">
      <div class="exam-card__name">${ex.label}</div>
      <div class="exam-card__full">${ex.full}</div>
      <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--ink-dim);margin-top:0.4em">${ex.freq}</div>
    </div>
  `).join('');
  grid.querySelectorAll('.exam-card').forEach(card => {
    const go = () => {
      selectedExamObj = EXAMS[catId].find(e => e.id === card.dataset.exam);
      if (selectedExamObj.hasDept && selectedExamObj.dept.length) {
        renderDeptGrid();
      } else {
        selectedDept = null;
        document.getElementById('toStep2').disabled = false;
        grid.querySelectorAll('.exam-card').forEach(c => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
      }
    };
    card.addEventListener('click', go);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') go(); });
  });
}

function renderDeptGrid() {
  subStep = 'dept';
  document.getElementById('toStep2').disabled = true;
  const panel = document.getElementById('panel1');
  panel.innerHTML = `
    <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3)">
      <button class="btn btn--ghost" id="backToExam" style="padding:0.4em 0.9em;font-size:0.85rem">← Exams</button>
      <h3>${selectedExamObj.label} — Choose Branch / Department</h3>
    </div>
    <div class="exam-grid" id="deptGrid"></div>
    <button class="btn btn--solid" id="toStep2" disabled>Continue →</button>
  `;
  document.getElementById('backToExam').addEventListener('click', () => renderExamGrid(selectedCategory));
  const grid = document.getElementById('deptGrid');
  grid.innerHTML = selectedExamObj.dept.map(d => `
    <div class="exam-card" data-dept="${d}" role="button" tabindex="0" aria-label="Select ${d}">
      <div class="exam-card__name" style="font-size:0.95rem">${d}</div>
    </div>
  `).join('');
  grid.querySelectorAll('.exam-card').forEach(card => {
    const go = () => {
      selectedDept = card.dataset.dept;
      grid.querySelectorAll('.exam-card').forEach(c => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
      document.getElementById('toStep2').disabled = false;
    };
    card.addEventListener('click', go);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') go(); });
  });
  document.getElementById('toStep2').addEventListener('click', () => {
    updateStepUI(2);
    renderYearPicker();
  });
}

// ---- PANEL 2: YEAR PICKER ----
function renderYearPicker() {
  const picker = document.getElementById('yearPicker');
  const cur = new Date().getFullYear();
  const years = [cur, cur+1, cur+2, cur+3, cur+4];
  picker.innerHTML = years.map(y => {
    const examDate = new Date(y, (selectedExamObj?.examMonth || 2) - 1, 15);
    const mLeft = Math.max(0, Math.round((examDate - new Date()) / (1000*60*60*24*30.44)));
    const away = mLeft === 0 ? 'This month' : `~${mLeft}mo away`;
    const col = mLeft < 4 ? 'var(--c-pink)' : mLeft < 10 ? 'var(--c-orange)' : 'var(--c-cyan)';
    return `<button class="year-btn" data-year="${y}">
      ${y}
      <span style="display:block;font-size:0.65rem;font-weight:400;color:${col};margin-top:0.2em">${MONTHS_SHORT[(selectedExamObj?.examMonth||2)-1]} · ${away}</span>
    </button>`;
  }).join('');
  picker.querySelectorAll('.year-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      picker.querySelectorAll('.year-btn').forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      selectedYear = parseInt(btn.dataset.year);
      document.getElementById('toStep3').disabled = false;
    });
  });
  document.getElementById('toStep3').disabled = true;
}

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// ---- TIME CALC ----
function calcTime(examObj, year) {
  const examDate = new Date(year, (examObj.examMonth || 2) - 1, 15);
  const today = new Date();
  const totalDays = Math.max(0, Math.floor((examDate - today) / 86400000));
  return {
    days: totalDays,
    weeks: Math.floor(totalDays / 7),
    months: Math.floor(totalDays / 30.44),
    years: (totalDays / 365).toFixed(1),
    examDate
  };
}

function getIntensity(months) {
  if (months >= 18) return { label: 'Relaxed',   color: 'relaxed',   advice: 'Plenty of time — build deep conceptual clarity without rushing.' };
  if (months >= 10) return { label: 'Moderate',  color: 'moderate',  advice: 'Good window — steady structured plan with weekly targets.' };
  if (months >= 4)  return { label: 'Intensive', color: 'intensive', advice: 'Limited time — focus hard on high-weight topics and start mocks early.' };
  return              { label: 'Critical',  color: 'critical',  advice: 'Very tight — high-yield topics, PYQs, and daily mock practice only.' };
}

// ---- ROADMAP ----
function generateRoadmap(examObj, time) {
  const phaseColors = ['', '--warm', '--cool', '--gold'];
  let cursor = new Date();
  let remaining = time.days;
  return examObj.phases.map((phase, i) => {
    const pDays = i < examObj.phases.length - 1
      ? Math.max(1, Math.floor(time.days * phase.weight))
      : Math.max(1, remaining);
    remaining -= pDays;
    const start = new Date(cursor);
    const end   = new Date(cursor.getTime() + pDays * 86400000);
    cursor = new Date(end);
    return { ...phase, startDate: start, endDate: end, days: pDays, colorClass: phaseColors[i] || '' };
  });
}

// ---- SCHEDULE CARDS ----
function generateSchedule(intensity, examObj) {
  const subList = examObj.syllabus.slice(0, 3).join(', ');
  const schedules = {
    relaxed: [
      { period: 'Daily',   title: '4–5 hrs study',        desc: `2 hrs concept + 2 hrs practice on ${subList}.` },
      { period: 'Weekly',  title: 'Topic completion',     desc: 'One full topic per week, mini-test every Sunday.' },
      { period: 'Monthly', title: 'Phase checkpoint',     desc: 'Complete one roadmap phase per month. Full mock at month-end.' },
      { period: 'Yearly',  title: 'Full coverage',        desc: 'Year 1: full syllabus. Year 2: revision + mocks.' },
    ],
    moderate: [
      { period: 'Daily',   title: '6–7 hrs study',        desc: `3 hrs concepts + 2 hrs PYQs + 1 hr revision on ${subList}.` },
      { period: 'Weekly',  title: '2 topics + 1 mock',    desc: 'Cover 2 topics, one sectional mock, review errors on Sunday.' },
      { period: 'Monthly', title: 'Syllabus in thirds',   desc: 'Divide syllabus into 3 equal parts, one per month with mock at end.' },
      { period: 'Yearly',  title: 'Structured prep',      desc: 'Steady concept-to-revision cycle across available months.' },
    ],
    intensive: [
      { period: 'Daily',   title: '8–9 hrs study',        desc: '4 hrs high-yield topics + 2 hrs PYQs + 2 hrs mock analysis.' },
      { period: 'Weekly',  title: '3 topics + 2 mocks',   desc: '3 topics/week, 2 weekend mocks, ruthless error analysis.' },
      { period: 'Monthly', title: 'Half-syllabus/month',  desc: 'Month 1–2: full coverage. Month 3+: pure revision and mocks.' },
      { period: 'Yearly',  title: 'Sprint mode',          desc: 'No time to waste — every week counts. Track targets strictly.' },
    ],
    critical: [
      { period: 'Daily',   title: '10+ hrs study',        desc: 'High-yield topics only. Skip low-weight areas entirely.' },
      { period: 'Weekly',  title: 'PYQ-first approach',   desc: 'Last 10 years PYQs first — reveals what actually comes in exams.' },
      { period: 'Monthly', title: 'Mock every week',      desc: 'Weekly full mocks with deep analysis are non-negotiable.' },
      { period: 'Yearly',  title: 'Final lap',            desc: "Home stretch. Confidence, stamina, and consistency win." },
    ],
  };
  return schedules[intensity.color] || schedules.moderate;
}

// ---- CHART ----
function buildChart(roadmap) {
  if (planChart) { planChart.destroy(); planChart = null; }
  const ctx = document.getElementById('planChart');
  if (!ctx || !roadmap.length) return;
  planChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: roadmap.map(p => p.name),
      datasets: [{
        label: 'Days allocated',
        data: roadmap.map(p => p.days),
        backgroundColor: ['rgba(108,92,231,0.8)','rgba(243,104,176,0.8)','rgba(79,209,197,0.8)','rgba(255,159,90,0.8)'],
        borderRadius: 8, borderSkipped: false,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => `${c.parsed.y} days (~${Math.round(c.parsed.y/7)} weeks)` } }
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#A8A3C2' } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#A8A3C2', callback: v => `${v}d` } }
      }
    }
  });
}

// ---- RESOURCES ----
function buildResources(examObj) {
  if (!examObj.resources) return '<p style="color:var(--ink-dim)">Resources coming soon.</p>';
  return Object.entries(examObj.resources).map(([subject, res]) => `
    <div class="resource-subject">
      <div class="resource-subject__name">${subject}</div>
      <div class="resource-list">
        ${(res.videos || []).map(v => `
          <div class="resource-item">
            <span class="resource-badge resource-badge--video">▶ Video</span>
            <a href="${v.url}" target="_blank" rel="noopener">${v.title}</a>
          </div>`).join('')}
        ${(res.notes || []).map(n => `
          <div class="resource-item">
            <span class="resource-badge resource-badge--notes">📄 Notes</span>
            <a href="${n.url}" target="_blank" rel="noopener">${n.title}</a>
          </div>`).join('')}
      </div>
    </div>
  `).join('');
}

// ---- ROADMAP SVG DIAGRAM ----
function buildRoadmapDiagram(roadmap, examObj, time, intensity) {
  const COLORS = ['#6C5CE7','#F368B0','#4FD1C5','#FF9F5A'];
  const W = 620, PH = 90, GAP = 36, TOP = 20;
  const totalH = TOP + roadmap.length * (PH + GAP) + GAP + 80;

  let svgPaths = '';
  let svgNodes = '';

  roadmap.forEach((phase, i) => {
    const y = TOP + i * (PH + GAP);
    const cx = W / 2;
    const col = COLORS[i % COLORS.length];
    const pct = Math.round((phase.days / time.days) * 100);
    const fmt = d => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    // Connector line (not for first)
    if (i > 0) {
      svgPaths += `<line x1="${cx}" y1="${y - GAP}" x2="${cx}" y2="${y}" stroke="${col}" stroke-width="2" stroke-dasharray="4 3" opacity="0.5"/>`;
    }

    // Phase box
    svgNodes += `
      <rect x="40" y="${y}" width="${W - 80}" height="${PH}" rx="12" fill="${col}" fill-opacity="0.1" stroke="${col}" stroke-width="1.5"/>
      <circle cx="40" cy="${y + PH/2}" r="16" fill="${col}"/>
      <text x="40" y="${y + PH/2 + 5}" text-anchor="middle" fill="#fff" font-size="13" font-weight="700">${i+1}</text>
      <text x="68" y="${y + 26}" fill="#fff" font-size="13" font-weight="700">${phase.name}</text>
      <text x="68" y="${y + 44}" fill="#A8A3C2" font-size="11">${fmt(phase.startDate)} → ${fmt(phase.endDate)}  ·  ${phase.days} days  ·  ${pct}%</text>
      <text x="68" y="${y + 62}" fill="#C4BEF0" font-size="10.5">${phase.topics.slice(0,3).join('  ·  ')}</text>
      <text x="${W - 48}" y="${y + PH/2 + 5}" text-anchor="end" fill="${col}" font-size="13" font-weight="700">${pct}%</text>
    `;
  });

  // Exam Day box
  const examY = TOP + roadmap.length * (PH + GAP) + GAP/2;
  const fmtFull = d => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  svgNodes += `
    <line x1="${W/2}" y1="${examY - 10}" x2="${W/2}" y2="${examY + 14}" stroke="#E74C3C" stroke-width="2" stroke-dasharray="4 3"/>
    <rect x="120" y="${examY + 14}" width="${W - 240}" height="56" rx="12" fill="#E74C3C" fill-opacity="0.15" stroke="#E74C3C" stroke-width="1.5"/>
    <text x="${W/2}" y="${examY + 40}" text-anchor="middle" fill="#FF7675" font-size="15" font-weight="700">🏆 Exam Day</text>
    <text x="${W/2}" y="${examY + 58}" text-anchor="middle" fill="#A8A3C2" font-size="11">${examObj.label}${selectedDept ? ' · ' + selectedDept : ''}  —  ${fmtFull(time.examDate)}</text>
  `;

  return `
    <div class="chart-wrap" style="margin-top:var(--space-4)">
      <h3>🗺️ Visual Roadmap — ${examObj.label} ${selectedYear}</h3>
      <svg viewBox="0 0 ${W} ${totalH}" width="100%" xmlns="http://www.w3.org/2000/svg" style="display:block;overflow:visible">
        ${svgPaths}${svgNodes}
      </svg>
    </div>
  `;
}

// ---- MAIN BUILD ----
function buildPlan() {
  const examObj   = selectedExamObj;
  const time      = calcTime(examObj, selectedYear);
  const intensity = getIntensity(time.months);
  const roadmap   = generateRoadmap(examObj, time);
  const schedule  = generateSchedule(intensity, examObj);
  const fmt       = d => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const planHTML = `
    <!-- Header summary -->
    <div style="margin-bottom:var(--space-3)">
      <div class="section__head" style="margin-bottom:0">
        <span class="section__num">your plan</span>
        <h3>${examObj.label}${selectedDept ? ' — ' + selectedDept : ''} · ${selectedYear}</h3>
        <p class="section__sub" style="margin:0">${examObj.full}</p>
      </div>
    </div>

    <!-- Time banner -->
    <div class="time-banner">
      <div class="time-stat"><div class="time-stat__num">${time.days.toLocaleString()}</div><div class="time-stat__label">Days remaining</div></div>
      <div class="time-stat"><div class="time-stat__num">${time.weeks}</div><div class="time-stat__label">Weeks</div></div>
      <div class="time-stat"><div class="time-stat__num">${time.months}</div><div class="time-stat__label">Months</div></div>
      <div class="time-stat"><div class="time-stat__num">${time.years}</div><div class="time-stat__label">Years</div></div>
    </div>

    <!-- Intensity -->
    <div class="intensity-banner">
      <div class="intensity-dot intensity-dot--${intensity.color}"></div>
      <div class="intensity-text"><strong>${intensity.label} mode</strong> — ${intensity.advice}</div>
    </div>

    <!-- Syllabus pills -->
    <div style="margin-bottom:var(--space-3)">
      <div style="font-family:var(--font-mono);font-size:0.75rem;font-weight:600;color:var(--ink-dim);text-transform:uppercase;letter-spacing:.06em;margin-bottom:0.6em">Syllabus</div>
      <div style="display:flex;flex-wrap:wrap;gap:0.5em">
        ${examObj.syllabus.map(s => `<span class="topic-tag">${s}</span>`).join('')}
      </div>
    </div>

    <!-- Roadmap phases -->
    <div class="section__head" style="margin-bottom:var(--space-3)">
      <span class="section__num">Roadmap</span>
      <h3>Phase-by-Phase Plan</h3>
    </div>
    <div class="roadmap">
      ${roadmap.map((phase, i) => `
        <div class="roadmap-phase roadmap-phase${phase.colorClass}">
          <div class="roadmap-phase__header">
            <div class="roadmap-phase__name">Phase ${i+1}: ${phase.name}</div>
            <div class="roadmap-phase__dates">${fmt(phase.startDate)} → ${fmt(phase.endDate)} · ${phase.days} days</div>
          </div>
          <div class="roadmap-phase__topics">
            ${phase.topics.map(t => `<span class="topic-tag">${t}</span>`).join('')}
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Chart.js bar chart -->
    <div class="chart-wrap">
      <h3>📊 Time Allocation by Phase</h3>
      <div class="chart-container"><canvas id="planChart"></canvas></div>
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
      <h3>Free YouTube Channels &amp; PDF Notes</h3>
    </div>
    <div class="resources-grid">${buildResources(examObj)}</div>

    <!-- SVG Roadmap Diagram -->
    ${buildRoadmapDiagram(roadmap, examObj, time, intensity)}
  `;

  document.getElementById('planContent').innerHTML = planHTML;
  setTimeout(() => buildChart(roadmap), 50);
}
