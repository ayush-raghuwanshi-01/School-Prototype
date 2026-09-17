import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, MessageSquareQuote, Pause, Play, Quote, Star } from 'lucide-react'
import { TESTIMONIALS } from '../../data/school'
import { Avatar } from '../ui/Form'
import { Eyebrow } from '../ui/Card'
import { cn } from '../../lib/utils'

const AUTOPLAY_MS = 6200

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [playing, setPlaying] = useState(true)

  const go = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1)
      setIndex((next + TESTIMONIALS.length) % TESTIMONIALS.length)
    },
    [index],
  )

  const next = useCallback(() => go((index + 1) % TESTIMONIALS.length), [go, index])
  const prev = useCallback(() => go((index - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), [go, index])

  // Autoplay is a single timer per slide — the progress rail is animated by
  // Framer Motion rather than re-rendering the carousel every frame.
  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => {
      setDirection(1)
      setIndex((i) => (i + 1) % TESTIMONIALS.length)
    }, AUTOPLAY_MS)
    return () => window.clearTimeout(timer)
    // `index` re-arms the timer for the next slide after every transition.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, index])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const active = TESTIMONIALS[index]

  return (
    <section
      id="voices"
      className="relative overflow-hidden border-y border-ink-200/70 bg-ink-900 py-20 sm:py-28 dark:border-white/8 dark:bg-ink-950"
    >
      <div className="pointer-events-none absolute inset-0 noise opacity-[0.035]" />
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[26rem] w-[26rem] rounded-full bg-brand-500/20 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-32 right-1/5 h-[24rem] w-[24rem] rounded-full bg-violet-accent-500/20 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow className="text-ink-400">
              <MessageSquareQuote className="h-3.5 w-3.5" /> Voices from campus
            </Eyebrow>
            <h2 className="mt-4 text-[clamp(2rem,4.4vw,3.1rem)] leading-[1.02] font-extrabold tracking-[-0.04em] text-white">
              Parents, alumni and faculty
              <span className="editorial italic text-brand-400"> in their own words.</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? 'Pause autoplay' : 'Resume autoplay'}
              className="press ring-focus inline-flex h-10 items-center gap-2 rounded-xl border border-white/12 bg-white/[0.06] px-3.5 text-[12.5px] font-bold text-ink-200 transition-colors hover:bg-white/[0.12] hover:text-white"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {playing ? 'Autoplay on' : 'Autoplay off'}
            </button>
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="press ring-focus grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/[0.06] text-ink-200 transition-colors hover:bg-white/[0.12] hover:text-white"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="press ring-focus grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/[0.06] text-ink-200 transition-colors hover:bg-white/[0.12] hover:text-white"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-12">
          {/* Main quote stage */}
          <div className="relative min-h-[330px] sm:min-h-[300px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.blockquote
                key={active.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 42, filter: 'blur(6px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: direction * -42, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <Quote className="h-9 w-9 text-brand-500/45" />
                <p className="mt-5 text-[clamp(1.25rem,2.4vw,1.85rem)] leading-[1.45] font-medium tracking-[-0.02em] text-balance text-ink-100">
                  {active.quote}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Avatar name={active.name} tone={active.tint} size={48} />
                  <div>
                    <p className="text-[14.5px] font-bold text-white">{active.name}</p>
                    <p className="text-[12.5px] text-ink-400">
                      {active.role} · {active.meta}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 sm:ml-auto">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                      >
                        <Star
                          className={cn(
                            'h-4 w-4',
                            i < active.rating ? 'fill-amber-400 text-amber-400' : 'text-ink-600',
                          )}
                        />
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* Selector rail */}
          <div className="space-y-2">
            {TESTIMONIALS.map((t, i) => {
              const isActive = i === index
              return (
                <button
                  key={t.id}
                  onClick={() => go(i)}
                  className={cn(
                    'press ring-focus group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border px-3.5 py-3 text-left transition-all duration-300',
                    isActive
                      ? 'border-brand-500/60 bg-white/[0.08]'
                      : 'border-white/8 bg-white/[0.025] hover:border-white/16 hover:bg-white/[0.06]',
                  )}
                >
                  <Avatar name={t.name} tone={t.tint} size={34} />
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn('block truncate text-[12.5px] font-bold', isActive ? 'text-white' : 'text-ink-300')}
                    >
                      {t.name}
                    </span>
                    <span className="block truncate text-[11px] text-ink-500">{t.role}</span>
                  </span>
                  {isActive && playing ? (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden bg-white/12">
                      <motion.span
                        key={`progress-${index}`}
                        className="block h-full bg-brand-500"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                      />
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      'h-1.5 w-1.5 shrink-0 rounded-full transition-colors',
                      isActive ? 'bg-brand-500' : 'bg-ink-600 group-hover:bg-ink-400',
                    )}
                  />
                </button>
              )
            })}

            <div className="mt-4 flex items-center gap-2 pl-1">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => go(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={cn(
                    'press h-1.5 rounded-full transition-all duration-300',
                    i === index ? 'w-8 bg-brand-500' : 'w-3 bg-white/22 hover:bg-white/40',
                  )}
                />
              ))}
              <span className="ml-2 text-[11px] font-bold tracking-[0.1em] text-ink-500 tabular">
                {String(index + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
