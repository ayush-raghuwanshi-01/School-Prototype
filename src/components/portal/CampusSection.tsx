import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bus,
  Dumbbell,
  FlaskConical,
  Library,
  Microscope,
  Music4,
  Snowflake,
  Sparkles,
  Trees,
  UtensilsCrossed,
  Wifi,
} from 'lucide-react'
import { INITIATIVES } from '../../data/school'
import { Eyebrow } from '../ui/Card'
import { ProgressBar } from '../ui/Form'
import { Pill, type Tone } from '../ui/Badge'
import { cn } from '../../lib/utils'

const FACILITIES = [
  { icon: Microscope, label: 'Tata Innovation Lab', detail: 'Robotics, 3D printing & AI studio' },
  { icon: FlaskConical, label: '11 laboratories', detail: 'Physics, chemistry, biology, CS' },
  { icon: Library, label: '42,000-volume library', detail: 'Open till 7 pm, JSTOR access' },
  { icon: Dumbbell, label: 'Athletics arena', detail: '400 m track, 2 cricket nets' },
  { icon: Music4, label: 'Performing arts block', detail: 'Recording studio & black box' },
  { icon: UtensilsCrossed, label: 'Two dining halls', detail: 'FSSAI-audited, nut-free options' },
  { icon: Bus, label: '22 bus routes', detail: 'Live GPS in the parent app' },
  { icon: Wifi, label: '1:2 device ratio', detail: 'Fibre campus, filtered internet' },
  { icon: Trees, label: '11-acre green campus', detail: 'Solar-augmented, 61% offset' },
  { icon: Snowflake, label: 'Fully air-conditioned', detail: 'Classrooms & labs' },
]

const GALLERY = [
  { id: 'g1', src: '/campus-innovation-lab.jpg', title: 'The Innovation Lab', tag: 'STEM' },
  { id: 'g2', src: '/campus-commons.jpg', title: 'Senior Commons', tag: 'Campus life' },
  { id: 'g3', src: '/campus-library.jpg', title: 'Reading Wing', tag: 'Library' },
]

export function CampusSection() {
  const [active, setActive] = useState(GALLERY[0].id)
  const current = GALLERY.find((g) => g.id === active)!

  return (
    <section id="campus" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Eyebrow>
              <Trees className="h-3.5 w-3.5" /> The campus
            </Eyebrow>
            <h2 className="mt-4 text-[clamp(2rem,4.2vw,2.9rem)] leading-[1.03] font-extrabold tracking-[-0.04em] text-ink-900 dark:text-white">
              Eleven acres,
              <span className="editorial italic text-violet-accent-600 dark:text-violet-accent-400">
                {' '}
                deliberately built.{' '}
              </span>
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
              We designed the buildings around the timetable, not the other way round. Every wing has its own lab, its
              own common room and a quiet room that nobody books meetings in.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { k: '11.4', v: 'acre campus' },
                { k: '96', v: 'air-conditioned rooms' },
                { k: '22', v: 'bus routes' },
                { k: '61%', v: 'energy offset' },
              ].map((s, i) => (
                <motion.div
                  key={s.v}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl border border-ink-200/80 bg-white/60 px-4 py-3.5 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <p className="text-[22px] leading-none font-extrabold tracking-[-0.04em] text-ink-900 tabular dark:text-white">
                    {s.k}
                  </p>
                  <p className="mt-1 text-[11.5px] font-semibold text-ink-500 dark:text-ink-400">{s.v}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-9 space-y-4">
              <p className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-ink-400 uppercase">
                <Sparkles className="h-3.5 w-3.5" /> Works in progress
              </p>
              {INITIATIVES.map((init, i) => (
                <motion.div
                  key={init.id}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="surface lift rounded-2xl p-4 hover:border-brand-300/60 dark:hover:border-brand-500/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[13.5px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
                        {init.title}
                      </p>
                      <p className="mt-0.5 text-[12px] leading-relaxed text-ink-500 dark:text-ink-400">{init.detail}</p>
                    </div>
                    <Pill tone={init.tone as Tone}>{init.progress}%</Pill>
                  </div>
                  <ProgressBar value={init.progress} tone={init.tone as Tone} className="mt-3" />
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            {/* Interactive gallery */}
            <div className="surface relative overflow-hidden rounded-[1.9rem] p-2.5 shadow-[0_36px_90px_-46px_rgb(15_23_42_/_0.5)]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink-200 dark:bg-white/8">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={current.id}
                    src={current.src}
                    alt={current.title}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                  <div>
                    <Pill tone="brand" className="border-white/20 bg-white/15 text-white backdrop-blur-md">
                      {current.tag}
                    </Pill>
                    <p className="mt-2 text-[19px] font-extrabold tracking-[-0.03em] text-white">{current.title}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {GALLERY.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setActive(g.id)}
                        aria-label={`Show ${g.title}`}
                        className={cn(
                          'press h-1.5 rounded-full transition-all duration-300',
                          g.id === active ? 'w-7 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/70',
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2.5 p-2.5 pt-3">
                {GALLERY.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setActive(g.id)}
                    className={cn(
                      'press overflow-hidden rounded-2xl border transition-all duration-300',
                      g.id === active
                        ? 'border-brand-500 ring-2 ring-brand-500/25'
                        : 'border-transparent opacity-70 hover:opacity-100',
                    )}
                  >
                    <img src={g.src} alt={g.title} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
              {FACILITIES.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 6) * 0.05 }}
                  className="group flex items-start gap-3 rounded-2xl border border-ink-200/70 bg-white/55 px-3.5 py-3 backdrop-blur-sm transition-colors hover:border-brand-300/70 hover:bg-white dark:border-white/8 dark:bg-white/[0.03] dark:hover:border-brand-500/30 dark:hover:bg-white/[0.06]"
                >
                  <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 transition-transform duration-300 group-hover:scale-110 dark:text-brand-400" />
                  <span>
                    <span className="block text-[12.5px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
                      {f.label}
                    </span>
                    <span className="block text-[11.5px] text-ink-500 dark:text-ink-400">{f.detail}</span>
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
