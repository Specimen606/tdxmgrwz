import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Home, Sparkles } from 'lucide-react'
import { cn } from '../ui'

const STEP_MAP: Record<string, { step: number; total: number; title: string }> = {
  '/quiz': { step: 1, total: 4, title: '趣味测试' },
  '/params': { step: 2, total: 4, title: '定制参数' },
  '/generating': { step: 3, total: 4, title: 'AI 生成中' },
  '/recipe': { step: 4, total: 4, title: '我的食谱' },
  '/rate': { step: 4, total: 4, title: '评价口味' },
}

const TITLE_MAP: Record<string, string> = {
  '/discover': '菜谱发现',
  '/pricing': '方案定价',
  '/admin': '菜谱管理',
}

export function AppShell({ children, showNav = true }: { children: ReactNode; showNav?: boolean }) {
  const location = useLocation()
  const navigate = useNavigate()
  const meta = STEP_MAP[location.pathname]
  const pageTitle = meta?.title || TITLE_MAP[location.pathname] || '宿舍食光'

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-orange-50/40 to-gray-50">
      <div className="relative mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-[#F7F8FA] shadow-2xl">
        {showNav && (
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-100 bg-white/95 px-4 backdrop-blur-lg">
            <div className="flex items-center gap-2">
              {meta ? (
                <button
                  onClick={() => navigate(-1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-gray-100 active:scale-95"
                >
                  <ArrowLeft size={20} />
                </button>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-400 text-white">
                  <Sparkles size={20} />
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-ink-900">{pageTitle}</p>
                {meta && (
                  <p className="text-[11px] text-ink-400">
                    第 {meta.step} / {meta.total} 步
                  </p>
                )}
              </div>
            </div>
            {meta && (
              <div className="flex w-24 gap-1">
                {Array.from({ length: meta.total }).map((_, i) => (
                  <span
                    key={i}
                    className={cn('h-1.5 flex-1 rounded-full', i < meta.step ? 'bg-brand-500' : 'bg-gray-200')}
                  />
                ))}
              </div>
            )}
          </header>
        )}

        <main className={cn('flex-1', showNav && 'pb-24')}>{children}</main>

        {showNav && (
          <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 border-t border-gray-100 bg-white/95 px-6 py-2 backdrop-blur-lg">
            <button
              onClick={() => navigate('/')}
              className="flex w-full items-center justify-center gap-1.5 py-1 text-xs text-ink-400 transition-colors hover:text-brand-500"
            >
              <Home size={14} /> 返回首页
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}
