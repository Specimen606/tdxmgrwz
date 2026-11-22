import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { AppShell } from '../components/layout/AppShell'
import { Button, Card, Chip, SectionTitle, cn } from '../components/ui'
import type { Cookware, Restriction, DietGoal } from '../types/recipe'
import { CookingPot, Microwave, UtensilsCrossed, Wind, Wallet, Target, Info } from 'lucide-react'

const COOKWARE: { id: Cookware; label: string; icon: typeof CookingPot }[] = [
  { id: 'electricPot', label: '小电锅', icon: CookingPot },
  { id: 'microwave', label: '微波炉', icon: Microwave },
  { id: 'airFryer', label: '空气炸锅', icon: Wind },
  { id: 'canteen', label: '学校食堂', icon: UtensilsCrossed },
]

const RESTRICTIONS: { id: Restriction; label: string }[] = [
  { id: 'noSpicy', label: '不吃辣' },
  { id: 'noCoriander', label: '不吃香菜' },
  { id: 'noSeafood', label: '海鲜过敏' },
  { id: 'noPork', label: '不吃猪肉' },
  { id: 'noDairy', label: '乳糖不耐' },
]

const GOALS: { id: DietGoal; emoji: string; title: string; desc: string }[] = [
  { id: 'budget', emoji: '💰', title: '省钱减脂', desc: '花得少、吃得好、热量低' },
  { id: 'stomach', emoji: '🍵', title: '养胃清淡', desc: '温和好消化，胃更舒服' },
  { id: 'muscle', emoji: '💪', title: '增肌高蛋白', desc: '蛋白质拉满，练出好身材' },
]

export default function ParamsPage() {
  const navigate = useNavigate()
  const { draftParams, setDraftParams } = useApp()
  const p = draftParams

  const toggleCookware = (id: Cookware) => {
    const next = p.cookware.includes(id) ? p.cookware.filter((c) => c !== id) : [...p.cookware, id]
    setDraftParams({ ...p, cookware: next })
  }
  const toggleRestriction = (id: Restriction) => {
    const next = p.restrictions.includes(id) ? p.restrictions.filter((r) => r !== id) : [...p.restrictions, id]
    setDraftParams({ ...p, restrictions: next })
  }

  const canSubmit = p.cookware.length > 0 && p.monthlyBudget > 0

  return (
    <AppShell>
      <div className="px-5 pt-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-ink-900">告诉我你的情况</h2>
          <p className="mt-1 text-sm text-ink-600">四项真实数据决定食谱，越准确越合胃口</p>
        </div>

        <Card className="mb-4">
          <SectionTitle emoji="💰" title="每月伙食预算" sub="用于食堂 + 自己做，控制每日花费" />
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-brand-600">¥{p.monthlyBudget}</span>
            <span className="mb-1 text-xs text-ink-400">约 ¥{Math.round(p.monthlyBudget / 30)} / 天</span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Wallet size={18} className="text-ink-400" />
            <input
              type="range"
              min={300}
              max={2000}
              step={50}
              value={p.monthlyBudget}
              onChange={(e) => setDraftParams({ ...p, monthlyBudget: Number(e.target.value) })}
              className="flex-1"
            />
          </div>
          <div className="mt-1 flex justify-between text-[11px] text-ink-400">
            <span>¥300</span>
            <span>¥2000</span>
          </div>
        </Card>

        <Card className="mb-4">
          <SectionTitle emoji="🍳" title="可用厨具" sub="可多选，决定能不能做快手菜" />
          <div className="grid grid-cols-2 gap-3">
            {COOKWARE.map((c) => (
              <button
                key={c.id}
                onClick={() => toggleCookware(c.id)}
                className={cn(
                  'flex items-center gap-2 rounded-2xl border-2 p-3 text-sm font-medium transition-all active:scale-95',
                  p.cookware.includes(c.id)
                    ? 'border-brand-500 bg-brand-50 text-brand-600'
                    : 'border-gray-100 bg-white text-ink-600 hover:border-brand-200',
                )}
              >
                <c.icon size={18} /> {c.label}
              </button>
            ))}
          </div>
        </Card>

        <Card className="mb-4">
          <SectionTitle emoji="🚫" title="饮食忌口" sub="可多选，生成时严格避开" />
          <div className="flex flex-wrap gap-2">
            {RESTRICTIONS.map((r) => (
              <Chip key={r.id} label={r.label} active={p.restrictions.includes(r.id)} onClick={() => toggleRestriction(r.id)} />
            ))}
          </div>
        </Card>

        <Card className="mb-2">
          <SectionTitle emoji="🎯" title="饮食目标" sub="单选，影响菜品优先级" />
          <div className="space-y-3">
            {GOALS.map((g) => (
              <button
                key={g.id}
                onClick={() => setDraftParams({ ...p, goal: g.id })}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all active:scale-[0.98]',
                  p.goal === g.id ? 'border-brand-500 bg-brand-50' : 'border-gray-100 bg-white hover:border-brand-200',
                )}
              >
                <span className="text-2xl">{g.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink-900">{g.title}</p>
                  <p className="text-xs text-ink-600">{g.desc}</p>
                </div>
                <div
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full border-2',
                    p.goal === g.id ? 'border-brand-500 bg-brand-500' : 'border-gray-300',
                  )}
                >
                  {p.goal === g.id && <span className="h-2 w-2 rounded-full bg-white" />}
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs leading-relaxed text-blue-700">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>人格测试仅作趣味破冰，不参与食谱计算。你的食谱完全由以上四项硬数据决定，逻辑严谨可追溯。</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 bg-gradient-to-t from-[#F7F8FA] via-[#F7F8FA] to-transparent px-5 pb-5 pt-3">
        <Button size="lg" full disabled={!canSubmit} onClick={() => navigate('/generating')}>
          <Target size={18} /> 生成我的周食谱
        </Button>
      </div>
    </AppShell>
  )
}
