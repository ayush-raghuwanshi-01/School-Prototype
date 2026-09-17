import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Sparkles, Trees, Trophy, Cpu, Palette } from 'lucide-react'
import { Eyebrow } from '../ui/Card'

interface VideoItem {
  id: string
  title: string
  category: string
  duration: string
  thumbnail: string
  caption: string
  icon: typeof Trees
  badge: string
}

const VIDEOS: VideoItem[] = [
  {
    id: 'v1',
    title: '15-Acre Bilkhiriya Nature Campus Drone Tour',
    category: 'Campus Aerial Tour',
    duration: '2:15',
    thumbnail: '/campus-commons.jpg',
    caption:
      'A sweeping aerial flight over our green campus, botanical learning pavilions, open-air assembly grounds, and eco-architecture.',
    icon: Trees,
    badge: '4K Drone Flight',
  },
  {
    id: 'v2',
    title: 'Robotics, AI & Composite Science Labs in Action',
    category: 'STEM & Innovation',
    duration: '1:45',
    thumbnail: '/campus-innovation-lab.jpg',
    caption:
      'Scholars experimenting in CBSE physics optics, chemistry titration benches, Python coding, and robotics fabrication.',
    icon: Cpu,
    badge: 'Innovation Hub',
  },
  {
    id: 'v3',
    title: 'Riverton Sports Academy & 400m Track Championship',
    category: 'Athletics & Sports',
    duration: '1:50',
    thumbnail: '/campus-library.jpg',
    caption:
      'Highlights from the Bhopal Sahodaya Athletic Meet, turf football training, swimming pool sessions, and yoga mornings.',
    icon: Trophy,
    badge: 'Sports Complex',
  },
  {
    id: 'v4',
    title: 'Aesthetic Arts, Handloom Day & Cultural Festival',
    category: 'Arts & Heritage',
    duration: '2:05',
    thumbnail: '/campus-commons.jpg',
    caption:
      'Celebrating Madhya Pradesh handloom artisans, classical Kathak dance, pottery studio, and Indian music performances.',
    icon: Palette,
    badge: 'Cultural Sanskar',
  },
]

export function CampusVideoShowcase() {
  const [activeVideo, setActiveVideo] = useState(VIDEOS[0])
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(38)

  return (
    <section id="campus-life" className="relative bg-white py-20 sm:py-28 border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow className="text-emerald-800 bg-emerald-50 border-emerald-200">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Campus in Motion · Riverton Valley School
            </Eyebrow>
            <h2 className="mt-4 text-[clamp(2.1rem,4.4vw,3.2rem)] leading-[1.03] font-extrabold tracking-[-0.04em] text-slate-900">
              See what life looks like on our{' '}
              <span className="editorial italic text-emerald-700">15-acre green campus.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
              Experience our classrooms, composite STEM laboratories, 400m athletic tracks, and cultural arts studios
              through immersive video tours.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 text-[12px] font-bold text-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Virtual Open House & Campus Tour Video Series</span>
          </div>
        </div>

        {/* Video Player Display */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.55fr_1fr] items-start">
          {/* Main Simulated Video Frame */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-xl group">
            {/* Visual Screen Backdrop */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-900">
              <img
                src={activeVideo.thumbnail}
                alt={activeVideo.title}
                className={`h-full w-full object-cover transition-all duration-700 ${isPlaying ? 'scale-105 brightness-95' : 'scale-100 brightness-75'}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

              {/* Live Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-600/90 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold text-white shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                  {activeVideo.badge}
                </span>
                <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono text-white/90">
                  {activeVideo.duration}
                </span>
              </div>

              {/* Big Center Play/Pause Overlay */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="press absolute inset-0 m-auto grid h-16 w-16 place-items-center rounded-full bg-white/90 text-emerald-900 shadow-2xl backdrop-blur-md transition-all hover:scale-110 hover:bg-white"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <Pause className="h-7 w-7 fill-emerald-900" />
                ) : (
                  <Play className="h-7 w-7 ml-1 fill-emerald-900" />
                )}
              </button>

              {/* Bottom Video Controls Bar */}
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/95 to-transparent">
                <p className="text-[17px] sm:text-[19px] font-extrabold text-white leading-tight">
                  {activeVideo.title}
                </p>
                <p className="mt-1 text-[12px] text-white/80 line-clamp-1">{activeVideo.caption}</p>

                {/* Simulated Progress bar */}
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:text-emerald-400 transition-colors"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>

                  <div
                    className="relative h-1.5 flex-1 rounded-full bg-white/20 overflow-hidden cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const pos = ((e.clientX - rect.left) / rect.width) * 100
                      setProgress(Math.round(pos))
                    }}
                  >
                    <motion.div
                      className="h-full bg-emerald-500 rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>

                  <span className="text-[11px] font-mono text-white/70">0:52 / {activeVideo.duration}</span>

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white hover:text-emerald-400 transition-colors"
                    aria-label="Toggle mute"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Playlist / Video Selector Cards */}
          <div className="space-y-3">
            <h3 className="text-[12px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
              Select Campus Video Tour
            </h3>
            {VIDEOS.map((v) => {
              const isSelected = v.id === activeVideo.id
              const Icon = v.icon
              return (
                <button
                  key={v.id}
                  onClick={() => {
                    setActiveVideo(v)
                    setIsPlaying(true)
                  }}
                  className={`press w-full rounded-2xl border p-3.5 text-left transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="relative h-16 w-24 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
                    <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="h-5 w-5 text-white/90" />
                    </div>
                    <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[9px] font-mono text-white">
                      {v.duration}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-emerald-800 uppercase tracking-wider">
                      <Icon className="h-3 w-3" />
                      <span>{v.category}</span>
                    </div>
                    <h4 className="mt-1 text-[13px] font-bold text-slate-900 leading-snug line-clamp-2">{v.title}</h4>
                    <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">{v.caption}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
