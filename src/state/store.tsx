import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  APPLICANTS,
  buildInvoices,
  NOTIFICATIONS,
  SEED_APPROVALS,
  SEED_MARKS,
  SEED_NOTES,
  SEED_NOTICES,
  SEED_TASKS,
  DUTY_STAFF,
  STUDENTS,
  SUBSTITUTIONS,
  type Approval,
  type ApprovalDecision,
  type Applicant,
  type AttendanceMark,
  type FeeInvoice,
  type LessonPlanReview,
  type Note,
  type Notice,
  type ParentFeedback,
  type Role,
  type Substitution,
  type Task,
  type TaskCategory,
  type TaskPriority,
  LESSON_PLAN_REVIEWS,
  PARENT_FEEDBACK,
} from '../data/school'
import { uid } from '../lib/utils'

export type Route = 'portal' | 'dashboard'
export type ViewKey =
  | 'overview'
  | 'approvals'
  | 'notices'
  | 'reviews'
  | 'staff'
  | 'analytics'
  | 'attendance'
  | 'fees'
  | 'exams'
  | 'students'
  | 'faculty'
  | 'reports'
  | 'admissions'
  | 'child'
export type Theme = 'light' | 'dark'

export interface Toast {
  id: string
  title: string
  description?: string
  tone: 'success' | 'info' | 'warning' | 'error'
}

export interface RoleProfile {
  id: Role
  label: string
  person: string
  designation: string
  scope: string
  description: string
  views: ViewKey[]
  defaultView: ViewKey
  accent: 'brand' | 'violet' | 'emerald' | 'amber' | 'rose'
}

export const ROLES: RoleProfile[] = [
  {
    id: 'admin',
    label: 'Administrator',
    person: 'Ayush Raghuwanshi',
    designation: 'Director of Operations',
    scope: 'Whole institution',
    description: 'Full control across academics, finance, admissions and estate.',
    views: [
      'overview',
      'approvals',
      'notices',
      'reviews',
      'staff',
      'analytics',
      'attendance',
      'exams',
      'fees',
      'students',
      'faculty',
      'reports',
      'admissions',
    ],
    defaultView: 'overview',
    accent: 'brand',
  },
  {
    id: 'principal',
    label: 'Principal',
    person: 'Dr. Meenal Krishnan',
    designation: 'Principal · Saraswati Vidhya Mandir',
    scope: 'Academic governance',
    description: 'Approvals, teacher reviews, discipline, exams and parent relations.',
    views: [
      'overview',
      'approvals',
      'notices',
      'reviews',
      'staff',
      'analytics',
      'attendance',
      'exams',
      'students',
      'faculty',
      'reports',
    ],
    defaultView: 'overview',
    accent: 'violet',
  },
  {
    id: 'teacher',
    label: 'Class Teacher',
    person: 'Dr. Shalini Verma',
    designation: 'Class Teacher · XII-B (Science)',
    scope: 'Class XII-B (Science)',
    description: 'Daily attendance, marks entry and mentoring for one homeroom.',
    views: ['overview', 'attendance', 'exams', 'students', 'notices', 'reviews'],
    defaultView: 'attendance',
    accent: 'emerald',
  },
  {
    id: 'accountant',
    label: 'Accounts Officer',
    person: 'Priya Menon',
    designation: 'Senior Accounts Officer',
    scope: 'Fees & payroll',
    description: 'Fee invoicing, collections reconciliation and defaulter follow-up.',
    views: ['overview', 'fees', 'approvals', 'notices', 'reports', 'analytics'],
    defaultView: 'fees',
    accent: 'amber',
  },
  {
    id: 'parent',
    label: 'Parent',
    person: 'Rakesh Mehta',
    designation: 'Guardian · Aarav Mehta (XII-B)',
    scope: 'Single student record',
    description: 'Read-only view of your ward’s attendance, fees and results.',
    views: ['child', 'notices'],
    defaultView: 'child',
    accent: 'rose',
  },
  {
    id: 'student',
    label: 'Student Portal',
    person: 'Aarav Sharma',
    designation: 'Scholar · Class XII-B (Science PCM + CS)',
    scope: 'Aarav Sharma · Scholar No. RVS-2024-0429',
    description: 'My academic grades, CBSE report card, timetable, assignments, and faculty chat.',
    views: ['child', 'exams', 'notices'],
    defaultView: 'child',
    accent: 'emerald',
  },
]

