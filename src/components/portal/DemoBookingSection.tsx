import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle2, School, Phone, Mail, User, Send } from 'lucide-react'
import { Button } from '../ui/Button'
import { Pill } from '../ui/Badge'
import { useApp } from '../../state/store'

export interface DemoLead {
  schoolName: string
  contactName: string
  role: string
  phone: string
  email: string
  studentCount: string
  painPoint: string
  date: string
}

const TRUSTED_SCHOOLS = [
  { name: 'Saraswati Vidhya Mandir', location: 'Bhopal · Estd 1994', students: '1,420 Students' },
  { name: "St. Xavier's Senior Sec", location: 'Jabalpur · Estd 1988', students: '1,850 Students' },
  { name: 'Delhi Public School Partner', location: 'Indore · Estd 2004', students: '2,200 Students' },
  { name: 'Sagar Public School', location: 'Bhopal · Estd 2001', students: '1,640 Students' },
  { name: 'Carmel Academy', location: 'Gwalior · Estd 1997', students: '1,120 Students' },
]

export function DemoBookingSection() {
  const { pushToast, triggerCelebration } = useApp()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<DemoLead>({
    schoolName: '',
    contactName: '',
    role: 'Principal',
    phone: '',
    email: '',
    studentCount: '500 - 1500 students',
    painPoint: 'Severe fee dues & manual follow-up struggles',
    date: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.schoolName || !formData.phone) {
      pushToast({
        tone: 'error',
        title: 'Required details missing',
        description: 'Please provide at least your School Name and WhatsApp contact number.',
      })
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      console.log('[School Management Demo Lead Captured]:', formData)

      // Trigger delight confetti burst
      triggerCelebration({
        message: `Walkthrough Reserved for ${formData.schoolName}!`,
      })

      pushToast({
        tone: 'success',
        title: 'Walkthrough booked successfully!',
        description: `We will contact ${formData.contactName || 'the principal'} on ${formData.phone} within 2 hours.`,
      })
    }, 900)
  }

  return (
    <section
      id="demo"
      className="relative border-t border-ink-200/80 bg-white py-24 dark:border-white/8 dark:bg-ink-950"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Trusted Schools Bar */}
        <div className="mb-20">
          <p className="text-center font-mono text-[11px] font-bold uppercase tracking-widest text-ink-400">
            Trusted by 45+ premier institutions across Central India
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {TRUSTED_SCHOOLS.map((school) => (
              <div
                key={school.name}
                className="flex flex-col items-center justify-center rounded-2xl border border-ink-200/60 bg-ink-50/50 p-4 text-center transition-colors hover:border-brand-300 dark:border-white/5 dark:bg-white/[0.02]"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-700 font-black text-xs dark:bg-brand-500/20 dark:text-brand-300">
                  {school.name.slice(0, 2).toUpperCase()}
                </div>
                <p className="mt-2 text-[12px] font-bold text-ink-900 dark:text-white line-clamp-1">{school.name}</p>
                <p className="text-[10px] text-ink-400">{school.location}</p>
                <span className="mt-1 font-mono text-[9.5px] text-emerald-600 dark:text-emerald-400">
                  {school.students}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form and Value Pitch Box */}
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300">
              <Calendar className="h-3.5 w-3.5" /> Schedule a 20-Minute On-Campus or Virtual Demo
            </div>
            <h2 className="mt-4 text-[clamp(2.1rem,3.8vw,2.9rem)] font-extrabold tracking-tight text-ink-900 dark:text-white leading-tight">
              See how this runs your school better in the first 60 seconds.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
              We will prepare a live sandbox preloaded with your school’s grade levels, fee structure, and house system
              so your management board sees exactly how your school operates on modern infrastructure.
            </p>

            <div className="mt-8 space-y-4">
              {[
                {
                  title: 'No software installation required',
                  desc: 'Works in any browser on principal laptops, office desktops, and parents’ mobile phones.',
                },
                {
                  title: '1-Click data migration from Tally or Excel',
                  desc: 'Our academic engineers migrate all student records, fee dues, and marks at zero extra cost.',
                },
                {
                  title: 'On-site staff training provided',
                  desc: 'Full hands-on training for teachers, accountants, and front-office staff in Hindi and English.',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-[13.5px] font-bold text-ink-900 dark:text-white">{item.title}</h4>
                    <p className="text-[12px] text-ink-500 dark:text-ink-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Capture Form Card */}
          <div className="rounded-3xl border border-ink-200/80 bg-white p-6 sm:p-8 shadow-xl dark:border-white/10 dark:bg-ink-900">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center"
              >
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-md dark:bg-emerald-500/20 dark:text-emerald-400">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h3 className="mt-4 text-[20px] font-extrabold text-ink-900 dark:text-white">Walkthrough Confirmed!</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
                  Thank you,{' '}
                  <strong className="font-bold text-ink-800 dark:text-ink-200">
                    {formData.contactName || 'Principal'}
                  </strong>
                  . A demonstration instance for{' '}
                  <strong className="font-bold text-brand-600 dark:text-brand-400">{formData.schoolName}</strong> is
                  being generated.
                </p>

                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-left text-[12px] dark:border-emerald-500/20 dark:bg-emerald-950/20">
                  <div className="flex justify-between py-1 border-b border-emerald-200/50 dark:border-emerald-500/20">
                    <span className="text-ink-500">School:</span>
                    <span className="font-bold text-ink-900 dark:text-white">{formData.schoolName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-emerald-200/50 dark:border-emerald-500/20">
                    <span className="text-ink-500">WhatsApp Contact:</span>
                    <span className="font-bold text-ink-900 dark:text-white">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-ink-500">Primary Focus:</span>
                    <span className="font-bold text-ink-900 dark:text-white">{formData.painPoint}</span>
                  </div>
                </div>

                <Button className="mt-6 w-full" variant="outline" onClick={() => setSubmitted(false)}>
                  Book for Another School
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-ink-100 pb-3 dark:border-white/10">
                  <div>
                    <h3 className="text-[17px] font-extrabold text-ink-900 dark:text-white">
                      Book a Free Demo for Your School
                    </h3>
                    <p className="text-[11.5px] text-ink-400">Tailored walkthrough for school trustees & principals</p>
                  </div>
                  <Pill tone="emerald">Instant Confirmation</Pill>
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-ink-700 dark:text-ink-300">
                    Institution / School Name *
                  </label>
                  <div className="relative mt-1">
                    <School className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Saraswati Vidhya Mandir Hr Sec School"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      className="w-full rounded-xl border border-ink-200 bg-ink-50/50 pl-9 pr-3 py-2 text-[12.5px] text-ink-900 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11.5px] font-bold text-ink-700 dark:text-ink-300">
                      Contact Person
                    </label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" />
                      <input
                        type="text"
                        placeholder="Dr. R. K. Sharma"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className="w-full rounded-xl border border-ink-200 bg-ink-50/50 pl-9 pr-3 py-2 text-[12.5px] text-ink-900 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11.5px] font-bold text-ink-700 dark:text-ink-300">Designation</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-ink-200 bg-ink-50/50 px-3 py-2 text-[12.5px] text-ink-900 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white"
                    >
                      <option value="Principal">Principal</option>
                      <option value="Director / Trustee">Director / Trustee</option>
                      <option value="Vice Principal">Vice Principal</option>
                      <option value="Administrator">Administrator</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11.5px] font-bold text-ink-700 dark:text-ink-300">
                      Mobile / WhatsApp *
                    </label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98260 12345"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-ink-200 bg-ink-50/50 pl-9 pr-3 py-2 text-[12.5px] text-ink-900 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11.5px] font-bold text-ink-700 dark:text-ink-300">
                      Official Email
                    </label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-ink-400" />
                      <input
                        type="email"
                        placeholder="principal@svm.edu"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-ink-200 bg-ink-50/50 pl-9 pr-3 py-2 text-[12.5px] text-ink-900 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11.5px] font-bold text-ink-700 dark:text-ink-300">
                      Current Students
                    </label>
                    <select
                      value={formData.studentCount}
                      onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-ink-200 bg-ink-50/50 px-3 py-2 text-[12.5px] text-ink-900 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white"
                    >
                      <option value="Under 500 students">Under 500 students</option>
                      <option value="500 - 1500 students">500 - 1,500 students</option>
                      <option value="1500 - 3000 students">1,500 - 3,000 students</option>
                      <option value="3000+ students (Multi-Campus)">3,000+ (Multi-Campus)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11.5px] font-bold text-ink-700 dark:text-ink-300">
                      Target Demo Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-ink-200 bg-ink-50/50 px-3 py-2 text-[12.5px] text-ink-900 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11.5px] font-bold text-ink-700 dark:text-ink-300">
                    Primary Administrative Pain Point
                  </label>
                  <select
                    value={formData.painPoint}
                    onChange={(e) => setFormData({ ...formData, painPoint: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-ink-200 bg-ink-50/50 px-3 py-2 text-[12.5px] text-ink-900 outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white"
                  >
                    <option value="Severe fee dues & manual follow-up struggles">
                      Severe fee dues & manual follow-up struggles
                    </option>
                    <option value="Attendance leakage & morning paper roll call delays">
                      Attendance leakage & morning paper roll call delays
                    </option>
                    <option value="Chaotic report card generation at term end">
                      Chaotic report card generation at term end
                    </option>
                    <option value="Parent complaints regarding bus tracking & notices">
                      Parent complaints regarding bus tracking & notices
                    </option>
                    <option value="Lack of a single consolidated executive dashboard">
                      Lack of a single consolidated executive dashboard
                    </option>
                  </select>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="w-full bg-brand-600 hover:bg-brand-700 shadow-lg justify-center py-2.5 text-[13.5px]"
                    icon={<Send className="h-4 w-4" />}
                  >
                    Schedule Free On-Campus / Virtual Demo
                  </Button>
                  <p className="mt-2 text-center text-[10.5px] text-ink-400">
                    Guaranteed confidential · No sales spam · Live customized walkthrough
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
