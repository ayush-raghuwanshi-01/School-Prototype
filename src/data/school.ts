import { mulberry32 } from '../lib/utils'

/* ------------------------------------------------------------------ *
 * Domain types
 * ------------------------------------------------------------------ */
export type Role = 'admin' | 'principal' | 'teacher' | 'accountant' | 'parent'
export type FeeStatus = 'paid' | 'pending' | 'overdue'
export type AttendanceMark = 'present' | 'absent' | 'late'

export interface Student {
  id: string
  roll: number
  name: string
  classId: string
  section: string
  admissionNo: string
  guardian: string
  phone: string
  house: 'Ganga' | 'Yamuna' | 'Kaveri' | 'Godavari'
  transport: boolean
  attendancePct: number
  cgpa: number
  feeStatus: FeeStatus
  dues: number
  tint: number
}

export interface FeeInvoice {
  id: string
  studentId: string
  studentName: string
  classId: string
  term: string
  heads: { label: string; amount: number }[]
  amount: number
  dueDate: string
  paidOn?: string
  method?: 'UPI' | 'NEFT' | 'Card' | 'Cash' | 'Cheque'
  status: FeeStatus
  receiptNo?: string
}

export interface Subject {
  id: string
  name: string
  code: string
  teacher: string
  maxMarks: number
}

export interface Program {
  id: string
  level: 'Primary' | 'Middle' | 'Secondary' | 'Senior Secondary'
  stream?: 'Science' | 'Commerce' | 'Humanities'
  grades: string
  blurb: string
  highlights: string[]
  fee: number
  seats: number
  applied: number
  ratio: string
  accent: 'brand' | 'violet' | 'emerald' | 'amber' | 'rose' | 'cyan'
  subjects: string[]
}

export interface Faculty {
  id: string
  name: string
  subject: string
  designation: string
  classes: string[]
  experience: number
  rating: number
  email: string
  room: string
}

export interface Applicant {
  id: string
  childName: string
  gradeApplied: string
  guardian: string
  city: string
  score: number
  stage: 'Enquiry' | 'Assessment' | 'Interview' | 'Offer' | 'Enrolled'
  source: 'Website' | 'Referral' | 'Walk-in' | 'Instagram' | 'Newspaper'
  appliedOn: string
}

export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  meta: string
  tint: number
  rating: number
}

/* ------------------------------------------------------------------ *
 * Public portal content
 * ------------------------------------------------------------------ */
export const SCHOOL = {
  name: 'Saraswati Vidhya Mandir Hr Sec School',
  shortName: 'Saraswati Vidhya Mandir',
  abbr: 'SVM',
  tagline: 'Shiksha · Sanskar · Samriddhi',
  affiliation: 'Affiliated to MPBSE · Recognition No. MP/2134',
  board: 'MP Board (MPBSE)',
  medium: 'Hindi & English medium',
  estd: 1994,
  campus: 'Saraswati Vidhya Mandir Campus, Bhopal, Madhya Pradesh 462010',
  city: 'Bhopal',
  pincode: '462010',
  phone: '+91 755 266 8800',
  email: 'info@svmbhopal.edu.in',
  admissionsEmail: 'admissions@svmbhopal.edu.in',
  session: '2026–27',
  students: 1363,
  staff: 138,
}

export const PROGRAMS: Program[] = [
  {
    id: 'primary',
    level: 'Primary',
    grades: 'Class 1 – 5',
    blurb: 'Foundational literacy and numeracy through structured play, storytelling and phonics labs.',
    highlights: ['1:16 teacher ratio', 'Phonics & reading lab', 'No-homework Wednesdays', 'Daily play-based numeracy'],
    fee: 26800,
    seats: 180,
    applied: 412,
    ratio: '1:16',
    accent: 'brand',
    subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Art & Craft', 'Music', 'Physical Education'],
  },
  {
    id: 'middle',
    level: 'Middle',
    grades: 'Class 6 – 8',
    blurb: 'Inquiry-led science blocks, Sanskrit and Urdu electives, and the SVM Atal Tinkering Lab.',
    highlights: ['Robotics & Maker Studio', 'Olympiad coaching', '1:2 device ratio', 'Inter-house debate league'],
    fee: 33400,
    seats: 165,
    applied: 356,
    ratio: '1:18',
    accent: 'cyan',
    subjects: [
      'English',
      'Hindi / Sanskrit',
      'Mathematics',
      'Science',
      'Social Science',
      'Computer Science',
      'Design Thinking',
    ],
  },
  {
    id: 'secondary',
    level: 'Secondary',
    grades: 'Class 9 – 10',
    blurb: 'Board-ready rigour with diagnostic testing cycles and career-orientation bootcamps.',
    highlights: ['Weekly board-pattern tests', 'Doubt-clinics till 6 pm', 'Psychometric profiling', 'NTSE & NMMS prep'],
    fee: 41600,
    seats: 150,
    applied: 298,
    ratio: '1:20',
    accent: 'violet',
    subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'AI & Coding', 'Financial Literacy'],
  },
  {
    id: 'science',
    level: 'Senior Secondary',
    stream: 'Science',
    grades: 'Class 11 – 12',
    blurb: 'Integrated JEE/NEET verticals taught inside the school timetable — no evening tuition needed.',
    highlights: ['Integrated JEE & NEET', 'Tata Innovation Lab', 'Research mentorship', 'All-India test series'],
    fee: 58200,
    seats: 120,
    applied: 468,
    ratio: '1:14',
    accent: 'emerald',
    subjects: [
      'Physics',
      'Chemistry',
      'Mathematics',
      'Biology',
      'Computer Science',
      'English Core',
      'Physical Education',
    ],
  },
  {
    id: 'commerce',
    level: 'Senior Secondary',
    stream: 'Commerce',
    grades: 'Class 11 – 12',
    blurb: 'CA/CS foundation tracks, live trading-room simulations and entrepreneurship studios.',
    highlights: ['CA & CS foundation track', 'Bloomberg trading lab', 'Start-up incubator', 'CUET intensive'],
    fee: 52400,
    seats: 90,
    applied: 241,
    ratio: '1:16',
    accent: 'amber',
    subjects: [
      'Accountancy',
      'Business Studies',
      'Economics',
      'Mathematics',
      'Applied Maths',
      'English Core',
      'Entrepreneurship',
    ],
  },
  {
    id: 'humanities',
    level: 'Senior Secondary',
    stream: 'Humanities',
    grades: 'Class 11 – 12',
    blurb: 'Law, psychology and global affairs pathways with MUN, moot court and field research.',
    highlights: ['CUET + CLAT pathway', 'Moot court & MUN', 'Psychology lab', 'Field research journals'],
    fee: 46800,
    seats: 75,
    applied: 187,
    ratio: '1:15',
    accent: 'rose',
    subjects: ['History', 'Political Science', 'Psychology', 'Economics', 'Geography', 'English Core', 'Legal Studies'],
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote:
      'We shifted from Indore mid-session and the school absorbed our daughter in eleven days — with a transition buddy and a personal learning plan. By March she was topping her batch in Mathematics.',
    name: 'Ritu Malhotra',
    role: 'Parent · Class 8',
    meta: 'With the school since 2024',
    tint: 0,
    rating: 5,
  },
  {
    id: 't2',
    quote:
      'The integrated JEE vertical is the real differentiator. I did not attend a single coaching class outside school and still scored 97.4 percentile while captaining the basketball team.',
    name: 'Aarav Deshpande',
    role: 'Alumnus · Batch of 2025',
    meta: 'Now at BITS Pilani, Computer Science',
    tint: 1,
    rating: 5,
  },
  {
    id: 't3',
    quote:
      'As a teacher I am trusted with the actual design of my curriculum. The leadership gives us two planning weeks a term — that is unheard of, and it shows up in our classroom outcomes.',
    name: 'Dr. Shalini Verma',
    role: 'Head of Science Department',
    meta: '12 years at SVM',
    tint: 2,
    rating: 5,
  },
  {
    id: 't4',
    quote:
      'The fee dashboard, transport live-tracking and the parent app means I always know exactly where my son is and what is pending. Institutional transparency, finally.',
    name: 'Imran Qureshi',
    role: 'Parent · Class 11 Commerce',
    meta: 'Two children enrolled · Kolar Road',
    tint: 3,
    rating: 4,
  },
  {
    id: 't5',
    quote:
      'The debate and moot-court society at SVM prepared me for law school more than any coaching module. I argued my first real case in Class 12 — with the school standing behind me.',
    name: 'Ananya Iyer',
    role: 'Alumna · Batch of 2024',
    meta: 'NLSIU Bengaluru, B.A. LL.B.',
    tint: 4,
    rating: 5,
  },
  {
    id: 't6',
    quote:
      'Every Thursday the headmistress calls us with a 90-second update on our daughter. In seven years, that call has never been skipped. That discipline is the school.',
    name: 'Col. Suresh Nair (Retd.)',
    role: 'Parent · Class 6',
    meta: 'With the school since 2019',
    tint: 5,
    rating: 5,
  },
]

