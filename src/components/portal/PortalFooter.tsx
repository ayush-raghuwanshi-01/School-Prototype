import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, ThumbsUp, GraduationCap, Camera, Briefcase, Mail, MapPin, Phone, Play } from 'lucide-react'
import { SCHOOL } from '../../data/school'
import { Button } from '../ui/Button'
import { Input } from '../ui/Form'
import { useApp } from '../../state/store'

const COLUMNS = [
  {
    title: 'Academics',
    links: ['Primary Wing', 'Middle Wing', 'Secondary Wing', 'Science Stream', 'Commerce Stream', 'Humanities Stream'],
  },
  {
    title: 'Admissions',
    links: ['Application process', 'Fee structure', 'Scholarships', 'Transport routes', 'Transfer certificate', 'FAQ'],
  },
  {
    title: 'Institution',
    links: ['About SVM', 'Leadership', 'Faculty directory', 'Mandatory disclosure', 'Careers', 'Press kit'],
  },
]

export function PortalFooter() {
  const { setRoute } = useApp()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  return (
    <footer className="relative overflow-hidden border-t border-ink-200/70 bg-white dark:border-white/8 dark:bg-ink-950">
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-[24rem] w-[24rem] rounded-full bg-brand-500/10 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="leading-none">
                <span className="block text-[15px] font-extrabold tracking-[-0.03em] text-slate-900">
                  Riverton Valley School
                </span>
                <span className="block text-[9.5px] font-bold tracking-[0.2em] text-emerald-700 uppercase">
                  CBSE Affiliated · Bhopal
                </span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-slate-600">
              {SCHOOL.tagline} An institution built on measurable transparency — for students, parents and the faculty
              who teach them. Managed by AKS Educational Society Bhopal.
            </p>

            <div className="mt-6 space-y-2.5 text-[12.5px] text-ink-600 dark:text-ink-300">
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" />
                {SCHOOL.campus}
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" />
                {SCHOOL.phone}
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" />
                {SCHOOL.email}
              </p>
              <p className="flex items-center gap-2.5">
                <Clock className="h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" />
                Office: Mon – Sat, 8:00 am – 4:30 pm
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2">
              {[Camera, ThumbsUp, Briefcase, Play].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-ink-200/80 bg-ink-50 text-ink-500 transition-colors hover:border-brand-300 hover:text-brand-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-300 dark:hover:border-brand-500/40 dark:hover:text-brand-400"
                  aria-label="Social profile"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-[11px] font-bold tracking-[0.16em] text-ink-400 uppercase">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-600 transition-colors hover:text-brand-600 dark:text-ink-300 dark:hover:text-brand-400"
                      >
                        {link}
                        <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 rounded-3xl border border-ink-200/80 bg-ink-50/80 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-white/[0.03]">
          <div>
            <p className="text-[15px] font-bold tracking-[-0.02em] text-ink-900 dark:text-white">
              The SVM Bulletin — monthly, no spam.
            </p>
            <p className="mt-1 text-[12.5px] text-ink-500 dark:text-ink-400">
              Board results, campus projects and admission deadlines. Unsubscribe in one click.
            </p>
          </div>
          <form
            className="flex w-full max-w-sm items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              setSubscribed(true)
            }}
          >
            <Input
              type="email"
              required
              placeholder="parent@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant={subscribed ? 'success' : 'primary'} className="shrink-0">
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </Button>
          </form>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink-200/70 pt-7 sm:flex-row dark:border-white/8">
          <p className="text-[11.5px] text-slate-500">
            © 2026 Riverton Valley School · AKS Educational Society Bhopal. {SCHOOL.affiliation}. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-[11.5px] text-slate-500">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="transition-colors hover:text-ink-700 dark:hover:text-ink-200"
            >
              Privacy policy
            </a>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="transition-colors hover:text-ink-700 dark:hover:text-ink-200"
            >
              Anti-bullying policy
            </a>
            <button
              onClick={() => setRoute('dashboard')}
              className="press font-bold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400"
            >
              Staff console →
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
