import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Activity,
  AlertTriangle,
  BadgeIndianRupee,
  CalendarCheck2,
  GraduationCap,
  Info,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react'
import { Card, CardHeader, Eyebrow } from '../../ui/Card'
import { Pill, TONES, type Tone } from '../../ui/Badge'
import { MetricCard, StatStrip } from '../MetricCard'
import { AXIS_STYLE, ChartFrame, ChartTooltip, DonutLegend } from '../ChartKit'
import { ACTIVITY_FEED, ADMISSION_TRENDS, AT_RISK, FEE_TRENDS, STUDENTS } from '../../../data/school'
import { Segmented } from '../../ui/Form'
import { SkeletonChart, SkeletonStatGrid } from '../../ui/Skeleton'
import { useApp, useSimulatedLoad } from '../../../state/store'
import { cn, inrCompact } from '../../../lib/utils'

const ATTENDANCE_SPLIT = [
  { label: 'Present', value: 1187, color: '#10B981', sub: 'Marked before 08:30' },
  { label: 'Late arrivals', value: 62, color: '#F59E0B', sub: 'After morning bell' },
  { label: 'Authorised leave', value: 74, color: '#2563EB', sub: 'Medical / sports duty' },
  { label: 'Absent', value: 40, color: '#F43F5E', sub: 'Unexplained' },
]

const SEVERITY_TONE: Record<'critical' | 'high' | 'medium', Tone> = {
  critical: 'rose',
  high: 'amber',
  medium: 'slate',
}

