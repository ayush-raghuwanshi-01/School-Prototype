import { useState } from 'react'
import { GraduationCap, ShieldCheck, UserCheck, Lock, Mail, ArrowRight } from 'lucide-react'
import { Modal } from '../ui/Overlay'
import { Button } from '../ui/Button'
import { useApp } from '../../state/store'
import type { Role } from '../../data/school'

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { setRoleId, setRoute, pushToast, triggerCelebration } = useApp()
  const [activeTab, setActiveTab] = useState<'admin' | 'teacher' | 'student'>('admin')
  const [email, setEmail] = useState('principal@rivertonvalley.edu.in')
  const [password, setPassword] = useState('••••••••••••')
  const [loading, setLoading] = useState(false)

  const handleTabChange = (tab: 'admin' | 'teacher' | 'student') => {
    setActiveTab(tab)
    if (tab === 'admin') {
      setEmail('principal@rivertonvalley.edu.in')
    } else if (tab === 'teacher') {
      setEmail('dr.shalini.verma@rivertonvalley.edu.in')
    } else {
      setEmail('aarav.sharma@student.rivertonvalley.edu.in')
    }
  }

  const handleLogin = (roleToSet?: Role) => {
    const roleId = roleToSet || (activeTab === 'student' ? 'student' : activeTab)
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setRoleId(roleId)
      setRoute('dashboard')
      onClose()

      const label = roleId === 'admin' ? 'Administrator' : roleId === 'teacher' ? 'Class Teacher' : 'Student Portal'
      triggerCelebration({ message: `Signed in to ${label}!` })
      pushToast({
        tone: 'success',
        title: `Welcome to Riverton Valley School`,
        description: `Logged in as ${label} · Session active`,
      })
    }, 600)
  }

  return (
    <Modal open={open} onClose={onClose} title="Riverton Valley School · Unified Portal Login" size="md">
      <div className="p-5 space-y-5">
        {/* Institutional Header */}
        <div className="flex items-center gap-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 p-3.5 text-emerald-950">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-700 text-white font-black text-xs shadow-sm">
            RVS
          </div>
          <div>
            <h4 className="text-[13px] font-extrabold uppercase tracking-wide">Riverton Valley School, Bhopal</h4>
            <p className="text-[11px] text-emerald-800 font-medium">
              CBSE Affiliation No. 1031461 · Secure Role-Based Access
            </p>
          </div>
        </div>

        {/* 3 Role Tabs */}
        <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-slate-200 bg-slate-100/80 p-1">
          {[
            { id: 'admin', label: 'Admin / Principal', icon: ShieldCheck },
            { id: 'teacher', label: 'Teacher / Faculty', icon: UserCheck },
            { id: 'student', label: 'Student Portal', icon: GraduationCap },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id as any)}
              className={`press flex flex-col items-center justify-center gap-1 rounded-lg py-2.5 px-2 text-center transition-all ${
                activeTab === t.id
                  ? 'bg-white font-bold text-emerald-800 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 font-medium'
              }`}
            >
              <t.icon className={`h-4 w-4 ${activeTab === t.id ? 'text-emerald-700' : 'text-slate-400'}`} />
              <span className="text-[11px] leading-none">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Role Briefing */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-3 text-[11.5px] leading-relaxed text-slate-600">
          {activeTab === 'admin' && (
            <p>
              <strong className="font-bold text-slate-900">Principal & Administration Console:</strong> Full
              institutional governance across 1,480 students, CBSE compliance disclosures, fee collection analytics, and
              live campus gate RFID activity.
            </p>
          )}
          {activeTab === 'teacher' && (
            <p>
              <strong className="font-bold text-slate-900">Faculty Workspace (Dr. Shalini Verma):</strong> Daily
              timetable, homeroom attendance register (XII-B), subject marks entry with AI teacher comments, and daily
              homework dispatcher.
            </p>
          )}
          {activeTab === 'student' && (
            <p>
              <strong className="font-bold text-slate-900">Student & Family Portal (Aarav Sharma):</strong> Live
              attendance gauge, subject scores with 1-click official CBSE report card PDF, homework schedule, and direct
              teacher messaging.
            </p>
          )}
        </div>

        {/* Credentials Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleLogin()
          }}
          className="space-y-3.5"
        >
          <div>
            <label className="block text-[11.5px] font-bold text-slate-700">
              {activeTab === 'student'
                ? 'Student Scholar ID / Email'
                : activeTab === 'teacher'
                  ? 'Faculty ID / Email'
                  : 'Admin Username / Email'}
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-[12.5px] text-slate-900 outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11.5px] font-bold text-slate-700">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-[12.5px] text-slate-900 outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-md justify-center py-2.5 text-[13px]"
            icon={<ArrowRight className="h-4 w-4" />}
          >
            Sign in as {activeTab === 'admin' ? 'Administrator' : activeTab === 'teacher' ? 'Class Teacher' : 'Student'}
          </Button>
        </form>

        {/* Quick Demo 1-Click Launchers */}
        <div className="border-t border-slate-100 pt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2">
            Instant Prototype Fast-Login (1-Click)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleLogin('admin')}
              className="press rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-2 text-[10.5px] font-bold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            >
              ⚡ Admin Demo
            </button>
            <button
              onClick={() => handleLogin('teacher')}
              className="press rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-2 text-[10.5px] font-bold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            >
              ⚡ Teacher Demo
            </button>
            <button
              onClick={() => handleLogin('student')}
              className="press rounded-lg border border-slate-200 bg-slate-50 py-1.5 px-2 text-[10.5px] font-bold text-slate-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            >
              ⚡ Student Demo
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
