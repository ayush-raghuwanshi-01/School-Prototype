import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  MessageSquare,
  Send,
  UserCheck,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Field, Input, Select } from '../ui/Form'
import { Eyebrow } from '../ui/Card'
import { useApp } from '../../state/store'
import { cn } from '../../lib/utils'

const STEPS = [
  { icon: ClipboardList, label: 'Enquiry', detail: 'Online form · 4 minutes' },
  { icon: FileCheck2, label: 'Assessment', detail: 'On-campus · 90 minutes' },
  { icon: MessageSquare, label: 'Interaction', detail: 'Child + parent panel' },
  { icon: UserCheck, label: 'Offer letter', detail: 'Within 72 hours' },
]

const FAQ = [
  {
    q: 'What documents are required at the time of admission?',
    a: 'Birth certificate, Aadhaar of the child and both parents, previous two report cards, a transfer certificate and four passport photographs. Everything can be uploaded to the portal — no photocopies needed.',
  },
  {
    q: 'Is the assessment a written entrance test?',
    a: 'For Grades I–VI it is an informal readiness interaction. For Grades VII–XII it is a 90-minute written assessment in English, Mathematics and Science, followed by a short conversation with the child.',
  },
  {
    q: 'How are fee instalments structured?',
    a: 'The annual fee is payable in three termly instalments due on 20 July, 10 September and 15 January. UPI, NEFT and card payments are accepted directly from the parent portal — receipts are instant.',
  },
  {
    q: 'Do you offer transport across the NCR?',
    a: 'Yes. 22 routes cover Kolar Road, MP Nagar, Arera Colony, Bairagarh and Ayodhya Bypass, with live GPS tracking and parent notifications in the app.',
  },
]