export function AnalyticsView() {
  const { attendance, setView, pushToast } = useApp()
  const [range, setRange] = useState<'term' | 'ytd'>('term')
  const [chartMode, setChartMode] = useState<'collected' | 'dues'>('collected')
  const loading = useSimulatedLoad(range, 700)

  const attendanceToday = useMemo(() => {
    const total = STUDENTS.length
    const present = Object.values(attendance).filter((m) => m === 'present').length
    const late = Object.values(attendance).filter((m) => m === 'late').length
    const absent = Object.values(attendance).filter((m) => m === 'absent').length
    return { total, present, late, absent, rate: ((present + late) / total) * 100 }
  }, [attendance])

  const trendData =
    range === 'term' ? FEE_TRENDS : FEE_TRENDS.map((d, i) => ({ ...d, collected: d.collected * 1.04 + i }))

  if (loading) {
    return (
      <div className="space-y-5">
        <SkeletonStatGrid />
        <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
          <SkeletonChart height="h-[360px]" />
          <SkeletonChart height="h-[360px]" bars={0} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>
            <Activity className="h-3.5 w-3.5" /> Institutional overview
          </Eyebrow>
          <h1 className="mt-2.5 text-[clamp(1.6rem,3vw,2.15rem)] leading-tight font-extrabold tracking-[-0.04em] text-ink-900 dark:text-white">
            Good morning, Ayush.
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500 dark:text-ink-400">
            Wednesday, 16 September 2026 · Day 118 of the session · Term-2 collections are 13.5% ahead of target.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Segmented
            value={range}
            onChange={setRange}
            options={[
              { value: 'term', label: 'This term' },
              { value: 'ytd', label: 'Year to date' },
            ]}
          />
          <Pill tone="emerald" dot>
            All systems nominal
          </Pill>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          index={0}
          label="Fee collected · Term 2"
          value={inrCompact(15890000)}
          delta={12.4}
          deltaLabel="vs ₹140 L target · 94.3% of demand"
          icon={BadgeIndianRupee}
          tone="emerald"
          spark={FEE_TRENDS.map((f) => f.collected)}
          onClick={() => setView('fees')}
        />
        <MetricCard
          index={1}
          label="Attendance today (whole school)"
          value={attendanceToday.rate.toFixed(1)}
          unit="%"
          delta={-0.6}
          deltaLabel={`${attendanceToday.absent} absent · 62 late · 74 on leave`}
          icon={CalendarCheck2}
          tone="brand"
          spark={[93, 94, 92, 95, 96, 94, 93, 94.2]}
          onClick={() => setView('attendance')}
        />
        <MetricCard
          index={2}
          label="Admission enquiries"
          value="764"
          delta={8.2}
          deltaLabel="188 enrolled · 24.6% conversion"
          icon={UserPlus}
          tone="violet"
          spark={ADMISSION_TRENDS.map((a) => a.enquiries)}
          onClick={() => setView('admissions')}
        />
        <MetricCard
          index={3}
          label="Staff on duty"
          value="131 / 138"
          delta={1.4}
          deltaLabel="7 on sanctioned leave · 0 unfilled periods"
          icon={Users}
          tone="amber"
          spark={[92, 94, 93, 95, 94, 96, 95, 94.9]}
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <Card className="p-5 sm:p-6">
          <CardHeader
            compact
            title="Monthly fee collection"
            subtitle={`Values in ₹ Lakh · session 2026–27 · ${range === 'term' ? 'Term 1 & 2' : 'Year to date'}`}
            right={
              <Segmented
                size="sm"
                value={chartMode}
                onChange={setChartMode}
                options={[
                  { value: 'collected', label: 'Collected' },
                  { value: 'dues', label: 'Dues' },
                ]}
              />
            }
          />
          <ChartFrame className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData} margin={{ top: 6, right: 6, bottom: 0, left: -18 }} barGap={6}>
                <defs>
                  <linearGradient id="barCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B76F6" />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0.72} />
                  </linearGradient>
                  <linearGradient id="barDues" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="currentColor" strokeOpacity={0.16} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={AXIS_STYLE} tickMargin={10} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={AXIS_STYLE}
                  width={54}
                  tickFormatter={(v) => `₹${Number(v ?? 0)}L`}
                />
                <Tooltip
                  cursor={{ fill: 'currentColor', fillOpacity: 0.06, radius: 8 }}
                  content={<ChartTooltip formatter={(v) => `₹${v.toFixed(1)} Lakh`} />}
                />
                <Bar
                  dataKey={chartMode === 'collected' ? 'collected' : 'dues'}
                  name={chartMode === 'collected' ? 'Collected' : 'Outstanding dues'}
                  fill={chartMode === 'collected' ? 'url(#barCollected)' : 'url(#barDues)'}
                  radius={[8, 8, 4, 4]}
                  maxBarSize={44}
                  animationDuration={900}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="4 4"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartFrame>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Collected this month', value: '₹1.59 Cr', tone: 'emerald' as Tone },
              { label: 'Outstanding dues', value: '₹8.7 L', tone: 'amber' as Tone },
              { label: 'Defaulters flagged', value: '19 students', tone: 'rose' as Tone },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-ink-200/70 bg-ink-50/70 px-3.5 py-3 dark:border-white/8 dark:bg-white/[0.03]"
              >
                <p className="text-[11px] font-semibold text-ink-400">{s.label}</p>
                <p className={cn('mt-0.5 text-[15px] font-extrabold tracking-[-0.03em] tabular', TONES[s.tone].text)}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col p-5 sm:p-6">
          <CardHeader
            compact
            title="Attendance split"
            subtitle="Whole school · today, 16 Sep 2026"
            right={<Pill tone="brand">1,363 students</Pill>}
          />
          <ChartFrame className="relative h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ATTENDANCE_SPLIT}
                  dataKey="value"
                  nameKey="label"
                  innerRadius="62%"
                  outerRadius="88%"
                  paddingAngle={3}
                  cornerRadius={7}
                  stroke="none"
                  animationDuration={950}
                >
                  {ATTENDANCE_SPLIT.map((entry) => (
                    <Cell key={entry.label} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip formatter={(v) => `${v.toLocaleString('en-IN')} students`} />} />
                <Legend content={() => null} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="text-[28px] leading-none font-extrabold tracking-[-0.045em] tabular text-ink-900 dark:text-white">
                  87.1%
                </p>
                <p className="mt-1 text-[11px] font-semibold text-ink-400">marked present</p>
                <p className="text-[10.5px] text-emerald-600 dark:text-emerald-400">+1.8% vs yesterday</p>
              </div>
            </div>
          </ChartFrame>
          <div className="mt-5">
            <DonutLegend items={ATTENDANCE_SPLIT} />
          </div>
          <button
            onClick={() => setView('attendance')}
            className="press mt-5 w-full rounded-xl border border-dashed border-ink-300 py-2.5 text-[12px] font-bold text-ink-500 transition-colors hover:border-brand-400 hover:text-brand-600 dark:border-white/12 dark:text-ink-400"
          >
            Open attendance heatmap →
          </button>
        </Card>
      </div>

      {/* Secondary row */}
      <div className="grid gap-5 xl:grid-cols-[1fr_1fr_1fr]">
        <Card className="p-5">
          <CardHeader compact title="Admissions funnel" subtitle="Apr – Sep 2026 · enquiries vs enrolments" />
          <ChartFrame className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ADMISSION_TRENDS} margin={{ top: 6, right: 8, bottom: 0, left: -22 }}>
                <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="currentColor" strokeOpacity={0.16} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={AXIS_STYLE} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tick={AXIS_STYLE} width={44} />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="enquiries"
                  name="Enquiries"
                  stroke="#7C3AED"
                  strokeWidth={2.4}
                  dot={false}
                  animationDuration={900}
                />
                <Line
                  type="monotone"
                  dataKey="enrolled"
                  name="Enrolled"
                  stroke="#10B981"
                  strokeWidth={2.4}
                  dot={{ r: 3, strokeWidth: 0, fill: '#10B981' }}
                  animationDuration={1100}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartFrame>
        </Card>

        <Card className="p-5">
          <CardHeader
            compact
            title="Watchlist"
            subtitle="Automated interventions this week"
            right={<Pill tone="rose">{AT_RISK.length} open</Pill>}
          />
          <div className="space-y-2">
            {AT_RISK.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group flex items-start gap-3 rounded-2xl border border-ink-200/70 bg-white/60 px-3.5 py-3 transition-colors hover:border-ink-300 dark:border-white/8 dark:bg-white/[0.03] dark:hover:border-white/16"
              >
                <AlertTriangle
                  className={cn(
                    'mt-0.5 h-4 w-4 shrink-0',
                    SEVERITY_TONE[r.severity] === 'rose' ? 'text-rose-500' : 'text-amber-500',
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-bold tracking-[-0.01em] text-ink-900 dark:text-white">
                    {r.name}
                  </p>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-ink-500 dark:text-ink-400">{r.reason}</p>
                </div>
                <Pill tone={SEVERITY_TONE[r.severity]} className="shrink-0 capitalize">
                  {r.severity}
                </Pill>
              </motion.div>
            ))}
          </div>
          <button
            onClick={() =>
              pushToast({
                tone: 'info',
                title: 'Counselling referrals drafted',
                description: '4 cases queued with the wellness wing for a Thursday review.',
              })
            }
            className="press mt-4 w-full rounded-xl bg-ink-900 py-2.5 text-[12px] font-bold text-white transition-colors hover:bg-ink-800 dark:bg-brand-600 dark:hover:bg-brand-500"
          >
            Refer all to wellness wing
          </button>
        </Card>

        <Card className="p-5">
          <CardHeader
            compact
            title="Activity feed"
            subtitle="Last 24 hours across all modules"
            right={<Activity className="h-4 w-4 text-ink-400" />}
          />
          <div className="relative space-y-3.5 pl-1.5">
            <span className="absolute top-1.5 bottom-3 left-[7px] w-px bg-ink-200 dark:bg-white/10" />
            {ACTIVITY_FEED.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative flex gap-3.5"
              >
                <span
                  className={cn(
                    'relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ring-4 ring-white dark:ring-ink-900',
                    TONES[a.tone].dot,
                  )}
                />
                <p className="text-[12px] leading-relaxed text-ink-500 dark:text-ink-400">
                  <strong className="font-bold text-ink-900 dark:text-white">{a.actor}</strong> {a.action}{' '}
                  <strong className="font-bold text-brand-700 dark:text-brand-300">{a.target}</strong>
                  <span className="mt-0.5 block font-mono text-[10.5px] text-ink-400">{a.at}</span>
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      <StatStrip
        items={[
          { label: 'Board average XII', value: '91.4%', tone: 'violet', sub: 'Batch of 2025 · 41 students > 90%' },
          { label: 'Teacher : student', value: '1 : 14', tone: 'brand', sub: 'Senior wing 1:14, primary 1:16' },
          { label: 'Transport utilisation', value: '89.6%', tone: 'cyan', sub: '22 routes · 1,211 students' },
          { label: 'Infrastructure uptime', value: '99.4%', tone: 'emerald', sub: 'Last 30 days · 2 planned outages' },
        ]}
      />

      <Card className="flex flex-wrap items-center gap-3 border-brand-200/70 bg-brand-50/60 p-4 dark:border-brand-500/25 dark:bg-brand-500/10">
        <Info className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-300" />
        <p className="flex-1 text-[12.5px] leading-relaxed font-medium text-brand-900 dark:text-brand-100">
          All figures on this dashboard are generated mock data for prototype purposes — fee ledgers, attendance splits
          and board averages are deterministic and reproducible.
        </p>
        <Pill tone="brand" icon={<TrendingUp className="h-3 w-3" />}>
          Deterministic seed · 20260415
        </Pill>
      </Card>

      <div className="flex items-center gap-2 text-[11.5px] text-ink-400">
        <GraduationCap className="h-3.5 w-3.5" />
        Data refreshes every 60 seconds in production · last sync 14 seconds ago
      </div>
    </div>
  )
}
