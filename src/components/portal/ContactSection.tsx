import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Navigation } from 'lucide-react'
import { Eyebrow } from '../ui/Card'
import { Button } from '../ui/Button'
import { useApp } from '../../state/store'

export function ContactSection() {
  const { pushToast } = useApp()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
      pushToast({
        tone: 'success',
        title: 'Message sent to Admissions Desk',
        description: 'Our campus coordinator will call you back shortly.',
      })
    }, 700)
  }

  return (
    <section id="contact" className="relative bg-slate-50/70 py-20 sm:py-28 border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow className="text-emerald-800 bg-emerald-50 border-emerald-200">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" /> Connect With Us · Riverton Valley School
            </Eyebrow>
            <h2 className="mt-4 text-[clamp(2.1rem,4.4vw,3.2rem)] leading-[1.03] font-extrabold tracking-[-0.04em] text-slate-900">
              Visit our green sanctuary or{' '}
              <span className="editorial italic text-emerald-700">get in touch today.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
              Located on Raisen Road near Bilkhiriya Bhopal, our 15-acre campus is easily accessible from all city
              sectors with our 6 dedicated school bus routes.
            </p>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs">
            <Clock className="h-5 w-5 text-emerald-700 shrink-0" />
            <div>
              <p className="text-[12px] font-bold text-slate-900">Visiting Hours: 8:00 AM – 4:30 PM</p>
              <p className="text-[11px] text-slate-500">Monday through Saturday · Prior appointment recommended</p>
            </div>
          </div>
        </div>

        {/* Contact Info & Direct Message Form */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.25fr] items-start">
          {/* Contact Details Cards */}
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h3 className="text-[16px] font-extrabold text-slate-900">Campus Coordinates</h3>

              <div className="flex items-start gap-3.5 text-[13px] text-slate-600">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <strong className="block text-slate-900 font-bold">15-Acre Nature Campus</strong>
                  <span>Riverton Valley School, Bilkhiriya, Raisen Road, Bhopal, Madhya Pradesh 462022</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-[13px] text-slate-600">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <strong className="block text-slate-900 font-bold">Admissions & Helpline</strong>
                  <span>+91 78699 66422 / +91 755 266 8800</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-[13px] text-slate-600">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <strong className="block text-slate-900 font-bold">Email Correspondence</strong>
                  <span>admissions@rivertonvalley.edu.in</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-[13px] text-slate-600">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <Navigation className="h-5 w-5" />
                </span>
                <div>
                  <strong className="block text-slate-900 font-bold">Society Governance</strong>
                  <span>AKS Educational Society, Bhopal · CBSE Affiliation No. 1031461</span>
                </div>
              </div>
            </div>

            {/* Quick Map Placeholder Card */}
            <div className="rounded-3xl border border-slate-200 bg-emerald-900 text-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="rounded-full bg-emerald-800 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-emerald-200">
                  Bhopal Transit Access
                </span>
                <h4 className="mt-3 text-[17px] font-extrabold">Easy 25-Min Drive from MP Nagar</h4>
                <p className="mt-1 text-[12.5px] text-emerald-100/90 leading-relaxed">
                  Smooth 4-lane connectivity via Raisen Road and Ayodhya Bypass with 6 school bus corridors.
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-emerald-800 text-[11px] text-emerald-300 font-mono">
                GPS: 23.2599° N, 77.4126° E · Bhopal, MP
              </div>
            </div>
          </div>

          {/* Quick Message / Enquiry Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h3 className="text-[19px] font-extrabold text-slate-900">Send a Direct Message / Schedule a Visit</h3>
            <p className="mt-1 text-[12.5px] text-slate-500">
              Have a quick question about admissions, fee structure, or bus routes? Write to us below.
            </p>

            {!sent ? (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Saxena"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-[13px] text-slate-900 outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Contact Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98260 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-[13px] text-slate-900 outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-slate-700 mb-1">Your Message / Query</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you'd like to know or request a weekend campus tour slot…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-[13px] text-slate-900 outline-none focus:border-emerald-600 focus:bg-white resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm justify-center py-2.5"
                  icon={<Send className="h-4 w-4" />}
                >
                  Send Message
                </Button>
              </form>
            ) : (
              <div className="py-8 text-center space-y-3">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h4 className="text-[17px] font-bold text-slate-900">Message Received</h4>
                <p className="text-[13px] text-slate-600 max-w-sm mx-auto">
                  Thank you, <strong>{name}</strong>. Our admissions officer will contact you at{' '}
                  <strong>{phone}</strong> within today.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSent(false)
                    setName('')
                    setPhone('')
                    setMessage('')
                  }}
                  className="mt-3"
                >
                  Send another message
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
