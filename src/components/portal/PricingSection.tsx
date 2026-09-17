import { motion } from 'framer-motion'
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap, HelpCircle } from 'lucide-react'
import { Button } from '../ui/Button'

const PLANS = [
  {
    id: 'starter',
    name: 'Foundation Campus',
    badge: 'Single Campus',
    description:
      'Perfect for established single-campus schools looking to eliminate manual registers & paper receipts.',
    pricePerStudent: '₹18',
    billedInfo: 'per student / month · billed annually',
    studentRange: 'Up to 500 Students',
    popular: false,
    features: [
      'Digital Attendance & Daily Roll Calls',
      'Fee Invoicing & UPI Collection Gateway',
      'Student Information System (SIS)',
      'Basic Report Card Generation',
      'SMS Notifications to Parents',
      'Standard Admin & Teacher Roles',
    ],
    cta: 'Select Foundation Plan',
  },
  {
    id: 'growth',
    name: 'Growth Institution',
    badge: 'Most Popular for K-12',
    description: 'The complete intelligent school ERP with AI attendance insights, WhatsApp reminders, and parent app.',
    pricePerStudent: '₹28',
    billedInfo: 'per student / month · billed annually',
    studentRange: '500 – 2,000 Students',
    popular: true,
    features: [
      'Everything in Foundation, plus:',
      'AI Attendance Leakage Radar & Dropout Alerts',
      'Smart WhatsApp Fee Assistant with 1-Click Pay Links',
      'Parent Mobile App & Teacher Direct Chat',
      'SmartGate RFID & Facial Biometric Integration',
      'CBSE / State Board Report Card Engine with AI Remarks',
      'Exam Cell Marks Moderation & Analytics',
      'Dedicated Account Manager & Staff Onboarding',
    ],
    cta: 'Start 30-Day Free Trial',
  },
  {
    id: 'enterprise',
    name: 'Institution Group',
    badge: 'Multi-Branch & Trusts',
    description: 'For educational trusts, multi-campus institutions, and large senior secondary academies.',
    pricePerStudent: '₹38',
    billedInfo: 'per student / month · custom trust billing',
    studentRange: '2,000+ Students or Multi-Campus',
    popular: false,
    features: [
      'Everything in Growth, plus:',
      'Multi-Branch Consolidated Command Centre',
      'Inter-Campus Staff Roster & Substitution Manager',
      'Custom Board Disclosure & Compliance Audits (RTE/POCSO)',
      'Custom ERP API & Tally ERP Accounting Sync',
      'Biometric Turnstile Hardware Provisioning Support',
      '24/7 Priority Emergency Helpdesk SLA',
    ],
    cta: 'Request Trust Quote',
  },
]

export function PricingSection({ onBookDemo }: { onBookDemo: () => void }) {
  return (
    <section
      id="pricing"
      className="relative border-t border-ink-200/70 bg-ink-50/60 py-24 dark:border-white/8 dark:bg-ink-950/60"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50/90 px-3.5 py-1 text-[11px] font-bold text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300">
            <Sparkles className="h-3.5 w-3.5" /> Transparent Institution Pricing
          </div>
          <h2 className="mt-4 text-[clamp(2rem,4vw,2.8rem)] font-extrabold tracking-tight text-ink-900 dark:text-white leading-tight">
            Clear, predictable plans built for Indian schools.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-500 dark:text-ink-400">
            No surprise setup fees. No hidden per-SMS charges. Scales comfortably with your student enrollment while
            recovering fees up to 35% faster.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3 items-stretch">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col rounded-3xl p-6 sm:p-8 transition-all ${
                plan.popular
                  ? 'border-2 border-brand-500 bg-white shadow-2xl ring-4 ring-brand-500/10 dark:bg-ink-900'
                  : 'border border-ink-200/80 bg-white/70 shadow-sm dark:border-white/10 dark:bg-ink-900/60'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-600 to-violet-accent-600 px-4 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-md">
                  Most Popular for K-12
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-[19px] font-extrabold text-ink-900 dark:text-white">{plan.name}</h3>
                  <span className="rounded-lg bg-ink-100 px-2 py-0.5 text-[10.5px] font-bold text-ink-600 dark:bg-white/10 dark:text-ink-300">
                    {plan.studentRange}
                  </span>
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500 dark:text-ink-400">{plan.description}</p>

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-1.5 border-t border-ink-100 pt-6 dark:border-white/8">
                  <span className="text-[36px] font-black tracking-tight text-ink-900 dark:text-white">
                    {plan.pricePerStudent}
                  </span>
                  <span className="text-[12px] font-medium text-ink-400">{plan.billedInfo}</span>
                </div>

                {/* Features list */}
                <div className="mt-6 space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400">Included Features:</p>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5 text-[12.5px]">
                      <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5 dark:bg-emerald-500/20 dark:text-emerald-400">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                      <span className="font-medium text-ink-700 dark:text-ink-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-ink-100 pt-6 dark:border-white/8">
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  className={`w-full justify-center ${plan.popular ? 'bg-brand-600 hover:bg-brand-700 shadow-lg' : ''}`}
                  onClick={onBookDemo}
                  icon={<ArrowRight className="h-4 w-4" />}
                >
                  {plan.cta}
                </Button>
                <p className="mt-2 text-center text-[10.5px] text-ink-400">
                  Free 30-day proof of concept · Full data migration assisted
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust & Guarantee footnote */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-ink-200/60 bg-white/50 p-4 text-center text-[12px] text-ink-600 dark:border-white/8 dark:bg-ink-900/40 dark:text-ink-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>ISO 27001 Data Encryption & Daily Encrypted Backups</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <span>Go-live in 48 hours with past marks & student records imported</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-brand-500" />
            <span>Dedicated WhatsApp Teacher Support Group</span>
          </div>
        </div>
      </div>
    </section>
  )
}
