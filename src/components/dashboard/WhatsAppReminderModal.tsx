import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Check, CheckCheck, Clock, ShieldCheck, Sparkles } from 'lucide-react'
import { Modal } from '../ui/Overlay'
import { Button } from '../ui/Button'
import { Pill } from '../ui/Badge'
import { inr } from '../../lib/utils'
import type { FeeInvoice } from '../../data/school'

export function WhatsAppReminderModal({
  open,
  onClose,
  invoice,
  onSent,
  isBatch = false,
  batchCount = 14,
  batchTotal = 485000,
}: {
  open: boolean
  onClose: () => void
  invoice: FeeInvoice | null
  onSent?: (invoiceId?: string) => void
  isBatch?: boolean
  batchCount?: number
  batchTotal?: number
}) {
  const [sending, setSending] = useState(false)
  const [delivered, setDelivered] = useState(false)
  const [batchProgress, setBatchProgress] = useState(0)

  const studentName = invoice?.studentName || 'Aarav Mehta'
  const amount = invoice?.amount || 42500
  const term = invoice?.term || 'Term 2 (2026-27)'
  const dueDate = invoice?.dueDate || '2026-09-15'

  const handleSend = () => {
    setSending(true)
    setDelivered(false)

    if (isBatch) {
      let current = 0
      const interval = setInterval(() => {
        current += 1
        setBatchProgress(current)
        if (current >= batchCount) {
          clearInterval(interval)
          setSending(false)
          setDelivered(true)
          onSent?.()
        }
      }, 120)
    } else {
      setTimeout(() => {
        setSending(false)
        setDelivered(true)
        onSent?.(invoice?.id)
      }, 1000)
    }
  }

  const handleReset = () => {
    setDelivered(false)
    setSending(false)
    setBatchProgress(0)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleReset}
      title={isBatch ? 'Smart WhatsApp Fee Assistant · Bulk Dispatch' : `Smart Fee Reminder Assistant · ${studentName}`}
      size="lg"
    >
      <div className="space-y-5 p-5">
        {/* Value Proposition Strip */}
        <div className="flex items-center justify-between rounded-xl bg-emerald-50/80 p-3 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[12px] font-bold">
              {isBatch
                ? `Ready to broadcast smart WhatsApp reminders to ${batchCount} overdue parents`
                : 'Auto-personalized with UPI quick-pay link and official school verification'}
            </span>
          </div>
          <Pill tone="emerald" dot>
            Verified WhatsApp API
          </Pill>
        </div>

        {/* WhatsApp Mobile Mockup */}
        <div className="mx-auto max-w-md overflow-hidden rounded-3xl border border-ink-200 bg-[#EFEAE2] shadow-xl dark:border-white/10 dark:bg-ink-950">
          {/* WhatsApp Header */}
          <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
            <div className="relative grid h-10 w-10 place-items-center rounded-full bg-emerald-700 font-bold text-white text-xs">
              SVM
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-[#075E54]"></span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-[13px] font-bold">Saraswati Vidhya Mandir</span>
                <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-emerald-400 text-[8px] font-black text-[#075E54]">
                  ✓
                </span>
              </div>
              <p className="text-[10px] text-emerald-100/80">Official School Accounts Desk · Verified Business</p>
            </div>
          </div>

          {/* Chat Canvas */}
          <div className="space-y-3 p-4 min-h-[220px]">
            {/* Timestamp Badge */}
            <div className="flex justify-center">
              <span className="rounded-lg bg-white/80 px-2 py-0.5 text-[10px] font-bold text-ink-500 shadow-xs dark:bg-ink-900/80 dark:text-ink-300">
                TODAY
              </span>
            </div>

            {/* Message Bubble */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative ml-auto max-w-[92%] rounded-2xl rounded-tr-xs bg-[#DCF8C6] p-3.5 text-ink-900 shadow-xs dark:bg-emerald-900/40 dark:text-emerald-50"
            >
              <div className="space-y-2 text-[12px] leading-relaxed">
                <p className="font-bold text-[#075E54] dark:text-emerald-300">
                  🏛️ Saraswati Vidhya Mandir Hr Sec School
                </p>
                <p>
                  Respected Guardian,
                  <br />
                  This is a gentle reminder regarding the pending tuition fee for{' '}
                  <strong className="font-bold">{isBatch ? 'your ward' : studentName}</strong> ({term}).
                </p>

                <div className="rounded-xl border border-emerald-300/60 bg-white/70 p-2.5 text-[11px] dark:border-emerald-500/20 dark:bg-ink-900/60">
                  <div className="flex justify-between font-bold">
                    <span>Outstanding Dues:</span>
                    <span className="text-rose-600 dark:text-rose-400">{inr(amount)}</span>
                  </div>
                  <div className="flex justify-between text-ink-500 dark:text-ink-400 text-[10px] mt-0.5">
                    <span>Due Date:</span>
                    <span>{dueDate}</span>
                  </div>
                  <div className="flex justify-between text-ink-500 dark:text-ink-400 text-[10px]">
                    <span>Convenience Charge:</span>
                    <span className="text-emerald-600 font-bold">₹0 (School Covered)</span>
                  </div>
                </div>

                <p className="text-[11px] text-ink-600 dark:text-ink-300">
                  Pay instantly via UPI (GPay, PhonePe, Paytm) to generate the instant digital fee receipt:
                </p>

                <div className="rounded-lg bg-emerald-600/10 p-2 text-center font-bold text-emerald-800 text-[11px] dark:bg-emerald-500/20 dark:text-emerald-200">
                  👉 Tap here to Pay & Download Receipt
                </div>

                <p className="text-[10px] text-ink-400 italic">
                  Note: Please ignore if payment has already been initiated today.
                </p>
              </div>

              {/* Ticks and time */}
              <div className="mt-1 flex items-center justify-end gap-1 text-[9.5px] text-ink-400">
                <span>08:12 AM</span>
                {delivered ? (
                  <CheckCheck className="h-3.5 w-3.5 text-blue-500" />
                ) : sending ? (
                  <Clock className="h-3 w-3 animate-spin text-ink-400" />
                ) : (
                  <Check className="h-3.5 w-3.5 text-ink-400" />
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Batch Progress Bar if batch mode */}
        {isBatch && sending && (
          <div className="space-y-1.5 rounded-xl border border-ink-200 bg-ink-50 p-3 dark:border-white/10 dark:bg-ink-900">
            <div className="flex justify-between text-[11.5px] font-bold">
              <span>Broadcasting WhatsApp reminders…</span>
              <span>
                {batchProgress} / {batchCount} Delivered
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-ink-200 dark:bg-white/10">
              <div
                className="h-full bg-emerald-500 transition-all duration-150"
                style={{ width: `${(batchProgress / batchCount) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-4 dark:border-white/10">
          <div className="flex items-center gap-2 text-[11px] text-ink-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Delivery rate 98.4% · Opt-out compliant</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={sending}
              onClick={handleSend}
              icon={delivered ? <CheckCheck className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              className="bg-emerald-600 hover:bg-emerald-700 shadow-md text-white border-0"
            >
              {delivered
                ? isBatch
                  ? `All ${batchCount} Reminders Dispatched!`
                  : 'Delivered to WhatsApp!'
                : sending
                  ? 'Dispatching via Meta API…'
                  : isBatch
                    ? `Send to All ${batchCount} Overdue Parents (${inr(batchTotal)})`
                    : `Send WhatsApp to Parent (${inr(amount)})`}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
