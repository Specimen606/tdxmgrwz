import { useMemo, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { Card, Chip, cn } from '../components/ui'
import { DishImage } from '../components/ui/DishImage'
import { useDishes } from '../services/dishStore'
import { dishScore } from '../services/tasteEngine'
import { useApp } from '../context/AppContext'
import type { Dish, MealType } from '../types/recipe'
import { Search, Sparkles, Flame, Beef, Wallet, UtensilsCrossed, X, Clock, Leaf } from 'lucide-react'

type Category = 'all' | MealType | 'canteen' | 'quick' | 'stomach' | 'protein' | 'budget' | 'lowcal'

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'breakfast', label: '早餐' },
  { id: 'lunch', label: '午餐' },
  { id: 'dinner', label: '晚餐' },
  { id: 'canteen', label: '食堂窗口' },
  { id: 'quick', label: '宿舍快手' },
  { id: 'stomach', label: '养胃' },
  { id: 'protein', label: '高蛋白' },
  { id: 'budget', label: '省钱' },
  { id: 'lowcal', label: '低卡' },
]

function matchesCategory(dish: Dish, cat: Category): boolean {
  switch (cat) {
    case 'all': return true
    case 'breakfast': case 'lunch': case 'dinner': return dish.meals.includes(cat)
    case 'canteen': return !!dish.canteenWindow
    case 'quick': return !dish.canteenWindow
    case 'stomach': return dish.tags.includes('养胃')
    case 'protein': return dish.tags.includes('高蛋白')
    case 'budget': return dish.tags.includes('省钱')
    case 'lowcal': return dish.tags.includes('低卡')
  }
}

