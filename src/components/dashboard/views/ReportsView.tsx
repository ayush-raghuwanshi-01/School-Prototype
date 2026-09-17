import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Building2,
  CheckCircle2,
  Clock,
  Download,
  FileBarChart,
  FileText,
  Gauge,
  Languages,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Card, CardHeader, Eyebrow } from '../../ui/Card'
import { Pill, type Tone } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import { ProgressBar } from '../../ui/Form'
import { SkeletonList } from '../../ui/Skeleton'
import { ACTIVITY_FEED } from '../../../data/school'
import { useApp, useSimulatedLoad } from '../../../state/store'
import { cn } from '../../../lib/utils'

const REPORTS = [
  {
    id: 'r1',
    title: 'Term-2 fee reconciliation',
    detail: 'Ledger, ageing buckets and defaulter list',
    format: 'XLSX',
    size: '412 KB',
    tone: 'emerald' as Tone,
    ready: true,
  },
  {
    id: 'r2',
    title: 'Consolidated attendance register',
    detail: 'Class-wise, April – September 2026',
    format: 'PDF',
    size: '1.8 MB',
    tone: 'brand' as Tone,
    ready: true,
  },
  {
    id: 'r3',
    title: 'MPBSE mandatory disclosure 2026–27',
    detail: 'Board-mandated public disclosure format',
    format: 'PDF',
    size: '860 KB',
    tone: 'violet' as Tone,
    ready: true,
  },
  {
    id: 'r4',
    title: 'Mid-term result analysis',
    detail: 'Section averages, toppers and gap analysis',
    format: 'PDF',
    size: '2.4 MB',
    tone: 'amber' as Tone,
    ready: false,
  },
  {
    id: 'r5',
    title: 'Transport & safety audit',
    detail: 'Route loads, GPS compliance, driver KYC',
    format: 'XLSX',
    size: '228 KB',
    tone: 'cyan' as Tone,
    ready: true,
  },
  {
    id: 'r6',
    title: 'Faculty workload & appraisal sheet',
    detail: 'Period load, substitutions, appraisal status',
    format: 'PDF',
    size: '1.1 MB',
    tone: 'rose' as Tone,
    ready: false,
  },
]

const COMPLIANCE = [
  { label: 'MPBSE recognition validity', value: 'Till 31 Mar 2029', ok: true, icon: ShieldCheck },
  { label: 'Fire safety certificate', value: 'Renewed 04 Aug 2026', ok: true, icon: Building2 },
  { label: 'POCSO committee constituted', value: '6 members · meets monthly', ok: true, icon: ShieldCheck },
  { label: 'Teacher-pupil ratio (RTE)', value: '1:14 · above norm', ok: true, icon: Gauge },
  { label: 'Board result upload', value: 'Pending board portal window', ok: false, icon: FileText },
  { label: 'Medium of instruction audit', value: 'Full compliance', ok: true, icon: Languages },
]

