import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  CornerUpLeft,
  Eye,
  Megaphone,
  MessageSquareQuote,
  NotebookPen,
  Pin,
  Plus,
  Reply,
  Star,
  StickyNote,
  ThumbsUp,
  Trash2,
  TrendingUp,
} from 'lucide-react'
import { Card, Eyebrow } from '../../ui/Card'
import { Pill } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { Avatar, Input, ProgressBar, Segmented } from '../../ui/Form'
import { Modal, StaggerGroup, StaggerItem } from '../../ui/Overlay'
import { SkeletonList } from '../../ui/Skeleton'
import { DataBar, PanelCard, RatingStars, SentimentPill } from '../Panels'
import { useApp, useSimulatedLoad } from '../../../state/store'
import type { NoteTone } from '../../../data/school'
import { cn } from '../../../lib/utils'

const NOTE_TONES: Record<NoteTone, { card: string; chip: string; label: string }> = {
  brand: {
    card: 'border-brand-200/80 bg-brand-50/80 dark:border-brand-500/25 dark:bg-brand-500/10',
    chip: 'bg-brand-600',
    label: 'Blue',
  },
  amber: {
    card: 'border-amber-200/80 bg-amber-50/80 dark:border-amber-500/25 dark:bg-amber-500/10',
    chip: 'bg-amber-500',
    label: 'Amber',
  },
  emerald: {
    card: 'border-emerald-200/80 bg-emerald-50/80 dark:border-emerald-500/25 dark:bg-emerald-500/10',
    chip: 'bg-emerald-500',
    label: 'Green',
  },
  violet: {
    card: 'border-violet-accent-100 bg-violet-accent-50/80 dark:border-violet-accent-400/25 dark:bg-violet-accent-500/10',
    chip: 'bg-violet-accent-600',
    label: 'Violet',
  },
  rose: {
    card: 'border-rose-200/80 bg-rose-50/80 dark:border-rose-500/25 dark:bg-rose-500/10',
    chip: 'bg-rose-500',
    label: 'Rose',
  },
  slate: {
    card: 'border-ink-200/80 bg-white/70 dark:border-white/10 dark:bg-white/[0.03]',
    chip: 'bg-ink-500',
    label: 'Grey',
  },
}

type Tab = 'notes' | 'plans' | 'feedback'

