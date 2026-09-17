import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BellRing,
  CalendarClock,
  CheckCheck,
  Copy,
  Eye,
  Megaphone,
  MessageCircle,
  PenLine,
  Send,
  Smartphone,
  Trash2,
  Users,
} from 'lucide-react'
import { Eyebrow } from '../../ui/Card'
import { Pill, type Tone } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { Field, Input, ProgressBar, Segmented, Select } from '../../ui/Form'
import { Modal } from '../../ui/Overlay'
import { SkeletonList } from '../../ui/Skeleton'
import { NOTICE_TONE, PanelCard, SectionLink } from '../Panels'
import { useApp, useSimulatedLoad } from '../../../state/store'
import type { Notice } from '../../../data/school'
import { cn } from '../../../lib/utils'

type NoticeTemplate = {
  id: string
  label: string
  title: string
  body: string
  category: Notice['category']
  priority: Notice['priority']
}

const AUDIENCES = ['Parents', 'Students', 'Staff', 'Transport', 'Alumni'] as const
const CATEGORIES: Notice['category'][] = ['Examination', 'Holiday', 'Fee', 'Event', 'Transport', 'General']

const TEMPLATES: NoticeTemplate[] = [
  {
    id: 'tpl-exam',
    label: 'Exam date sheet',
    title: 'Half-yearly examination date sheet released',
    body: 'The date sheet for Classes 9 to 12 is available on the notice board and the parent app. Practical examinations begin 8 February. Students must carry their admit cards.',
    category: 'Examination',
    priority: 'urgent',
  },
  {
    id: 'tpl-holiday',
    label: 'Holiday notice',
    title: 'School closed on account of local holiday',
    body: 'The school will remain closed on 25 September on account of the district holiday. Classes will resume as per the regular timetable.',
    category: 'Holiday',
    priority: 'normal',
  },
  {
    id: 'tpl-fee',
    label: 'Fee reminder',
    title: 'Reminder: Term-2 fee due',
    body: 'Parents are requested to deposit the Term-2 fee through UPI, net banking or at the school counter between 8 am and 2 pm. Receipts are issued instantly in the app.',
    category: 'Fee',
    priority: 'normal',
  },
  {
    id: 'tpl-ptm',
    label: 'Parent-teacher meeting',
    title: 'Parent-teacher meeting — all sections',
    body: 'The monthly parent-teacher meeting will be held on Saturday from 9 am to 12 noon. Class teachers will share progress cards and subject-wise feedback.',
    category: 'Event',
    priority: 'normal',
  },
]

