import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radio, CheckCircle2, ScanFace, CreditCard, Send, UserCheck } from 'lucide-react'
import { Modal } from '../ui/Overlay'
import { Button } from '../ui/Button'
import { Pill } from '../ui/Badge'
import { Avatar } from '../ui/Form'

interface ScanLog {
  id: string
  name: string
  classId: string
  time: string
  method: 'RFID Card' | 'Face Recognition'
  gate: string
  parentAlert: boolean
}

const INITIAL_LOGS: ScanLog[] = [
  {
    id: 'l-1',
    name: 'Aarav Sharma',
    classId: 'Class XII-B',
    time: '08:04:12 AM',
    method: 'RFID Card',
    gate: 'Gate 01 (Main)',
    parentAlert: true,
  },
  {
    id: 'l-2',
    name: 'Diya Patel',
    classId: 'Class X-A',
    time: '08:03:48 AM',
    method: 'Face Recognition',
    gate: 'Gate 02 (Junior Wing)',
    parentAlert: true,
  },
  {
    id: 'l-3',
    name: 'Kabir Joshi',
    classId: 'Class VIII-C',
    time: '08:02:15 AM',
    method: 'RFID Card',
    gate: 'Gate 01 (Main)',
    parentAlert: true,
  },
  {
    id: 'l-4',
    name: 'Simran Kaur',
    classId: 'Class XI-A',
    time: '08:00:52 AM',
    method: 'RFID Card',
    gate: 'Gate 03 (Bus Bay)',
    parentAlert: true,
  },
]

