'use client'

import { useState, useEffect, useRef } from 'react'
import useAuthStore from '@/lib/auth'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const login = useAuthStore((state) => state.login)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = login(password)
    if (isValid) {
      onClose()
      setPassword('')
      setError('')
    } else {
      setError('密码错误')
      if (inputRef.current) {
        inputRef.current.select()
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        className="absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="关闭登录窗口"
      />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        className="absolute left-1/2 top-1/2 w-[28rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-[#1A1C1E] shadow-2xl ring-1 ring-white/10"
        style={{
          animation: 'modal-appear 0.2s ease-out',
        }}
      >
        <style jsx global>{`
          @keyframes modal-appear {
            from {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
          @keyframes input-appear {
            from {
              opacity: 0;
              transform: translateY(4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
        <div className="p-4">
          <h2 id="login-title" className="sr-only">
            管理员登录
          </h2>
          <form onSubmit={handleSubmit}>
            <div
              className="relative"
              style={{
                animation: 'input-appear 0.2s ease-out',
              }}
            >
              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-[#2A2D30] px-4 py-3 text-[15px] text-white placeholder-gray-400 outline-none ring-1 ring-white/10 transition-all duration-200 focus:bg-[#313438] focus:ring-white/20"
                placeholder="输入管理员密码..."
                aria-label="管理员密码"
                aria-invalid={!!error}
                aria-describedby={error ? 'password-error' : undefined}
              />
              {error && (
                <div id="password-error" className="absolute -bottom-6 left-0 text-sm text-red-400">
                  {error}
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="border-t border-white/[0.08] bg-[#2A2D30] px-4 py-3">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex space-x-4">
              <span>
                <kbd className="rounded border border-white/20 bg-[#1A1C1E] px-1.5 py-0.5 font-sans">
                  ⏎
                </kbd>{' '}
                确认
              </span>
              <span>
                <kbd className="rounded border border-white/20 bg-[#1A1C1E] px-1.5 py-0.5 font-sans">
                  Esc
                </kbd>{' '}
                取消
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
