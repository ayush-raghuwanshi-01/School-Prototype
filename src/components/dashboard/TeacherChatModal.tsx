import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCheck, Check } from 'lucide-react'
import { Modal } from '../ui/Overlay'
import { Button } from '../ui/Button'
import { Avatar } from '../ui/Form'
import { Pill } from '../ui/Badge'

interface ChatMessage {
  id: string
  sender: 'parent' | 'teacher'
  text: string
  time: string
  status?: 'sent' | 'delivered' | 'read'
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    sender: 'teacher',
    text: 'Good afternoon Mr. Mehta! Aarav performed exceptionally well in the Physics optics practical today, securing 94/100.',
    time: '11:45 AM',
  },
  {
    id: 'm-2',
    sender: 'parent',
    text: 'Thank you Dr. Verma! He spent the weekend reviewing the lens formulas. Is the record notebook submission deadline tomorrow?',
    time: '12:10 PM',
    status: 'read',
  },
  {
    id: 'm-3',
    sender: 'teacher',
    text: 'Yes, please ensure he carries the signed laboratory journal tomorrow morning for board internal moderation.',
    time: '12:15 PM',
  },
]

const QUICK_PROMPTS = [
  'Requesting 1-day sick leave for tomorrow',
  'Confirming Saturday PTM slot (10:30 AM)',
  'Inquiring about Chemistry project deadline',
]

export function TeacherChatModal({
  open,
  onClose,
  onSent,
}: {
  open: boolean
  onClose: () => void
  onSent?: (msg: string) => void
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  })

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input
    if (!text.trim()) return

    const parentMsg: ChatMessage = {
      id: `m-parent-${messages.length + 1}`,
      sender: 'parent',
      text: text.trim(),
      time: '12:16 PM',
      status: 'delivered',
    }

    setMessages((prev) => [...prev, parentMsg])
    setInput('')
    onSent?.(text.trim())

    // Simulate teacher typing and response
    setTimeout(() => {
      setIsTyping(true)
    }, 700)

    setTimeout(() => {
      setIsTyping(false)
      const replyMsg: ChatMessage = {
        id: `m-reply-${messages.length + 2}`,
        sender: 'teacher',
        text: `Thank you for the update, Mr. Mehta. I have noted this in the class records and shared it with the subject faculty.`,
        time: '12:17 PM',
      }
      setMessages((prev) => [...prev, replyMsg])
    }, 2200)
  }

  return (
    <Modal open={open} onClose={onClose} title="Direct Parent-Teacher Communication Portal" size="md">
      <div className="flex h-[520px] flex-col">
        {/* Teacher Header Bar */}
        <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50/70 px-4 py-3 dark:border-white/8 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar name="Dr. Shalini Verma" size={40} className="ring-2 ring-brand-500/20" />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-ink-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-ink-900 dark:text-white">Dr. Shalini Verma</span>
                <Pill tone="emerald" className="py-0 text-[9.5px]">
                  Online
                </Pill>
              </div>
              <p className="text-[11px] text-ink-400">Class Teacher (XII-B) & Head of Physics</p>
            </div>
          </div>
          <span className="text-[10px] text-ink-400 font-medium">Synced with Parent Mobile App</span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 space-y-3 overflow-y-auto p-4 bg-ink-50/30 dark:bg-ink-950/40">
          <div className="text-center">
            <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold text-ink-400 shadow-2xs dark:bg-ink-900">
              End-to-end encrypted school communication
            </span>
          </div>

          {messages.map((m) => {
            const isMe = m.sender === 'parent'
            return (
              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-[12.5px] shadow-2xs leading-relaxed ${
                    isMe
                      ? 'rounded-br-xs bg-brand-600 text-white dark:bg-brand-600'
                      : 'rounded-bl-xs border border-ink-200/70 bg-white text-ink-800 dark:border-white/10 dark:bg-ink-900 dark:text-ink-100'
                  }`}
                >
                  <p>{m.text}</p>
                  <div
                    className={`mt-1 flex items-center justify-end gap-1 text-[9.5px] ${
                      isMe ? 'text-white/70' : 'text-ink-400'
                    }`}
                  >
                    <span>{m.time}</span>
                    {isMe && (
                      <span>
                        {m.status === 'read' ? (
                          <CheckCheck className="h-3 w-3 text-cyan-200" />
                        ) : (
                          <Check className="h-3 w-3 text-white/70" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-[11px] text-ink-400"
              >
                <div className="flex gap-1 rounded-full bg-ink-100 px-3 py-1.5 dark:bg-white/10">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400 [animation-delay:0.4s]" />
                </div>
                <span>Dr. Shalini Verma is typing…</span>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="border-t border-ink-100 bg-white p-2 dark:border-white/8 dark:bg-ink-900">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="press shrink-0 rounded-lg border border-ink-200/80 bg-ink-50 px-2.5 py-1 text-[11px] font-medium text-ink-600 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-300 dark:hover:bg-brand-500/10 dark:hover:text-brand-300"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input field */}
          <div className="mt-1 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend()
              }}
              placeholder="Type message to class teacher…"
              className="flex-1 rounded-xl border border-ink-200 bg-ink-50/60 px-3 py-2 text-[12.5px] outline-none focus:border-brand-500 focus:bg-white dark:border-white/10 dark:bg-white/5 dark:focus:border-brand-400"
            />
            <Button size="sm" variant="primary" onClick={() => handleSend()} icon={<Send className="h-3.5 w-3.5" />}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
