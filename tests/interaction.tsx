/**
 * Client-side interaction suite.
 *
 * Mounts the real app inside jsdom, drives the UI with genuine DOM events and
 * asserts what a user would see. Runs via `npm run test:dom` (Node + jsdom).
 */
declare const process: { exitCode?: number }

import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
})

const win = dom.window as unknown as Window & typeof globalThis

// --- Minimal browser APIs that jsdom does not implement -------------------
class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
win.IntersectionObserver = ObserverStub as unknown as typeof IntersectionObserver
win.ResizeObserver = ObserverStub as unknown as typeof ResizeObserver
win.matchMedia = ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia
win.HTMLElement.prototype.scrollIntoView = function scrollIntoView() {}
Object.defineProperty(win, 'requestAnimationFrame', {
  writable: true,
  value: (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 8) as unknown as number,
})
Object.defineProperty(win, 'cancelAnimationFrame', { writable: true, value: (id: number) => clearTimeout(id) })
win.scrollTo = (() => {}) as typeof window.scrollTo
// jsdom reports a zero-size box for everything, which starves Recharts'
// ResponsiveContainer. Give every element a plausible box instead.
win.Element.prototype.getBoundingClientRect = function getBoundingClientRect() {
  return {
    width: 800,
    height: 420,
    top: 0,
    left: 0,
    right: 800,
    bottom: 420,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect
}

// Expose the jsdom globals to modules that expect a browser.
const g = globalThis as unknown as Record<string, unknown>
g.window = win
g.document = win.document
Object.defineProperty(g, 'navigator', { value: win.navigator, configurable: true })
g.HTMLElement = win.HTMLElement
g.Element = win.Element
g.Node = win.Node
g.Event = win.Event
g.MouseEvent = win.MouseEvent
g.KeyboardEvent = win.KeyboardEvent
g.CustomEvent = win.CustomEvent
g.getComputedStyle = win.getComputedStyle.bind(win)
g.requestAnimationFrame = win.requestAnimationFrame
g.cancelAnimationFrame = win.cancelAnimationFrame
g.IntersectionObserver = ObserverStub
g.ResizeObserver = ObserverStub
g.matchMedia = win.matchMedia
g.localStorage = win.localStorage
// Mirror the rest of the jsdom window onto globalThis (SVGElement, CSS, etc.)
// so that DOM-aware libraries such as Framer Motion can run unmodified.
for (const key of Object.getOwnPropertyNames(win)) {
  if (key in g) continue
  try {
    Object.defineProperty(g, key, { get: () => (win as unknown as Record<string, unknown>)[key], configurable: true })
  } catch {
    /* read-only global — skip */
  }
}

g.IS_REACT_ACT_ENVIRONMENT = true

const { createRoot } = await import('react-dom/client')
const { act } = await import('react')
const { default: App } = await import('../src/App')

let failures = 0
function ok(name: string, condition: boolean, detail = '') {
  const status = condition ? '✓' : '✗'
  if (!condition) failures += 1
  console.log(`  ${status} ${name}${condition || !detail ? '' : ` — ${detail}`}`)
}

const root = createRoot(win.document.getElementById('root')!)
const all = (selector: string) => Array.from(win.document.querySelectorAll(selector)) as HTMLElement[]
const text = () => win.document.body.textContent ?? ''

function byText(selector: string, needle: string) {
  return all(selector).find((el) => (el.textContent ?? '').includes(needle)) ?? null
}

async function click(el: HTMLElement | null, label: string) {
  if (!el) {
    ok(`click target present: ${label}`, false)
    return
  }
  await act(async () => {
    el.dispatchEvent(new win.MouseEvent('click', { bubbles: true, cancelable: true }))
    await new Promise((r) => setTimeout(r, 30))
  })
}

async function setInputValue(input: HTMLElement, value: string) {
  const proto = Object.getPrototypeOf(input) as object
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set
  await act(async () => {
    setter?.call(input, value)
    input.dispatchEvent(new win.Event('input', { bubbles: true }))
    await new Promise((r) => setTimeout(r, 40))
  })
}

/** Polls until `predicate` holds (or times out), flushing React work each tick. */
async function waitFor(predicate: () => boolean, timeout = 4000) {
  const started = Date.now()
  while (Date.now() - started < timeout) {
    if (predicate()) return true
    await act(async () => {
      await new Promise((r) => setTimeout(r, 80))
    })
  }
  return predicate()
}

async function settle(ms = 900) {
  await act(async () => {
    await new Promise((r) => setTimeout(r, ms))
  })
}

/* ------------------------------------------------------------------ */
console.log('\n▸ Public portal\n')
await act(async () => {
  root.render(<App />)
})
await settle(300)

ok('hero headline renders', text().includes('A school built'))
ok('live showcase widget renders', text().includes('Campus Pulse'))
ok('programs tabs render', text().includes('Academic Programs'))

// Switch a program tab and confirm the panel changes.
await click(byText('button', 'Senior Secondary'), 'Senior Secondary tab')
ok('senior secondary stream cards appear', text().includes('Science Stream'))
await click(byText('button', 'Commerce'), 'Commerce stream pill')
await settle(200)
ok('commerce stream swaps in', text().includes('Commerce Stream'))

// Testimonial pagination dot.
const activeBefore = text().includes('Ritu Malhotra')
await click(all('button[aria-label^="Show testimonial"]')[2] ?? null, 'testimonial dot 3')
ok('carousel moves on pagination dot', activeBefore && text().includes('Head of Science Department'))

// Theme toggle should flip the html class.
const darkBefore = win.document.documentElement.classList.contains('dark')
await click(win.document.querySelector('button[aria-label="Toggle colour theme"]'), 'portal theme toggle')
ok('theme toggle flips the dark class', win.document.documentElement.classList.contains('dark') !== darkBefore)

/* ------------------------------------------------------------------ */
console.log('\n▸ Management console\n')

await click(byText('button', 'Dashboard') ?? byText('a', 'Dashboard'), 'Dashboard entry')
ok('console shell mounts', await waitFor(() => text().includes('Good morning')))
ok('fee collection chart card renders', await waitFor(() => text().includes('Monthly fee collection')))
ok('attendance donut renders', await waitFor(() => text().includes('Attendance split')))

// Sidebar navigation → attendance.
await click(byText('button', 'Attendance'), 'sidebar Attendance')
ok('attendance heatmap renders', await waitFor(() => text().includes('Monthly attendance heatmap')))
ok('live register renders', await waitFor(() => text().includes('Live register')))

// Per-student P/L/A toggles appear once the register finishes "loading".
const togglesReady = await waitFor(() => all('button[title*="present"]').length >= 20)
ok('register exposes per-student toggles', togglesReady)
await click(all('button[title*="present"]')[0] ?? null, 'first present toggle')
await settle(120)

// Bulk action fires a toast.
await click(byText('button', 'Mark all present'), 'Mark all present')
ok('bulk action raises a toast', await waitFor(() => text().includes('All 24 marked present')))

// Command palette.
await act(async () => {
  win.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))
  await new Promise((r) => setTimeout(r, 80))
})
const paletteOpened = await waitFor(() => text().includes('Search students'))
ok('⌘K opens the command palette', paletteOpened)
ok('palette lists nav modules', text().includes('Command Centre') && text().includes('Approvals & Sanctions'))
await act(async () => {
  win.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  await new Promise((r) => setTimeout(r, 80))
})
ok('Escape closes the palette', await waitFor(() => !text().includes('Search students, jump')))