/* ------------------------------------------------------------------ *
 * Deterministic academic data
 * ------------------------------------------------------------------ */
const ROSTER: Array<[string, string]> = [
  ['Aarav Mehta', 'Rakesh Mehta'],
  ['Ishita Sharma', 'Vinod Sharma'],
  ['Kabir Tiwari', 'Suresh Tiwari'],
  ['Ananya Sonkar', 'Ramesh Sonkar'],
  ['Vivaan Gupta', 'Anil Gupta'],
  ['Diya Choudhary', 'Mahesh Choudhary'],
  ['Aditya Dubey', 'Sanjay Dubey'],
  ['Saanvi Chaturvedi', 'Prakash Chaturvedi'],
  ['Rehan Qureshi', 'Imran Qureshi'],
  ['Meera Namdeo', 'Srinivas Namdeo'],
  ['Arjun Sethi', 'Vikram Sethi'],
  ['Kavya Sahu', 'Harish Sahu'],
  ['Devansh Bhatt', 'Nilesh Bhatt'],
  ['Riya Malviya', 'Ashok Malviya'],
  ['Zoya Khan', 'Farid Khan'],
  ['Rudra Patel', 'Bhavesh Patel'],
  ['Tara Ahirwar', 'Girish Ahirwar'],
  ['Yash Bansal', 'Deepak Bansal'],
  ['Nitya Chouhan', 'Chandra Chouhan'],
  ['Harsh Vardhan', 'Alok Vardhan'],
  ['Aisha Siddiqui', 'Nadeem Siddiqui'],
  ['Pranav Joshi', 'Mukesh Joshi'],
  ['Sanya Kapoor', 'Rohit Kapoor'],
  ['Krishna Rathore', 'Venkat Rathore'],
]

const HOUSES: Student['house'][] = ['Ganga', 'Yamuna', 'Kaveri', 'Godavari']
const rand = mulberry32(20260415)

export const STUDENTS: Student[] = ROSTER.map(([name, guardian], i) => {
  const duesRoll = rand()
  const feeStatus: FeeStatus = i % 9 === 4 ? 'overdue' : i % 5 === 2 ? 'pending' : 'paid'
  const attendancePct = Math.round((78 + rand() * 21) * 10) / 10
  void duesRoll
  return {
    id: `SVM-XIIB-${String(i + 1).padStart(3, '0')}`,
    roll: i + 1,
    name,
    classId: 'XII',
    section: 'B',
    admissionNo: `SVM/2026/${4100 + i * 7}`,
    guardian,
    phone: `+91 9${String(800000000 + Math.floor(rand() * 99999999)).slice(0, 9)}`,
    house: HOUSES[i % 4],
    transport: i % 3 === 0,
    attendancePct,
    cgpa: Math.round((6.4 + rand() * 3.5) * 100) / 100,
    feeStatus,
    dues:
      feeStatus === 'paid' ? 0 : feeStatus === 'pending' ? [28000, 42000, 35000][i % 3] : [56000, 78000, 64000][i % 3],
    tint: i % 6,
  }
})

export const STUDENT_BY_ID = Object.fromEntries(STUDENTS.map((s) => [s.id, s])) as Record<string, Student>

export const CLASSES = [
  { id: 'I-A', label: 'Class I-A', strength: 32, strengthNote: 'Primary' },
  { id: 'VI-C', label: 'Class VI-C', strength: 38, strengthNote: 'Middle' },
  { id: 'IX-A', label: 'Class IX-A', strength: 41, strengthNote: 'Secondary' },
  { id: 'X-A', label: 'Class X-A', strength: 44, strengthNote: 'Board year' },
  { id: 'XI-Sci', label: 'Class XI Science', strength: 58, strengthNote: 'JEE / NEET' },
  { id: 'XII-B', label: 'Class XII-B', strength: STUDENTS.length, strengthNote: 'Science' },
]

export const SUBJECTS: Subject[] = [
  { id: 'phy', name: 'Physics', code: 'PHY', teacher: 'Dr. Shalini Verma', maxMarks: 100 },
  { id: 'chem', name: 'Chemistry', code: 'CHE', teacher: 'Dr. Rohit Saxena', maxMarks: 100 },
  { id: 'math', name: 'Mathematics', code: 'MAT', teacher: 'Anil Deshpande', maxMarks: 100 },
  { id: 'bio', name: 'Biology', code: 'BIO', teacher: 'Dr. Kavita Rangan', maxMarks: 100 },
  { id: 'hin', name: 'Hindi Core', code: 'HIN', teacher: 'Rekha Namdeo', maxMarks: 100 },
  { id: 'eng', name: 'English Core', code: 'ENG', teacher: 'Anand Chaturvedi', maxMarks: 100 },
]

/** Marks keyed by `${studentId}:${subjectId}` — pre-filled with realistic mid-term data. */
export const SEED_MARKS: Record<string, number> = (() => {
  const out: Record<string, number> = {}
  const mar = mulberry32(7761)
  for (const s of STUDENTS) {
    // Gentle upward trend by roll number so the roster reads like a real class.
    const base = 52 + ((STUDENTS.length - s.roll) / STUDENTS.length) * 38
    for (const sub of SUBJECTS) {
      out[`${s.id}:${sub.id}`] = Math.max(28, Math.min(99, Math.round(base + (mar() * 18 - 9))))
    }
  }
  return out
})()

export const EXAMS = [
  {
    id: 'e1',
    name: 'Mid-Term Examination',
    className: 'XII-B',
    startDate: '2026-09-14',
    endDate: '2026-09-26',
    status: 'ongoing' as const,
    papers: 6,
  },
  {
    id: 'e2',
    name: 'Unit Test III',
    className: 'XII-B',
    startDate: '2026-08-11',
    endDate: '2026-08-16',
    status: 'completed' as const,
    papers: 4,
  },
  {
    id: 'e3',
    name: 'Half-Yearly Board Pattern',
    className: 'XII-B',
    startDate: '2026-11-24',
    endDate: '2026-12-08',
    status: 'scheduled' as const,
    papers: 6,
  },
  {
    id: 'e4',
    name: 'Pre-Board I',
    className: 'XII-B',
    startDate: '2027-01-12',
    endDate: '2027-01-24',
    status: 'scheduled' as const,
    papers: 6,
  },
  {
    id: 'e5',
    name: 'MPBSE Practical Assessment',
    className: 'XII-B',
    startDate: '2027-02-08',
    endDate: '2027-02-14',
    status: 'scheduled' as const,
    papers: 4,
  },
]