export function NoticesView() {
  const { notices, publishNotice, deleteNotice, pushToast, role } = useApp()
  const [composer, setComposer] = useState(false)
  const [template, setTemplate] = useState<NoticeTemplate | null>(null)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [preview, setPreview] = useState<Notice | null>(null)
  const loading = useSimulatedLoad(filter, 520)

  const canPublish = role.views.includes('notices') && role.id !== 'parent'

  const rows = useMemo(() => notices.filter((n) => filter === 'all' || n.status === filter), [filter, notices])

  const totalDelivered = notices.reduce((a, n) => a + n.delivered, 0)
  const readRate = (() => {
    const delivered = notices.filter((n) => n.status === 'published').reduce((a, n) => a + n.delivered, 0)
    const read = notices.filter((n) => n.status === 'published').reduce((a, n) => a + n.read, 0)
    return delivered ? (read / delivered) * 100 : 0
  })()

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>
            <Megaphone className="h-3.5 w-3.5" /> Communication
          </Eyebrow>
          <h1 className="mt-2.5 text-[clamp(1.6rem,3vw,2.15rem)] leading-tight font-extrabold tracking-[-0.04em] text-ink-900 dark:text-white">
            Notices & circulars
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500 dark:text-ink-400">
            One place to reach 1,363 parents, 1,501 students and 138 staff — with read receipts.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Pill tone="emerald" dot>
            {readRate.toFixed(1)}% read rate
          </Pill>
          <Pill tone="brand">{notices.length} circulars this session</Pill>
          {canPublish ? (
            <Button size="sm" icon={<PenLine className="h-3.5 w-3.5" />} onClick={() => setComposer(true)}>
              Compose circular
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Messages delivered',
            value: totalDelivered.toLocaleString('en-IN'),
            sub: 'App + SMS + WhatsApp',
            tone: 'brand' as Tone,
            icon: Send,
          },
          {
            label: 'Read receipts',
            value: `${readRate.toFixed(1)}%`,
            sub: 'Parents reading within 6 h',
            tone: 'emerald' as Tone,
            icon: CheckCheck,
          },
          {
            label: 'App notifications',
            value: '96.2%',
            sub: 'Of guardians have the app',
            tone: 'violet' as Tone,
            icon: Smartphone,
          },
          {
            label: 'Parent queries',
            value: '14',
            sub: 'Replied by the office today',
            tone: 'amber' as Tone,
            icon: MessageCircle,
          },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="surface lift rounded-3xl p-5 hover:border-brand-300/60 dark:hover:border-brand-500/30"
          >
            <span
              className={cn(
                'grid h-9 w-9 place-items-center rounded-xl',
                kpi.tone === 'brand' && 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
                kpi.tone === 'emerald' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
                kpi.tone === 'violet' &&
                  'bg-violet-accent-50 text-violet-accent-600 dark:bg-violet-accent-500/15 dark:text-violet-accent-400',
                kpi.tone === 'amber' && 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
              )}
            >
              <kpi.icon className="h-4.5 w-4.5" />
            </span>
            <p className="mt-3.5 text-[11.5px] font-semibold text-ink-500 dark:text-ink-400">{kpi.label}</p>
            <p className="mt-1 text-[21px] leading-none font-extrabold tracking-[-0.04em] tabular text-ink-900 dark:text-white">
              {kpi.value}
            </p>
            <p className="mt-2 text-[11px] text-ink-400">{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Segmented
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: `All ${notices.length}` },
                { value: 'published', label: `Published ${notices.filter((n) => n.status === 'published').length}` },
                { value: 'draft', label: `Drafts ${notices.filter((n) => n.status === 'draft').length}` },
              ]}
            />
            <p className="text-[11.5px] font-medium text-ink-400">Newest first</p>
          </div>

          {loading ? (
            <SkeletonList rows={5} />
          ) : (
            <AnimatePresence initial={false}>
              {rows.map((notice, i) => (
                <motion.div
                  key={notice.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.25) }}
                  className="surface group rounded-3xl p-5 transition-colors hover:border-brand-300/70 dark:hover:border-brand-500/35"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className={cn(
                          'grid h-10 w-10 shrink-0 place-items-center rounded-2xl',
                          notice.priority === 'urgent'
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300'
                            : 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
                        )}
                      >
                        <Megaphone className="h-4.5 w-4.5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-[14px] font-bold tracking-[-0.015em] text-ink-900 dark:text-white">
                            {notice.title}
                          </h3>
                          <Pill tone={NOTICE_TONE[notice.priority]} dot className="capitalize">
                            {notice.priority}
                          </Pill>
                          {notice.status === 'draft' ? <Pill tone="slate">Draft</Pill> : null}
                        </div>
                        <p className="mt-0.5 text-[11px] font-medium text-ink-500 dark:text-ink-400">
                          {notice.category} · {notice.author} · {notice.when}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        onClick={() => setPreview(notice)}
                        className="press inline-flex h-8 items-center gap-1.5 rounded-lg border border-ink-200/80 px-2.5 text-[11.5px] font-bold text-ink-600 transition-colors hover:border-brand-400 hover:text-brand-700 dark:border-white/10 dark:text-ink-300"
                      >
                        <Eye className="h-3.5 w-3.5" /> Preview
                      </button>
                      <button
                        onClick={() => {
                          pushToast({
                            tone: 'info',
                            title: 'Circular duplicated',
                            description: `“${notice.title}” copied to a new draft for editing.`,
                          })
                        }}
                        aria-label="Duplicate circular"
                        className="press grid h-8 w-8 place-items-center rounded-lg border border-ink-200/80 text-ink-500 transition-colors hover:border-brand-400 hover:text-brand-600 dark:border-white/10 dark:text-ink-300"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      {canPublish ? (
                        <button
                          onClick={() => {
                            deleteNotice(notice.id)
                            pushToast({
                              tone: 'warning',
                              title: 'Circular withdrawn',
                              description: 'Removed from the app, notice board and website.',
                            })
                          }}
                          aria-label="Withdraw circular"
                          className="press grid h-8 w-8 place-items-center rounded-lg border border-ink-200/80 text-ink-500 transition-colors hover:border-rose-300 hover:text-rose-600 dark:border-white/10 dark:text-ink-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <p className="mt-3 text-[12.5px] leading-relaxed text-ink-600 dark:text-ink-300">{notice.body}</p>

                  <div className="mt-3.5 flex flex-wrap items-center gap-2">
                    {notice.audience.map((a) => (
                      <span
                        key={a}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-ink-200/80 bg-ink-50 px-2 py-1 text-[10.5px] font-bold text-ink-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-300"
                      >
                        <Users className="h-3 w-3" />
                        {a}
                      </span>
                    ))}
                  </div>

                  {notice.status === 'published' ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-ink-500 dark:text-ink-400">
                          <span>Read receipts</span>
                          <span className="tabular text-ink-800 dark:text-ink-100">
                            {notice.read.toLocaleString('en-IN')} / {notice.delivered.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <ProgressBar
                          value={notice.delivered ? (notice.read / notice.delivered) * 100 : 0}
                          tone={notice.read / (notice.delivered || 1) >= 0.8 ? 'emerald' : 'amber'}
                          className="mt-1.5"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        icon={<BellRing className="h-3.5 w-3.5" />}
                        onClick={() =>
                          pushToast({
                            tone: 'info',
                            title: 'Reminder sent',
                            description: `${(notice.delivered - notice.read).toLocaleString('en-IN')} pending guardians nudged on the app.`,
                          })
                        }
                      >
                        Nudge pending
                      </Button>
                    </div>
                  ) : null}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="space-y-5">
          <PanelCard
            title="Quick templates"
            subtitle="Pre-approved wording for common circulars"
            icon={<PenLine className="h-4 w-4" />}
            action={<SectionLink label="Compose" onClick={() => setComposer(true)} />}
          >
            <div className="space-y-2.5">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => {
                    if (!canPublish) {
                      pushToast({
                        tone: 'warning',
                        title: 'Read-only access',
                        description: 'Your role can view circulars but not publish them.',
                      })
                      return
                    }
                    setTemplate(tpl)
                    setComposer(true)
                    pushToast({
                      tone: 'info',
                      title: `Template loaded: ${tpl.label}`,
                      description: 'Edit the wording before publishing.',
                    })
                  }}
                  className="press flex w-full items-center gap-3 rounded-2xl border border-ink-200/70 px-3.5 py-3 text-left transition-colors hover:border-brand-300/70 hover:bg-brand-50/40 dark:border-white/8 dark:hover:border-brand-500/30 dark:hover:bg-brand-500/8"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-ink-100 text-[11px] font-extrabold text-ink-500 dark:bg-white/8 dark:text-ink-300">
                    {tpl.label.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-bold text-ink-900 dark:text-white">
                      {tpl.label}
                    </span>
                    <span className="block truncate text-[11px] text-ink-500 dark:text-ink-400">
                      {tpl.category} · {tpl.priority}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </PanelCard>

          <PanelCard
            title="Delivery channels"
            subtitle="How parents actually receive a circular"
            icon={<Smartphone className="h-4 w-4" />}
          >
            <div className="space-y-3.5">
              {[
                { label: 'Parent app push', value: 96, tone: 'brand' as Tone },
                { label: 'SMS fallback', value: 78, tone: 'emerald' as Tone },
                { label: 'WhatsApp broadcast', value: 64, tone: 'violet' as Tone },
                { label: 'Printed diary note', value: 100, tone: 'amber' as Tone },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="font-semibold text-ink-600 dark:text-ink-300">{row.label}</span>
                    <span className="font-bold tabular text-ink-900 dark:text-white">{row.value}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        row.tone === 'brand' && 'bg-brand-600',
                        row.tone === 'emerald' && 'bg-emerald-500',
                        row.tone === 'violet' && 'bg-violet-accent-600',
                        row.tone === 'amber' && 'bg-amber-500',
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${row.value}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard
            title="Notice board today"
            subtitle="Pinned outside the front office"
            icon={<CalendarClock className="h-4 w-4" />}
          >
            <ul className="space-y-2.5">
              {[
                'Half-yearly date sheet — Class 9 to 12',
                'Swachhta hi Seva: shramdaan on 19 Sep, 8 am',
                'Route 7 timing change from 20 Sep',
                'Class 10 extra Mathematics periods (Mon/Wed 7th)',
                'Health check-up camp for Classes 1 to 5 on 23 Sep',
              ].map((line, i) => (
                <motion.li
                  key={line}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2.5 text-[11.5px] leading-relaxed font-medium text-ink-600 dark:text-ink-300"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {line}
                </motion.li>
              ))}
            </ul>
          </PanelCard>
        </div>
      </div>

      <Composer
        open={composer}
        onClose={() => {
          setComposer(false)
          setTemplate(null)
        }}
        onPublish={publishNotice}
        canPublish={canPublish}
        template={template}
      />

      {/* Preview */}
      <Modal
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        title="Parent app preview"
        description={preview?.title}
        size="sm"
      >
        {preview ? (
          <div className="rounded-[1.75rem] border border-ink-200/80 bg-ink-100 p-4 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="mx-auto w-full max-w-[300px] overflow-hidden rounded-[1.5rem] border border-ink-200 bg-white shadow-xl dark:border-white/10 dark:bg-ink-900">
              <div className="bg-ink-900 px-4 py-3 text-white dark:bg-brand-600">
                <p className="text-[11px] font-bold tracking-[0.14em] uppercase opacity-80">SVM Parent App</p>
                <p className="text-[13.5px] font-extrabold">Notice from school</p>
              </div>
              <div className="p-4">
                <Pill tone={NOTICE_TONE[preview.priority]} dot className="capitalize">
                  {preview.priority}
                </Pill>
                <p className="mt-2.5 text-[13.5px] leading-snug font-bold text-ink-900 dark:text-white">
                  {preview.title}
                </p>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-600 dark:text-ink-300">{preview.body}</p>
                <div className="mt-3 flex items-center gap-2 border-t border-dashed border-ink-200 pt-3 dark:border-white/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <p className="text-[10.5px] font-semibold text-ink-500 dark:text-ink-400">
                    {preview.author} · {preview.when}
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <span className="rounded-xl bg-brand-600 py-2 text-center text-[11.5px] font-bold text-white">
                    Acknowledge
                  </span>
                  <span className="rounded-xl border border-ink-200 py-2 text-center text-[11.5px] font-bold text-ink-600 dark:border-white/12 dark:text-ink-300">
                    Call office
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

/* ------------------------------------------------------------------ */
function Composer({
  open,
  onClose,
  onPublish,
  canPublish,
  template,
}: {
  open: boolean
  onClose: () => void
  onPublish: ReturnType<typeof useApp>['publishNotice']
  canPublish: boolean
  template: NoticeTemplate | null
}) {
  const { pushToast } = useApp()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [priority, setPriority] = useState<Notice['priority']>('normal')
  const [category, setCategory] = useState<Notice['category']>('General')
  const [audience, setAudience] = useState<string[]>(['Parents', 'Students'])
  const [sending, setSending] = useState(false)
  const [seededTemplate, setSeededTemplate] = useState<string | null>(null)

  // Re-seed the form whenever a different quick template is chosen.
  if (template && template.id !== seededTemplate) {
    setSeededTemplate(template.id)
    setTitle(template.title)
    setBody(template.body)
    setCategory(template.category)
    setPriority(template.priority)
  }

  const toggleAudience = (a: string) =>
    setAudience((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))

  const publish = () => {
    setSending(true)
    window.setTimeout(() => {
      onPublish({ title, body, audience, priority, category })
      setSending(false)
      setTitle('')
      setBody('')
      onClose()
      pushToast({
        tone: 'success',
        title: 'Circular published',
        description: `Delivered to ${audience.join(', ').toLowerCase()} · read receipts will update live.`,
      })
    }, 1000)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Compose circular"
      description="Published instantly to the parent app, notice board and school website."
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Save as draft
          </Button>
          <Button
            loading={sending}
            disabled={!canPublish || title.trim().length < 4 || body.trim().length < 10 || audience.length === 0}
            onClick={publish}
            icon={<Send className="h-4 w-4" />}
          >
            {sending ? 'Publishing…' : 'Publish now'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Title" hint="Appears as the push notification heading">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Half-yearly examination date sheet released"
          />
        </Field>

        <div>
          <label className="mb-1.5 block text-[12.5px] font-bold text-ink-700 dark:text-ink-200">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="Write the circular in simple language — Hindi or English…"
            className="ring-focus w-full resize-none rounded-xl border border-ink-200 bg-white px-3.5 py-3 text-sm font-medium text-ink-900 shadow-sm placeholder:font-normal placeholder:text-ink-400 dark:border-white/12 dark:bg-white/[0.05] dark:text-white"
          />
          <p className="mt-1.5 text-[11px] text-ink-400">
            {body.length} characters · parents see roughly 3 lines in the app before opening.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Priority">
            <Select value={priority} onChange={(e) => setPriority(e.target.value as Notice['priority'])}>
              <option value="urgent">Urgent — push + SMS</option>
              <option value="normal">Normal — push notification</option>
              <option value="info">Informational — app only</option>
            </Select>
          </Field>
          <Field label="Category">
            <Select value={category} onChange={(e) => setCategory(e.target.value as Notice['category'])}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div>
          <p className="mb-2 text-[12.5px] font-bold text-ink-700 dark:text-ink-200">Audience</p>
          <div className="flex flex-wrap gap-2">
            {AUDIENCES.map((a) => {
              const active = audience.includes(a)
              return (
                <button
                  key={a}
                  onClick={() => toggleAudience(a)}
                  className={cn(
                    'press rounded-xl border px-3 py-1.5 text-[11.5px] font-bold transition-colors',
                    active
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-ink-200 text-ink-600 hover:border-brand-400 hover:text-brand-700 dark:border-white/12 dark:text-ink-300',
                  )}
                >
                  {a}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-[11px] text-ink-400">
            {audience.length === 0
              ? 'Select at least one audience group.'
              : `Estimated delivery to ${audience.includes('Parents') ? '1,363 parents' : audience.includes('Students') ? '1,501 students' : `${audience.join(' + ')}`}.`}
          </p>
        </div>
      </div>
    </Modal>
  )
}