/* ------------------------------------------------------------------ */
console.log('\n▸ Fees & invoicing\n')
await click(byText('button', 'Fees & Invoicing'), 'sidebar Fees')
ok('invoice table renders', await waitFor(() => text().includes('INV-2026')))
const recordButtons = () => all('button').filter((b) => (b.textContent ?? '').trim().startsWith('Record'))
ok('record payment buttons present', await waitFor(() => recordButtons().length > 0))

await click(recordButtons()[0] ?? null, 'Record payment')
ok('payment modal opens', await waitFor(() => text().includes('Record a fee payment')))
ok('fee head breakdown shown', text().includes('Tuition Fee'))

const confirm = all('button').find((b) => (b.textContent ?? '').startsWith('Confirm ₹'))
await click(confirm ?? null, 'Confirm payment')
ok('payment posts a toast', await waitFor(() => text().includes('Payment recorded')))

const overdueRowsBefore = all('tbody tr').length
await click(byText('button', 'Overdue'), 'overdue filter')
ok(
  'overdue filter narrows the table',
  await waitFor(() => all('tbody tr').length > 0 && all('tbody tr').length < overdueRowsBefore),
)

/* ------------------------------------------------------------------ */
console.log('\n▸ Exams & marks entry\n')
await click(byText('button', 'Exams & Marks'), 'sidebar Exams')
ok('marks matrix renders', await waitFor(() => text().includes('Marks entry matrix')))
ok('grade matrix has editable cells', await waitFor(() => all('input[type="number"]').length >= 100))

const averageNow = () => text().match(/Class average[\s\S]{0,160}?([\d.]+)%/)?.[1]
const beforeAverage = averageNow()
await setInputValue(all('input[type="number"]')[0], '12')
const changed = await waitFor(() => averageNow() !== beforeAverage)
ok('editing a mark recomputes the class average', changed, `${beforeAverage} → ${averageNow()}`)

// Simulated bulk entry refreshes the whole matrix.
await click(byText('button', 'Simulate entry'), 'Simulate entry')
ok('simulate entry streams a full dataset', await waitFor(() => text().includes('Marks entry simulated'), 12000))

/* ------------------------------------------------------------------ */
console.log('\n▸ Principal workspace\n')

// Command centre is the landing view for the Principal/Administrator role.
await click(byText('button', 'Command Centre'), 'sidebar Command Centre')
ok('command centre renders', await waitFor(() => text().includes('Today’s task board')))
ok('KPI band shows live counts', text().includes('Students present today') && text().includes('Approvals awaiting you'))