// Monthly fee collections in ₹ Lakh for a 1,363-student school on the local
// (Bhopal) fee scale — July and September carry the termly dues spikes.
export const FEE_TRENDS = [
  { month: 'Apr', collected: 32.4, target: 35, dues: 4.2 },
  { month: 'May', collected: 38.1, target: 38, dues: 3.1 },
  { month: 'Jun', collected: 44.6, target: 42, dues: 5.4 },
  { month: 'Jul', collected: 71.2, target: 65, dues: 11.8 },
  { month: 'Aug', collected: 49.8, target: 50, dues: 9.6 },
  { month: 'Sep', collected: 76.5, target: 70, dues: 6.2 },
]

export const ADMISSION_TRENDS = [
  { month: 'Apr', enquiries: 412, enrolled: 96 },
  { month: 'May', enquiries: 528, enrolled: 132 },
  { month: 'Jun', enquiries: 634, enrolled: 158 },
  { month: 'Jul', enquiries: 702, enrolled: 171 },
  { month: 'Aug', enquiries: 688, enrolled: 164 },
  { month: 'Sep', enquiries: 764, enrolled: 188 },
]

export const ACTIVITY_FEED = [
  {
    id: 'a1',
    actor: 'Priya Menon',
    action: 'recorded UPI payment of ₹42,000 for',
    target: 'Ishita Sharma',
    at: '4 min ago',
    tone: 'emerald' as const,
  },
  {
    id: 'a2',
    actor: 'System',
    action: 'flagged 3 students below 75% attendance in',
    target: 'Class IX-A',
    at: '22 min ago',
    tone: 'amber' as const,
  },
  {
    id: 'a3',
    actor: 'Dr. Shalini Verma',
    action: 'uploaded Physics mid-term marks for',
    target: 'Class XII-B',
    at: '1 hr ago',
    tone: 'brand' as const,
  },
  {
    id: 'a4',
    actor: 'Admissions Desk',
    action: 'moved 6 applicants to Assessment stage for',
    target: 'Class 11 Science',
    at: '2 hr ago',
    tone: 'violet' as const,
  },
  {
    id: 'a5',
    actor: 'Transport Cell',
    action: 'resolved route delay on',
    target: 'Route 7 — Kolar Road',
    at: '3 hr ago',
    tone: 'cyan' as const,
  },
  {
    id: 'a6',
    actor: 'Exam Cell',
    action: 'published date sheet for',
    target: 'Half-Yearly Examination',
    at: 'Yesterday',
    tone: 'brand' as const,
  },
]

export const AT_RISK = [
  {
    id: 'r1',
    name: 'Harsh Vardhan',
    reason: 'Attendance 61.2% · below the 75% board norm',
    severity: 'critical' as const,
    classId: 'XII-B',
  },
  {
    id: 'r2',
    name: 'Devansh Bhatt',
    reason: 'Two consecutive Chemistry submissions missed',
    severity: 'high' as const,
    classId: 'XII-B',
  },
  {
    id: 'r3',
    name: 'Riya Kulkarni',
    reason: 'Term-2 fees overdue by 38 days',
    severity: 'high' as const,
    classId: 'XII-B',
  },
  {
    id: 'r4',
    name: 'Yash Bansal',
    reason: 'Physics score dropped 22 marks vs Unit Test II',
    severity: 'medium' as const,
    classId: 'XII-B',
  },
]

export const FACULTY: Faculty[] = [
  {
    id: 'f1',
    name: 'Dr. Shalini Verma',
    subject: 'Physics',
    designation: 'Head of Science',
    classes: ['XII-B', 'XI-Sci'],
    experience: 18,
    rating: 4.9,
    email: 'shalini.verma@svmbhopal.edu.in',
    room: 'Lab 3',
  },
  {
    id: 'f2',
    name: 'Anil Deshpande',
    subject: 'Mathematics',
    designation: 'Senior Faculty',
    classes: ['XII-B', 'X-A'],
    experience: 14,
    rating: 4.8,
    email: 'anil.deshpande@svmbhopal.edu.in',
    room: 'B-204',
  },
  {
    id: 'f3',
    name: 'Dr. Rohit Saxena',
    subject: 'Chemistry',
    designation: 'Senior Faculty',
    classes: ['XII-B', 'XI-Sci'],
    experience: 12,
    rating: 4.7,
    email: 'rohit.saxena@svmbhopal.edu.in',
    room: 'Lab 2',
  },
  {
    id: 'f4',
    name: 'Rekha Namdeo',
    subject: 'Hindi',
    designation: 'Faculty',
    classes: ['XII-B', 'IX-A'],
    experience: 9,
    rating: 4.8,
    email: 'rekha.namdeo@svmbhopal.edu.in',
    room: 'H-102',
  },
  {
    id: 'f5',
    name: 'Anand Chaturvedi',
    subject: 'English',
    designation: 'Faculty',
    classes: ['XII-B', 'X-A'],
    experience: 11,
    rating: 4.6,
    email: 'anand.chaturvedi@svmbhopal.edu.in',
    room: 'E-108',
  },
  {
    id: 'f6',
    name: 'Dr. Kavita Rangan',
    subject: 'Biology',
    designation: 'Senior Faculty',
    classes: ['XI-Sci'],
    experience: 16,
    rating: 4.9,
    email: 'kavita.rangan@svmbhopal.edu.in',
    room: 'Lab 4',
  },
  {
    id: 'f7',
    name: 'Farah Ali',
    subject: 'Economics',
    designation: 'Faculty',
    classes: ['XI-Com', 'XII-Com'],
    experience: 8,
    rating: 4.5,
    email: 'farah.ali@svmbhopal.edu.in',
    room: 'C-101',
  },
  {
    id: 'f8',
    name: 'Rajesh Kumar',
    subject: 'Accountancy',
    designation: 'Faculty',
    classes: ['XI-Com', 'XII-Com'],
    experience: 13,
    rating: 4.6,
    email: 'rajesh.kumar@svmbhopal.edu.in',
    room: 'C-104',
  },
  {
    id: 'f9',
    name: 'Meenakshi Dubey',
    subject: 'Counselling',
    designation: 'Counsellor',
    classes: ['All'],
    experience: 10,
    rating: 4.9,
    email: 'meenakshi.dubey@svmbhopal.edu.in',
    room: 'Wellness',
  },
  {
    id: 'f10',
    name: 'Sunil Yadav',
    subject: 'Physical Education',
    designation: 'Sports Director',
    classes: ['All'],
    experience: 15,
    rating: 4.7,
    email: 'sunil.yadav@svmbhopal.edu.in',
    room: 'Arena',
  },
  {
    id: 'f11',
    name: 'Anita Sharma',
    subject: 'Primary Wing',
    designation: 'Headmistress',
    classes: ['I-A', 'III-B'],
    experience: 21,
    rating: 5.0,
    email: 'anita.sharma@svmbhopal.edu.in',
    room: 'P-01',
  },
  {
    id: 'f12',
    name: 'Vikram Singh Chouhan',
    subject: 'Middle Wing',
    designation: 'Coordinator',
    classes: ['VI-C', 'VIII-A'],
    experience: 17,
    rating: 4.6,
    email: 'vikram.chouhan@svmbhopal.edu.in',
    room: 'M-12',
  },
]

