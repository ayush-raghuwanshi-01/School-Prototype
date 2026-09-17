import { motion } from 'framer-motion'
import { Trees, Cpu, GraduationCap, Palette, Trophy, Compass, CheckCircle2, Sparkles, Award } from 'lucide-react'
import { Eyebrow } from '../ui/Card'

const PILLARS = [
  {
    icon: Trees,
    title: 'Nature-Embedded 15-Acre Campus',
    blurb:
      'Situated amidst the pristine greenery of Bilkhiriya, Bhopal, our eco-friendly campus offers open-air learning gazebos, botanical gardens, and fresh air for holistic child well-being.',
    badge: 'Eco Campus',
    highlights: ['Zero-noise natural environment', 'Solar-powered classrooms', 'Organic fruit & medicinal orchard'],
    color: 'emerald',
  },
  {
    icon: Cpu,
    title: 'Smart Classrooms & Innovation Labs',
    blurb:
      'Every classroom is equipped with interactive touch panels, complemented by composite physics, chemistry, biology, and Atal-inspired robotics and AI maker labs.',
    badge: 'STEM & Robotics',
    highlights: ['CBSE Composite Science Labs', 'Python & Robotics Studio', '1:1 Interactive Touch Panels'],
    color: 'brand',
  },
  {
    icon: GraduationCap,
    title: 'Experienced Mentors & Faculty',
    blurb:
      'Our educators bring decades of pedagogical excellence from premier institutions, nurturing critical thinking and conceptual clarity with a 1:16 teacher-student ratio.',
    badge: '1:16 Ratio',
    highlights: ['Continuous CBSE faculty training', 'Dedicated doubt clearing clinics', 'Student mentorship pods'],
    color: 'violet',
  },
  {
    icon: Palette,
    title: 'Aesthetic & Cultural Arts',
    blurb:
      'Fostering Indian ethos and creative expression through classical music, Kathak, drama, pottery, visual arts, and celebrating Madhya Pradesh handloom heritage.',
    badge: 'Arts & Sanskar',
    highlights: ['Dedicated acoustic music hall', 'Pottery & ceramic kiln studio', 'Annual Heritage Showcase'],
    color: 'amber',
  },
  {
    icon: Trophy,
    title: 'Riverton Sports Club & Athletic Academy',
    blurb:
      'A sprawling sports complex featuring a 400-metre athletic track, FIFA-standard turf football field, half-Olympic swimming pool, cricket nets, and indoor badminton courts.',
    badge: 'Sports Complex',
    highlights: ['400m synthetic athletic track', 'Half-Olympic swimming pool', 'Bhopal Sahodaya champions'],
    color: 'rose',
  },
  {
    icon: Compass,
    title: 'Intellectual Rigor & Future Readiness',
    blurb:
      'From Middle School foundation modules to Senior Secondary stream specialization (Science PCM/PCB, Commerce, Humanities), integrated with JEE, NEET, and CUET guidance.',
    badge: 'Board Excellence',
    highlights: ['CBSE Affiliation No. 1031461', 'Integrated competitive prep', 'Bhopal Interschool MUN'],
    color: 'cyan',
  },
]

export function RivertonEthosSection() {
  return (
    <section id="ethos" className="relative bg-white py-20 sm:py-28 border-y border-slate-200/80">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow className="text-emerald-700 bg-emerald-50 border-emerald-200">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Ethos & Philosophy · Riverton Valley School
            </Eyebrow>
            <h2 className="mt-4 text-[clamp(2.1rem,4.4vw,3.2rem)] leading-[1.03] font-extrabold tracking-[-0.04em] text-slate-900">
              Nurturing character, intellect, and{' '}
              <span className="editorial italic text-emerald-700">life-long curiosity.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
              Under the stewardship of AKS Educational Society Bhopal, Riverton Valley School harmoniously bridges
              ancient Indian values (Sanskar) with forward-looking 21st-century CBSE academic rigour.
            </p>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-700 text-white font-bold shadow-sm">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[13px] font-extrabold text-slate-900">CBSE Affiliation No. 1031461</p>
              <p className="text-[11px] text-slate-500">School Code: 50924 · Bhopal Sahodaya Complex</p>
            </div>
          </div>
        </div>

        {/* 6 Ethos Pillars */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              whileHover={{ y: -4 }}
              className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 group-hover:bg-emerald-700 group-hover:text-white transition-colors duration-300">
                    <pillar.icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-600">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="mt-5 text-[18px] font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {pillar.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-slate-600">{pillar.blurb}</p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 space-y-2">
                {pillar.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-2 text-[12px] font-medium text-slate-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
