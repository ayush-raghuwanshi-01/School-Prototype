import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgeIndianRupee,
  BellRing,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Download,
  FileText,
  Receipt,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { Card, Eyebrow } from '../../ui/Card'
import { FeePill, Pill, type Tone } from '../../ui/Badge'
import { Button, IconButton } from '.././../ui/Button'
import { Avatar, Field, Input, Segmented, Select } from '../../ui/Form'
import { Modal } from '../../ui/Overlay'
import { EmptyState, SkeletonTable } from '../../ui/Skeleton'
import { useApp, useSimulatedLoad } from '../../../state/store'
import type { FeeInvoice, FeeStatus } from '../../../data/school'
import { cn, formatDate, inr } from '../../../lib/utils'

type Filter = 'all' | FeeStatus
type SortKey = 'name' | 'amount' | 'dueDate'

export function FeesView() {
  const { invoices, recordPayment, pushToast, role } = useApp()
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('name')
  const [selection, setSelection] = useState<string[]>([])
  const [payTarget, setPayTarget] = useState<FeeInvoice | null>(null)
  const [detail, setDetail] = useState<FeeInvoice | null>(null)
  const loading = useSimulatedLoad(filter, 520)
  const readOnly = role.id === 'parent'

  // Support the ⌘K / quick-action "record a payment" deep link.
  useEffect(() => {
    const open = () => {
      const firstUnpaid = invoices.find((i) => i.status !== 'paid')
      if (firstUnpaid) setPayTarget(firstUnpaid)
    }
    document.addEventListener('svm:open-payment', open)
    return () => document.removeEventListener('svm:open-payment', open)
  }, [invoices])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = invoices.filter((inv) => {
      const matchesFilter = filter === 'all' || inv.status === filter
      const matchesQuery =
        !q ||
        inv.studentName.toLowerCase().includes(q) ||
        inv.id.toLowerCase().includes(q) ||
        inv.term.toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
    return filtered.sort((a, b) => {
      if (sort === 'name') return a.studentName.localeCompare(b.studentName)
      if (sort === 'amount') return b.amount - a.amount
      return a.dueDate.localeCompare(b.dueDate)
    })
  }, [filter, invoices, query, sort])

  const totals = useMemo(() => {
    const paid = invoices.filter((i) => i.status === 'paid')
    const pending = invoices.filter((i) => i.status === 'pending')
    const overdue = invoices.filter((i) => i.status === 'overdue')
    const sum = (arr: FeeInvoice[]) => arr.reduce((a, b) => a + b.amount, 0)
    return {
      collected: sum(paid),
      pending: sum(pending),
      overdue: sum(overdue),
      paidCount: paid.length,
      pendingCount: pending.length,
      overdueCount: overdue.length,
      rate: (paid.length / invoices.length) * 100,
    }
  }, [invoices])

  const counts = {
    all: invoices.length,
    paid: totals.paidCount,
    pending: totals.pendingCount,
    overdue: totals.overdueCount,
  }

  const toggleSelect = (id: string) =>
    setSelection((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const allVisibleSelected = rows.length > 0 && rows.every((r) => selection.includes(r.id))

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>
            <BadgeIndianRupee className="h-3.5 w-3.5" /> Finance module
          </Eyebrow>
          <h1 className="mt-2.5 text-[clamp(1.6rem,3vw,2.15rem)] leading-tight font-extrabold tracking-[-0.04em] text-ink-900 dark:text-white">
            Fees & invoicing
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500 dark:text-ink-400">
            Term-2 invoicing · payment reconciliation runs nightly at 11:45 pm IST.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Pill tone="emerald" dot>
            {totals.rate.toFixed(1)}% settled
          </Pill>
          <Button
            size="sm"
            variant="outline"
            icon={<Download className="h-3.5 w-3.5" />}
            onClick={() =>
              pushToast({
                tone: 'info',
                title: 'Ledger export queued',
                description: 'Term-2 fee ledger (XLSX) will download shortly.',
              })
            }
          >
            Export ledger
          </Button>
          <Button
            size="sm"
            disabled={readOnly}
            icon={<Receipt className="h-3.5 w-3.5" />}
            onClick={() => {
              const firstUnpaid = invoices.find((i) => i.status !== 'paid')
              if (firstUnpaid) setPayTarget(firstUnpaid)
            }}
          >
            Record payment
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Collected · Term 2',
            value: inr(totals.collected),
            icon: Wallet,
            tone: 'emerald' as Tone,
            sub: `${totals.paidCount} invoices settled`,
          },
          {
            label: 'Awaiting payment',
            value: inr(totals.pending),
            icon: CreditCard,
            tone: 'amber' as Tone,
            sub: `${totals.pendingCount} invoices due 10 Sep`,
          },
          {
            label: 'Overdue',
            value: inr(totals.overdue),
            icon: BellRing,
            tone: 'rose' as Tone,
            sub: `${totals.overdueCount} invoices past due`,
          },
          {
            label: 'Avg. settlement time',
            value: '6.4 days',
            icon: TrendingUp,
            tone: 'brand' as Tone,
            sub: 'Down from 9.1 days last term',
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="surface lift rounded-3xl p-5 hover:border-brand-300/60 dark:hover:border-brand-500/30"
          >
            <span
              className={cn(
                'grid h-9 w-9 place-items-center rounded-xl',
                s.tone === 'emerald' && 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
                s.tone === 'amber' && 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
                s.tone === 'rose' && 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
                s.tone === 'brand' && 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
              )}
            >
              <s.icon className="h-4.5 w-4.5" />
            </span>
            <p className="mt-3.5 text-[11.5px] font-semibold text-ink-500 dark:text-ink-400">{s.label}</p>
            <p className="mt-1 text-[20px] leading-none font-extrabold tracking-[-0.04em] tabular text-ink-900 dark:text-white">
              {s.value}
            </p>
            <p className="mt-2 text-[11px] text-ink-400">{s.sub}</p>
          </motion.div>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-200/70 p-4 dark:border-white/8">
          <Segmented
            value={filter}
            onChange={(v) => {
              setFilter(v)
              setSelection([])
            }}
            options={[
              { value: 'all', label: `All ${counts.all}` },
              { value: 'paid', label: `Paid ${counts.paid}` },
              { value: 'pending', label: `Pending ${counts.pending}` },
              { value: 'overdue', label: `Overdue ${counts.overdue}` },
            ]}
          />
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search student, invoice no…"
                className="h-10 w-full pl-9 text-[12.5px] sm:w-64"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-10 pl-9 text-[12.5px] sm:w-44"
              >
                <option value="name">Sort: Student</option>
                <option value="amount">Sort: Amount</option>
                <option value="dueDate">Sort: Due date</option>
              </Select>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {selection.length > 0 ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-brand-200/70 bg-brand-50/70 dark:border-brand-500/25 dark:bg-brand-500/10"
            >
              <div className="flex flex-wrap items-center gap-3 px-4 py-2.5">
                <Pill tone="brand">{selection.length} selected</Pill>
                <p className="flex-1 text-[12px] font-semibold text-brand-800 dark:text-brand-200">
                  Total outstanding:{' '}
                  {inr(invoices.filter((i) => selection.includes(i.id)).reduce((a, b) => a + b.amount, 0))}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<BellRing className="h-3.5 w-3.5" />}
                  onClick={() => {
                    pushToast({
                      tone: 'success',
                      title: `Reminders sent to ${selection.length} guardians`,
                      description: 'WhatsApp + email, scheduled for 9:00 am tomorrow.',
                    })
                    setSelection([])
                  }}
                >
                  Send reminders
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelection([])}>
                  Clear
                </Button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {loading ? (
          <div className="p-4">
            <SkeletonTable rows={7} cols={5} />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title={`No ${filter === 'all' ? '' : filter} invoices found`}
            description={
              query
                ? `Nothing matches “${query}” in this filter. Try a different student name or invoice number.`
                : 'Every invoice in this category has been settled. Nice work.'
            }
            action={
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setQuery('')
                  setFilter('all')
                }}
              >
                Reset filters
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse">
              <thead>
                <tr className="border-b border-ink-200/70 bg-ink-50/60 text-left dark:border-white/8 dark:bg-white/[0.02]">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={() => setSelection(allVisibleSelected ? [] : rows.map((r) => r.id))}
                      className="h-4 w-4 cursor-pointer rounded border-ink-300 accent-brand-600"
                      aria-label="Select all visible"
                    />
                  </th>
                  {['Student', 'Invoice', 'Term', 'Amount', 'Due date', 'Status', ''].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-[10.5px] font-bold tracking-[0.12em] text-ink-400 uppercase whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {rows.map((inv, i) => (
                    <motion.tr
                      key={inv.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.25) }}
                      className={cn(
                        'group border-b border-ink-100 transition-colors last:border-0 dark:border-white/5',
                        selection.includes(inv.id)
                          ? 'bg-brand-50/60 dark:bg-brand-500/10'
                          : 'hover:bg-ink-50/80 dark:hover:bg-white/[0.03]',
                      )}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selection.includes(inv.id)}
                          onChange={() => toggleSelect(inv.id)}
                          className="h-4 w-4 cursor-pointer rounded border-ink-300 accent-brand-600"
                          aria-label={`Select ${inv.studentName}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={inv.studentName} tone={i % 6} size={32} />
                          <div className="min-w-0">
                            <p className="truncate text-[12.5px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
                              {inv.studentName}
                            </p>
                            <p className="text-[10.5px] text-ink-400">
                              Class {inv.classId} · {inv.studentId.slice(-3)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setDetail(inv)}
                          className="press font-mono text-[11.5px] font-semibold text-brand-700 underline decoration-dotted underline-offset-4 transition-colors hover:text-brand-800 dark:text-brand-300"
                        >
                          {inv.id}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-[12px] font-medium whitespace-nowrap text-ink-600 dark:text-ink-300">
                        {inv.term}
                      </td>
                      <td className="px-4 py-3 text-[12.5px] font-bold tabular whitespace-nowrap text-ink-900 dark:text-white">
                        {inr(inv.amount)}
                      </td>
                      <td className="px-4 py-3 text-[12px] whitespace-nowrap text-ink-500 dark:text-ink-400">
                        {formatDate(inv.dueDate, {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <FeePill status={inv.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {inv.status === 'paid' ? (
                            <button
                              onClick={() => setDetail(inv)}
                              className="press inline-flex h-8 items-center gap-1.5 rounded-lg border border-ink-200/80 px-2.5 text-[11.5px] font-bold text-ink-600 transition-colors hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:text-ink-300 dark:hover:border-emerald-500/40 dark:hover:text-emerald-400"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" /> Receipt
                            </button>
                          ) : (
                            <button
                              disabled={readOnly}
                              onClick={() => setPayTarget(inv)}
                              className="press inline-flex h-8 items-center gap-1.5 rounded-lg bg-ink-900 px-2.5 text-[11.5px] font-bold text-white transition-colors hover:bg-ink-800 disabled:opacity-40 dark:bg-brand-600 dark:hover:bg-brand-500"
                            >
                              <Receipt className="h-3.5 w-3.5" /> Record
                            </button>
                          )}
                          <IconButton
                            label={`Open ${inv.id}`}
                            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={() => setDetail(inv)}
                          >
                            <ChevronDown className="h-3.5 w-3.5 -rotate-90" />
                          </IconButton>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-200/70 px-4 py-3 dark:border-white/8">
          <p className="text-[11.5px] font-medium text-ink-400">
            Showing {rows.length} of {invoices.length} invoices · {totals.overdueCount} overdue need follow-up
          </p>
          <div className="flex items-center gap-2">
            <Pill tone="emerald" dot>
              {inr(totals.collected)} collected
            </Pill>
            <Pill tone="rose" dot>
              {inr(totals.overdue)} overdue
            </Pill>
          </div>
        </div>
      </Card>

      <PaymentModal
        key={payTarget?.id ?? 'none'}
        invoice={payTarget}
        onClose={() => setPayTarget(null)}
        onSubmit={recordPayment}
      />
      <InvoiceDrawer
        invoice={detail}
        onClose={() => setDetail(null)}
        onRecord={(inv) => {
          setDetail(null)
          setPayTarget(inv)
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
function PaymentModal({
  invoice,
  onClose,
  onSubmit,
}: {
  invoice: FeeInvoice | null
  onClose: () => void
  onSubmit: (id: string, method: NonNullable<FeeInvoice['method']>, amount: number) => void
}) {
  const { pushToast } = useApp()
  const [method, setMethod] = useState<NonNullable<FeeInvoice['method']>>('UPI')
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [partial, setPartial] = useState(false)
  const [loadedId, setLoadedId] = useState<string | null>(null)

  // Whenever a different invoice is opened, re-seed the form. React's
  // documented "adjust state during render" pattern keeps this out of an
  // effect, so there are no cascading renders.
  if (invoice && invoice.id !== loadedId) {
    setLoadedId(invoice.id)
    setAmount(String(invoice.amount))
    setMethod('UPI')
    setPartial(false)
  }

  if (!invoice) return null

  const numeric = Number(amount.replace(/[^\d]/g, '')) || 0

  const submit = () => {
    setSubmitting(true)
    window.setTimeout(() => {
      onSubmit(invoice.id, method, numeric)
      setSubmitting(false)
      onClose()
      pushToast({
        tone: 'success',
        title: `Payment recorded · ${inr(numeric)}`,
        description: `${invoice.studentName} · ${invoice.term} · ${method} · receipt RCPT/26/${Math.floor(9000 + Math.random() * 900)}`,
      })
    }, 900)
  }

  return (
    <Modal
      open={Boolean(invoice)}
      onClose={onClose}
      title="Record a fee payment"
      description={`${invoice.id} · ${invoice.studentName} · Class ${invoice.classId}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={submitting} disabled={numeric <= 0} onClick={submit} icon={<Receipt className="h-4 w-4" />}>
            {submitting ? 'Posting…' : `Confirm ${inr(numeric)}`}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink-200/80 bg-ink-50/70 p-4 dark:border-white/8 dark:bg-white/[0.03]">
          <Avatar name={invoice.studentName} size={44} tone={2} />
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
              {invoice.studentName}
            </p>
            <p className="text-[11.5px] text-ink-500 dark:text-ink-400">
              {invoice.term} · due {formatDate(invoice.dueDate)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold text-ink-400">Outstanding</p>
            <p className="text-[17px] font-extrabold tabular text-ink-900 dark:text-white">{inr(invoice.amount)}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-ink-200/80 p-4 dark:border-white/8">
          <p className="text-[11px] font-bold tracking-[0.14em] text-ink-400 uppercase">Fee head breakdown</p>
          <ul className="mt-3 space-y-2">
            {invoice.heads.map((h, i) => (
              <motion.li
                key={h.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-between text-[12.5px]"
              >
                <span className="font-medium text-ink-600 dark:text-ink-300">{h.label}</span>
                <span className="font-bold tabular text-ink-900 dark:text-white">{inr(h.amount)}</span>
              </motion.li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-dashed border-ink-200 pt-3 text-[13px] dark:border-white/10">
            <span className="font-bold text-ink-700 dark:text-ink-200">Total payable</span>
            <span className="font-extrabold tabular text-ink-900 dark:text-white">{inr(invoice.amount)}</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Payment method">
            <Select value={method} onChange={(e) => setMethod(e.target.value as NonNullable<FeeInvoice['method']>)}>
              <option value="UPI">UPI · GPay / PhonePe</option>
              <option value="NEFT">NEFT / RTGS transfer</option>
              <option value="Card">Debit / credit card</option>
              <option value="Cash">Cash at counter</option>
              <option value="Cheque">Cheque / DD</option>
            </Select>
          </Field>
          <Field label="Amount received" hint={partial ? 'Partial allowed' : 'Full settlement'}>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ''))}
              inputMode="numeric"
              disabled={!partial}
            />
          </Field>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-ink-200/80 px-4 py-3 dark:border-white/8">
          <div>
            <p className="text-[12.5px] font-bold text-ink-800 dark:text-ink-100">Recording a partial payment?</p>
            <p className="text-[11px] text-ink-500 dark:text-ink-400">
              Balance will stay pending against this invoice.
            </p>
          </div>
          <button
            onClick={() => {
              setPartial((p) => !p)
              setAmount(partial ? String(invoice.amount) : '')
            }}
            className={cn(
              'press h-9 shrink-0 rounded-xl px-3.5 text-[12px] font-bold transition-colors',
              partial
                ? 'bg-amber-500 text-ink-900'
                : 'border border-ink-200 text-ink-600 hover:bg-ink-100 dark:border-white/12 dark:text-ink-300 dark:hover:bg-white/8',
            )}
          >
            {partial ? 'Partial mode on' : 'Enable partial'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {[invoice.amount, Math.round(invoice.amount / 2), Math.round(invoice.amount / 3)].map((v, i) => (
            <button
              key={v}
              onClick={() => {
                setPartial(true)
                setAmount(String(v))
              }}
              className="press rounded-xl border border-ink-200/80 px-3 py-1.5 text-[11.5px] font-bold text-ink-600 transition-colors hover:border-brand-400 hover:text-brand-700 dark:border-white/10 dark:text-ink-300 dark:hover:border-brand-500/40 dark:hover:text-brand-300"
            >
              {i === 0 ? 'Full' : i === 1 ? 'Half' : 'Instalment'} · {inr(v)}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}

/* ------------------------------------------------------------------ */
function InvoiceDrawer({
  invoice,
  onClose,
  onRecord,
}: {
  invoice: FeeInvoice | null
  onClose: () => void
  onRecord: (inv: FeeInvoice) => void
}) {
  const { pushToast } = useApp()
  return (
    <AnimatePresence>
      {invoice ? (
        <div key="invoice-drawer" className="fixed inset-0 z-[92]">
          <motion.div
            className="absolute inset-0 bg-ink-950/50 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-lg flex-col border-l border-ink-200/80 bg-white dark:border-white/10 dark:bg-ink-900"
          >
            <div className="flex items-start justify-between gap-4 border-b border-ink-200/70 px-6 py-5 dark:border-white/8">
              <div>
                <p className="font-mono text-[11.5px] font-bold text-brand-700 dark:text-brand-300">{invoice.id}</p>
                <h2 className="mt-1 text-[17px] font-extrabold tracking-[-0.02em] text-ink-900 dark:text-white">
                  {invoice.studentName}
                </h2>
                <p className="text-[12px] text-ink-500 dark:text-ink-400">
                  Class {invoice.classId} · {invoice.term}
                </p>
              </div>
              <FeePill status={invoice.status} />
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { k: 'Invoice amount', v: inr(invoice.amount) },
                  { k: 'Due date', v: formatDate(invoice.dueDate) },
                  {
                    k: 'Paid on',
                    v: invoice.paidOn ? formatDate(invoice.paidOn) : '—',
                  },
                  { k: 'Method', v: invoice.method ?? 'Pending' },
                ].map((row) => (
                  <div key={row.k} className="rounded-2xl border border-ink-200/80 px-4 py-3 dark:border-white/8">
                    <p className="text-[10.5px] font-bold tracking-[0.12em] text-ink-400 uppercase">{row.k}</p>
                    <p className="mt-1 text-[13.5px] font-bold tabular text-ink-900 dark:text-white">{row.v}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-ink-200/80 p-4 dark:border-white/8">
                <p className="text-[11px] font-bold tracking-[0.14em] text-ink-400 uppercase">Ledger timeline</p>
                <div className="relative mt-4 space-y-4 pl-1">
                  <span className="absolute top-2 bottom-4 left-[7px] w-px bg-ink-200 dark:bg-white/10" />
                  {[
                    {
                      t: 'Invoice generated',
                      d: formatDate('2026-07-01'),
                      done: true,
                    },
                    {
                      t: 'Reminder sent to guardian',
                      d: formatDate('2026-08-01'),
                      done: true,
                    },
                    {
                      t: 'Payment received',
                      d: invoice.paidOn ? formatDate(invoice.paidOn) : 'Awaiting',
                      done: invoice.status === 'paid',
                    },
                    {
                      t: 'Receipt issued',
                      d: invoice.receiptNo ?? 'Awaiting',
                      done: invoice.status === 'paid',
                    },
                  ].map((step, i) => (
                    <motion.div
                      key={step.t}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="relative flex gap-3.5"
                    >
                      <span
                        className={cn(
                          'relative z-10 mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-white dark:ring-ink-900',
                          step.done ? 'bg-emerald-500' : 'bg-ink-300 dark:bg-white/20',
                        )}
                      />
                      <div>
                        <p className="text-[12.5px] font-bold text-ink-900 dark:text-white">{step.t}</p>
                        <p className="font-mono text-[11px] text-ink-400">{step.d}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-ink-900 p-4 text-white dark:bg-brand-600">
                <p className="text-[12px] font-semibold text-white/70">Guardian contact</p>
                <p className="mt-0.5 text-[13.5px] font-bold">Rakesh Mehta · +91 98110 44219</p>
                <p className="text-[11.5px] text-white/70">rakesh.mehta@gmail.com · preferred language: Hindi</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-ink-200/70 bg-ink-50/60 px-6 py-4 dark:border-white/8 dark:bg-white/[0.02]">
              <Button
                variant="outline"
                onClick={() =>
                  pushToast({
                    tone: 'info',
                    title: 'Invoice PDF prepared',
                    description: `${invoice.id} · 2 pages · shared to email.`,
                  })
                }
              >
                Download PDF
              </Button>
              {invoice.status !== 'paid' ? (
                <Button onClick={() => onRecord(invoice)} icon={<Receipt className="h-4 w-4" />}>
                  Record payment
                </Button>
              ) : (
                <Button
                  variant="success"
                  onClick={() =>
                    pushToast({
                      tone: 'success',
                      title: 'Receipt re-sent',
                      description: `${invoice.receiptNo} emailed to the guardian.`,
                    })
                  }
                >
                  Re-send receipt
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