export const TIMETABLE_SLOTS = ['08:15', '09:10', '10:05', '11:15', '12:10', '13:40', '14:35']
export const TIMETABLE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
export const TIMETABLE: Record<string, string[]> = {
  Mon: ['Physics', 'Mathematics', 'Chemistry', '— Break —', 'English Core', 'Hindi Core', 'Games'],
  Tue: ['Mathematics', 'Physics', 'Biology', '— Break —', 'Chemistry', 'Library', 'Games'],
  Wed: ['Chemistry', 'English Core', 'Mathematics', '— Break —', 'Physics Lab', 'Physics Lab', 'Mentoring'],
  Thu: ['Hindi Core', 'Mathematics', 'Physics', '— Break —', 'Chemistry Lab', 'Chemistry Lab', 'Games'],
  Fri: ['English Core', 'Biology', 'Mathematics', '— Break —', 'Physics', 'Career Studio', 'House Assembly'],
}

export const APPLICANTS: Applicant[] = [
  {
    id: 'ap1',
    childName: 'Naina Bhardwaj',
    gradeApplied: 'Class 11 Science',
    guardian: 'Sameer Bhardwaj',
    city: 'Bhopal',
    score: 92,
    stage: 'Offer',
    source: 'Website',
    appliedOn: '2026-08-02',
  },
  {
    id: 'ap2',
    childName: 'Vihaan Chauhan',
    gradeApplied: 'Class 6',
    guardian: 'Deepa Chauhan',
    city: 'Vidisha',
    score: 84,
    stage: 'Interview',
    source: 'Referral',
    appliedOn: '2026-08-07',
  },
  {
    id: 'ap3',
    childName: 'Alia Bhattacharya',
    gradeApplied: 'Class 11 Commerce',
    guardian: 'Sourav Bhattacharya',
    city: 'Jabalpur',
    score: 88,
    stage: 'Assessment',
    source: 'Instagram',
    appliedOn: '2026-08-11',
  },
  {
    id: 'ap4',
    childName: 'Reyansh Tomar',
    gradeApplied: 'Class 1',
    guardian: 'Pooja Tomar',
    city: 'Bhopal',
    score: 78,
    stage: 'Enquiry',
    source: 'Walk-in',
    appliedOn: '2026-08-14',
  },
  {
    id: 'ap5',
    childName: 'Sara Fernandes',
    gradeApplied: 'Class 9',
    guardian: 'Jason Fernandes',
    city: 'Sehore',
    score: 90,
    stage: 'Enrolled',
    source: 'Website',
    appliedOn: '2026-07-28',
  },
  {
    id: 'ap6',
    childName: 'Ibrahim Sheikh',
    gradeApplied: 'Class 11 Arts',
    guardian: 'Naeem Sheikh',
    city: 'Raisen',
    score: 81,
    stage: 'Interview',
    source: 'Newspaper',
    appliedOn: '2026-08-16',
  },
  {
    id: 'ap7',
    childName: 'Trisha Ghosh',
    gradeApplied: 'Class 8',
    guardian: 'Sudeshna Ghosh',
    city: 'Bhopal',
    score: 86,
    stage: 'Assessment',
    source: 'Referral',
    appliedOn: '2026-08-19',
  },
  {
    id: 'ap8',
    childName: 'Kiaan Malhotra',
    gradeApplied: 'Class 4',
    guardian: 'Ritu Malhotra',
    city: 'Bhopal',
    score: 89,
    stage: 'Offer',
    source: 'Website',
    appliedOn: '2026-08-21',
  },
  {
    id: 'ap9',
    childName: 'Anvi Deshpande',
    gradeApplied: 'Class 11 Science',
    guardian: 'Kiran Deshpande',
    city: 'Indore',
    score: 95,
    stage: 'Enrolled',
    source: 'Referral',
    appliedOn: '2026-07-21',
  },
  {
    id: 'ap10',
    childName: 'Zaid Ansari',
    gradeApplied: 'Class 7',
    guardian: 'Shabana Ansari',
    city: 'Bhopal',
    score: 74,
    stage: 'Enquiry',
    source: 'Instagram',
    appliedOn: '2026-08-24',
  },
  {
    id: 'ap11',
    childName: 'Mahika Joshi',
    gradeApplied: 'Class 10',
    guardian: 'Pranav Joshi',
    city: 'Gwalior',
    score: 87,
    stage: 'Assessment',
    source: 'Website',
    appliedOn: '2026-08-26',
  },
  {
    id: 'ap12',
    childName: 'Advait Kulkarni',
    gradeApplied: 'Class 2',
    guardian: 'Sneha Kulkarni',
    city: 'Bhopal',
    score: 80,
    stage: 'Interview',
    source: 'Walk-in',
    appliedOn: '2026-09-01',
  },
  {
    id: 'ap13',
    childName: 'Nayantara Reddy',
    gradeApplied: 'Class 11 Commerce',
    guardian: 'Chandra Reddy',
    city: 'Itarsi',
    score: 91,
    stage: 'Offer',
    source: 'Referral',
    appliedOn: '2026-09-03',
  },
  {
    id: 'ap14',
    childName: 'Dhruv Ananda',
    gradeApplied: 'Class 12 Science',
    guardian: 'Ravi Ananda',
    city: 'Bhopal',
    score: 83,
    stage: 'Enquiry',
    source: 'Website',
    appliedOn: '2026-09-09',
  },
]

export const NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'Term-2 fee collection crossed ₹76.5 L',
    body: 'September collections are 9.3% ahead of the quarterly target.',
    at: '12m',
    kind: 'fees' as const,
    unread: true,
  },
  {
    id: 'n2',
    title: '3 attendance exemptions awaiting approval',
    body: 'Submitted by the sports department for the inter-school athletics meet.',
    at: '48m',
    kind: 'attendance' as const,
    unread: true,
  },
  {
    id: 'n3',
    title: 'Physics mid-term marks incomplete',
    body: 'Section XII-B · 4 students still unreported for Dr. Verma.',
    at: '2h',
    kind: 'exams' as const,
    unread: true,
  },
  {
    id: 'n4',
    title: 'New admission enquiry from WhatsApp',
    body: 'Grade XI Science · verified guardian number.',
    at: '5h',
    kind: 'admissions' as const,
    unread: false,
  },
  {
    id: 'n5',
    title: 'Bus Route 7 running 18 minutes late',
    body: 'Diversion near Kolar bypass. Parents notified automatically.',
    at: '1d',
    kind: 'transport' as const,
    unread: false,
  },
]

export const FEE_HEADS = [
  { label: 'Tuition Fee', amount: 22000 },
  { label: 'Laboratory & Activity', amount: 3400 },
  { label: 'Transport (Route 7)', amount: 9600 },
  { label: 'Examination & Assessment', amount: 1800 },
]

export function buildInvoices(): FeeInvoice[] {
  const rnd = mulberry32(4477)
  const methods: FeeInvoice['method'][] = ['UPI', 'NEFT', 'Card', 'Cash', 'Cheque']
  const out: FeeInvoice[] = []
  STUDENTS.forEach((s, idx) => {
    const term = idx % 3 === 0 ? 'Term 1 · 2026-27' : idx % 3 === 1 ? 'Term 2 · 2026-27' : 'Annual Charges'
    const amount = 32000 + Math.round(rnd() * 16000)
    const dueDate = idx % 3 === 2 ? '2026-10-15' : idx % 3 === 1 ? '2026-09-10' : '2026-07-20'
    const status: FeeStatus = s.feeStatus
    out.push({
      id: `INV-2026-${(1040 + idx).toString()}`,
      studentId: s.id,
      studentName: s.name,
      classId: `${s.classId}-${s.section}`,
      term,
      heads: FEE_HEADS.map((h) => ({ ...h, amount: Math.round((h.amount / 36800) * amount) })),
      amount,
      dueDate,
      paidOn: status === 'paid' ? '2026-09-0' + ((idx % 8) + 1) : undefined,
      method: status === 'paid' ? methods[idx % methods.length] : undefined,
      status,
      receiptNo: status === 'paid' ? `RCPT/26/${8200 + idx}` : undefined,
    })
  })
  return out
}

