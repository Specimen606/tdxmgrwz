import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { AppShell } from '../components/layout/AppShell'
import { Button, Card, Chip, StarRating, SectionTitle, cn } from '../components/ui'
import { DishImage } from '../components/ui/DishImage'
import { TASTE_TAGS } from '../services/tasteEngine'
import { tasteSummary } from '../services/tasteEngine'
import type { Dish } from '../types/recipe'
import { Sparkles, Brain, ArrowRight, CheckCircle2 } from 'lucide-react'

interface RatingState {
  score: number
  liked: string[]
  disliked: string[]
}

export default function RatePage() {
  const navigate = useNavigate()
  const { plan, addRating, profile } = useApp()
  const [idx, setIdx] = useState(0)
  const [ratings, setRatings] = useState<Record<string, RatingState>>({})
  const [done, setDone] = useState(false)

  if (!plan) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
          <div className="text-6xl">⭐</div>
          <p className="mt-4 text-ink-600">还没有可评价的食谱</p>
          <Button className="mt-6" onClick={() => navigate('/')}>返回首页</Button>
        </div>
      </AppShell>
    )
  }

  const uniqueDishes: Dish[] = Array.from(
    plan.days.flatMap((d) => d.meals.map((m) => m.dish)).reduce((map, d) => map.set(d.id, d), new Map<string, Dish>()).values(),
  ).slice(0, 5)
  const current = uniqueDishes[idx]
  const state = ratings[current?.id] || { score: 0, liked: [], disliked: [] }

  const setState = (s: RatingState) => setRatings({ ...ratings, [current.id]: s })

  const toggleTag = (tag: string, kind: 'liked' | 'disliked') => {
    const other = kind === 'liked' ? 'disliked' : 'liked'
    const list = state[kind]
    const next = list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag]
    setState({ ...state, [kind]: next, [other]: state[other].filter((t) => t !== tag) })
  }

  const submitCurrent = () => {
    if (state.score === 0) return
    addRating(
      {
        dishId: current.id,
        score: state.score,
        likedTags: state.liked,
        dislikedTags: state.disliked,
        flavor: current.flavor,
        timestamp: Date.now(),
      },
      current,
    )
    if (idx < uniqueDishes.length - 1) {
      setIdx(idx + 1)
    } else {
      setDone(true)
    }
  }

  const summary = profile ? tasteSummary(profile.taste) : []

  if (done) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
          <div className="animate-pop flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-leaf-400 to-leaf-500 text-5xl text-white shadow-card">
            <CheckCircle2 size={52} />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-ink-900">AI 已记住你的口味</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            下次生成食谱时，会参考你的评价自动优化菜品，越吃越合胃口。
          </p>

          <Card className="mt-6 w-full text-left">
            <div className="mb-3 flex items-center gap-2">
              <Brain size={18} className="text-brand-500" />
              <h3 className="font-semibold text-ink-900">你的口味档案</h3>
            </div>
            {summary.length ? (
              <div className="flex flex-wrap gap-2">
                {summary.map((s) => (
                  <span key={s} className="rounded-full bg-leaf-50 px-3 py-1.5 text-xs font-medium text-leaf-600">{s}</span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink-400">已记录 {profile?.taste.historyCount || 0} 条评价</p>
            )}
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-50 p-3 text-xs leading-relaxed text-brand-700">
              <Sparkles size={14} className="shrink-0" />
              <span>这就是项目的创新点：持续保存历史评价，形成口味档案，实现食谱的迭代优化闭环。</span>
            </div>
          </Card>

          <Button size="lg" full className="mt-7" onClick={() => navigate('/pricing')}>
            查看会员权益 <ArrowRight size={18} />
          </Button>
          <button onClick={() => navigate('/')} className="mt-4 text-sm text-ink-400 hover:text-brand-500">返回首页</button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="px-5 pt-6">
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between text-xs text-ink-400">
            <span>给吃过的菜打个分</span>
            <span>{idx + 1} / {uniqueDishes.length}</span>
          </div>
          <h2 className="text-xl font-bold text-ink-900">这道菜合胃口吗？</h2>
          <p className="mt-1 text-sm text-ink-600">你的评价会成为 AI 下次优化的参考</p>
        </div>

        {current && (
          <Card key={current.id} className="animate-slide-up">
            <div className="flex items-center gap-4">
              <DishImage dish={current} width={300} className="h-20 w-20" rounded="rounded-3xl" />
              <div>
                <h3 className="text-lg font-semibold text-ink-900">{current.name}</h3>
                <p className="mt-1 text-xs text-ink-400">{current.tags.slice(0, 4).join(' · ')}</p>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <SectionTitle title="整体满意度" />
              <div className="flex items-center gap-4">
                <StarRating value={state.score} onChange={(v) => setState({ ...state, score: v })} size={36} />
                <span className="text-sm font-medium text-brand-600">
                  {['', '很差', '一般', '还行', '好吃', '超赞'][state.score] || ''}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <SectionTitle title="喜欢哪些点" sub="可多选" />
              <div className="flex flex-wrap gap-2">
                {TASTE_TAGS.map((tag) => (
                  <Chip key={tag} label={tag} active={state.liked.includes(tag)} onClick={() => toggleTag(tag, 'liked')} />
                ))}
              </div>
            </div>

            <div className="mt-5">
              <SectionTitle title="想避开哪些点" sub="可多选" />
              <div className="flex flex-wrap gap-2">
                {TASTE_TAGS.map((tag) => (
                  <Chip key={tag} label={tag} active={state.disliked.includes(tag)} onClick={() => toggleTag(tag, 'disliked')} />
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 bg-gradient-to-t from-[#F7F8FA] via-[#F7F8FA] to-transparent px-5 pb-5 pt-3">
        <Button size="lg" full disabled={state.score === 0} onClick={submitCurrent}>
          {idx < uniqueDishes.length - 1 ? '下一道菜' : '完成评价'} <ArrowRight size={18} />
        </Button>
      </div>
    </AppShell>
  )
}
