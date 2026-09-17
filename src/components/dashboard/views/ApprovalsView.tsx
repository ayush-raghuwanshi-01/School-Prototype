import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgeCheck,
  CheckCheck,
  ClipboardList,
  FileText,
  Filter,
  IndianRupee,
  Info,
  ScrollText,
  Search,
  ShieldCheck,
  Truck,
  UserMinus,
  X,
} from 'lucide-react'
import { Card, Eyebrow } from '../../ui/Card'
import { Pill, type Tone } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { Avatar, Input, Segmented } from '../../ui/Form'
import { Modal } from '../../ui/Overlay'
import { EmptyState, SkeletonList } from '../../ui/Skeleton'
import { PanelCard, PriorityPill } from '../Panels'
import { useApp, useSimulatedLoad } from '../../../state/store'
import type { Approval, ApprovalKind } from '../../../data/school'
import { cn, formatDate, inr } from '../../../lib/utils'

const KIND_META: Record<ApprovalKind, { icon: typeof FileText; tone: Tone; blurb: string }> = {
  Leave: { icon: UserMinus, tone: 'brand', blurb: 'Staff leave & duty adjustment' },
  Expense: { icon: IndianRupee, tone: 'amber', blurb: 'Reimbursement claim' },
  Certificate: { icon: ScrollText, tone: 'slate', blurb: 'Student certificate issuance' },
  Purchase: { icon: ClipboardList, tone: 'violet', blurb: 'Purchase indents & quotations' },
  'Fee waiver': { icon: BadgeCheck, tone: 'emerald', blurb: 'Concession under management norms' },
  Transport: { icon: Truck, tone: 'cyan', blurb: 'Route, timing and fleet changes' },
}

type FilterKey = 'all' | ApprovalKind