/** Attendance heatmap: 6 months of daily attendance splits for Class XII-B. */
export const ATTENDANCE_HISTORY = (() => {
  const rnd = mulberry32(9133)
  const days: { date: string; present: number; late: number; absent: number; holiday: boolean; note?: string }[] = []
  const start = new Date('2026-04-01T00:00:00')
  const total = 24
  for (let i = 0; i < 183; i += 1) {
    const d = new Date(start.getTime())
    d.setDate(start.getDate() + i)
    const dow = d.getDay()
    const holiday = dow === 0 || (dow === 6 && rnd() > 0.6)
    const iso = d.toISOString().slice(0, 10)
    if (holiday) {
      days.push({
        date: iso,
        present: 0,
        late: 0,
        absent: 0,
        holiday: true,
        note: dow === 0 ? 'Sunday' : 'Second Saturday',
      })
      continue
    }
    const absent = Math.round(rnd() * 3.4)
    const late = Math.round(rnd() * 2.1)
    days.push({ date: iso, present: total - absent - late, late, absent, holiday: false })
  }
  return days
})()

export const INITIATIVES = [
  {
    id: 'i1',
    title: 'Atal Tinkering Lab',
    detail: '₹42 L Atal Innovation Mission grant — robotics and IoT lab live from October.',
    progress: 78,
    tone: 'brand' as const,
  },
  {
    id: 'i2',
    title: 'Wellness & Counselling Wing',
    detail: 'Two full-time counsellors onboarded; 148 sessions this term.',
    progress: 92,
    tone: 'emerald' as const,
  },
  {
    id: 'i3',
    title: 'Solar Rooftop Phase II',
    detail: '120 kW additional capacity — 58% campus energy offset.',
    progress: 54,
    tone: 'amber' as const,
  },
  {
    id: 'i4',
    title: 'Smart Classroom Upgrade',
    detail: '24 interactive panels installed across the high-school wing.',
    progress: 66,
    tone: 'violet' as const,
  },
]

export const ACCENT_TINTS = [0, 1, 2, 3, 4, 5] as const

/* ================================================================== *
 * Principal's workspace — daily operations, notes, reviews & approvals
 * ================================================================== */
export type TaskPriority = 'high' | 'medium' | 'low'
export type TaskCategory = 'Academics' | 'Finance' | 'Discipline' | 'Admin' | 'Parents' | 'Events'

export interface Task {
  id: string
  title: string
  detail?: string
  priority: TaskPriority
  category: TaskCategory
  assignee: string
  due: string
  done: boolean
}

export const SEED_TASKS: Task[] = [
  {
    id: 'tsk1',
    title: 'Sign off Unit Test-III answer sheets for Class 10',
    detail: 'Dr. Shalini Verma submitted 4 sets at 9:40 am',
    priority: 'high',
    category: 'Academics',
    assignee: 'Dr. Meenal Krishnan',
    due: 'Today, 1:00 pm',
    done: false,
  },
  {
    id: 'tsk2',
    title: 'Review the ₹1.86 L lab equipment quotation',
    detail: 'Physics practical kit — pending since 12 Sep',
    priority: 'high',
    category: 'Finance',
    assignee: 'Purchase committee',
    due: 'Today, 4:00 pm',
    done: false,
  },
  {
    id: 'tsk3',
    title: 'Assembly address on cleanliness drive',
    detail: 'Swachhta hi Seva fortnight · 08:15 am ground',
    priority: 'medium',
    category: 'Events',
    assignee: 'You',
    due: 'Today, 8:15 am',
    done: true,
  },
  {
    id: 'tsk4',
    title: 'Call guardians of 6 low-attendance students',
    detail: 'Below 75% in Classes 9–10 · list shared by office',
    priority: 'high',
    category: 'Parents',
    assignee: 'Class teachers',
    due: 'Today, 5:00 pm',
    done: false,
  },
  {
    id: 'tsk5',
    title: 'Verify MPBSE Class 10 & 12 exam form data',
    detail: '246 forms uploaded · names, DOB and subject codes',
    priority: 'high',
    category: 'Admin',
    assignee: 'Exam cell',
    due: 'Tomorrow, 11:00 am',
    done: false,
  },
  {
    id: 'tsk6',
    title: 'Grade-3 employee service book audit',
    detail: '12 records pending attestation from DEO office',
    priority: 'low',
    category: 'Admin',
    assignee: 'Head clerk',
    due: '20 Sep',
    done: false,
  },
  {
    id: 'tsk7',
    title: 'Inspect mid-day meal kitchen with the SMC',
    detail: 'Monthly hygiene round · FSSAI checklist',
    priority: 'medium',
    category: 'Admin',
    assignee: 'SMC members',
    due: '21 Sep',
    done: false,
  },
  {
    id: 'tsk8',
    title: 'Approve Annual Day duty roster',
    detail: '48 staff slots · 3 still unassigned',
    priority: 'medium',
    category: 'Events',
    assignee: 'Coordinator',
    due: '22 Sep',
    done: false,
  },
  {
    id: 'tsk9',
    title: 'Respond to 2 unsigned TC requests',
    detail: 'Guarantors verified by the front office',
    priority: 'low',
    category: 'Parents',
    assignee: 'Front office',
    due: '23 Sep',
    done: true,
  },
]

export type NoteTone = 'brand' | 'amber' | 'emerald' | 'violet' | 'rose' | 'slate'

export interface Note {
  id: string
  title: string
  body: string
  tone: NoteTone
  pinned: boolean
  author: string
  updatedAt: string
}

export const SEED_NOTES: Note[] = [
  {
    id: 'nt1',
    title: 'Points for the 18 Sep staff meeting',
    body: '1) Board practicals from 8 Feb — labs to be ready by 25 Jan. 2) Hindi medium sections need 4 extra Mathematics periods. 3) Transport route 7 timing change after Kolar road work.',
    tone: 'brand',
    pinned: true,
    author: 'Dr. Meenal Krishnan',
    updatedAt: 'Today, 9:12 am',
  },
  {
    id: 'nt2',
    title: 'Fee waiver requests this month',
    body: 'Eleven applications received — 4 from Class 11 Science, 3 from Class 9. Management committee sits on 24 Sep. Keep DEO norms handy.',
    tone: 'amber',
    pinned: true,
    author: 'Priya Menon',
    updatedAt: 'Today, 8:05 am',
  },
  {
    id: 'nt3',
    title: 'Follow up: Sanskrit teacher vacancy',
    body: 'Second advertisement released in Dainik Bhaskar. 6 applications so far, 2 with B.Ed. Interview panels on Saturday.',
    tone: 'violet',
    pinned: false,
    author: 'Office of the Principal',
    updatedAt: 'Yesterday',
  },
  {
    id: 'nt4',
    title: 'Class 12 Biology doubt sessions',
    body: 'Students requested Sunday morning slots till the half-yearly exams. Speak to Dr. Kavita Rangan about lab availability.',
    tone: 'emerald',
    pinned: false,
    author: 'Dr. Shalini Verma',
    updatedAt: 'Yesterday',
  },
  {
    id: 'nt5',
    title: 'Swachhta hi Seva — reminders',
    body: 'Painting competition on 20 Sep. Each house sends 8 students. Photography permission for parents must be cleared one day prior.',
    tone: 'rose',
    pinned: false,
    author: 'Cultural committee',
    updatedAt: '14 Sep',
  },
]