export function AdmissionsSection() {
  const { pushToast } = useApp()
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [reference, setReference] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [form, setForm] = useState({
    child: '',
    guardian: '',
    phone: '',
    email: '',
    grade: 'Grade XI — Science Stream',
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // The reference number is minted when the form is submitted — never during
    // render — so repeated renders stay pure.
    const ref = `VG-ADM-${Math.floor(4100 + Math.random() * 800)}`
    setReference(ref)
    window.setTimeout(() => {
      setSubmitting(false)
      setDone(true)
      pushToast({
        tone: 'success',
        title: `Enquiry logged for ${form.child || 'your child'}`,
        description: `${form.grade} · reference ${ref}`,
      })
    }, 1100)
  }

  const valid = form.child.trim().length > 1 && form.guardian.trim().length > 1 && form.phone.trim().length >= 10

  return (
    <section id="admissions" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-lines absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <div>
            <Eyebrow>
              <CalendarDays className="h-3.5 w-3.5" /> Admissions {`2026–27`}
            </Eyebrow>
            <h2 className="mt-4 text-[clamp(2rem,4.4vw,3.1rem)] leading-[1.02] font-extrabold tracking-[-0.04em] text-ink-900 dark:text-white">
              The application,
              <span className="editorial italic text-brand-600 dark:text-brand-400"> end to end. </span>
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
              No broker fees, no waiting rooms. Submit an enquiry and the admissions desk calls you within one working
              day with a slot.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="surface lift relative rounded-2xl p-4 hover:border-brand-300/70 dark:hover:border-brand-500/35"
                >
                  <span className="absolute top-3.5 right-4 font-mono text-[11px] font-bold text-ink-300 dark:text-ink-600">
                    0{i + 1}
                  </span>
                  <s.icon className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
                  <p className="mt-3 text-[13.5px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
                    {s.label}
                  </p>
                  <p className="text-[12px] text-ink-500 dark:text-ink-400">{s.detail}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-9 space-y-2">
              {FAQ.map((item, i) => {
                const open = openFaq === i
                return (
                  <div
                    key={item.q}
                    className={cn(
                      'surface overflow-hidden rounded-2xl transition-colors',
                      open && 'border-brand-300/70 dark:border-brand-500/30',
                    )}
                  >
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="press flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                    >
                      <span className="text-[13.5px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
                        {item.q}
                      </span>
                      <motion.span
                        animate={{ rotate: open ? 45 : 0 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                        className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-500 dark:bg-white/8 dark:text-ink-300"
                      >
                        <span className="text-[15px] leading-none font-bold">+</span>
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-4 text-[13px] leading-relaxed text-ink-600 dark:text-ink-300">
                            {item.a}
                          </p>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Enquiry card */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="surface relative overflow-hidden rounded-[1.9rem] p-6 shadow-[0_36px_90px_-46px_rgb(15_23_42_/_0.5)]">
              <div className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-brand-500/22 blur-3xl" />
              <AnimatePresence mode="wait">
                {!done ? (
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="relative"
                  >
                    <h3 className="text-[19px] font-extrabold tracking-[-0.03em] text-ink-900 dark:text-white">
                      Start an enquiry
                    </h3>
                    <p className="mt-1 text-[12.5px] text-ink-500 dark:text-ink-400">
                      Average response time this week:{' '}
                      <strong className="text-emerald-600 dark:text-emerald-400">3 h 40 m</strong>
                    </p>

                    <div className="mt-5 space-y-4">
                      <Field label="Child’s full name">
                        <Input placeholder="e.g. Naina Bhardwaj" value={form.child} onChange={set('child')} required />
                      </Field>
                      <Field label="Parent / guardian name">
                        <Input placeholder="e.g. Sameer Bhardwaj" value={form.guardian} onChange={set('guardian')} />
                      </Field>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Mobile number" hint="+91">
                          <Input placeholder="98765 43210" value={form.phone} onChange={set('phone')} inputMode="tel" />
                        </Field>
                        <Field label="Email">
                          <Input
                            placeholder="parent@email.com"
                            value={form.email}
                            onChange={set('email')}
                            type="email"
                          />
                        </Field>
                      </div>
                      <Field label="Grade applying for">
                        <Select value={form.grade} onChange={set('grade')}>
                          <optgroup label="Primary">
                            <option>Grade I</option>
                            <option>Grade II</option>
                            <option>Grade IV</option>
                          </optgroup>
                          <optgroup label="Middle">
                            <option>Grade VI</option>
                            <option>Grade VII</option>
                            <option>Grade VIII</option>
                          </optgroup>
                          <optgroup label="Secondary">
                            <option>Grade IX</option>
                            <option>Grade X</option>
                          </optgroup>
                          <optgroup label="Senior Secondary">
                            <option>Grade XI — Science Stream</option>
                            <option>Grade XI — Commerce Stream</option>
                            <option>Grade XI — Humanities Stream</option>
                            <option>Grade XII — Science Stream</option>
                          </optgroup>
                        </Select>
                      </Field>
                    </div>

                    <Button
                      type="submit"
                      className="mt-6 w-full"
                      size="lg"
                      loading={submitting}
                      disabled={!valid}
                      icon={<Send className="h-4 w-4" />}
                    >
                      {submitting ? 'Submitting enquiry…' : 'Submit enquiry'}
                    </Button>
                    <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-400">
                      Your details are stored only in this prototype — nothing is transmitted.
                    </p>
                  </motion.form>
                ) : (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="relative py-6 text-center"
                  >
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 20 }}
                      className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                    >
                      <CheckCircle2 className="h-8 w-8" />
                    </motion.span>
                    <h3 className="mt-5 text-[19px] font-extrabold tracking-[-0.03em] text-ink-900 dark:text-white">
                      Enquiry received
                    </h3>
                    <p className="mx-auto mt-2 max-w-xs text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
                      Thanks, {form.guardian || 'there'}. The admissions desk will call{' '}
                      <strong className="text-ink-700 dark:text-ink-200">{form.phone || 'your number'}</strong> within
                      one working day to schedule the {form.grade} assessment.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                      <PillMock label={`Ref ${reference}`} />
                      <PillMock label={form.grade} />
                    </div>
                    <Button
                      variant="outline"
                      className="mt-6"
                      onClick={() => {
                        setDone(false)
                        setForm({ child: '', guardian: '', phone: '', email: '', grade: 'Grade XI — Science Stream' })
                      }}
                    >
                      Submit another enquiry
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="surface mt-4 flex items-center gap-3 rounded-2xl p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-900 text-white dark:bg-brand-600">
                <ArrowRight className="h-4.5 w-4.5" />
              </span>
              <p className="text-[12.5px] leading-relaxed font-medium text-ink-600 dark:text-ink-300">
                Already applied? Track your application status in the parent portal — stage updates land as push
                notifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function PillMock({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-ink-200/80 bg-ink-50 px-3 py-1.5 font-mono text-[11px] font-semibold text-ink-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-ink-300">
      {label}
    </span>
  )
}
