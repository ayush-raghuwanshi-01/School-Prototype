import { useState } from 'react'
import { Bus, ShieldCheck, CheckCircle2, Navigation } from 'lucide-react'
import { Eyebrow } from '../ui/Card'
import { Pill } from '../ui/Badge'

const ROUTES = [
  {
    id: 'r1',
    name: 'Route 1 · Ayodhya Bypass & Karond',
    stops: ['Bilkhiriya Campus', 'Bhanpur Bridge', 'Ayodhya Nagar', 'Karond Square', 'DIG Bungalow'],
    busNo: 'MP-04-PA-2101',
    driver: 'Mahesh Sharma (+91 98260 11442)',
    morningTime: '06:50 AM',
    eveningDrop: '03:45 PM',
    status: 'Active · On Time',
  },
  {
    id: 'r2',
    name: 'Route 2 · Raisen Road & BHEL Township',
    stops: [
      'Bilkhiriya Campus',
      'Oriental College Trisection',
      'Anand Nagar',
      'Piplani',
      'Govindpura ITI',
      'BHEL Gate 1',
    ],
    busNo: 'MP-04-PA-2102',
    driver: 'Santosh Yadav (+91 94250 88219)',
    morningTime: '07:05 AM',
    eveningDrop: '03:35 PM',
    status: 'Active · On Time',
  },
  {
    id: 'r3',
    name: 'Route 3 · MP Nagar & Arera Colony',
    stops: [
      'Bilkhiriya Campus',
      'Prabhat Square',
      'Subhash Nagar Overbridge',
      'MP Nagar Zone 1',
      'Bittan Market',
      '10 No. Market Arera',
    ],
    busNo: 'MP-04-PA-2103',
    driver: 'Rameshwar Lodhi (+91 98270 44321)',
    morningTime: '06:45 AM',
    eveningDrop: '03:55 PM',
    status: 'Active · On Time',
  },
  {
    id: 'r4',
    name: 'Route 4 · Kolar Road & Nayapura',
    stops: [
      'Bilkhiriya Campus',
      'Chuna Bhatti',
      'Sarvdharm Sector A',
      'Nayapura',
      'D-Mart Kolar',
      'Bairagarh Chichali',
    ],
    busNo: 'MP-04-PA-2104',
    driver: 'Devendra Meena (+91 97550 12890)',
    morningTime: '06:40 AM',
    eveningDrop: '04:05 PM',
    status: 'Active · +8m Delay (Kolar PWD Roadwork)',
  },
  {
    id: 'r5',
    name: 'Route 5 · Hoshangabad Road & AIIMS Bhopal',
    stops: [
      'Bilkhiriya Campus',
      'Bagsewaniya',
      'AIIMS Residential Gate',
      'Misrod Square',
      'Aashima Mall',
      'Barkatullah University',
    ],
    busNo: 'MP-04-PA-2105',
    driver: 'Harishankar Sen (+91 94065 67210)',
    morningTime: '06:55 AM',
    eveningDrop: '03:50 PM',
    status: 'Active · On Time',
  },
  {
    id: 'r6',
    name: 'Route 6 · Shahpura & Bawadiya Kalan',
    stops: ['Bilkhiriya Campus', 'Shahpura Lake View', 'Manit Square', 'Gulmohar Colony', 'Bawadiya Kalan Crossing'],
    busNo: 'MP-04-PA-2106',
    driver: 'Kamal Kishor (+91 98930 76541)',
    morningTime: '07:00 AM',
    eveningDrop: '03:40 PM',
    status: 'Active · On Time',
  },
]

export function BhopalTransitSection() {
  const [selectedRoute, setSelectedRoute] = useState(ROUTES[0].id)
  const route = ROUTES.find((r) => r.id === selectedRoute) || ROUTES[0]

  return (
    <section id="transit" className="relative bg-white py-20 sm:py-28 border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow className="text-emerald-800 bg-emerald-50 border-emerald-200">
              <Bus className="h-3.5 w-3.5 text-emerald-600" /> Bhopal City Transit Network · Riverton Valley School
            </Eyebrow>
            <h2 className="mt-4 text-[clamp(2.1rem,4.4vw,3.2rem)] leading-[1.03] font-extrabold tracking-[-0.04em] text-slate-900">
              Safe, air-conditioned bus routes connecting{' '}
              <span className="editorial italic text-emerald-700">every corner of Bhopal.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
              Our 15-acre Bilkhiriya campus is supported by GPS-tracked school buses with speed governors, CCTV cameras,
              female attendants, and live parent app arrival updates across all 6 major Bhopal city transit corridors.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2.5">
            <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0" />
            <span className="text-[12px] font-bold text-slate-700">
              100% Supreme Court Child Safety Compliant Fleet
            </span>
          </div>
        </div>

        {/* Route Selector & Info */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr] items-start">
          {/* Routes list */}
          <div className="space-y-2.5">
            {ROUTES.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRoute(r.id)}
                className={`press w-full rounded-2xl border p-4 text-left transition-all ${
                  selectedRoute === r.id
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13.5px] font-bold text-slate-900">{r.name}</span>
                  <Pill tone={r.status.includes('Delay') ? 'amber' : 'emerald'} className="text-[10px] shrink-0" dot>
                    {r.status.includes('Delay') ? 'Slow' : 'On Time'}
                  </Pill>
                </div>
                <p className="mt-1 text-[11.5px] text-slate-500 truncate">{r.stops.slice(1, 4).join(' → ')} …</p>
              </button>
            ))}
          </div>

          {/* Detailed Route Card */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800">
                  <Navigation className="h-3 w-3" /> Dedicated School Transit Corridor
                </span>
                <h3 className="mt-2 text-[19px] font-extrabold text-slate-900">{route.name}</h3>
                <p className="text-[12px] text-slate-600">
                  Bus Vehicle: <strong className="text-slate-800">{route.busNo}</strong> · Driver: {route.driver}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">First Pickup</span>
                <p className="text-[17px] font-extrabold text-slate-900">{route.morningTime}</p>
                <span className="text-[10.5px] text-slate-500">Drop: {route.eveningDrop}</span>
              </div>
            </div>

            {/* Stops list */}
            <div className="mt-6">
              <h4 className="text-[11.5px] font-extrabold uppercase tracking-wider text-slate-400">
                Scheduled Boarding & Drop-off Points
              </h4>
              <div className="mt-4 space-y-3 relative pl-6">
                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-emerald-300" />
                {route.stops.map((stop, i) => (
                  <div key={stop} className="relative flex items-center gap-3">
                    <span className="absolute -left-6 grid h-4 w-4 place-items-center rounded-full bg-emerald-600 text-white ring-4 ring-white text-[9px] font-bold">
                      {i + 1}
                    </span>
                    <span className="text-[13px] font-bold text-slate-800">{stop}</span>
                    {i === 0 && (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-extrabold text-emerald-800">
                        Campus Origin
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Feature Checklist */}
            <div className="mt-8 pt-5 border-t border-slate-200/80 grid sm:grid-cols-2 gap-2.5 text-[11.5px] text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                Real-time RFID Student Tap-in / Tap-out
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                CCTV Inside Saloon & Dual Dashcam
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                Dedicated Female Attendant Onboard
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                Speed Governors Capped at 40 km/h
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