function DishCard({ dish, onClick }: { dish: Dish; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-3xl bg-white p-3 text-left shadow-soft transition-all hover:shadow-card hover:-translate-y-0.5 active:scale-[0.97]">
      <div className="relative">
        <DishImage dish={dish} width={320} className="h-24 w-full" rounded="rounded-2xl" />
        {dish.canteenWindow && (
          <span className="absolute right-2 top-2 rounded-md bg-blue-500/90 px-1.5 py-0.5 text-[9px] font-medium text-white">食堂</span>
        )}
      </div>
      <p className="mt-2.5 truncate text-sm font-semibold text-ink-900">{dish.name}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {dish.tags.slice(0, 2).map((t) => (
          <span key={t} className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] text-brand-600">{t}</span>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-1 text-xs">
        <span className="shrink-0 font-bold text-brand-600">¥{dish.cost}</span>
        <span className="shrink-0 text-[11px] text-ink-400">{dish.calories} kcal</span>
      </div>
    </button>
  )
}

function DishDetail({ dish, onClose }: { dish: Dish; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[86vh] w-full max-w-[430px] animate-slide-up overflow-y-auto rounded-t-[32px] bg-white px-5 pb-8 pt-3"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />
        <button onClick={onClose} className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-ink-600 active:scale-95">
          <X size={18} />
        </button>

        <div className="relative">
          <DishImage dish={dish} width={800} className="h-40 w-full" rounded="rounded-3xl" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between rounded-b-3xl bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-8">
            <h2 className="text-xl font-bold text-white drop-shadow">{dish.name}</h2>
            <span className="text-3xl">{dish.emoji}</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {dish.tags.slice(0, 4).map((t) => (
            <span key={t} className="rounded-md bg-brand-50 px-2 py-1 text-[11px] text-brand-600">{t}</span>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { icon: Wallet, label: '单份花费', value: `¥${dish.cost}`, color: 'text-brand-600' },
            { icon: Flame, label: '热量', value: `${dish.calories}`, color: 'text-orange-500' },
            { icon: Beef, label: '蛋白质', value: `${dish.protein}g`, color: 'text-leaf-500' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-gray-50 p-3 text-center">
              <s.icon size={18} className={cn('mx-auto', s.color)} />
              <p className={cn('mt-1 text-base font-bold', s.color)}>{s.value}</p>
              <p className="text-[10px] text-ink-400">{s.label}</p>
            </div>
          ))}
        </div>

        {dish.canteenWindow && (
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-blue-50 p-3.5 text-sm text-blue-700">
            <UtensilsCrossed size={18} /> <span className="font-medium">食堂窗口：{dish.canteenWindow}</span>
          </div>
        )}

        <div className="mt-5">
          <h3 className="flex items-center gap-2 text-base font-semibold text-ink-900"><Clock size={17} className="text-brand-500" /> 做法</h3>
          <p className="mt-2 rounded-2xl bg-gray-50 p-4 text-sm leading-relaxed text-ink-600">{dish.quickRecipe}</p>
        </div>

        <div className="mt-5">
          <h3 className="flex items-center gap-2 text-base font-semibold text-ink-900"><Leaf size={17} className="text-leaf-500" /> 食材用量</h3>
          <div className="mt-2 space-y-2">
            {dish.ingredients.map((ing) => (
              <div key={ing.name} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-2.5 text-sm">
                <span className="text-ink-900">{ing.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-ink-400">{ing.amount}</span>
                  <span className="font-medium text-brand-600">¥{ing.estimatedCost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DiscoverPage() {
  const { profile } = useApp()
  const dishes = useDishes()
  const [category, setCategory] = useState<Category>('all')
  const [keyword, setKeyword] = useState('')
  const [selected, setSelected] = useState<Dish | null>(null)

  const recommended = useMemo(() => {
    const taste = profile?.taste
    return [...dishes]
      .map((d) => ({ d, s: taste ? dishScore(d, taste) : 0 }))
      .sort((a, b) => b.s - a.s || a.d.cost - b.d.cost)
      .slice(0, 6)
      .map((x) => x.d)
  }, [profile, dishes])

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return dishes.filter(
      (d) =>
        matchesCategory(d, category) &&
        (!kw ||
          d.name.toLowerCase().includes(kw) ||
          d.tags.some((t) => t.toLowerCase().includes(kw)) ||
          d.ingredients.some((i) => i.name.toLowerCase().includes(kw))),
    )
  }, [category, keyword, dishes])

  return (
    <AppShell>
      <div className="px-4 pt-5">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-ink-900">菜谱发现</h1>
          <p className="mt-1 text-sm text-ink-600">{dishes.length} 道宿舍友好菜谱，找找今天想吃的</p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-soft">
          <Search size={18} className="shrink-0 text-ink-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜菜名、食材或口味，如「鸡蛋」「养胃」"
            className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
          />
          {keyword && <button onClick={() => setKeyword('')} className="text-ink-400"><X size={16} /></button>}
        </div>

        {!keyword && category === 'all' && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-ink-900">
                <Sparkles size={18} className="text-brand-500" />
                {profile?.taste.historyCount ? '根据你的口味推荐' : '热门推荐'}
              </h2>
              <span className="text-[11px] text-ink-400">{profile?.taste.historyCount ? '越用越懂你' : '大家都在做'}</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {recommended.map((d) => (
                <div key={d.id} className="w-[140px] shrink-0 [&>button]:p-2.5">
                  <DishCard dish={d} onClick={() => setSelected(d)} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <h2 className="mb-3 text-base font-semibold text-ink-900">按分类找</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((c) => (
              <Chip key={c.id} label={c.label} active={category === c.id} onClick={() => setCategory(c.id)} />
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-ink-900">{keyword ? '搜索结果' : '全部菜谱'}</h2>
            <span className="text-xs text-ink-400">{filtered.length} 道</span>
          </div>
          {filtered.length ? (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((d) => (
                <DishCard key={d.id} dish={d} onClick={() => setSelected(d)} />
              ))}
            </div>
          ) : (
            <Card className="py-12 text-center text-sm text-ink-400">没找到相关菜谱，换个关键词试试</Card>
          )}
        </div>
      </div>

      {selected && <DishDetail dish={selected} onClose={() => setSelected(null)} />}
    </AppShell>
  )
}
