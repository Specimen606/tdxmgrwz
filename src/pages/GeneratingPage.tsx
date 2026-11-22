import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { AppShell } from '../components/layout/AppShell'
import { loadProfile } from '../services/storage'
import { Sparkles, ChefHat } from 'lucide-react'

const STEPS = ['分析你的预算与厨具', '匹配忌口与目标菜品', '结合口味档案加权', '生成七天三餐与采购清单']

export default function GeneratingPage() {
  const navigate = useNavigate()
  const { draftParams, generate, error } = useApp()

  useEffect(() => {
    let cancelled = false
    const taste = loadProfile()?.taste || {
      likedTags: {}, dislikedTags: {}, likedFlavors: {}, historyCount: 0, ratedDishes: [],
    }
    const timer = setTimeout(async () => {
      const result = await generate(draftParams, taste)
      if (result && !cancelled) navigate('/recipe')
    }, 2600)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  return (
    <AppShell>
      <div className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-10 flex h-40 w-40 items-center justify-center">
          <div className="absolute inset-0 animate-spin-slow rounded-full border-4 border-dashed border-brand-200" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-brand-500 to-brand-400 opacity-10" />
          <div className="animate-float text-7xl">🤖</div>
          <ChefHat className="absolute -right-1 top-2 animate-float text-brand-500" size={32} style={{ animationDelay: '0.5s' }} />
          <Sparkles className="absolute -left-2 bottom-3 animate-float text-leaf-500" size={28} style={{ animationDelay: '1s' }} />
        </div>

        <h2 className="text-2xl font-bold text-ink-900">AI 正在为你搭配食谱</h2>
        <p className="mt-2 text-sm text-ink-600">根据四项硬数据 + 你的口味档案综合生成</p>

        <div className="mt-10 w-full max-w-[300px] space-y-4 text-left">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3" style={{ animation: `slide-up 0.4s ease-out ${i * 0.5}s both` }}>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                {i + 1}
              </div>
              <span className="text-sm text-ink-600">{s}</span>
            </div>
          ))}
        </div>

        {error && <p className="mt-6 text-sm text-red-500">{error}</p>}
      </div>
    </AppShell>
  )
}
