import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { AppShell } from '../components/layout/AppShell'
import { Button, Card, cn } from '../components/ui'
import { DishImage } from '../components/ui/DishImage'
import { Wallet, CookingPot, UtensilsCrossed, ShoppingBasket, Check, Star, ArrowRight, Flame, Beef } from 'lucide-react'
import type { MealType } from '../types/recipe'

const MEAL_LABEL: Record<MealType, string> = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' }
const MEAL_EMOJI: Record<MealType, string> = { breakfast: '🌅', lunch: '☀️', dinner: '🌙' }
const GOAL_LABEL = { budget: '省钱减脂', stomach: '养胃清淡', muscle: '增肌高蛋白' }

export default function RecipePage() {
  const navigate = useNavigate()
  const { plan, toggleShoppingItem, addPlan, profile } = useApp()
  const [dayIdx, setDayIdx] = useState(0)
  const [tab, setTab] = useState<'menu' | 'shopping'>('menu')

  const planId = plan?.id
  useEffect(() => {
    if (profile && planId && !profile.weeklyPlans.includes(planId)) addPlan(planId)
  }, [planId, profile, addPlan])

  if (!plan) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
          <div className="text-6xl">🍽️</div>
          <p className="mt-4 text-ink-600">还没有食谱，先去生成一份吧</p>
          <Button className="mt-6" onClick={() => navigate('/')}>返回首页</Button>
        </div>
      </AppShell>
    )
  }

  const day = plan.days[dayIdx]

  return (
    <AppShell>
      <div className="px-4 pt-5">
        <Card className="mb-5 bg-gradient-to-br from-brand-500 to-brand-400 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/85">为你生成的一周食谱</p>
              <h2 className="mt-1 text-xl font-bold">吃得明白，花得清楚</h2>
            </div>
            <div className="text-5xl">🍱</div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/25 pt-4">
            <div className="text-center">
              <p className="text-lg font-bold">¥{plan.avgDailyCost}</p>
              <p className="text-[11px] text-white/80">日均花费</p>
            </div>
            <div className="text-center border-x border-white/25">
              <p className="text-lg font-bold">¥{plan.totalCost}</p>
              <p className="text-[11px] text-white/80">一周总计</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{GOAL_LABEL[plan.params.goal]}</p>
              <p className="text-[11px] text-white/80">饮食目标</p>
            </div>
          </div>
        </Card>

        <div className="mb-4 flex items-center gap-3 text-xs text-ink-600">
          <span className="flex items-center gap-1"><Wallet size={14} className="text-brand-500" /> ¥{plan.params.monthlyBudget}/月</span>
          <span className="flex items-center gap-1"><CookingPot size={14} className="text-brand-500" /> {plan.params.cookware.length} 种厨具</span>
          <span className="flex items-center gap-1"><UtensilsCrossed size={14} className="text-brand-500" /> {plan.params.restrictions.length || 0} 项忌口</span>
        </div>

        <div className="mb-4 flex rounded-2xl bg-gray-100 p-1">
          <button onClick={() => setTab('menu')} className={cn('flex-1 rounded-xl py-2 text-sm font-semibold transition-all', tab === 'menu' ? 'bg-white text-brand-600 shadow-soft' : 'text-ink-600')}>
            📅 每日菜单
          </button>
          <button onClick={() => setTab('shopping')} className={cn('flex-1 rounded-xl py-2 text-sm font-semibold transition-all', tab === 'shopping' ? 'bg-white text-brand-600 shadow-soft' : 'text-ink-600')}>
            🛒 采购清单
          </button>
        </div>

        {tab === 'menu' ? (
          <>
            <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
              {plan.days.map((d, i) => (
                <button
                  key={d.day}
                  onClick={() => setDayIdx(i)}
                  className={cn(
                    'shrink-0 rounded-2xl px-4 py-2 text-sm font-medium transition-all',
                    dayIdx === i ? 'bg-brand-500 text-white shadow-card' : 'bg-white text-ink-600 hover:bg-brand-50',
                  )}
                >
                  {d.dateLabel}
                </button>
              ))}
            </div>

            <div key={dayIdx} className="animate-slide-up space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-base font-semibold text-ink-900">{day.dateLabel}的三餐</h3>
                <span className="text-sm font-medium text-brand-600">约 ¥{day.estimatedCost}</span>
              </div>

              {day.meals.map((meal) => (
                <Card key={meal.type} className="p-0 overflow-hidden">
                  <div className="flex items-center justify-between bg-gray-50 px-4 py-2.5">
                    <span className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                      {MEAL_EMOJI[meal.type]} {MEAL_LABEL[meal.type]}
                    </span>
                    <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-medium', meal.source === 'canteen' ? 'bg-blue-50 text-blue-600' : 'bg-leaf-50 text-leaf-600')}>
                      {meal.source === 'canteen' ? '食堂窗口' : '宿舍快手'}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <DishImage dish={meal.dish} width={200} className="h-14 w-14 shrink-0" rounded="rounded-2xl" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-ink-900">{meal.dish.name}</h4>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {meal.dish.tags.slice(0, 3).map((t) => (
                            <span key={t} className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] text-brand-600">{t}</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm font-bold text-brand-600">¥{meal.dish.cost}</p>
                    </div>

                    <div className="mt-3 rounded-xl bg-gray-50 p-3">
                      {meal.dish.canteenWindow && (
                        <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-blue-600">
                          <UtensilsCrossed size={13} /> {meal.dish.canteenWindow}
                        </p>
                      )}
                      <p className="text-xs leading-relaxed text-ink-600">👨‍🍳 {meal.dish.quickRecipe}</p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-400">
                      <span className="flex items-center gap-1"><Flame size={13} /> {meal.dish.calories} kcal</span>
                      <span className="flex items-center gap-1"><Beef size={13} /> 蛋白 {meal.dish.protein}g</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="animate-slide-up">
            <Card className="mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBasket size={18} className="text-brand-500" />
                  <h3 className="font-semibold text-ink-900">本周采购清单</h3>
                </div>
                <span className="text-sm font-bold text-brand-600">约 ¥{plan.totalCost}</span>
              </div>
              <p className="mt-1 text-xs text-ink-400">按天采购，勾选已买，避免浪费</p>
            </Card>
            <div className="space-y-2">
              {plan.shoppingList.map((item) => (
                <button
                  key={item.name}
                  onClick={() => toggleShoppingItem(item.name)}
                  className={cn('flex w-full items-center gap-3 rounded-2xl border bg-white p-3.5 text-left transition-all active:scale-[0.98]', item.checked ? 'border-leaf-200 bg-leaf-50/40' : 'border-gray-100')}
                >
                  <div className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all', item.checked ? 'border-leaf-500 bg-leaf-500 text-white' : 'border-gray-300')}>
                    {item.checked && <Check size={14} />}
                  </div>
                  <div className="flex-1">
                    <p className={cn('text-sm font-medium', item.checked ? 'text-ink-400 line-through' : 'text-ink-900')}>{item.name}</p>
                    <p className="text-xs text-ink-400">{item.totalAmount}</p>
                  </div>
                  <p className="text-sm font-semibold text-ink-600">¥{item.estimatedCost}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 bg-gradient-to-t from-[#F7F8FA] via-[#F7F8FA] to-transparent px-5 pb-5 pt-3">
        <Button size="lg" full onClick={() => navigate('/rate')}>
          <Star size={18} /> 评价口味 · 让 AI 更懂你 <ArrowRight size={18} />
        </Button>
      </div>
    </AppShell>
  )
}