export type ApprovalKind = 'Leave' | 'Expense' | 'Certificate' | 'Purchase' | 'Fee waiver' | 'Transport'

export interface ApprovalDecision {
  id: string
  who: string
  what: string
  at: string
  decision: 'approved' | 'rejected'
  kind: ApprovalKind
  remark?: string
}

export interface Approval {
  id: string
  kind: ApprovalKind
  requester: string
  role: string
  detail: string
  amount?: number
  submitted: string
  priority: 'high' | 'normal' | 'low'
  sla: string
}

export const SEED_APPROVALS: Approval[] = [
  {
    id: 'ap-1',
    kind: 'Leave',
    requester: 'Rekha Namdeo',
    role: 'Hindi · Class 12-B',
    detail: 'Casual leave for 2 days from 18 Sep (family function). Arrangement: Sunita Dubey.',
    submitted: 'Today, 9:05 am',
    priority: 'high',
    sla: 'Decide in 6 h',
  },
  {
    id: 'ap-2',
    kind: 'Purchase',
    requester: 'Dr. Shalini Verma',
    role: 'Head of Science',
    detail: 'Physics practical kit — 12 sets of optics benches and lenses for Class 10 & 12.',
    amount: 186000,
    submitted: '12 Sep',
    priority: 'high',
    sla: '2 days overdue',
  },
  {
    id: 'ap-3',
    kind: 'Fee waiver',
    requester: 'Priya Menon',
    role: 'Accounts officer',
    detail: 'Guarantor-verified waiver for Rohtash Verma (Class 9-B) — father admitted to hospital.',
    amount: 12600,
    submitted: 'Yesterday',
    priority: 'normal',
    sla: 'Decide in 1 day',
  },
  {
    id: 'ap-4',
    kind: 'Certificate',
    requester: 'Front office',
    role: 'Class 12-A student',
    detail: 'Bonafide certificate and true-copy attestation for scholarship application.',
    submitted: 'Today, 8:40 am',
    priority: 'normal',
    sla: 'Decide in 2 days',
  },
  {
    id: 'ap-5',
    kind: 'Transport',
    requester: 'Transport cell',
    role: 'Route 7 · Kolar Road',
    detail: 'Revise pick-up timing by 15 minutes for 46 students owing to road work near Kolar bypass.',
    submitted: 'Yesterday',
    priority: 'high',
    sla: 'Decide today',
  },
  {
    id: 'ap-6',
    kind: 'Leave',
    requester: 'Suresh Namdeo',
    role: 'Lab attendant',
    detail: 'Medical leave for 3 days (certificate attached from AIIMS Bhopal).',
    submitted: 'Today, 10:20 am',
    priority: 'normal',
    sla: 'Decide in 8 h',
  },
  {
    id: 'ap-7',
    kind: 'Expense',
    requester: 'Sports department',
    role: 'District athletics meet',
    detail: 'Entry fees, bus hire and breakfast for 32 participants to MITS ground, Bhopal.',
    amount: 24400,
    submitted: '13 Sep',
    priority: 'low',
    sla: 'Decide in 3 days',
  },
  {
    id: 'ap-8',
    kind: 'Certificate',
    requester: 'Anita Sharma',
    role: 'Headmistress, primary',
    detail: 'Transfer certificate for 2 students relocating to Sehore — dues cleared.',
    submitted: '11 Sep',
    priority: 'low',
    sla: 'Decide in 4 days',
  },
]

export interface Notice {
  id: string
  title: string
  body: string
  audience: string[]
  priority: 'urgent' | 'normal' | 'info'
  author: string
  when: string
  delivered: number
  read: number
  status: 'published' | 'scheduled' | 'draft'
  category: 'Examination' | 'Holiday' | 'Fee' | 'Event' | 'Transport' | 'General'
}

export const SEED_NOTICES: Notice[] = [
  {
    id: 'no1',
    title: 'Half-yearly examination date sheet released',
    body: 'The date sheet for Classes 9 to 12 is now available on the notice board and the parent app. Practical examinations begin 8 February.',
    audience: ['Students', 'Parents'],
    priority: 'urgent',
    author: 'Exam cell',
    when: 'Today, 8:00 am',
    delivered: 1363,
    read: 1184,
    status: 'published',
    category: 'Examination',
  },
  {
    id: 'no2',
    title: 'Term-2 fee due on 10 September',
    body: 'Parents may pay through UPI, net banking or at the school counter between 8 am and 2 pm. Receipts are issued instantly in the app.',
    audience: ['Parents'],
    priority: 'normal',
    author: 'Accounts office',
    when: '08 Sep',
    delivered: 1363,
    read: 1268,
    status: 'published',
    category: 'Fee',
  },
  {
    id: 'no3',
    title: 'Route 7 pick-up timing revised from 20 Sep',
    body: 'Bus 12 will reach the Kolar Road stop 15 minutes earlier because of ongoing road work near the bypass. Please plan accordingly.',
    audience: ['Parents', 'Transport'],
    priority: 'urgent',
    author: 'Transport cell',
    when: 'Yesterday',
    delivered: 46,
    read: 39,
    status: 'published',
    category: 'Transport',
  },
  {
    id: 'no4',
    title: 'Swachhta hi Seva fortnight — activities',
    body: 'Shramdaan on 19 Sep, painting competition on 20 Sep and a cleanliness pledge in the morning assembly on 21 Sep.',
    audience: ['Students', 'Staff'],
    priority: 'info',
    author: 'Cultural committee',
    when: '13 Sep',
    delivered: 1501,
    read: 980,
    status: 'published',
    category: 'Event',
  },
  {
    id: 'no5',
    title: 'Draft: Winter uniform from 1 November',
    body: 'Pending confirmation from the uniform supplier on stock availability before publishing to parents.',
    audience: ['Parents'],
    priority: 'normal',
    author: 'Office of the Principal',
    when: 'Edited 2 h ago',
    delivered: 0,
    read: 0,
    status: 'draft',
    category: 'General',
  },
]

export interface ParentFeedback {
  id: string
  parent: string
  child: string
  rating: number
  text: string
  sentiment: 'positive' | 'neutral' | 'concern'
  topic: string
  at: string
  replied: boolean
}

