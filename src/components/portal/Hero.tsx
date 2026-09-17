import { motion } from 'framer-motion'
import { ArrowRight, BookOpenCheck, Landmark, PlayCircle, Sparkles, Star, Trophy, Users } from 'lucide-react'
import { Button } from '../ui/Button'
import { Avatar } from '../ui/Form'
import { LiveShowcase } from './LiveShowcase'
import { SCHOOL, STUDENTS } from '../../data/school'

const STATS = [
  { icon: Users, value: '1,363', label: 'Students on campus', sub: 'Classes I – XII' },
  { icon: Trophy, value: '92.6%', label: 'MPBSE XII average', sub: 'Batch of 2025' },
  { icon: Landmark, value: '138', label: 'Teachers & staff', sub: '1:18 teacher ratio' },
  { icon: BookOpenCheck, value: '100%', label: 'Board pass rate', sub: 'Class X & XII, 2025' },
]

const MARQUEE = [
  'CBSE Affiliated · Affiliation No. 1031461 · School Code: 50924',
  'AKS Educational Society · 15-Acre Nature Campus Bhopal',
  'Ranked Among Top CBSE Schools in Bhopal — 2026',
  '100% CBSE Board Pass Rate with Distinctions',
  'Bhopal Sahodaya Complex Member School',
  'Integrated JEE, NEET & CUET Guidance',
  'English Medium Co-educational with Indian Sanskar',
]

export function Hero() {
  return (
    <section id="academics" className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* Editorial backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-lines absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <motion.div
          className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-brand-500/18 blur-[110px]"
          animate={{ scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -top-24 right-0 h-[30rem] w-[30rem] rounded-full bg-violet-accent-500/16 blur-[120px]"
          animate={{ scale: [1.06, 1, 1.06], opacity: [0.7, 0.95, 0.7] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-ink-200/80 bg-white/80 py-1.5 pr-4 pl-1.5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05]"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-2.5 py-1 text-[10.5px] font-bold tracking-[0.14em] text-white uppercase dark:bg-brand-600">
              <Sparkles className="h-3 w-3" /> Session {SCHOOL.session}
            </span>
            <span className="text-[12.5px] font-semibold text-ink-600 dark:text-ink-300">
              Admissions open · 520 seats across 6 pathways
            </span>
          </motion.div>

          <h1 className="mt-7 text-[clamp(2.6rem,7.2vw,4.6rem)] leading-[0.94] font-extrabold tracking-[-0.045em] text-ink-900 dark:text-white">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              A school built
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
            >
              like an{' '}
              <span className="editorial bg-gradient-to-br from-brand-600 via-violet-accent-600 to-brand-500 bg-clip-text pr-2 italic text-transparent">
                institution
              </span>
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              should have been.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="mt-6 max-w-xl text-[16.5px] leading-[1.65] text-balance text-slate-600"
          >
            Fifteen acres in Bilkhiriya, Bhopal. A CBSE curriculum (Affiliation No. 1031461) with integrated JEE, NEET,
            NDA and CUET guidance. And a management system that shows every parent, teacher and trustee exactly what is
            happening — in real time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.38 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button
              size="lg"
              icon={<ArrowRight className="h-4 w-4" />}
              onClick={() => document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Begin an application
            </Button>
            <Button
              size="lg"
              variant="outline"
              icon={<PlayCircle className="h-4 w-4" />}
              onClick={() => document.getElementById('campus')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Tour the campus
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {STUDENTS.slice(0, 5).map((s) => (
                  <Avatar key={s.id} name={s.name} tone={s.tint} size={34} ring />
                ))}
              </div>
              <div className="text-[12.5px] leading-tight">
                <p className="font-bold text-ink-900 dark:text-white">286 parents applied</p>
                <p className="text-ink-500 dark:text-ink-400">across the last 90 days</p>
              </div>
            </div>
            <div className="h-9 w-px bg-ink-200 dark:bg-white/10" />
            <div className="text-[12.5px] leading-tight">
              <p className="flex items-center gap-1 font-bold text-ink-900 dark:text-white">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.9 / 5.0
              </p>
              <p className="text-ink-500 dark:text-ink-400">742 verified parent reviews</p>
            </div>
          </motion.div>
        </div>

        <LiveShowcase />
      </div>

      {/* Stat band */}
      <div className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-ink-200/80 bg-ink-200/70 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10 dark:bg-white/10">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-white px-6 py-6 transition-colors hover:bg-ink-50 dark:bg-ink-950 dark:hover:bg-white/[0.04]"
            >
              <stat.icon className="h-5 w-5 text-brand-600 transition-transform duration-300 group-hover:scale-110 dark:text-brand-400" />
              <p className="mt-4 text-[30px] leading-none font-extrabold tracking-[-0.04em] text-ink-900 tabular dark:text-white">
                {stat.value}
              </p>
              <p className="mt-2 text-[13px] font-bold text-ink-700 dark:text-ink-200">{stat.label}</p>
              <p className="text-[12px] text-ink-500 dark:text-ink-400">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Marquee creds */}
      <div className="relative mt-16 overflow-hidden border-y border-ink-200/70 py-4 dark:border-white/8">
        <div className="animate-marquee flex w-max gap-10 pr-10">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-3 text-[12.5px] font-bold tracking-[0.06em] text-ink-500 uppercase dark:text-ink-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