export function ApprovalsView() {
  const { approvals, decideApproval, decideAllApprovals, decisions, pushToast, role } = useApp()
  const [filter, setFilter] = useState<FilterKey>('all')
  const [query, setQuery] = useState('')
  const [rejectTarget, setRejectTarget] = useState<Approval | null>(null)
  const [remark, setRemark] = useState('')
  const loading = useSimulatedLoad(filter, 540)
  const readOnly = !role.views.includes('approvals')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return approvals.filter((a) => {
      const matchKind = filter === 'all' || a.kind === filter
      const matchQuery =
        !q ||
        a.requester.toLowerCase().includes(q) ||
        a.detail.toLowerCase().includes(q) ||
        a.kind.toLowerCase().includes(q)
      return matchKind && matchQuery
    })
  }, [approvals, filter, query])

  const counts = useMemo(() => {
    const map = new Map<ApprovalKind | 'all', number>()
    map.set('all', approvals.length)
    approvals.forEach((a) => map.set(a.kind, (map.get(a.kind) ?? 0) + 1))
    return map
  }, [approvals])

  const moneyPending = approvals.filter((a) => a.amount).reduce((sum, a) => sum + (a.amount ?? 0), 0)
  const highPriority = approvals.filter((a) => a.priority === 'high').length

  const approve = (a: Approval) => {
    decideApproval(a.id, 'approved')
    pushToast({
      tone: 'success',
      title: `${a.kind} approved · ${a.requester.split(' ')[0]}`,
      description: a.amount
        ? `${inr(a.amount)} sanctioned and posted to the ledger.`
        : 'Request closed with an audit entry.',
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>
            <ShieldCheck className="h-3.5 w-3.5" /> Approval workflow
          </Eyebrow>
          <h1 className="mt-2.5 text-[clamp(1.6rem,3vw,2.15rem)] leading-tight font-extrabold tracking-[-0.04em] text-ink-900 dark:text-white">
            Approvals & sanctions
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500 dark:text-ink-400">
            Leave, purchases, certificates and concessions routed to the Principal’s desk.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Pill tone="rose" dot>
            {highPriority} urgent
          </Pill>
          <Pill tone="violet">{inr(moneyPending)} financial approvals pending</Pill>
          {approvals.length > 0 && !readOnly ? (
            <Button
              size="sm"
              variant="outline"
              icon={<CheckCheck className="h-3.5 w-3.5" />}
              onClick={() => {
                decideAllApprovals('approved')
                pushToast({
                  tone: 'success',
                  title: `${approvals.length} requests approved in bulk`,
                  description: 'Requester notifications sent · signed PDFs queued.',
                })
              }}
            >
              Approve all visible
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Awaiting decision',
            value: String(approvals.length),
            sub: 'Across 6 request types',
            tone: 'brand' as Tone,
            icon: ClipboardList,
          },
          {
            label: 'Financial value',
            value: inr(moneyPending),
            sub: 'Purchases, claims & waivers',
            tone: 'violet' as Tone,
            icon: IndianRupee,
          },
          {
            label: 'Decided this week',
            value: '37',
            sub: 'Average turnaround 9 h 20 m',
            tone: 'emerald' as Tone,
            icon: BadgeCheck,
          },
          { label: 'SLA breaches', value: '2', sub: 'Purchase indent since 12 Sep', tone: 'rose' as Tone, icon: Info },
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
                kpi.tone === 'violet' &&
                  'bg-violet-accent-50 text-violet-accent-600 dark:bg-violet-accent-500/15 dark:text-violet-accent-400',
                kpi.tone === 'emerald' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
                kpi.tone === 'rose' && 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
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

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search requester, amount or reason…"
              className="pl-9"
            />
          </div>
          <Segmented
            size="sm"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: `All ${counts.get('all') ?? 0}` },
              ...(Object.keys(KIND_META) as ApprovalKind[]).map((k) => ({
                value: k,
                label: `${k} ${counts.get(k) ?? 0}`,
              })),
            ]}
          />
        </div>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-3">
          {loading ? (
            <SkeletonList rows={6} />
          ) : rows.length === 0 ? (
            <Card>
              <EmptyState
                icon={<BadgeCheck className="h-6 w-6 text-emerald-500" />}
                title={approvals.length === 0 ? 'All caught up — inbox zero' : 'No requests in this filter'}
                description={
                  approvals.length === 0
                    ? 'Every leave, purchase, certificate and waiver request has been decided. New requests will land here automatically with an SLA timer.'
                    : 'Try another request type, or clear the search to see the full queue.'
                }
                action={
                  approvals.length === 0 ? (
                    <Pill tone="emerald" dot>
                      Average turnaround this week: 9 h 20 m
                    </Pill>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setFilter('all')
                        setQuery('')
                      }}
                    >
                      Clear filters
                    </Button>
                  )
                }
              />
            </Card>
          ) : (
            <AnimatePresence initial={false}>
              {rows.map((a, i) => {
                const meta = KIND_META[a.kind]
                const overdue = a.sla.toLowerCase().includes('overdue')
                return (
                  <motion.div
                    key={a.id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.25), ease: [0.22, 1, 0.36, 1] }}
                    className="surface overflow-hidden rounded-3xl p-4.5 transition-colors hover:border-brand-300/70 dark:hover:border-brand-500/35"
                  >
                    <div className="flex flex-wrap items-start gap-4">
                      <span
                        className={cn(
                          'grid h-11 w-11 shrink-0 place-items-center rounded-2xl',
                          meta.tone === 'brand' &&
                            'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
                          meta.tone === 'violet' &&
                            'bg-violet-accent-50 text-violet-accent-600 dark:bg-violet-accent-500/15 dark:text-violet-accent-400',
                          meta.tone === 'emerald' &&
                            'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
                          meta.tone === 'amber' &&
                            'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
                          meta.tone === 'cyan' && 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-300',
                          meta.tone === 'slate' && 'bg-ink-100 text-ink-500 dark:bg-white/8 dark:text-ink-300',
                        )}
                      >
                        <meta.icon className="h-5 w-5" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[14px] font-bold tracking-[-0.015em] text-ink-900 dark:text-white">
                            {a.requester}
                          </p>
                          <Pill tone={meta.tone}>{a.kind}</Pill>
                          <PriorityPill priority={a.priority} />
                          {overdue ? (
                            <Pill tone="rose" dot>
                              SLA breached
                            </Pill>
                          ) : null}
                        </div>
                        <p className="mt-0.5 text-[11.5px] font-medium text-ink-500 dark:text-ink-400">
                          {a.role} · submitted {a.submitted}
                        </p>
                        <p className="mt-2 text-[12.5px] leading-relaxed text-ink-600 dark:text-ink-300">{a.detail}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          {a.amount ? (
                            <span className="inline-flex items-center gap-1.5 rounded-xl bg-ink-100 px-2.5 py-1 text-[12px] font-extrabold tabular text-ink-800 dark:bg-white/8 dark:text-white">
                              <IndianRupee className="h-3.5 w-3.5" />
                              {inr(a.amount)}
                            </span>
                          ) : null}
                          <span className="font-mono text-[10.5px] text-ink-400">{a.sla}</span>
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col gap-2">
                        <Button
                          size="sm"
                          disabled={readOnly}
                          onClick={() => approve(a)}
                          icon={<BadgeCheck className="h-3.5 w-3.5" />}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={readOnly}
                          onClick={() => {
                            setRejectTarget(a)
                            setRemark('')
                          }}
                          icon={<X className="h-3.5 w-3.5" />}
                        >
                          Return
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>

        <div className="space-y-5">
          <PanelCard
            title="Decision policy"
            subtitle="Normative turnaround times set by the SMC"
            icon={<ShieldCheck className="h-4 w-4" />}
          >
            <div className="space-y-2.5">
              {[
                { k: 'Leave — up to 3 days', v: '1 working day' },
                { k: 'Purchase indent', v: '₹25,000 without tender' },
                { k: 'Fee waiver', v: 'Management committee ratification' },
                { k: 'Certificate issuance', v: 'Same day, dues must be clear' },
                { k: 'Transport change', v: 'Parent consent + route capacity' },
              ].map((row) => (
                <div
                  key={row.k}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-ink-200/70 px-3.5 py-2.5 dark:border-white/8"
                >
                  <span className="text-[11.5px] font-semibold text-ink-700 dark:text-ink-200">{row.k}</span>
                  <span className="shrink-0 text-[11px] font-bold text-brand-700 dark:text-brand-300">{row.v}</span>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard
            title="This week’s throughput"
            subtitle="Decisions taken by the office"
            icon={<BadgeCheck className="h-4 w-4" />}
          >
            <div className="space-y-3.5">
              {[
                { label: 'Approved', value: 29, max: 37, tone: 'emerald' as Tone },
                { label: 'Returned for correction', value: 5, max: 37, tone: 'amber' as Tone },
                { label: 'Rejected', value: 3, max: 37, tone: 'rose' as Tone },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="font-semibold text-ink-600 dark:text-ink-300">{row.label}</span>
                    <span className="font-bold tabular text-ink-900 dark:text-white">{row.value}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-white/10">
                    <motion.div
                      className={cn(
                        'h-full rounded-full',
                        row.tone === 'emerald'
                          ? 'bg-emerald-500'
                          : row.tone === 'amber'
                            ? 'bg-amber-500'
                            : 'bg-rose-500',
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${(row.value / row.max) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-ink-200/70 bg-ink-50/70 p-3.5 dark:border-white/8 dark:bg-white/[0.03]">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" />
              <p className="text-[11px] leading-relaxed font-medium text-ink-600 dark:text-ink-300">
                Every decision writes an immutable audit entry with the approver name, timestamp and remarks — ready for
                SMC and DEO inspection.
              </p>
            </div>
          </PanelCard>

          <PanelCard
            title="Recent decisions"
            subtitle={
              decisions.length ? `${decisions.length} entries written this session` : 'Audit log · last four entries'
            }
            icon={<Filter className="h-4 w-4" />}
          >
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {(() => {
                  const seeded = [
                    {
                      id: 'seed-1',
                      who: 'Anil Deshpande',
                      what: 'Leave approved · 1 day',
                      at: 'Today, 9:40 am',
                      decision: 'approved' as const,
                    },
                    {
                      id: 'seed-2',
                      who: 'Accounts office',
                      what: 'Expense ₹8,400 sanctioned',
                      at: 'Today, 8:55 am',
                      decision: 'approved' as const,
                    },
                    {
                      id: 'seed-3',
                      who: 'Front office',
                      what: 'Bonafide certificate issued',
                      at: 'Yesterday',
                      decision: 'approved' as const,
                    },
                    {
                      id: 'seed-4',
                      who: 'Transport cell',
                      what: 'Route 12 timing revised',
                      at: 'Yesterday',
                      decision: 'approved' as const,
                    },
                  ]
                  return [...decisions.slice(0, 4), ...seeded].slice(0, 4)
                })().map((row, i) => (
                  <motion.div
                    key={row.id}
                    layout
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.05, 0.2) }}
                    className="flex items-start gap-3"
                  >
                    <Avatar name={row.who} size={30} tone={row.who.length % 6} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-bold text-ink-900 dark:text-white">{row.who}</p>
                      <p className="text-[11px] text-ink-500 dark:text-ink-400">{row.what}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="font-mono text-[10px] text-ink-400">{row.at}</span>
                      <Pill tone={row.decision === 'approved' ? 'emerald' : 'rose'}>
                        {row.decision === 'approved' ? 'Approved' : 'Returned'}
                      </Pill>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </PanelCard>
        </div>
      </div>

      {/* Return modal */}
      <Modal
        open={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        title="Return request with remarks"
        description={rejectTarget ? `${rejectTarget.kind} · ${rejectTarget.requester}` : ''}
        footer={
          <>
            <Button variant="ghost" onClick={() => setRejectTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={remark.trim().length < 4}
              onClick={() => {
                if (!rejectTarget) return
                decideApproval(rejectTarget.id, 'rejected', remark)
                pushToast({
                  tone: 'warning',
                  title: `${rejectTarget.kind} returned`,
                  description: `${rejectTarget.requester} will see your remarks in the app.`,
                })
                setRejectTarget(null)
              }}
            >
              Return request
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {rejectTarget ? (
            <div className="rounded-2xl border border-ink-200/80 bg-ink-50/70 p-4 dark:border-white/8 dark:bg-white/[0.03]">
              <p className="text-[12.5px] font-bold text-ink-900 dark:text-white">{rejectTarget.requester}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-ink-600 dark:text-ink-300">{rejectTarget.detail}</p>
              <p className="mt-2 font-mono text-[10.5px] text-ink-400">
                {rejectTarget.role} · submitted {rejectTarget.submitted} · {rejectTarget.sla}
              </p>
            </div>
          ) : null}
          <div>
            <label className="mb-1.5 block text-[12.5px] font-bold text-ink-700 dark:text-ink-200">
              Remarks for the requester
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={4}
              placeholder="e.g. Please attach two comparative quotations before resubmitting."
              className="ring-focus w-full resize-none rounded-xl border border-ink-200 bg-white px-3.5 py-3 text-sm font-medium text-ink-900 shadow-sm placeholder:font-normal placeholder:text-ink-400 dark:border-white/12 dark:bg-white/[0.05] dark:text-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              'Attach comparative quotations',
              'Submit medical certificate',
              'Clear pending dues first',
              'Take SMC approval',
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => setRemark(preset)}
                className="press rounded-xl border border-ink-200/80 px-3 py-1.5 text-[11.5px] font-semibold text-ink-600 transition-colors hover:border-brand-400 hover:text-brand-700 dark:border-white/10 dark:text-ink-300 dark:hover:border-brand-500/40"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <p className="pb-14 text-[11px] text-ink-400">
        Approvals module · {formatDate('2026-09-16')} · routed by role, escalated after 24 hours of inactivity
      </p>
    </div>
  )
}