export const PARENT_FEEDBACK: ParentFeedback[] = [
  {
    id: 'fb1',
    parent: 'Rakesh Mehta',
    child: 'Aarav Mehta · Class 12-B',
    rating: 5,
    text: 'The doubt-clearing classes before the unit test made a real difference. My son solved the whole Physics paper without coaching.',
    sentiment: 'positive',
    topic: 'Academics',
    at: '2 h ago',
    replied: false,
  },
  {
    id: 'fb2',
    parent: 'Shabana Ansari',
    child: 'Zaid Ansari · Class 7-A',
    rating: 3,
    text: 'Class 7 ke liye bus ka time thoda jaldi hai. Baaki sab theek hai — teachers se baat karke samadhan mil jata hai.',
    sentiment: 'concern',
    topic: 'Transport',
    at: '5 h ago',
    replied: false,
  },
  {
    id: 'fb3',
    parent: 'Deepa Chouhan',
    child: 'Vihaan Chouhan · Class 6-C',
    rating: 5,
    text: 'Monthly parent-teacher meeting is very well organised. The teacher showed my daughter’s reading progress on the app.',
    sentiment: 'positive',
    topic: 'Parent meeting',
    at: 'Yesterday',
    replied: true,
  },
  {
    id: 'fb4',
    parent: 'Sourav Bhattacharya',
    child: 'Alia Bhattacharya · Class 11 Commerce',
    rating: 4,
    text: 'Accountancy faculty is excellent. Library timings could be extended beyond 4 pm for senior students.',
    sentiment: 'neutral',
    topic: 'Library',
    at: 'Yesterday',
    replied: false,
  },
  {
    id: 'fb5',
    parent: 'Naeem Sheikh',
    child: 'Ibrahim Sheikh · Class 11 Arts',
    rating: 2,
    text: 'Toilet on the second floor needed attention last week. Cleaning staff improved it after I called the office.',
    sentiment: 'concern',
    topic: 'Facilities',
    at: '2 days ago',
    replied: true,
  },
  {
    id: 'fb6',
    parent: 'Sudeshna Ghosh',
    child: 'Trisha Ghosh · Class 8-B',
    rating: 5,
    text: 'Hindi medium section me bhi English speaking practice ho rahi hai — yeh bahut acchi baat hai.',
    sentiment: 'positive',
    topic: 'Academics',
    at: '2 days ago',
    replied: false,
  },
]

export interface LessonPlanReview {
  id: string
  teacher: string
  subject: string
  className: string
  topic: string
  submitted: string
  quality: number
  status: 'pending' | 'approved' | 'returned'
  note?: string
}

export const LESSON_PLAN_REVIEWS: LessonPlanReview[] = [
  {
    id: 'lp1',
    teacher: 'Dr. Shalini Verma',
    subject: 'Physics',
    className: 'Class 12-B',
    topic: 'Ray optics — spherical mirrors and lens combination',
    submitted: 'Today, 7:35 am',
    quality: 4,
    status: 'pending',
    note: 'Week 24 plan · includes 2 practicals',
  },
  {
    id: 'lp2',
    teacher: 'Rekha Namdeo',
    subject: 'Hindi',
    className: 'Class 10-A',
    topic: 'काव्य खंड — सूरदास पद एवं व्याख्या',
    submitted: 'Yesterday',
    quality: 5,
    status: 'pending',
    note: 'Board-pattern answer practice attached',
  },
  {
    id: 'lp3',
    teacher: 'Devendra Agrawal',
    subject: 'Accountancy',
    className: 'Class 11 Commerce',
    topic: 'Bank reconciliation statement',
    submitted: '12 Sep',
    quality: 3,
    status: 'returned',
    note: 'Needs differentiation for weak learners',
  },
  {
    id: 'lp4',
    teacher: 'Sunil Yadav',
    subject: 'Physical Education',
    className: 'Class 9-C',
    topic: 'Athletics — shot put technique and safety',
    submitted: '11 Sep',
    quality: 5,
    status: 'approved',
    note: 'Approved with a note of appreciation',
  },
  {
    id: 'lp5',
    teacher: 'Kavita Chouhan',
    subject: 'Biology',
    className: 'Class 12-A',
    topic: 'Human reproduction — diagrams and terminology',
    submitted: 'Today, 9:50 am',
    quality: 4,
    status: 'pending',
    note: 'Includes a revision worksheet',
  },
]

export interface Grievance {
  id: string
  from: string
  who: string
  subject: string
  detail: string
  raised: string
  ageDays: number
  stage: 'New' | 'In progress' | 'Awaiting parent' | 'Closed'
  channel: 'App' | 'Office' | 'Suggestion box' | 'WhatsApp'
}

export const GRIEVANCES: Grievance[] = [
  {
    id: 'gr1',
    from: 'Parent of Class 5-B student',
    who: 'Shalini Sahu',
    subject: 'Drinking water cooler not working',
    detail: 'Second floor cooler leaks. Children carry bottles from home in this heat.',
    raised: '14 Sep',
    ageDays: 2,
    stage: 'In progress',
    channel: 'App',
  },
  {
    id: 'gr2',
    from: 'Parent of Class 11 Science student',
    who: 'Sameer Bhardwaj',
    subject: 'Request to shift Mathematics batch',
    detail: 'Clashes with the NTSE coaching slot on Tuesdays.',
    raised: '15 Sep',
    ageDays: 1,
    stage: 'New',
    channel: 'WhatsApp',
  },
  {
    id: 'gr3',
    from: 'Class 12-B students (group of 6)',
    who: 'Suggestion box',
    subject: 'Request for Sunday doubt sessions before half-yearly',
    detail: 'Chemistry and Biology doubt sessions requested for two Sundays.',
    raised: '13 Sep',
    ageDays: 3,
    stage: 'In progress',
    channel: 'Suggestion box',
  },
  {
    id: 'gr4',
    from: 'Parent of Class 3-A student',
    who: 'Vinod Sharma',
    subject: 'Bus 9 did not arrive on 12 Sep',
    detail: 'Waited 40 minutes with the child at the stop.',
    raised: '12 Sep',
    ageDays: 4,
    stage: 'Awaiting parent',
    channel: 'Office',
  },
]

export interface DutyStaff {
  id: string
  name: string
  role: string
  wing: string
  phone: string
  periodsToday: number
}

export const DUTY_STAFF: DutyStaff[] = [
  {
    id: 'd1',
    name: 'Dr. Shalini Verma',
    role: 'Head of Science',
    wing: 'High school',
    phone: '+91 94250 11203',
    periodsToday: 5,
  },
  {
    id: 'd2',
    name: 'Anil Deshpande',
    role: 'Mathematics',
    wing: 'High school',
    phone: '+91 94250 11204',
    periodsToday: 6,
  },
  { id: 'd3', name: 'Rekha Namdeo', role: 'Hindi', wing: 'High school', phone: '+91 94250 11205', periodsToday: 5 },
  {
    id: 'd4',
    name: 'Dr. Kavita Rangan',
    role: 'Biology',
    wing: 'Senior secondary',
    phone: '+91 94250 11206',
    periodsToday: 4,
  },
  {
    id: 'd5',
    name: 'Devendra Agrawal',
    role: 'Accountancy',
    wing: 'Senior secondary',
    phone: '+91 94250 11207',
    periodsToday: 5,
  },
  {
    id: 'd6',
    name: 'Sunita Dubey',
    role: 'Sanskrit',
    wing: 'Middle school',
    phone: '+91 94250 11208',
    periodsToday: 6,
  },
  {
    id: 'd7',
    name: 'Mahesh Shukla',
    role: 'Social Science',
    wing: 'High school',
    phone: '+91 94250 11209',
    periodsToday: 5,
  },
  {
    id: 'd8',
    name: 'Anita Sharma',
    role: 'Headmistress, Primary',
    wing: 'Primary',
    phone: '+91 94250 11210',
    periodsToday: 3,
  },
  {
    id: 'd9',
    name: 'Vikram Singh Chouhan',
    role: 'Coordinator, Middle',
    wing: 'Middle school',
    phone: '+91 94250 11211',
    periodsToday: 4,
  },
  {
    id: 'd10',
    name: 'Sunil Yadav',
    role: 'Physical Education',
    wing: 'All wings',
    phone: '+91 94250 11212',
    periodsToday: 6,
  },
  {
    id: 'd11',
    name: 'Kavita Chouhan',
    role: 'Biology',
    wing: 'Senior secondary',
    phone: '+91 94250 11213',
    periodsToday: 5,
  },
  {
    id: 'd12',
    name: 'Dinesh Malviya',
    role: 'Hindi',
    wing: 'Middle school',
    phone: '+91 94250 11214',
    periodsToday: 6,
  },
]