export function ReviewsView() {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    togglePinNote,
    lessonPlans,
    decideLessonPlan,
    feedback,
    replyFeedback,
    pushToast,
    role,
  } = useApp()

  const [tab, setTab] = useState<Tab>('notes')
  const [noteComposer, setNoteComposer] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [replyTarget, setReplyTarget] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | 'concern' | 'unreplied'>('all')
  const loading = useSimulatedLoad(tab, 560)

  const canReview = role.views.includes('reviews')
  const readOnly = !canReview || role.id === 'parent'

  const sortedNotes = useMemo(() => [...notes].sort((a, b) => Number(b.pinned) - Number(a.pinned)), [notes])

  const visibleFeedback = useMemo(() => {
    if (feedbackFilter === 'concern') return feedback.filter((f) => f.sentiment === 'concern')
    if (feedbackFilter === 'unreplied') return feedback.filter((f) => !f.replied)
    return feedback
  }, [feedback, feedbackFilter])

  const pendingPlans = lessonPlans.filter((p) => p.status === 'pending')
  const avgRating = feedback.reduce((a, b) => a + b.rating, 0) / (feedback.length || 1)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>
            <NotebookPen className="h-3.5 w-3.5" /> Principal’s workspace
          </Eyebrow>
          <h1 className="mt-2.5 text-[clamp(1.6rem,3vw,2.15rem)] leading-tight font-extrabold tracking-[-0.04em] text-ink-900 dark:text-white">
            Notes, reviews & feedback
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500 dark:text-ink-400">
            Your private memo board, lesson-plan scrutiny and the parent voice — all in one desk.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Pill tone="violet" dot>
            {pendingPlans.length} lesson plans pending
          </Pill>
          <Pill tone="amber">{feedback.filter((f) => !f.replied).length} parent messages unreplied</Pill>
          <Button size="sm" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setNoteComposer(true)}>
            New note
          </Button>
        </div>
      </div>

      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: 'notes', label: `Notes & memos ${notes.length}`, icon: <StickyNote className="h-3.5 w-3.5" /> },
          {
            value: 'plans',
            label: `Lesson plans ${pendingPlans.length}`,
            icon: <BookOpenCheck className="h-3.5 w-3.5" />,
          },
          {
            value: 'feedback',
            label: `Parent voice ${feedback.length}`,
            icon: <MessageSquareQuote className="h-3.5 w-3.5" />,
          },
        ]}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {loading ? (
            <SkeletonList rows={6} />
          ) : tab === 'notes' ? (
            <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
              <StaggerGroup className="grid gap-4 sm:grid-cols-2">
                <AnimatePresence initial={false}>
                  {sortedNotes.map((note) => (
                    <StaggerItem key={note.id} variant="scale">
                      <motion.div
                        layout
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={cn('group flex h-full flex-col rounded-3xl border p-5', NOTE_TONES[note.tone].card)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className={cn('h-1.5 w-8 rounded-full', NOTE_TONES[note.tone].chip)} />
                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={() => togglePinNote(note.id)}
                              aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
                              className={cn(
                                'press grid h-7 w-7 place-items-center rounded-lg transition-colors',
                                note.pinned
                                  ? 'text-brand-600 dark:text-brand-300'
                                  : 'text-ink-400 hover:text-ink-700 dark:hover:text-white',
                              )}
                            >
                              <Pin className={cn('h-3.5 w-3.5', note.pinned && 'fill-current')} />
                            </button>
                            <button
                              onClick={() => setEditing(note.id)}
                              aria-label="Edit note"
                              className="press grid h-7 w-7 place-items-center rounded-lg text-ink-400 transition-colors hover:text-brand-600"
                            >
                              <NotebookPen className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                deleteNote(note.id)
                                pushToast({
                                  tone: 'info',
                                  title: 'Note deleted',
                                  description: 'Removed from your memo board.',
                                })
                              }}
                              aria-label="Delete note"
                              className="press grid h-7 w-7 place-items-center rounded-lg text-ink-400 transition-colors hover:text-rose-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="mt-2 text-[14px] leading-snug font-bold tracking-[-0.015em] text-ink-900 dark:text-white">
                          {note.title}
                        </p>
                        <p className="mt-2 flex-1 text-[12px] leading-relaxed text-ink-600 dark:text-ink-300">
                          {note.body}
                        </p>
                        <div className="mt-4 flex items-center gap-2.5 border-t border-dashed border-ink-200 pt-3 dark:border-white/10">
                          <Avatar name={note.author} size={26} tone={1} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[11px] font-bold text-ink-700 dark:text-ink-200">
                              {note.author}
                            </span>
                            <span className="block text-[10px] text-ink-400">{note.updatedAt}</span>
                          </span>
                          {note.pinned ? <Pill tone="brand">Pinned</Pill> : null}
                        </div>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </AnimatePresence>
                <StaggerItem variant="scale">
                  <button
                    onClick={() => setNoteComposer(true)}
                    className="press flex h-full min-h-[190px] w-full flex-col items-center justify-center gap-2.5 rounded-3xl border-2 border-dashed border-ink-300 px-5 py-6 text-center transition-colors hover:border-brand-400 hover:bg-brand-50/40 dark:border-white/12 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/8"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink-100 text-ink-500 dark:bg-white/8 dark:text-ink-300">
                      <Plus className="h-5 w-5" />
                    </span>
                    <span className="text-[12.5px] font-bold text-ink-700 dark:text-ink-200">Add a note</span>
                    <span className="text-[11px] text-ink-400">Meeting points, follow-ups, reminders</span>
                  </button>
                </StaggerItem>
              </StaggerGroup>

              <div className="space-y-5">
                <PanelCard
                  title="Pinned this week"
                  subtitle="Surfaced on your command centre"
                  icon={<Pin className="h-4 w-4" />}
                >
                  <div className="space-y-2.5">
                    {notes.filter((n) => n.pinned).length === 0 ? (
                      <p className="rounded-2xl border border-dashed border-ink-300 px-4 py-6 text-center text-[11.5px] text-ink-500 dark:border-white/12">
                        Pin a note to keep it on the command centre.
                      </p>
                    ) : (
                      notes
                        .filter((n) => n.pinned)
                        .map((note) => (
                          <div
                            key={note.id}
                            className="flex items-start gap-3 rounded-2xl border border-ink-200/70 px-3.5 py-3 dark:border-white/8"
                          >
                            <Pin className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-current text-brand-500" />
                            <div className="min-w-0">
                              <p className="text-[12px] font-bold text-ink-900 dark:text-white">{note.title}</p>
                              <p className="mt-0.5 text-[10.5px] text-ink-400">{note.updatedAt}</p>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </PanelCard>

                <PanelCard
                  title="Writing prompts"
                  subtitle="Tap to start a note from a prompt"
                  icon={<NotebookPen className="h-4 w-4" />}
                >
                  <div className="space-y-2">
                    {[
                      'Points for the next staff meeting',
                      'Follow-ups from today’s parent meetings',
                      'DEO / MPBSE pending paperwork',
                      'Observation notes from classroom visits',
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => setNoteComposer(true)}
                        className="press flex w-full items-center justify-between gap-2 rounded-2xl border border-ink-200/70 px-3.5 py-2.5 text-left text-[11.5px] font-semibold text-ink-700 transition-colors hover:border-brand-400 hover:text-brand-700 dark:border-white/8 dark:text-ink-200 dark:hover:border-brand-500/40"
                      >
                        {prompt}
                        <Plus className="h-3.5 w-3.5 shrink-0 text-ink-400" />
                      </button>
                    ))}
                  </div>
                </PanelCard>
              </div>
            </div>
          ) : tab === 'plans' ? (
            <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
              <div className="space-y-3">
                {lessonPlans.map((plan, i) => (
                  <motion.div
                    key={plan.id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="surface rounded-3xl p-5 transition-colors hover:border-brand-300/70 dark:hover:border-brand-500/35"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <Avatar name={plan.teacher} size={40} tone={i % 6} />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[13.5px] font-bold tracking-[-0.015em] text-ink-900 dark:text-white">
                              {plan.teacher}
                            </p>
                            <Pill tone="brand">
                              {plan.subject} · {plan.className}
                            </Pill>
                            {plan.status === 'pending' ? (
                              <Pill tone="amber" dot>
                                Awaiting review
                              </Pill>
                            ) : plan.status === 'approved' ? (
                              <Pill tone="emerald" dot>
                                Approved
                              </Pill>
                            ) : (
                              <Pill tone="rose" dot>
                                Returned
                              </Pill>
                            )}
                          </div>
                          <p className="mt-0.5 text-[11px] text-ink-500 dark:text-ink-400">
                            Submitted {plan.submitted}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <RatingStars rating={plan.quality} />
                        <p className="mt-0.5 text-[10px] text-ink-400">lesson quality</p>
                      </div>
                    </div>

                    <div className="mt-3.5 rounded-2xl border border-ink-200/70 bg-ink-50/70 px-4 py-3 dark:border-white/8 dark:bg-white/[0.03]">
                      <p className="text-[10.5px] font-bold tracking-[0.12em] text-ink-400 uppercase">Topic</p>
                      <p className="mt-1 text-[12.5px] font-semibold text-ink-800 dark:text-ink-100">{plan.topic}</p>
                      {plan.note ? (
                        <p className="mt-1 text-[11px] text-ink-500 dark:text-ink-400">{plan.note}</p>
                      ) : null}
                    </div>

                    {plan.status === 'pending' && !readOnly ? (
                      <div className="mt-3.5 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                          onClick={() => {
                            decideLessonPlan(plan.id, 'approved')
                            pushToast({
                              tone: 'success',
                              title: 'Lesson plan approved',
                              description: `${plan.teacher} · ${plan.subject} ${plan.className}`,
                            })
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          icon={<CornerUpLeft className="h-3.5 w-3.5" />}
                          onClick={() => {
                            decideLessonPlan(plan.id, 'returned')
                            pushToast({
                              tone: 'warning',
                              title: 'Returned for revision',
                              description: `${plan.teacher} asked to add differentiation notes.`,
                            })
                          }}
                        >
                          Return with remarks
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<Eye className="h-3.5 w-3.5" />}
                          onClick={() =>
                            pushToast({
                              tone: 'info',
                              title: 'Plan preview',
                              description: `${plan.topic} · 2 pages with worksheets.`,
                            })
                          }
                        >
                          View full plan
                        </Button>
                      </div>
                    ) : null}
                  </motion.div>
                ))}
              </div>

              <div className="space-y-5">
                <PanelCard
                  title="Review discipline"
                  subtitle="Your scrutiny cadence this month"
                  icon={<BookOpenCheck className="h-4 w-4" />}
                >
                  <div className="space-y-3.5">
                    <DataBar label="Plans reviewed on time" value={38} max={42} tone="emerald" />
                    <DataBar label="Returned for improvement" value={4} max={42} tone="amber" />
                    <DataBar label="Classroom observations done" value={17} max={24} tone="brand" />
                    <DataBar label="Follow-up observations" value={9} max={24} tone="violet" />
                  </div>
                  <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-brand-200/70 bg-brand-50/70 p-3.5 dark:border-brand-500/25 dark:bg-brand-500/10">
                    <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-300" />
                    <p className="text-[11px] leading-relaxed font-medium text-brand-900 dark:text-brand-100">
                      Lesson-plan quality has risen from 3.6 to 4.3 average since weekly submission began in July.
                    </p>
                  </div>
                </PanelCard>

                <PanelCard
                  title="Observation slots"
                  subtitle="Book a classroom visit"
                  icon={<BookOpenCheck className="h-4 w-4" />}
                >
                  <div className="space-y-2">
                    {[
                      { t: 'Class 10-A · Physics', w: 'Today, 09:30' },
                      { t: 'Class 8-B · Hindi', w: 'Tomorrow, 10:15' },
                      { t: 'Class 11-Com · Accountancy', w: 'Fri, 11:00' },
                    ].map((slot) => (
                      <div
                        key={slot.t}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-ink-200/70 px-3.5 py-2.5 dark:border-white/8"
                      >
                        <span className="text-[11.5px] font-semibold text-ink-700 dark:text-ink-200">{slot.t}</span>
                        <Pill tone="brand">{slot.w}</Pill>
                      </div>
                    ))}
                  </div>
                </PanelCard>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Segmented
                    size="sm"
                    value={feedbackFilter}
                    onChange={setFeedbackFilter}
                    options={[
                      { value: 'all', label: `All ${feedback.length}` },
                      {
                        value: 'concern',
                        label: `Concerns ${feedback.filter((f) => f.sentiment === 'concern').length}`,
                      },
                      { value: 'unreplied', label: `Unreplied ${feedback.filter((f) => !f.replied).length}` },
                    ]}
                  />
                </div>

                <AnimatePresence initial={false}>
                  {visibleFeedback.map((f, i) => (
                    <motion.div
                      key={f.id}
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.25) }}
                      className="surface rounded-3xl p-5 transition-colors hover:border-brand-300/70 dark:hover:border-brand-500/35"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <Avatar name={f.parent} size={38} tone={i % 6} />
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
                              {f.parent}
                            </p>
                            <p className="text-[11px] text-ink-500 dark:text-ink-400">{f.child}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <RatingStars rating={f.rating} />
                          <SentimentPill sentiment={f.sentiment} />
                        </div>
                      </div>
                      <p className="mt-3 text-[12.5px] leading-relaxed text-ink-700 dark:text-ink-200">“{f.text}”</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2.5">
                        <Pill tone="slate">{f.topic}</Pill>
                        <span className="font-mono text-[10.5px] text-ink-400">{f.at}</span>
                        {f.replied ? (
                          <Pill tone="emerald" dot>
                            Replied
                          </Pill>
                        ) : (
                          <button
                            disabled={readOnly}
                            onClick={() => {
                              setReplyTarget(f.id)
                              setReplyText('')
                            }}
                            className="press inline-flex items-center gap-1.5 rounded-lg bg-ink-900 px-2.5 py-1 text-[11px] font-bold text-white transition-colors hover:bg-ink-800 disabled:opacity-40 dark:bg-brand-600"
                          >
                            <Reply className="h-3 w-3" /> Reply
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {visibleFeedback.length === 0 ? (
                  <Card className="p-8 text-center">
                    <ThumbsUp className="mx-auto h-7 w-7 text-emerald-500" />
                    <p className="mt-2.5 text-[13.5px] font-bold text-ink-800 dark:text-ink-100">
                      Nothing pending here
                    </p>
                    <p className="mt-1 text-[12px] text-ink-500 dark:text-ink-400">
                      Every parent message in this filter has been answered.
                    </p>
                  </Card>
                ) : null}
              </div>

              <div className="space-y-5">
                <PanelCard
                  title="Parent satisfaction"
                  subtitle={`${feedback.length} verified reviews this month`}
                  icon={<Star className="h-4 w-4" />}
                >
                  <div className="flex items-end gap-4">
                    <div>
                      <p className="text-[34px] leading-none font-extrabold tracking-[-0.045em] tabular text-ink-900 dark:text-white">
                        {avgRating.toFixed(1)}
                      </p>
                      <RatingStars rating={Math.round(avgRating)} />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = feedback.filter((f) => f.rating === star).length
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="w-3 text-[10.5px] font-bold text-ink-400 tabular">{star}</span>
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
                              <motion.div
                                className="h-full rounded-full bg-amber-400"
                                initial={{ width: 0 }}
                                animate={{ width: `${(count / feedback.length) * 100}%` }}
                                transition={{ duration: 0.7 }}
                              />
                            </div>
                            <span className="w-3 text-right text-[10.5px] font-bold tabular text-ink-600 dark:text-ink-300">
                              {count}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="mt-4">
                    <ProgressBar value={92} tone="emerald" showLabel />
                    <p className="mt-1.5 text-[11px] text-ink-400">92% of parents replied within 48 hours this month</p>
                  </div>
                </PanelCard>

                <PanelCard
                  title="Hot topics"
                  subtitle="What parents are writing about"
                  icon={<MessageSquareQuote className="h-4 w-4" />}
                >
                  <div className="space-y-3.5">
                    {['Academics', 'Transport', 'Parent meeting', 'Library', 'Facilities'].map((topic) => {
                      const count = feedback.filter((f) => f.topic === topic).length
                      return (
                        <DataBar
                          key={topic}
                          label={topic}
                          value={count}
                          max={3}
                          tone={count >= 2 ? 'brand' : 'slate'}
                          hint={`${count} msg`}
                        />
                      )
                    })}
                  </div>
                </PanelCard>

                <PanelCard
                  title="Escalations"
                  subtitle="Flagged for the management committee"
                  icon={<AlertTriangle className="h-4 w-4" />}
                >
                  <div className="space-y-2.5">
                    {feedback
                      .filter((f) => f.sentiment === 'concern')
                      .slice(0, 2)
                      .map((f) => (
                        <div
                          key={f.id}
                          className="rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3.5 dark:border-amber-500/25 dark:bg-amber-500/10"
                        >
                          <p className="text-[11.5px] font-bold text-amber-900 dark:text-amber-100">{f.topic}</p>
                          <p className="mt-0.5 text-[11px] leading-relaxed text-amber-800/90 dark:text-amber-200/80">
                            {f.text}
                          </p>
                        </div>
                      ))}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3.5 w-full"
                    icon={<Megaphone className="h-3.5 w-3.5" />}
                    onClick={() =>
                      pushToast({
                        tone: 'info',
                        title: 'Summary prepared for the SMC',
                        description: 'Concern themes compiled into the monthly agenda.',
                      })
                    }
                  >
                    Add to SMC agenda
                  </Button>
                </PanelCard>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Note composer */}
      <NoteModal
        open={noteComposer}
        onClose={() => setNoteComposer(false)}
        onSubmit={(input) => {
          addNote(input)
          pushToast({
            tone: 'success',
            title: 'Note saved',
            description: 'Available on your memo board and command centre.',
          })
        }}
      />

      <NoteModal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        existing={notes.find((n) => n.id === editing) ?? null}
        onSubmit={(input) => {
          if (editing) updateNote(editing, input)
          pushToast({ tone: 'success', title: 'Note updated', description: 'Changes saved.' })
        }}
      />

      {/* Reply modal */}
      <Modal
        open={Boolean(replyTarget)}
        onClose={() => setReplyTarget(null)}
        title="Reply to parent"
        description="Your reply is delivered in the app and logged against the student record."
        footer={
          <>
            <Button variant="ghost" onClick={() => setReplyTarget(null)}>
              Cancel
            </Button>
            <Button
              disabled={replyText.trim().length < 4}
              icon={<Reply className="h-4 w-4" />}
              onClick={() => {
                if (!replyTarget) return
                replyFeedback(replyTarget)
                setReplyTarget(null)
                pushToast({
                  tone: 'success',
                  title: 'Reply sent',
                  description: 'Parent notified in the app · acknowledgement tracked.',
                })
              }}
            >
              Send reply
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {(() => {
            const target = feedback.find((f) => f.id === replyTarget)
            if (!target) return null
            return (
              <div className="rounded-2xl border border-ink-200/80 bg-ink-50/70 p-4 dark:border-white/8 dark:bg-white/[0.03]">
                <p className="text-[12.5px] font-bold text-ink-900 dark:text-white">
                  {target.parent} · {target.child}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-600 dark:text-ink-300">“{target.text}”</p>
              </div>
            )
          })()}
          <div>
            <label className="mb-1.5 block text-[12.5px] font-bold text-ink-700 dark:text-ink-200">Your reply</label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
              placeholder="e.g. Thank you for writing in. The transport in-charge will call you today to adjust the stop timing."
              className="ring-focus w-full resize-none rounded-xl border border-ink-200 bg-white px-3.5 py-3 text-sm font-medium text-ink-900 shadow-sm placeholder:font-normal placeholder:text-ink-400 dark:border-white/12 dark:bg-white/[0.05] dark:text-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              'Thank you for the feedback.',
              'We have informed the concerned department.',
              'Please meet me on Saturday between 10 am and 12 noon.',
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => setReplyText(preset)}
                className="press rounded-xl border border-ink-200/80 px-3 py-1.5 text-[11px] font-semibold text-ink-600 transition-colors hover:border-brand-400 hover:text-brand-700 dark:border-white/10 dark:text-ink-300"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}

/* ------------------------------------------------------------------ */
function NoteModal({
  open,
  onClose,
  onSubmit,
  existing,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (input: { title: string; body: string; tone: NoteTone }) => void
  existing?: { title: string; body: string; tone: NoteTone } | null
}) {
  const [title, setTitle] = useState(existing?.title ?? '')
  const [body, setBody] = useState(existing?.body ?? '')
  const [tone, setTone] = useState<NoteTone>(existing?.tone ?? 'brand')
  const [seeded, setSeeded] = useState(existing?.title ?? '')

  // Re-seed when a different note is opened (render-time state adjustment).
  if (existing && existing.title !== seeded) {
    setSeeded(existing.title)
    setTitle(existing.title)
    setBody(existing.body)
    setTone(existing.tone)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={existing ? 'Edit note' : 'New note'}
      description="Private to your account — pinned notes appear on the command centre."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={title.trim().length < 2}
            onClick={() => {
              onSubmit({ title, body, tone })
              if (!existing) {
                setTitle('')
                setBody('')
              }
              onClose()
            }}
          >
            {existing ? 'Save changes' : 'Save note'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[12.5px] font-bold text-ink-700 dark:text-ink-200">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Points for the staff meeting"
            autoFocus
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[12.5px] font-bold text-ink-700 dark:text-ink-200">Note</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            placeholder="Write the details here…"
            className="ring-focus w-full resize-none rounded-xl border border-ink-200 bg-white px-3.5 py-3 text-sm font-medium text-ink-900 shadow-sm placeholder:font-normal placeholder:text-ink-400 dark:border-white/12 dark:bg-white/[0.05] dark:text-white"
          />
        </div>
        <div>
          <p className="mb-2 text-[12.5px] font-bold text-ink-700 dark:text-ink-200">Colour</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(NOTE_TONES) as NoteTone[]).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                aria-label={`${NOTE_TONES[t].label} note`}
                className={cn(
                  'press h-8 w-8 rounded-xl border-2 transition-transform',
                  NOTE_TONES[t].chip,
                  tone === t
                    ? 'scale-110 border-ink-900 dark:border-white'
                    : 'border-transparent opacity-70 hover:opacity-100',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
