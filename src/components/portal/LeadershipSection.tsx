import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, UserCheck, ShieldCheck } from 'lucide-react'
import { Eyebrow } from '../ui/Card'

interface Leader {
  id: string
  name: string
  role: string
  title: string
  message: string
  points: string[]
  quote: string
  initials: string
}

const LEADERS: Leader[] = [
  {
    id: 'chairperson',
    name: 'Divyanshi Saxena',
    role: 'Chairperson · AKS Educational Society',
    title: 'From the Chairperson’s Desk',
    quote:
      'Education at Riverton Valley is an alchemy of grounded values and boundless ambition. We do not prepare children merely for exams; we prepare them for an ethical, courageous life.',
    message:
      'When AKS Educational Society envisioned Riverton Valley School in Bhopal, our vision was to liberate learning from rote memorization and concrete cages. Our 15-acre green sanctuary at Bilkhiriya provides children the breathing room to wonder, experiment, and build resilient character. As a CBSE-affiliated institution, we uphold the highest academic standards while ensuring every scholar blossoms with empathy and cultural pride.',
    points: [
      'Focus on joyful and experiential learning environments',
      'Integrity, humility, and environmental consciousness as daily habits',
      'Affordable, world-class CBSE education for Bhopal families',
    ],
    initials: 'DS',
  },
  {
    id: 'vice-chairman',
    name: 'Kashish Saxena',
    role: 'Vice Chairman · AKS Educational Society',
    title: 'From the Vice Chairman’s Desk',
    quote:
      'The modern world rewards agility, technological literacy, and interdisciplinary problem solving. Our classrooms and innovation hubs reflect the future.',
    message:
      'We live in an era where technology is reshaping every discipline. At Riverton Valley, Middle and Higher Secondary students are exposed to composite robotics labs, computational coding, analytical science diagnostics, and career guidance for JEE, NEET, and CUET. We empower our scholars to be creators of tomorrow, not just consumers of information.',
    points: [
      'Industry-standard STEM & Robotics curriculum from Class 6 onwards',
      'Integrated competitive test mentorship within the regular school timetable',
      'Digital transparency for parents through live academic portals',
    ],
    initials: 'KS',
  },
  {
    id: 'vice-principal',
    name: 'Nidhi Lal',
    role: 'Vice Principal & Academic Dean',
    title: 'From the Principal & Academic Desk',
    quote:
      'Every lesson plan is crafted with deliberate care. When teachers and students engage in meaningful dialogue, academic excellence is a natural consequence.',
    message:
      'Academic governance at Riverton Valley is anchored on CBSE curriculum frameworks, continuous diagnostic assessments, and personalized mentoring. In our Middle School (Classes 6–8), we build strong foundational literacy and scientific curiosity. In Secondary (9–10) and Senior Secondary (11–12), our faculty team guides students through rigorous board preparation, practical laboratory mastery, and doubt resolution.',
    points: [
      'Individualized student performance diagnostics & remedial support',
      'Bhopal Sahodaya interschool debates, sports, and science exhibitions',
      'CBSE 100% board pass commitment with distinction honors',
    ],
    initials: 'NL',
  },
]

export function LeadershipSection() {
  const [activeLeader, setActiveLeader] = useState<string>('chairperson')
  const leader = LEADERS.find((l) => l.id === activeLeader) || LEADERS[0]

  return (
    <section id="leadership" className="relative bg-slate-50/70 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow className="text-emerald-800 bg-emerald-50 border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Leadership Desk · Riverton Valley School
            </Eyebrow>
            <h2 className="mt-4 text-[clamp(2.1rem,4.4vw,3.2rem)] leading-[1.03] font-extrabold tracking-[-0.04em] text-slate-900">
              Guided by visionaries, <span className="editorial italic text-emerald-700">driven by educators.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
              Meet the leadership team steering Riverton Valley School and AKS Educational Society towards pioneering
              academic and holistic milestones in Bhopal.
            </p>
          </div>

          {/* Leader Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            {LEADERS.map((l) => (
              <button
                key={l.id}
                onClick={() => setActiveLeader(l.id)}
                className={`press flex items-center gap-2 rounded-xl px-3.5 py-2 text-[12.5px] font-bold transition-all ${
                  activeLeader === l.id
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{l.name.split(' ')[0]}</span>
                <span className="text-[10.5px] opacity-75 font-normal">({l.role.split('·')[0].trim()})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Leader Profile Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={leader.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm"
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-12 items-start">
              {/* Leader Bio Box */}
              <div className="rounded-2xl border border-slate-100 bg-emerald-50/40 p-6 text-center sm:text-left">
                <div className="mx-auto sm:mx-0 grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white font-black text-2xl shadow-md">
                  {leader.initials}
                </div>
                <h3 className="mt-5 text-[22px] font-black text-slate-900 tracking-tight">{leader.name}</h3>
                <p className="text-[13px] font-bold text-emerald-800 mt-0.5">{leader.role}</p>
                <div className="mt-4 pt-4 border-t border-emerald-200/60 text-[11.5px] text-slate-600 space-y-1">
                  <p>AKS Educational Society, Bhopal</p>
                  <p>CBSE Affiliation: 1031461</p>
                </div>

                <div className="mt-6 rounded-xl bg-white p-4 border border-emerald-100 shadow-2xs">
                  <Quote className="h-5 w-5 text-emerald-600 mb-2" />
                  <p className="text-[12.5px] italic text-slate-700 leading-relaxed font-serif">"{leader.quote}"</p>
                </div>
              </div>

              {/* Leader Full Message */}
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-700" />
                  {leader.title}
                </div>

                <p className="text-[15.5px] leading-relaxed text-slate-700">{leader.message}</p>

                <div className="pt-2">
                  <h4 className="text-[12px] font-extrabold uppercase tracking-wider text-slate-400">
                    Strategic Priorities & Ethos
                  </h4>
                  <ul className="mt-3 space-y-2.5">
                    {leader.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[13px] text-slate-700 font-medium">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {i + 1}
                        </span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