// Task board → add a task through the composer.
await click(byText('button', 'Add task'), 'Add task')
ok('task composer opens', await waitFor(() => text().includes('Add a task')))
await setInputValue(win.document.querySelector('input[placeholder^="e.g."]'), 'Verify UDISE+ upload with the office')
await click(
  all('button').find((b) => (b.textContent ?? '').trim() === 'Add task' && b.closest('[role="dialog"]')),
  'confirm add task',
)
ok('new task lands on the board', await waitFor(() => text().includes('Verify UDISE+ upload with the office')))

// Ticking a task updates the done counter.
const doneCount = () => text().match(/(\d+) completed/)?.[1]
const doneBefore = doneCount()
const taskToggles = all('button').filter((b) => (b.getAttribute('aria-label') ?? '').startsWith('Mark "'))
await click(taskToggles[0] ?? null, 'complete first task')
ok(
  'task completion is recorded',
  await waitFor(() => doneCount() !== doneBefore, 6000),
  `${doneBefore} → ${doneCount()}`,
)

// Approvals queue → approve the first request, which writes an audit entry.
await click(byText('button', 'Approvals'), 'sidebar Approvals')
ok('approval queue renders', await waitFor(() => text().includes('Approvals & sanctions')))
const queueBefore = text().match(/Awaiting decision[\s\S]{0,120}?([\d]+)/)?.[1]
const approveButton = () => all('button').find((b) => (b.textContent ?? '').trim() === 'Approve') ?? null
const approveReady = await waitFor(() => approveButton() !== null, 8000)
await click(approveReady ? approveButton() : null, 'approve first request')
ok('approval writes an audit entry', await waitFor(() => text().includes('Recent decisions')))
ok(
  'queue shrinks after a decision',
  await waitFor(() => text().match(/Awaiting decision[\s\S]{0,120}?([\d]+)/)?.[1] !== queueBefore),
)

// Notices → publish a circular from a quick template.
await click(byText('button', 'Notices & Circulars'), 'sidebar Notices')
ok('notice desk renders', await waitFor(() => text().includes('Read receipts')))
await click(byText('button', 'Compose circular'), 'Compose circular')
ok('composer opens with templates', await waitFor(() => text().includes('Audience')))
await setInputValue(
  win.document.querySelector('input[placeholder^="e.g. Half-yearly"]') as HTMLElement,
  'Sports day rehearsal schedule',
)
await setInputValue(
  win.document.querySelector('textarea[placeholder^="Write the circular"]') as HTMLElement,
  'Rehearsals for the annual sports day will be held daily from 7:30 am. Students should report to the main ground in house kit.',
)
await click(all('button').find((b) => (b.textContent ?? '').trim() === 'Publish now') ?? null, 'Publish now')
ok('circular publishes with a toast', await waitFor(() => text().includes('Circular published'), 8000))
ok('published circular shows in the list', await waitFor(() => text().includes('Sports day rehearsal schedule')))

// Reviews → save a memo note.
await click(byText('button', 'Notes & Reviews'), 'sidebar Reviews')
ok('notes board renders', await waitFor(() => text().includes('memo board') || text().includes('Pinned this week')))
await click(byText('button', 'New note'), 'New note')
await setInputValue(win.document.querySelector('input[placeholder^="e.g. Points"]'), 'Staff meeting agenda — 21 Sep')
await click(all('button').find((b) => (b.textContent ?? '').trim() === 'Save note') ?? null, 'Save note')
ok('note is saved to the board', await waitFor(() => text().includes('Staff meeting agenda — 21 Sep')))

// Staff & duty → whole-staff attendance action.
await click(byText('button', 'Staff & Duty'), 'sidebar Staff')
ok('duty roster renders', await waitFor(() => text().includes('Substitution engine')))
await click(byText('button', 'Mark all present'), 'Mark all present (staff)')
ok('staff register submits', await waitFor(() => text().includes('Whole staff marked present')))

/* ------------------------------------------------------------------ */
console.log('\n▸ Role switching\n')
await click(win.document.querySelector('button[aria-label="Notifications"]'), 'notification bell')
ok('notification panel opens', await waitFor(() => text().includes('unread · last 24 hours')))
ok('notifications list content renders', text().includes('Term-2 fee collection crossed'))

await act(async () => {
  win.dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  await new Promise((r) => setTimeout(r, 60))
})

const roleTrigger = all('button').find((b) => (b.textContent ?? '').includes('Administrator'))
await click(roleTrigger ?? null, 'role selector')
ok('role menu opens', await waitFor(() => text().includes('Switch role')))
const parentOption = all('button').find((b) => (b.textContent ?? '').includes('Read-only view of your ward'))
await click(parentOption ?? null, 'Parent role')
ok('parent role lands on the family view', await waitFor(() => text().includes('Good afternoon')))
ok('parent view is read-only', text().includes('read-only') || text().includes('Here is how'))

/* ------------------------------------------------------------------ */
if (failures === 0) {
  console.log('\n✅ All interaction checks passed\n')
  process.exitCode = 0
} else {
  console.error(`\n❌ ${failures} interaction check(s) failed\n`)
  process.exitCode = 1
}
await act(async () => {
  root.unmount()
})
process.exit(failures === 0 ? 0 : 1)