export interface CelebrationPayload {
  x?: number
  y?: number
  message?: string
}

export interface AppState {
  route: Route
  setRoute: (route: Route) => void
  view: ViewKey
  setView: (view: ViewKey) => void
  theme: Theme
  toggleTheme: () => void
  role: RoleProfile
  setRoleId: (id: Role) => void
  toasts: Toast[]
  pushToast: (t: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
  /* --- Campus / Branch selection --------------------------------- */
  campus: string
  setCampus: (campusId: string) => void
  /* --- Guided sales tour ----------------------------------------- */
  tourActive: boolean
  tourStep: number
  startTour: () => void
  nextTour: () => void
  prevTour: () => void
  endTour: () => void
  jumpToTourStep: (step: number, targetView?: ViewKey) => void
  /* --- Celebration & confetti animation ------------------------- */
  celebrationPayload: CelebrationPayload | null
  triggerCelebration: (payload?: CelebrationPayload) => void
  clearCelebration: () => void
  /* --- Interactive sales modals ---------------------------------- */
  biometricModalOpen: boolean
  setBiometricModalOpen: (open: boolean) => void
  whatsAppModalOpen: boolean
  setWhatsAppModalOpen: (open: boolean) => void
  whatsAppInvoice: FeeInvoice | null
  setWhatsAppInvoice: (invoice: FeeInvoice | null) => void
  whatsAppIsBatch: boolean
  setWhatsAppIsBatch: (isBatch: boolean) => void
  reportCardModalOpen: boolean
  setReportCardModalOpen: (open: boolean) => void
  reportCardStudent: any
  setReportCardStudent: (student: any) => void
  reportCardRemark: string
  setReportCardRemark: (remark: string) => void
  chatModalOpen: boolean
  setChatModalOpen: (open: boolean) => void
  notifications: typeof NOTIFICATIONS
  unreadCount: number
  markNotificationsRead: () => void
  notificationsOpen: boolean
  setNotificationsOpen: (open: boolean) => void
  paletteOpen: boolean
  setPaletteOpen: (open: boolean) => void
  attendance: Record<string, AttendanceMark>
  setAttendanceMark: (studentId: string, mark: AttendanceMark) => void
  bulkAttendance: (mark: AttendanceMark) => void
  attendanceReset: () => void
  marks: Record<string, number>
  setMark: (studentId: string, subjectId: string, value: number) => void
  resetMarks: () => void
  invoices: FeeInvoice[]
  recordPayment: (invoiceId: string, method: NonNullable<FeeInvoice['method']>, amount: number) => void
  applicants: Applicant[]
  moveApplicant: (id: string, stage: Applicant['stage']) => void
  /* --- Principal's workspace ------------------------------------- */
  tasks: Task[]
  addTask: (input: {
    title: string
    priority: TaskPriority
    category: TaskCategory
    assignee: string
    due: string
  }) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  clearDoneTasks: () => void
  notes: Note[]
  addNote: (input: { title: string; body: string; tone: Note['tone'] }) => void
  updateNote: (id: string, patch: Partial<Pick<Note, 'title' | 'body' | 'tone'>>) => void
  togglePinNote: (id: string) => void
  deleteNote: (id: string) => void
  approvals: Approval[]
  decideApproval: (id: string, decision: 'approved' | 'rejected', remark?: string) => void
  decideAllApprovals: (decision: 'approved' | 'rejected') => void
  approvalsOpenCount: number
  decisions: ApprovalDecision[]
  notices: Notice[]
  publishNotice: (input: {
    title: string
    body: string
    audience: string[]
    priority: Notice['priority']
    category: Notice['category']
  }) => void
  deleteNotice: (id: string) => void
  feedback: ParentFeedback[]
  replyFeedback: (id: string) => void
  lessonPlans: LessonPlanReview[]
  decideLessonPlan: (id: string, decision: 'approved' | 'returned') => void
  staffDuty: Record<string, 'present' | 'leave' | 'od'>
  setStaffDuty: (id: string, mark: 'present' | 'leave' | 'od') => void
  staffOnLeaveCount: number
  substitutions: Substitution[]
  confirmSubstitution: (id: string, substitute?: string) => void
}

const AppContext = createContext<AppState | null>(null)

/**
 * Escape hatch used by the SSR/prerender harness and the test suite: when set,
 * views skip their simulated network delay so the first paint contains real
 * content instead of pulse skeletons.
 */
function isInstant() {
  return (globalThis as { __SVM_INSTANT__?: boolean }).__SVM_INSTANT__ === true
}

const STAGES: Applicant['stage'][] = ['Enquiry', 'Assessment', 'Interview', 'Offer', 'Enrolled']

const VIEW_KEYS = new Set<ViewKey>([
  'analytics',
  'attendance',
  'fees',
  'exams',
  'students',
  'faculty',
  'reports',
  'admissions',
  'child',
])

/** Deep links look like `#/dashboard/fees` or `#/portal/programs`. */
function readHash(): { route?: Route; view?: ViewKey } {
  if (typeof window === 'undefined') return {}
  const raw = window.location.hash.replace(/^#\/?/, '')
  const [head, tail] = raw.split('/')
  const route = head === 'dashboard' || head === 'portal' ? (head as Route) : undefined
  const view = VIEW_KEYS.has(tail as ViewKey) ? (tail as ViewKey) : undefined
  return { route, view }
}

export function AppProvider({
  children,
  initialRoute,
  initialView,
}: {
  children: ReactNode
  initialRoute?: Route
  initialView?: ViewKey
}) {
  const hash = readHash()
  const [route, setRoute] = useState<Route>(initialRoute ?? hash.route ?? 'portal')
  const [view, setViewState] = useState<ViewKey>(initialView ?? hash.view ?? 'analytics')
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = window.localStorage.getItem('svm-theme')
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [roleId, setRoleIdState] = useState<Role>('admin')
  const [toasts, setToasts] = useState<Toast[]>([])
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [attendance, setAttendance] = useState<Record<string, AttendanceMark>>(() =>
    Object.fromEntries(STUDENTS.map((s, i) => [s.id, i % 11 === 3 ? 'absent' : i % 7 === 5 ? 'late' : 'present'])),
  )
  const [marks, setMarks] = useState<Record<string, number>>(() => ({ ...SEED_MARKS }))
  const [invoices, setInvoices] = useState<FeeInvoice[]>(() => buildInvoices())
  const [applicants, setApplicants] = useState<Applicant[]>(APPLICANTS)
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS)
  const [notes, setNotes] = useState<Note[]>(SEED_NOTES)
  const [approvals, setApprovals] = useState<Approval[]>(SEED_APPROVALS)
  const [decisions, setDecisions] = useState<ApprovalDecision[]>([])
  const [notices, setNotices] = useState<Notice[]>(SEED_NOTICES)
  const [feedback, setFeedback] = useState<ParentFeedback[]>(PARENT_FEEDBACK)
  const [lessonPlans, setLessonPlans] = useState<LessonPlanReview[]>(LESSON_PLAN_REVIEWS)
  const [staffDuty, setStaffDutyState] = useState<Record<string, 'present' | 'leave' | 'od'>>(() =>
    Object.fromEntries(DUTY_STAFF.map((d, i) => [d.id, i === 4 || i === 10 ? 'leave' : i === 7 ? 'od' : 'present'])),
  )
  const [substitutions, setSubstitutions] = useState(SUBSTITUTIONS)
  const timers = useRef<number[]>([])

  /* --- Sales Pitch & Interactive Experience States --- */
  const [campus, setCampusState] = useState<string>('main')
  const [tourActive, setTourActive] = useState(false)
  const [tourStep, setTourStep] = useState(0)
  const [celebrationPayload, setCelebrationPayload] = useState<CelebrationPayload | null>(null)
  const [biometricModalOpen, setBiometricModalOpen] = useState(false)
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false)
  const [whatsAppInvoice, setWhatsAppInvoice] = useState<FeeInvoice | null>(null)
  const [whatsAppIsBatch, setWhatsAppIsBatch] = useState(false)
  const [reportCardModalOpen, setReportCardModalOpen] = useState(false)
  const [reportCardStudent, setReportCardStudent] = useState<any>(null)
  const [reportCardRemark, setReportCardRemark] = useState<string>('')
  const [chatModalOpen, setChatModalOpen] = useState(false)