export function BiometricScanModal({
  open,
  onClose,
  onPunched,
}: {
  open: boolean
  onClose: () => void
  onPunched?: (studentName: string) => void
}) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanSuccess, setScanSuccess] = useState(false)
  const [mode, setMode] = useState<'rfid' | 'face'>('rfid')
  const [logs, setLogs] = useState<ScanLog[]>(INITIAL_LOGS)
  const [lastStudent] = useState({
    name: 'Aarav Sharma',
    classId: 'XII-B',
    roll: '01',
    admissionNo: 'SVM-2018-0429',
    guardian: 'Rakesh Sharma (Father)',
    phone: '+91 98260 11442',
    house: 'Ganga',
    bloodGroup: 'O+',
  })

  const simulateScan = () => {
    setIsScanning(true)
    setScanSuccess(false)

    setTimeout(() => {
      setIsScanning(false)
      setScanSuccess(true)
      const now = new Date()
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

      const newLog: ScanLog = {
        id: `l-${Date.now()}`,
        name: lastStudent.name,
        classId: `Class ${lastStudent.classId}`,
        time: timeStr,
        method: mode === 'rfid' ? 'RFID Card' : 'Face Recognition',
        gate: 'Gate 01 (Main)',
        parentAlert: true,
      }
      setLogs((prev) => [newLog, ...prev.slice(0, 5)])
      onPunched?.(lastStudent.name)
    }, 1100)
  }

  return (
    <Modal open={open} onClose={onClose} title="Hardware Integration · SmartGate Biometric & RFID Attendance" size="xl">
      <div className="space-y-6 p-5">
        {/* Hardware Status Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink-900 p-4 text-white dark:bg-white/[0.04]">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
            </span>
            <div>
              <p className="text-[13px] font-bold">SVM SmartGate Terminal v3.4 · Gate 01 Online</p>
              <p className="text-[11px] text-ink-400">
                Connected: Optical Face Sensor + Dual 13.56MHz NFC / RFID Reader
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Pill tone="emerald" dot>
              Synced with Cloud ERP
            </Pill>
            <span className="font-mono text-[11px] text-emerald-400">Latency: 14ms</span>
          </div>
        </div>

        {/* mode selector */}
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Visual Scanner Area */}
          <div className="relative overflow-hidden rounded-2xl border border-ink-200/80 bg-gradient-to-b from-ink-50/50 to-white p-5 text-center dark:border-white/10 dark:from-ink-900/60 dark:to-ink-950">
            {/* Terminal Viewport */}
            <div className="mx-auto flex h-48 max-w-sm flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink-300/80 bg-white p-4 shadow-inner dark:border-white/15 dark:bg-ink-900">
              <AnimatePresence mode="wait">
                {isScanning ? (
                  <motion.div
                    key="scanning"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                        className="h-16 w-16 rounded-full border-4 border-brand-200 border-t-brand-600 dark:border-brand-900 dark:border-t-brand-400"
                      />
                      <Radio className="absolute inset-0 m-auto h-6 w-6 animate-pulse text-brand-600 dark:text-brand-400" />
                    </div>
                    <p className="font-mono text-[12px] font-bold text-brand-600 dark:text-brand-400">
                      Reading {mode === 'rfid' ? 'Smart ID NFC chip…' : 'Biometric facial vectors…'}
                    </p>
                  </motion.div>
                ) : scanSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-lg dark:bg-emerald-500/20 dark:text-emerald-400">
                      <CheckCircle2 className="h-10 w-10 animate-bounce" />
                    </div>
                    <p className="text-[14px] font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                      ACCESS GRANTED · GATE OPEN
                    </p>
                    <p className="text-[11px] text-ink-500">Auto-recorded into daily register</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                      {mode === 'rfid' ? <CreditCard className="h-7 w-7" /> : <ScanFace className="h-7 w-7" />}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-ink-800 dark:text-white">
                        {mode === 'rfid' ? 'Hold Student ID Card to Terminal' : 'Position Face in Gate Viewport'}
                      </p>
                      <p className="text-[11px] text-ink-400">Simulates hardware punch-in event</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Controls */}
            <div className="mt-5 flex items-center justify-center gap-3">
              <Button
                variant={mode === 'rfid' ? 'primary' : 'outline'}
                size="sm"
                icon={<CreditCard className="h-3.5 w-3.5" />}
                onClick={() => setMode('rfid')}
              >
                RFID Smart Card
              </Button>
              <Button
                variant={mode === 'face' ? 'primary' : 'outline'}
                size="sm"
                icon={<ScanFace className="h-3.5 w-3.5" />}
                onClick={() => setMode('face')}
              >
                Face Biometrics
              </Button>
            </div>

            <div className="mt-4">
              <Button
                className="w-full shadow-lg"
                loading={isScanning}
                onClick={simulateScan}
                icon={<Radio className="h-4 w-4" />}
              >
                {isScanning
                  ? 'Simulating Scan…'
                  : mode === 'rfid'
                    ? 'Simulate Tap Student ID Card'
                    : 'Simulate Facial Recognition Scan'}
              </Button>
            </div>
          </div>

          {/* Student Card & Parent Notification Preview */}
          <div className="space-y-4">
            {/* Student ID Card Visual */}
            <div className="overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-ink-900">
              <div className="bg-brand-600 px-4 py-2 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-widest uppercase">Student Identity Card</span>
                  <span className="font-mono text-[9px] bg-brand-700 px-1.5 py-0.5 rounded">RFID: 0x8FA12B</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-3">
                  <Avatar name={lastStudent.name} size={54} className="ring-2 ring-brand-500/20" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-extrabold text-ink-900 dark:text-white">{lastStudent.name}</p>
                    <p className="text-[11.5px] font-medium text-brand-600 dark:text-brand-400">
                      Class {lastStudent.classId} · Roll #{lastStudent.roll}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-ink-400">Adm No: {lastStudent.admissionNo}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-ink-100 pt-3 text-[11px] dark:border-white/5">
                  <div>
                    <span className="text-ink-400 text-[10px] block">House</span>
                    <span className="font-bold text-ink-800 dark:text-ink-200">{lastStudent.house}</span>
                  </div>
                  <div>
                    <span className="text-ink-400 text-[10px] block">Blood Group</span>
                    <span className="font-bold text-ink-800 dark:text-ink-200">{lastStudent.bloodGroup}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instant Parent Dispatch Preview */}
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3.5 dark:border-emerald-500/20 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <Send className="h-3.5 w-3.5 shrink-0" />
                <span className="text-[11.5px] font-bold">Instant Parent Notification (Dispatched on Tap)</span>
              </div>
              <div className="mt-2 rounded-xl bg-white p-2.5 text-[11px] leading-relaxed text-ink-700 shadow-xs dark:bg-ink-900 dark:text-ink-300">
                <span className="font-bold text-ink-900 dark:text-white">WhatsApp & SMS Alert:</span> "Dear Mr.{' '}
                {lastStudent.guardian.split(' ')[0]}, your ward {lastStudent.name} has safely entered Saraswati Vidhya
                Mandir via Gate 01 at {logs[0]?.time || '08:04 AM'}. Attendance recorded: Present."
              </div>
            </div>
          </div>
        </div>

        {/* Live Gate Entry Feed */}
        <div className="rounded-2xl border border-ink-200/80 bg-white p-4 dark:border-white/10 dark:bg-ink-900">
          <div className="flex items-center justify-between border-b border-ink-100 pb-2.5 dark:border-white/5">
            <span className="text-[12px] font-bold text-ink-800 dark:text-white">
              Recent Gate Check-in Stream (Today)
            </span>
            <span className="text-[10.5px] text-ink-400">Auto-refreshed live</span>
          </div>
          <div className="mt-2.5 divide-y divide-ink-100 text-[11.5px] dark:divide-white/5">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2.5">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="font-bold text-ink-900 dark:text-white">{log.name}</span>
                  <span className="text-ink-400">({log.classId})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10.5px] text-ink-400">{log.time}</span>
                  <Pill tone="emerald" className="text-[10px] py-0.5">
                    {log.method}
                  </Pill>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
