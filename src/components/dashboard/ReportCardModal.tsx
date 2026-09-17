import { useRef } from 'react'
import { Printer, Download, Sparkles } from 'lucide-react'
import { Modal } from '../ui/Overlay'
import { Button } from '../ui/Button'
import { Pill } from '../ui/Badge'

interface StudentRecord {
  name: string
  roll: number
  classId: string
  admissionNo: string
  guardian: string
  attendancePct: number
  house: string
}

function handlePrint() {
  if (typeof window !== 'undefined') {
    window.print()
  }
}

export function ReportCardModal({
  open,
  onClose,
  student,
  aiRemark,
}: {
  open: boolean
  onClose: () => void
  student?: StudentRecord | null
  aiRemark?: string
}) {
  const printRef = useRef<HTMLDivElement>(null)

  const activeStudent: StudentRecord = student || {
    name: 'Aarav Sharma',
    roll: 1,
    classId: 'XII-B',
    admissionNo: 'SVM-2018-0429',
    guardian: 'Rakesh Sharma',
    attendancePct: 95.7,
    house: 'Ganga',
  }

  const scores = [
    { name: 'Physics (Theory & Practical)', code: '042', pt: 9.5, nb: 5.0, se: 4.8, term: 75, total: 94, grade: 'A1' },
    {
      name: 'Chemistry (Theory & Practical)',
      code: '043',
      pt: 8.8,
      nb: 4.8,
      se: 4.6,
      term: 70,
      total: 88,
      grade: 'A2',
    },
    { name: 'Mathematics Core', code: '041', pt: 10.0, nb: 5.0, se: 5.0, term: 77, total: 97, grade: 'A1' },
    { name: 'English Core', code: '301', pt: 9.0, nb: 4.5, se: 4.5, term: 73, total: 91, grade: 'A1' },
    { name: 'Computer Science (Python)', code: '083', pt: 9.2, nb: 4.8, se: 4.8, term: 73, total: 92, grade: 'A1' },
  ]

  const totalObtained = scores.reduce((acc, curr) => acc + curr.total, 0)
  const maxMarks = scores.length * 100
  const percentage = (totalObtained / maxMarks) * 100

  return (
    <Modal open={open} onClose={onClose} title="Official Board Grade Sheet & Progress Card Generator" size="xl">
      <div className="space-y-4 p-5">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-xl bg-ink-50 p-3.5 dark:bg-ink-900">
          <div className="flex items-center gap-2">
            <Pill tone="emerald" dot>
              Official CBSE / Board Template
            </Pill>
            <span className="text-[12px] font-bold text-ink-700 dark:text-ink-200">
              Formatted for 1-Click Print & PDF Export (A4 Ready)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Printer className="h-3.5 w-3.5" />} onClick={handlePrint}>
              Print / Save as PDF
            </Button>
            <Button variant="primary" size="sm" icon={<Download className="h-3.5 w-3.5" />} onClick={handlePrint}>
              Download PDF
            </Button>
          </div>
        </div>

        {/* Printable Official Document Container */}
        <div
          ref={printRef}
          id="printable-report-card"
          className="report-card-sheet mx-auto max-w-[800px] rounded-xl border-4 border-double border-ink-800 bg-white p-6 text-ink-900 shadow-xl print:m-0 print:border-2 print:p-4 print:shadow-none"
        >
          {/* Header Banner */}
          <div className="border-b-2 border-ink-800 pb-3 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-full border-2 border-emerald-900 bg-emerald-50 font-black text-emerald-800 text-lg">
                RVS
              </div>
              <div>
                <h1 className="text-[18px] font-black uppercase tracking-wider text-slate-950">
                  RIVERTON VALLEY SCHOOL, BHOPAL
                </h1>
                <p className="text-[11px] font-bold text-emerald-800">
                  CBSE Affiliated · Affiliation No. 1031461 · School Code: 50924
                </p>
                <p className="text-[10px] text-slate-500">
                  15-Acre Nature Campus, Bilkhiriya, Raisen Road, Bhopal, MP 462022 · AKS Educational Society
                </p>
              </div>
            </div>
            <div className="mt-2.5 inline-block rounded-md bg-ink-900 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white print:bg-black print:text-white">
              Mid-Term Academic Progress Report · Session 2026-27
            </div>
          </div>

          {/* Student Profile Information Grid */}
          <div className="my-3.5 grid grid-cols-2 gap-x-6 gap-y-1.5 rounded-lg border border-ink-300 bg-ink-50/50 p-3 text-[11.5px]">
            <div>
              <span className="font-semibold text-ink-500">Student Name: </span>
              <strong className="font-extrabold uppercase text-ink-900">{activeStudent.name}</strong>
            </div>
            <div>
              <span className="font-semibold text-ink-500">Admission / Scholar No: </span>
              <strong className="font-bold">{activeStudent.admissionNo}</strong>
            </div>
            <div>
              <span className="font-semibold text-ink-500">Class & Section: </span>
              <strong className="font-bold">{activeStudent.classId}</strong>
            </div>
            <div>
              <span className="font-semibold text-ink-500">Roll Number: </span>
              <strong className="font-bold">#{activeStudent.roll}</strong>
            </div>
            <div>
              <span className="font-semibold text-ink-500">Father / Guardian: </span>
              <strong className="font-bold">Mr. {activeStudent.guardian}</strong>
            </div>
            <div>
              <span className="font-semibold text-ink-500">Mother: </span>
              <strong className="font-bold">Mrs. Sunita Sharma</strong>
            </div>
            <div>
              <span className="font-semibold text-ink-500">House: </span>
              <strong className="font-bold">{activeStudent.house} House</strong>
            </div>
            <div>
              <span className="font-semibold text-ink-500">Term Attendance: </span>
              <strong className="font-bold text-emerald-700">178 / 186 Days ({activeStudent.attendancePct}%)</strong>
            </div>
          </div>

          {/* Scholastic Marks Table */}
          <div className="my-3 overflow-hidden rounded-lg border border-ink-300">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-ink-100 font-bold uppercase tracking-wider text-ink-800 border-b border-ink-300">
                <tr>
                  <th className="p-2 border-r border-ink-300">Subject Name</th>
                  <th className="p-2 text-center border-r border-ink-300">Code</th>
                  <th className="p-2 text-center border-r border-ink-300">PT (10)</th>
                  <th className="p-2 text-center border-r border-ink-300">NB (5)</th>
                  <th className="p-2 text-center border-r border-ink-300">SE (5)</th>
                  <th className="p-2 text-center border-r border-ink-300">Term (80)</th>
                  <th className="p-2 text-center border-r border-ink-300">Total (100)</th>
                  <th className="p-2 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {scores.map((row) => (
                  <tr key={row.name} className="hover:bg-ink-50/50">
                    <td className="p-2 font-semibold text-ink-900 border-r border-ink-200">{row.name}</td>
                    <td className="p-2 text-center font-mono text-ink-500 border-r border-ink-200">{row.code}</td>
                    <td className="p-2 text-center tabular border-r border-ink-200">{row.pt.toFixed(1)}</td>
                    <td className="p-2 text-center tabular border-r border-ink-200">{row.nb.toFixed(1)}</td>
                    <td className="p-2 text-center tabular border-r border-ink-200">{row.se.toFixed(1)}</td>
                    <td className="p-2 text-center tabular border-r border-ink-200">{row.term}</td>
                    <td className="p-2 text-center font-bold tabular border-r border-ink-200">{row.total}</td>
                    <td className="p-2 text-center font-black text-brand-700">{row.grade}</td>
                  </tr>
                ))}
                {/* Aggregate Row */}
                <tr className="bg-ink-100/70 font-bold border-t-2 border-ink-400">
                  <td colSpan={6} className="p-2 text-right uppercase border-r border-ink-300">
                    Aggregate Result (Total Marks Obtained):
                  </td>
                  <td className="p-2 text-center font-black text-[12px] border-r border-ink-300">
                    {totalObtained} / {maxMarks}
                  </td>
                  <td className="p-2 text-center font-black text-[12px] text-emerald-700">
                    {percentage.toFixed(1)}% (A1)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Co-Scholastic & Discipline */}
          <div className="my-3 grid grid-cols-4 gap-2 text-center text-[10.5px]">
            <div className="rounded border border-ink-200 p-1.5 bg-ink-50/40">
              <span className="block text-ink-500 font-medium">Work Education</span>
              <strong className="text-[12px] font-bold text-ink-800">Grade A</strong>
            </div>
            <div className="rounded border border-ink-200 p-1.5 bg-ink-50/40">
              <span className="block text-ink-500 font-medium">Art Education</span>
              <strong className="text-[12px] font-bold text-ink-800">Grade A</strong>
            </div>
            <div className="rounded border border-ink-200 p-1.5 bg-ink-50/40">
              <span className="block text-ink-500 font-medium">Physical Education</span>
              <strong className="text-[12px] font-bold text-ink-800">Grade A+</strong>
            </div>
            <div className="rounded border border-ink-200 p-1.5 bg-ink-50/40">
              <span className="block text-ink-500 font-medium">General Discipline</span>
              <strong className="text-[12px] font-bold text-emerald-700">Grade A+</strong>
            </div>
          </div>

          {/* Class Teacher's Pedagogical Remark (with AI capability) */}
          <div className="my-3 rounded-lg border border-brand-200 bg-brand-50/40 p-3 text-[11px] print:border-ink-300 print:bg-transparent">
            <div className="flex items-center justify-between font-bold text-brand-900 print:text-black">
              <span className="uppercase tracking-wider">Class Teacher's Remark & Observations:</span>
              <span className="text-[9.5px] text-brand-700 print:hidden font-mono flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> AI Assisted Remark
              </span>
            </div>
            <p className="mt-1 leading-relaxed text-ink-800 italic print:text-black">
              "
              {aiRemark ||
                'Aarav demonstrates exceptional conceptual clarity in Physics and Mathematics, consistently ranking at the top of his class. He shows remarkable initiative during laboratory investigations. Highly disciplined, courteous, and an active asset to the house team.'}
              "
            </p>
          </div>

          {/* Official Signatures & Verification Seal */}
          <div className="mt-6 pt-4 border-t border-ink-300">
            <div className="flex items-end justify-between text-center text-[10.5px]">
              <div>
                <div className="h-9 border-b border-ink-400 font-serif italic text-ink-600 flex items-end justify-center pb-1">
                  Dr. Shalini Verma
                </div>
                <p className="font-bold text-ink-800 mt-1 uppercase">Class Teacher</p>
              </div>

              {/* Official Seal Mockup */}
              <div className="flex flex-col items-center">
                <div className="relative grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-emerald-800 text-emerald-800 text-[8px] font-bold uppercase rotate-[-8deg] p-1">
                  <div className="text-center leading-tight">
                    <span>★ RVS ★</span>
                    <span className="block text-[7px]">EXAM CELL</span>
                    <span>VERIFIED</span>
                  </div>
                </div>
                <p className="text-[9px] text-ink-400 font-mono mt-1">Ref: RVS/2026/8941</p>
              </div>

              <div>
                <div className="h-9 border-b border-ink-400 font-serif italic text-ink-600 flex items-end justify-center pb-1">
                  Dr. Sunita Sharma
                </div>
                <p className="font-bold text-ink-800 mt-1 uppercase">Principal & Head of School</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
