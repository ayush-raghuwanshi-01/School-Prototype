import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera } from 'lucide-react'
import { Eyebrow } from '../ui/Card'

interface Activity {
  id: string
  title: string
  category: 'Culture' | 'Sports' | 'STEM' | 'Nature'
  date: string
  image: string
  blurb: string
  highlights: string[]
}

const ACTIVITIES: Activity[] = [
  {
    id: 'act1',
    title: 'National Handloom Day — Master Weavers Heritage Workshop',
    category: 'Culture',
    date: 'August 2026',
    image: '/campus-commons.jpg',
    blurb:
      'Students interacted with traditional Chanderi and Maheshwari handloom weavers from Madhya Pradesh, understanding indigenous loom craft and sustainable textiles.',
    highlights: ['Hands-on spinning wheel demo', 'Natural indigo dye workshop', 'Student textile exhibition'],
  },
  {
    id: 'act2',
    title: 'Bhopal Sahodaya Complex Inter-School Athletic Meet',
    category: 'Sports',
    date: 'September 2026',
    image: '/campus-library.jpg',
    blurb:
      'Riverton Valley athletes secured 14 medals across 100m sprint, 400m relay, long jump, and football on our full-size 400m campus synthetic track.',
    highlights: ['14 medals won', 'Overall runners-up trophy', 'District selection for 4 sprinters'],
  },
  {
    id: 'act3',
    title: 'Annual Robotics & Composite Science Expo',
    category: 'STEM',
    date: 'July 2026',
    image: '/campus-innovation-lab.jpg',
    blurb:
      'Middle and Senior Secondary innovators showcased AI crop-monitoring rovers, solar tracking sensors, and optics apparatus in our composite STEM lab.',
    highlights: ['42 student project stalls', 'Automated IoT greenhouse model', 'Evaluated by MANIT professors'],
  },
  {
    id: 'act4',
    title: 'Van Vihar Biodiversity & Wetland Expedition',
    category: 'Nature',
    date: 'August 2026',
    image: '/campus-commons.jpg',
    blurb:
      'Field trip studying Upper Lake avifauna, soil conservation, and rare botanical specimens as part of the Riverton eco-stewardship initiative.',
    highlights: ['Bird count catalog', 'Water purity titration testing', 'Nature photography journal'],
  },
  {
    id: 'act5',
    title: 'Janmashtami & Krishna Leela Cultural Evening',
    category: 'Culture',
    date: 'September 2026',
    image: '/campus-library.jpg',
    blurb:
      'Kindergarten to Middle School scholars presented classical dance enactments, tabla recitals, and traditional matki-phod sports on campus.',
    highlights: ['Classical Kathak recital', '120 participating students', 'Parent-led folk music choir'],
  },
  {
    id: 'act6',
    title: 'Riverton Inter-House Debate & Moot Court League',
    category: 'STEM',
    date: 'July 2026',
    image: '/campus-innovation-lab.jpg',
    blurb:
      'Heated debates on ethical AI in education and space exploration, judged by senior advocates from the Madhya Pradesh High Court bench.',
    highlights: ['Parliamentary debate format', 'Best speaker honors', 'Ganga House victory'],
  },
]

export function ActivitiesSection() {
  const [filter, setFilter] = useState<'All' | 'Culture' | 'Sports' | 'STEM' | 'Nature'>('All')

  const visible = filter === 'All' ? ACTIVITIES : ACTIVITIES.filter((a) => a.category === filter)

  return (
    <section id="activities" className="relative bg-white py-20 sm:py-28 border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow className="text-emerald-800 bg-emerald-50 border-emerald-200">
              <Camera className="h-3.5 w-3.5 text-emerald-600" /> Life & Activities · Riverton Valley School
            </Eyebrow>
            <h2 className="mt-4 text-[clamp(2.1rem,4.4vw,3.2rem)] leading-[1.03] font-extrabold tracking-[-0.04em] text-slate-900">
              Vibrant campus life beyond the <span className="editorial italic text-emerald-700">textbook page.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
              From our 400m athletic arena to robotics challenges and Madhya Pradesh cultural heritage, our students
              discover their passions every day.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-1">
            {(['All', 'Culture', 'Sports', 'STEM', 'Nature'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`press rounded-xl px-3.5 py-1.5 text-[12px] font-bold transition-all ${
                  filter === tab
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Activities Cards Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((act) => (
              <motion.article
                key={act.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={act.image}
                    alt={act.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[10.5px] font-extrabold uppercase tracking-wider text-emerald-900 shadow-xs">
                      {act.category}
                    </span>
                  </div>
                  <span className="absolute bottom-3 left-3 text-[11px] font-mono text-white/90 font-medium">
                    {act.date}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[16px] font-extrabold text-slate-900 leading-snug group-hover:text-emerald-800 transition-colors">
                      {act.title}
                    </h3>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-slate-600 line-clamp-3">{act.blurb}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    {act.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
