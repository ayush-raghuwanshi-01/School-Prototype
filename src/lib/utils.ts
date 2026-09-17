import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* ------------------------------------------------------------------ *
 * Deterministic pseudo-randomness — keeps mock data stable across
 * renders while still feeling organic.
 * ------------------------------------------------------------------ */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Indian digit grouping: 1250000 -> "12,50,000" */
export function groupIndian(value: number, fractionDigits = 0) {
  const fixed = Math.abs(value).toFixed(fractionDigits)
  const [whole, decimal] = fixed.split('.')
  const lastThree = whole.slice(-3)
  const rest = whole.slice(0, -3)
  const grouped = rest ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${lastThree}` : lastThree
  return `${value < 0 ? '-' : ''}${grouped}${decimal ? `.${decimal}` : ''}`
}

export function inr(value: number, fractionDigits = 0) {
  return `₹${groupIndian(value, fractionDigits)}`
}

/** Compact Indian currency: 1,24,00,000 -> "₹1.24 Cr" */
export function inrCompact(value: number) {
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''
  if (abs >= 1_00_00_000) return `${sign}₹${(abs / 1_00_00_000).toFixed(2)} Cr`
  if (abs >= 1_00_000) return `${sign}₹${(abs / 1_00_000).toFixed(2)} L`
  if (abs >= 1_000) return `${sign}₹${(abs / 1_000).toFixed(1)}K`
  return `${sign}₹${groupIndian(abs)}`
}

export function pct(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`
}

export function formatDate(
  iso: string,
  opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' },
) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', opts)
}

export function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0])
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function average(nums: number[]) {
  if (!nums.length) return 0
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

export function gradeFor(percent: number) {
  if (percent >= 91) return 'A1'
  if (percent >= 81) return 'A2'
  if (percent >= 71) return 'B1'
  if (percent >= 61) return 'B2'
  if (percent >= 51) return 'C1'
  if (percent >= 41) return 'C2'
  return 'D'
}

export const GRADES = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D'] as const
export type Grade = (typeof GRADES)[number]

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