export interface Substitution {
  id: string
  slot: string
  className: string
  subject: string
  absent: string
  substitute: string
  reason: string
  confirmed: boolean
}

export const SUBSTITUTIONS: Substitution[] = [
  {
    id: 'su1',
    slot: '11:15 – 12:00',
    className: 'Class 12-B',
    subject: 'Hindi',
    absent: 'Rekha Namdeo',
    substitute: 'Sunita Dubey',
    reason: 'Casual leave',
    confirmed: false,
  },
  {
    id: 'su2',
    slot: '12:10 – 12:55',
    className: 'Class 9-A',
    subject: 'Mathematics',
    absent: 'Anil Deshpande',
    substitute: 'Mahesh Shukla',
    reason: 'Board verification duty (DEO office)',
    confirmed: false,
  },
  {
    id: 'su3',
    slot: '13:40 – 14:25',
    className: 'Class 7-C',
    subject: 'Sanskrit',
    absent: 'Sunita Dubey',
    substitute: 'Dinesh Malviya',
    reason: 'Substitution adjustment',
    confirmed: true,
  },
  {
    id: 'su4',
    slot: '14:35 – 15:20',
    className: 'Class 11 Commerce',
    subject: 'Accountancy',
    absent: 'Devendra Agrawal',
    substitute: 'Not assigned',
    reason: 'Training at SCERT',
    confirmed: false,
  },
]

export const BIRTHDAYS = [
  { id: 'bd1', name: 'Ananya Sonkar', meta: 'Class 12-B · Roll 4', kind: 'student' as const, when: 'Today', age: 17 },
  {
    id: 'bd2',
    name: 'Sunita Dubey',
    meta: 'Sanskrit teacher · Middle wing',
    kind: 'staff' as const,
    when: 'Today',
    age: 44,
  },
  {
    id: 'bd3',
    name: 'Saanvi Chaturvedi',
    meta: 'Class 12-B · Roll 8',
    kind: 'student' as const,
    when: 'Tomorrow',
    age: 17,
  },
  {
    id: 'bd4',
    name: 'Mahesh Shukla',
    meta: 'Social Science · High school',
    kind: 'staff' as const,
    when: '19 Sep',
    age: 39,
  },
  { id: 'bd5', name: 'Nitya Chouhan', meta: 'Class 12-B · Roll 19', kind: 'student' as const, when: '20 Sep', age: 18 },
]

export const PRINCIPAL_DAY = [
  { id: 'pd1', time: '07:50', title: 'Gate duty with the transport team', place: 'Main gate', tone: 'brand' as const },
  {
    id: 'pd2',
    time: '08:15',
    title: 'Morning assembly · cleanliness pledge',
    place: 'Assembly ground',
    tone: 'emerald' as const,
  },
  {
    id: 'pd3',
    time: '09:30',
    title: 'Classroom observation — Class 10-A Physics',
    place: 'Room H-203',
    tone: 'violet' as const,
  },
  {
    id: 'pd4',
    time: '11:00',
    title: 'MPBSE exam form verification with the exam cell',
    place: 'Principal’s office',
    tone: 'amber' as const,
  },
  {
    id: 'pd5',
    time: '12:30',
    title: 'Parent meeting — 3 admission enquiries',
    place: 'Conference room',
    tone: 'brand' as const,
  },
  {
    id: 'pd6',
    time: '14:00',
    title: 'Staff meeting — half-yearly preparation',
    place: 'Staff room',
    tone: 'rose' as const,
  },
  {
    id: 'pd7',
    time: '15:30',
    title: 'SMC review of mid-day meal registers',
    place: 'Office annexe',
    tone: 'emerald' as const,
  },
]

export const CLASS_ROLLUP = [
  { className: 'Class 1–5', present: 318, total: 336, classes: '14 sections' },
  { className: 'Class 6–8', present: 296, total: 312, classes: '11 sections' },
  { className: 'Class 9–10', present: 349, total: 372, classes: '12 sections' },
  { className: 'Class 11–12', present: 286, total: 343, classes: '14 sections' },
]

export const CAMPUS_ALERTS = [
  {
    id: 'ca1',
    title: 'Second-floor water cooler — plumber assigned',
    detail: 'Complaint gr1 · expected fix today by 3 pm',
    severity: 'medium' as const,
    module: 'Facilities',
    at: '1 h ago',
  },
  {
    id: 'ca2',
    title: 'Bus 12 (Route 7) running 12 minutes late',
    detail: 'Road work near Kolar bypass · parents notified in the app',
    severity: 'high' as const,
    module: 'Transport',
    at: '22 min ago',
  },
  {
    id: 'ca3',
    title: 'Chemistry lab exhaust fan servicing due',
    detail: 'Annual AMC visit scheduled 21 Sep',
    severity: 'low' as const,
    module: 'Safety',
    at: 'Yesterday',
  },
  {
    id: 'ca4',
    title: 'CCTV camera 3 (corridor B) offline',
    detail: 'Vendor ticket #4821 raised · 48-hour SLA',
    severity: 'medium' as const,
    module: 'Safety',
    at: 'Yesterday',
  },
]

export const COMPLIANCE_DEADLINES = [
  {
    id: 'cd1',
    label: 'MPBSE Class 10 & 12 exam forms',
    due: '22 Sep',
    days: 6,
    owner: 'Exam cell',
    status: 'In progress' as const,
  },
  { id: 'cd2', label: 'UDISE+ data update', due: '30 Sep', days: 14, owner: 'Head clerk', status: 'Pending' as const },
  {
    id: 'cd3',
    label: 'RTE pupil-teacher ratio return',
    due: '05 Oct',
    days: 19,
    owner: 'Office',
    status: 'Pending' as const,
  },
  {
    id: 'cd4',
    label: 'Mid-day meal monthly utilisation',
    due: '18 Sep',
    days: 2,
    owner: 'Accounts',
    status: 'Due soon' as const,
  },
]

export const EXAM_READINESS = [
  { id: 'er1', label: 'Syllabus completion (all sections)', value: 82 },
  { id: 'er2', label: 'Question papers set & moderated', value: 64 },
  { id: 'er3', label: 'Answer-sheet stock verified', value: 100 },
  { id: 'er4', label: 'Invigilation duty roster published', value: 45 },
  { id: 'er5', label: 'Hall & seating plan finalised', value: 30 },
]

export const SICK_BAY = [
  {
    id: 'sb1',
    student: 'Kabir Tiwari',
    className: '12-B',
    issue: 'Headache, rested 40 min',
    status: 'Returned to class' as const,
    at: '11:05 am',
  },
  {
    id: 'sb2',
    student: 'Riya Malviya',
    className: '9-A',
    issue: 'Stomach ache — guardian informed',
    status: 'Sent home' as const,
    at: '10:20 am',
  },
  {
    id: 'sb3',
    student: 'Yash Bansal',
    className: '12-B',
    issue: 'Minor sports injury (ankle)',
    status: 'First aid given' as const,
    at: '9:40 am',
  },
]

export const BOARD_TREND = [
  { year: '2021', pass: 96.2, average: 71.4, distinction: 34 },
  { year: '2022', pass: 97.8, average: 73.1, distinction: 41 },
  { year: '2023', pass: 99.1, average: 75.2, distinction: 48 },
  { year: '2024', pass: 99.6, average: 76.8, distinction: 55 },
  { year: '2025', pass: 100, average: 78.4, distinction: 62 },
]
