import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { mulberry32 } from '../../lib/utils'

export interface CelebrationPayload {
  x?: number
  y?: number
  message?: string
}

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  rotation: number
  delay: number
  duration: number
  height: number
  borderRadius: string
}

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#7C3AED', '#EC4899', '#06B6D4', '#F43F5E']

function generateParticles(): Particle[] {
  const prng = mulberry32(42)
  return Array.from({ length: 36 }).map((_, i) => {
    const r1 = prng()
    const r2 = prng()
    const r3 = prng()
    const r4 = prng()
    const r5 = prng()
    const r6 = prng()
    const angle = (i / 36) * 360 + (r1 * 20 - 10)
    const dist = 70 + r2 * 110
    const rad = (angle * Math.PI) / 180
    const size = 6 + r3 * 8
    return {
      id: i,
      x: Math.cos(rad) * dist,
      y: Math.sin(rad) * dist - 25,
      color: COLORS[Math.floor(r4 * COLORS.length)],
      size,
      rotation: r5 * 360,
      delay: r6 * 0.08,
      duration: 1.1 + r1 * 0.4,
      height: size * (r2 > 0.5 ? 1.5 : 1),
      borderRadius: r3 > 0.4 ? '9999px' : '2px',
    }
  })
}

const STATIC_PARTICLES = generateParticles()

export function CelebrationBurst({
  payload,
  onComplete,
}: {
  payload: CelebrationPayload | null
  onComplete: () => void
}) {
  useEffect(() => {
    if (!payload) return
    const timer = setTimeout(() => {
      onComplete()
    }, 1800)

    return () => clearTimeout(timer)
  }, [payload, onComplete])

  if (!payload) return null

  const originX = payload.x ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 400)
  const originY = payload.y ?? (typeof window !== 'undefined' ? window.innerHeight / 2 : 300)

  return (
    <div className="pointer-events-none fixed inset-0 z-[120] overflow-hidden">
      {/* Center Toast / Badge if message exists */}
      <AnimatePresence>
        {payload.message ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: originY - 40, x: originX }}
            animate={{ opacity: 1, scale: 1, y: originY - 70, x: originX }}
            exit={{ opacity: 0, scale: 0.8, y: originY - 90 }}
            transition={{ type: 'spring', damping: 14, stiffness: 220 }}
            style={{ transform: 'translateX(-50%)' }}
            className="absolute rounded-full border border-emerald-400/40 bg-emerald-600 px-5 py-2 font-bold text-white shadow-2xl backdrop-blur-md"
          >
            <span className="flex items-center gap-2 text-sm">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-xs font-black text-emerald-600">
                ✓
              </span>
              {payload.message}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Confetti particles */}
      <div style={{ position: 'absolute', left: originX, top: originY }}>
        {STATIC_PARTICLES.map((p) => (
          <motion.span
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.2, rotate: 0 }}
            animate={{
              x: p.x,
              y: p.y + 70, // gravity drop
              opacity: 0,
              scale: [0.2, 1.2, 0.8, 0],
              rotate: p.rotation + 360,
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: [0.18, 0.89, 0.32, 1.28],
            }}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.height,
              borderRadius: p.borderRadius,
              backgroundColor: p.color,
              boxShadow: `0 0 8px ${p.color}66`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
