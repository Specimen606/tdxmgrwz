import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { AppShell } from '../components/layout/AppShell'
import { Button, Card } from '../components/ui'
import { DishImage } from '../components/ui/DishImage'
import { Sparkles, Wallet, Apple, Brain, ArrowRight, Star, BookOpen, Pencil, Flame, ChefHat } from 'lucide-react'
import { useDishes } from '../services/dishStore'

const FEATURES = [
  { icon: Wallet, title: '真省钱', desc: '按预算精打细算，每周花多少心里有数', color: 'from-blue-400 to-blue-500' },
  { icon: Apple, title: '真养胃', desc: '食堂窗口 + 小电锅快手做法，照着做就行', color: 'from-leaf-400 to-leaf-500' },
  { icon: Brain, title: '越吃越懂你', desc: 'AI 记住你的口味，下周自动优化', color: 'from-purple-400 to-purple-500' },
]

const FEATURED_IDS = ['b01', 'l02', 'l13', 'd16', 'l15', 'd11']

export default function HomePage() {
  const navigate = useNavigate()
  const { profile } = useApp()
  const dishes = useDishes()

  return (
    <AppShell showNav={false}>
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-400 to-orange-400 px-6 pb-16 pt-10 text-white">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="relative">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/25 backdrop-blur">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">宿舍食光</h1>
              <p className="text-[11px] text-white/80">AI 宿舍低成本食谱搭配机</p>
            </div>
          </div>

          <div className="animate-slide-up">
            <h2 className="text-[32px] font-bold leading-tight">
              今天吃什么？
              <br />
              <span className="text-white/90">交给 AI 决定</span>
            </h2>
            <p className="mt-3 max-w-[300px] text-sm leading-relaxed text-white/85">
              预算、厨具、忌口、目标一填，一周三餐和采购清单全搞定，告别每天纠结。
            </p>
          </div>

          <div className="relative mt-8 flex justify-center">
            <div className="animate-float">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&q=80"
                alt="健康美食拼盘"
                className="h-44 w-44 rounded-full border-4 border-white/30 object-cover shadow-2xl"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            </div>
            <div className="absolute -left-1 top-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-3xl shadow-lg animate-float" style={{ animationDelay: '0.4s' }}>
              🥗
            </div>
            <div className="absolute -right-1 bottom-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-3xl shadow-lg animate-float" style={{ animationDelay: '0.8s' }}>
              🍜
            </div>
          </div>
        </div>
      </div>

      <div className="-mt-8 rounded-t-[32px] bg-[#F7F8FA] px-5 pt-7">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500 text-white"><Sparkles size={15} /></div>
          <h3 className="text-lg font-semibold text-ink-900">为什么选我们</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="flex flex-col items-center gap-2 p-3 text-center">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} text-white`}>
                <f.icon size={22} />
              </div>
              <p className="text-sm font-semibold text-ink-900">{f.title}</p>
              <p className="text-[11px] leading-snug text-ink-600">{f.desc}</p>
            </Card>
          ))}
        </div>

        <div className="mt-7">
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-leaf-500 text-white"><ChefHat size={15} /></div>
            <h3 className="text-lg font-semibold text-ink-900">看看能吃到什么</h3>
          </div>
          <p className="mb-3 text-xs text-ink-400">真实菜品 · 食堂窗口与宿舍快手做法，照着做就行</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {FEATURED_IDS.map((id) => {
              const d = dishes.find((x) => x.id === id)
              if (!d) return null
              return (
                <button
                  key={d.id}
                  onClick={() => navigate('/discover')}
                  className="w-[150px] shrink-0 overflow-hidden rounded-2xl bg-white text-left shadow-soft transition-all hover:shadow-card active:scale-[0.97]"
                >
                  <div className="relative">
                    <DishImage dish={d} width={360} className="h-24 w-full" rounded="rounded-none" />
                    <span className="absolute left-2 top-2 rounded-md bg-black/40 px-1.5 py-0.5 text-[10px] text-white backdrop-blur">
                      {d.canteenWindow ? '食堂' : '快手'}
                    </span>
                  </div>
                  <div className="p-2.5">
                    <p className="truncate text-sm font-semibold text-ink-900">{d.name}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm font-bold text-brand-600">¥{d.cost}</span>
                      <span className="flex items-center gap-0.5 text-[10px] text-ink-400"><Flame size={11} /> {d.calories} kcal</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={() => navigate('/discover')}
          className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-brand-200 bg-white px-4 py-3.5 text-left transition-all hover:border-brand-400 hover:shadow-soft active:scale-[0.98]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <BookOpen size={20} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink-900">先逛逛菜谱库</p>
            <p className="text-[11px] text-ink-400">{dishes.length} 道菜品、做法与食堂窗口，随手就能查</p>
          </div>
          <ArrowRight size={18} className="text-brand-500" />
        </button>

        <button
          onClick={() => navigate('/admin')}
          className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-left transition-all hover:border-leaf-400 hover:shadow-soft active:scale-[0.98]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-50 text-leaf-600">
            <Pencil size={19} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-ink-900">管理我的菜谱</p>
            <p className="text-[11px] text-ink-400">添加、编辑菜品，改动实时保存在本网站</p>
          </div>
          <ArrowRight size={18} className="text-leaf-500" />
        </button>

        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-3 text-xs text-ink-600">
          <Star size={16} className="fill-brand-400 text-brand-400" />
          <span>已有 2,800+ 大学生用 AI 解决了「今天吃什么」</span>
        </div>

        <button onClick={() => navigate('/pricing')} className="mt-4 w-full text-center text-xs text-ink-400 transition-colors hover:text-brand-500">
          了解会员方案与定价 →
        </button>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 bg-gradient-to-t from-[#F7F8FA] via-[#F7F8FA] to-transparent px-5 pb-5 pt-3">
        <Button size="lg" full onClick={() => navigate('/quiz')}>
          {profile ? '再测一次 · 定制食谱' : '免费测一测'} <ArrowRight size={18} />
        </Button>
      </div>
    </AppShell>
  )
}