export function ReportsView() {
  const { pushToast } = useApp()
  const [generating, setGenerating] = useState<string | null>(null)
  const loading = useSimulatedLoad('reports', 620)

  const generate = (id: string, title: string) => {
    setGenerating(id)
    window.setTimeout(() => {
      setGenerating(null)
      pushToast({ tone: 'success', title: 'Report ready', description: `${title} generated and shared to your inbox.` })
    }, 1400)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>
            <FileBarChart className="h-3.5 w-3.5" /> Reporting & compliance
          </Eyebrow>
          <h1 className="mt-2.5 text-[clamp(1.6rem,3vw,2.15rem)] leading-tight font-extrabold tracking-[-0.04em] text-ink-900 dark:text-white">
            Reports, audits & disclosures
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500 dark:text-ink-400">
            Every artefact the board, parents and auditors ask for — generated from live records.
          </p>
        </div>
        <Pill tone="emerald" dot>
          5 of 6 reports current
        </Pill>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <CardHeader
            compact
            title="Report library"
            subtitle="Scheduled and on-demand exports"
            right={<Download className="h-4 w-4 text-ink-400" />}
          />
          {loading ? (
            <SkeletonList rows={5} />
          ) : (
            <div className="space-y-2.5">
              {REPORTS.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex flex-wrap items-center gap-3 rounded-2xl border border-ink-200/70 bg-white/60 px-4 py-3.5 transition-colors hover:border-brand-300/70 dark:border-white/8 dark:bg-white/[0.02] dark:hover:border-brand-500/30"
                >
                  <span
                    className={cn(
                      'grid h-9 w-9 shrink-0 place-items-center rounded-xl',
                      r.tone === 'emerald' &&
                        'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
                      r.tone === 'brand' && 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
                      r.tone === 'violet' &&
                        'bg-violet-accent-50 text-violet-accent-600 dark:bg-violet-accent-500/15 dark:text-violet-accent-400',
                      r.tone === 'amber' && 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
                      r.tone === 'cyan' && 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-300',
                      r.tone === 'rose' && 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
                    )}
                  >
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
                      {r.title}
                    </p>
                    <p className="truncate text-[11.5px] text-ink-500 dark:text-ink-400">{r.detail}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="hidden font-mono text-[10.5px] font-semibold text-ink-400 sm:block">
                      {r.format} · {r.size}
                    </span>
                    {r.ready ? (
                      <Pill tone="emerald" icon={<CheckCircle2 className="h-3 w-3" />}>
                        Ready
                      </Pill>
                    ) : (
                      <Pill tone="amber" icon={<Clock className="h-3 w-3" />}>
                        Generating
                      </Pill>
                    )}
                    <Button
                      size="sm"
                      variant={r.ready ? 'outline' : 'primary'}
                      loading={generating === r.id}
                      onClick={() => generate(r.id, r.title)}
                    >
                      {generating === r.id ? 'Working…' : r.ready ? 'Download' : 'Generate'}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <CardHeader
              compact
              title="Compliance checklist"
              subtitle="Updated nightly against board circulars"
              right={<ShieldCheck className="h-4 w-4 text-emerald-500" />}
            />
            <div className="space-y-2">
              {COMPLIANCE.map((c, i) => (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 rounded-2xl border border-ink-200/70 px-3.5 py-2.5 dark:border-white/8"
                >
                  <c.icon className={cn('h-4 w-4 shrink-0', c.ok ? 'text-emerald-500' : 'text-amber-500')} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-bold text-ink-900 dark:text-white">{c.label}</p>
                    <p className="truncate text-[11px] text-ink-500 dark:text-ink-400">{c.value}</p>
                  </div>
                  <span className={cn('h-2 w-2 shrink-0 rounded-full', c.ok ? 'bg-emerald-500' : 'bg-amber-500')} />
                </motion.div>
              ))}
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11.5px] font-semibold text-ink-500 dark:text-ink-400">
                <span>Overall compliance score</span>
                <span className="tabular text-ink-800 dark:text-ink-100">94%</span>
              </div>
              <ProgressBar value={94} tone="emerald" className="mt-1.5" />
            </div>
          </Card>

          <Card className="p-5">
            <CardHeader
              compact
              title="System health"
              subtitle="All modules operational"
              right={<Activity className="h-4 w-4 text-brand-500" />}
            />
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: 'Uptime · 30d', v: '99.94%', tone: 'emerald' as Tone },
                { k: 'Avg API latency', v: '84 ms', tone: 'brand' as Tone },
                { k: 'Failed syncs', v: '0', tone: 'emerald' as Tone },
                { k: 'Storage used', v: '412 GB', tone: 'amber' as Tone },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl border border-ink-200/70 px-3.5 py-3 dark:border-white/8">
                  <p className="text-[10.5px] font-bold tracking-[0.1em] text-ink-400 uppercase">{s.k}</p>
                  <p
                    className={cn(
                      'mt-1 text-[16px] font-extrabold tabular',
                      s.tone === 'emerald'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : s.tone === 'brand'
                          ? 'text-brand-600 dark:text-brand-400'
                          : 'text-amber-600 dark:text-amber-400',
                    )}
                  >
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-brand-200/70 bg-brand-50/70 p-3.5 dark:border-brand-500/25 dark:bg-brand-500/10">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-300" />
              <p className="text-[11.5px] leading-relaxed font-medium text-brand-900 dark:text-brand-100">
                Nightly reconciliation completed at 11:47 pm · 1,363 attendance records, 246 invoices and 148 marks
                entries validated with zero exceptions.
              </p>
            </div>
          </Card>

          <Card className="p-5">
            <CardHeader
              compact
              title="Audit trail"
              subtitle="Immutable log · last 6 events"
              right={<Zap className="h-4 w-4 text-violet-accent-500" />}
            />
            <div className="space-y-2.5">
              {ACTIVITY_FEED.slice(0, 6).map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex gap-3"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300 dark:bg-white/20" />
                  <p className="text-[11.5px] leading-relaxed text-ink-500 dark:text-ink-400">
                    <strong className="font-bold text-ink-800 dark:text-ink-100">{a.actor}</strong> {a.action}{' '}
                    <strong className="text-brand-700 dark:text-brand-300">{a.target}</strong>
                    <span className="ml-1 font-mono text-[10px] text-ink-400">· {a.at}</span>
                  </p>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