  const role = useMemo(() => ROLES.find((r) => r.id === roleId) ?? ROLES[0], [roleId])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
    window.localStorage.setItem('svm-theme', theme)
  }, [theme])

  // Keep the URL hash in sync so console modules are shareable links.
  useEffect(() => {
    const next = route === 'dashboard' ? `#/dashboard/${view}` : '#/portal'
    if (window.location.hash !== next) {
      window.history.replaceState(null, '', next)
    }
  }, [route, view])

  // Honour browser back/forward and manual hash edits.
  useEffect(() => {
    const onHash = () => {
      const next = readHash()
      if (next.route) setRoute(next.route)
      if (next.view) setViewState(next.view)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const pushToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = uid('toast')
    setToasts((prev) => [...prev.slice(-3), { ...t, id }])
    const timer = window.setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4200)
    timers.current.push(timer)
  }, [])

  const dismissToast = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), [])

  const setView = useCallback((next: ViewKey) => {
    setViewState(next)
    setNotificationsOpen(false)
  }, [])

  const setRoleId = useCallback(
    (id: Role) => {
      const next = ROLES.find((r) => r.id === id) ?? ROLES[0]
      setRoleIdState(id)
      setViewState(next.defaultView)
      pushToast({
        tone: 'info',
        title: `Signed in as ${next.label}`,
        description: `${next.person} · ${next.scope}`,
      })
    },
    [pushToast],
  )

  const triggerCelebration = useCallback((payload?: CelebrationPayload) => {
    setCelebrationPayload(payload ?? { message: 'Action Confirmed!' })
  }, [])

  const clearCelebration = useCallback(() => {
    setCelebrationPayload(null)
  }, [])

  const setCampus = useCallback(
    (campusId: string) => {
      setCampusState(campusId)
      pushToast({
        tone: 'info',
        title: 'Branch switched',
        description:
          campusId === 'main'
            ? 'Viewing Main Campus (Arera Colony · 1,420 students)'
            : 'Viewing North Campus (Ayodhya Bypass · 680 students)',
      })
    },
    [pushToast],
  )

  const startTour = useCallback(() => {
    setTourActive(true)
    setTourStep(0)
    setViewState('overview')
  }, [])

  const endTour = useCallback(() => {
    setTourActive(false)
  }, [])

  const jumpToTourStep = useCallback((step: number, targetView?: ViewKey) => {
    setTourStep(step)
    if (targetView) {
      setViewState(targetView)
    }
  }, [])

  const nextTour = useCallback(() => {
    setTourStep((prev) => prev + 1)
  }, [])

  const prevTour = useCallback(() => {
    setTourStep((prev) => Math.max(0, prev - 1))
  }, [])

  // Global ⌘K / Ctrl+K palette trigger.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((p) => !p)
      }
      if (e.key === 'Escape') {
        setPaletteOpen(false)
        setNotificationsOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const setAttendanceMark = useCallback((studentId: string, mark: AttendanceMark) => {
    setAttendance((prev) => ({ ...prev, [studentId]: mark }))
  }, [])

  const bulkAttendance = useCallback((mark: AttendanceMark) => {
    setAttendance(Object.fromEntries(STUDENTS.map((s) => [s.id, mark])))
  }, [])

  const attendanceReset = useCallback(() => {
    setAttendance(
      Object.fromEntries(STUDENTS.map((s, i) => [s.id, i % 11 === 3 ? 'absent' : i % 7 === 5 ? 'late' : 'present'])),
    )
  }, [])

  const setMark = useCallback((studentId: string, subjectId: string, value: number) => {
    setMarks((prev) => ({ ...prev, [`${studentId}:${subjectId}`]: Math.max(0, Math.min(100, value)) }))
  }, [])

  const resetMarks = useCallback(() => setMarks({ ...SEED_MARKS }), [])

  const recordPayment = useCallback(
    (invoiceId: string, method: NonNullable<FeeInvoice['method']>, amount: number) => {
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invoiceId
            ? {
                ...inv,
                status: 'paid',
                paidOn: new Date().toISOString().slice(0, 10),
                method,
                amount,
                receiptNo: `RCPT/26/${Math.floor(9000 + Math.random() * 900)}`,
              }
            : inv,
        ),
      )
      triggerCelebration({ message: 'Fee Payment Recorded & Receipt Generated!' })
    },
    [triggerCelebration],
  )

  const moveApplicant = useCallback((id: string, stage: Applicant['stage']) => {
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, stage } : a)))
  }, [])

  /* ---------------------------------------------------------------- *
   * Principal's workspace
   * ---------------------------------------------------------------- */
  const addTask = useCallback<AppState['addTask']>((input) => {
    setTasks((prev) => [{ id: uid('tsk'), done: false, ...input }, ...prev])
  }, [])

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }, [])

  const deleteTask = useCallback((id: string) => setTasks((prev) => prev.filter((t) => t.id !== id)), [])
  const clearDoneTasks = useCallback(() => setTasks((prev) => prev.filter((t) => !t.done)), [])

  const addNote = useCallback<AppState['addNote']>((input) => {
    setNotes((prev) => [{ id: uid('nt'), pinned: false, author: 'You', updatedAt: 'Just now', ...input }, ...prev])
  }, [])

  const updateNote = useCallback<AppState['updateNote']>((id, patch) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch, updatedAt: 'Just now' } : n)))
  }, [])

  const togglePinNote = useCallback((id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)))
  }, [])

  const deleteNote = useCallback((id: string) => setNotes((prev) => prev.filter((n) => n.id !== id)), [])

  const decideApproval = useCallback<AppState['decideApproval']>(
    (id, decision, remark) => {
      setApprovals((prev) => {
        const target = prev.find((a) => a.id === id)
        if (target) {
          setDecisions((log) => [
            {
              id: uid(),
              who: target.requester,
              what: `${target.kind} ${decision}${target.amount ? ` · ₹${target.amount.toLocaleString('en-IN')}` : ''}`,
              at: new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
              decision,
              kind: target.kind,
              remark,
            },
            ...log,
          ])
        }
        return prev.filter((a) => a.id !== id)
      })
      triggerCelebration({
        message: decision === 'approved' ? 'Application Approved & Notified!' : 'Decision Recorded',
      })
    },
    [triggerCelebration],
  )

  const decideAllApprovals = useCallback<AppState['decideAllApprovals']>((decision) => {
    setApprovals((prev) => {
      if (prev.length) {
        setDecisions((log) => [
          ...prev.map((target) => ({
            id: uid(),
            who: target.requester,
            what: `${target.kind} ${decision}${target.amount ? ` · ₹${target.amount.toLocaleString('en-IN')}` : ''}`,
            at: new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }),
            decision,
            kind: target.kind,
          })),
          ...log,
        ])
      }
      return []
    })
  }, [])

  const publishNotice = useCallback<AppState['publishNotice']>(
    (input) => {
      const reach = input.audience.includes('Parents') ? 1363 : 1501
      setNotices((prev) => [
        {
          id: uid('no'),
          author: 'Office of the Principal',
          when: 'Just now',
          delivered: reach,
          read: 0,
          status: 'published',
          ...input,
        },
        ...prev,
      ])
      triggerCelebration({ message: 'Circular Broadcasted to Campus!' })
    },
    [triggerCelebration],
  )

  const deleteNotice = useCallback((id: string) => setNotices((prev) => prev.filter((n) => n.id !== id)), [])

  const replyFeedback = useCallback((id: string) => {
    setFeedback((prev) => prev.map((f) => (f.id === id ? { ...f, replied: true } : f)))
  }, [])

  const decideLessonPlan = useCallback<AppState['decideLessonPlan']>((id, decision) => {
    setLessonPlans((prev) => prev.map((p) => (p.id === id ? { ...p, status: decision } : p)))
  }, [])

  const setStaffDuty = useCallback<AppState['setStaffDuty']>((id, mark) => {
    setStaffDutyState((prev) => ({ ...prev, [id]: mark }))
  }, [])

  const confirmSubstitution = useCallback((id: string, substitute?: string) => {
    setSubstitutions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, confirmed: true, substitute: substitute ?? sub.substitute } : sub)),
    )
  }, [])

  const markNotificationsRead = useCallback(
    () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false }))),
    [],
  )

  const value: AppState = {
    route,
    setRoute,
    view,
    setView,
    theme,
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    role,
    setRoleId,
    toasts,
    pushToast,
    dismissToast,
    notifications,
    unreadCount: notifications.filter((n) => n.unread).length,
    markNotificationsRead,
    notificationsOpen,
    setNotificationsOpen,
    paletteOpen,
    setPaletteOpen,
    attendance,
    setAttendanceMark,
    bulkAttendance,
    attendanceReset,
    marks,
    setMark,
    resetMarks,
    invoices,
    recordPayment,
    applicants,
    moveApplicant,
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    clearDoneTasks,
    notes,
    addNote,
    updateNote,
    togglePinNote,
    deleteNote,
    approvals,
    decideApproval,
    decideAllApprovals,
    approvalsOpenCount: approvals.length,
    decisions,
    notices,
    publishNotice,
    deleteNotice,
    feedback,
    replyFeedback,
    lessonPlans,
    decideLessonPlan,
    staffDuty,
    setStaffDuty,
    staffOnLeaveCount: Object.values(staffDuty).filter((v) => v !== 'present').length,
    substitutions,
    confirmSubstitution,
    campus,
    setCampus,
    tourActive,
    tourStep,
    startTour,
    nextTour,
    prevTour,
    endTour,
    jumpToTourStep,
    celebrationPayload,
    triggerCelebration,
    clearCelebration,
    biometricModalOpen,
    setBiometricModalOpen,
    whatsAppModalOpen,
    setWhatsAppModalOpen,
    whatsAppInvoice,
    setWhatsAppInvoice,
    whatsAppIsBatch,
    setWhatsAppIsBatch,
    reportCardModalOpen,
    setReportCardModalOpen,
    reportCardStudent,
    setReportCardStudent,
    reportCardRemark,
    setReportCardRemark,
    chatModalOpen,
    setChatModalOpen,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within <AppProvider>')
  return ctx
}

/** Simulates a network round-trip so views can exercise their skeleton states. */
export function useSimulatedLoad(dep: unknown, delay = 620) {
  const [loading, setLoading] = useState(!isInstant())
  useEffect(() => {
    if (isInstant()) {
      setLoading(false)
      return
    }
    setLoading(true)
    const t = window.setTimeout(() => setLoading(false), delay)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep, delay])
  return loading
}

/** Counts up to a target value for animated metric displays. */
export function useCountUp(target: number, duration = 900, deps: unknown[] = []) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let frame = 0
    const start = performance.now()
    const from = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(from + (target - from) * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, ...deps])
  return value
}

export { STAGES }
