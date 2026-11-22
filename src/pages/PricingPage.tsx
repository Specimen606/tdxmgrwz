import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { AppShell } from '../components/layout/AppShell'
import { Button, Card, cn } from '../components/ui'
import { PRICING_TIERS } from '../data/pricing'
import { Check, Crown, Sparkles, Users, RefreshCw, ShieldCheck, ArrowRight } from 'lucide-react'

const TIER_ICON = { once: Sparkles, monthly: Crown, group: Users }

export default function PricingPage() {
  const navigate = useNavigate()
  const { profile, setMembership } = useApp()

  const choose = (id: 'once' | 'monthly' | 'group') => {
    if (id !== 'once') setMembership(id)
    navigate('/params')
  }

  return (
    <AppShell>
      <div className="px-5 pt-6">
        <div className="mb-6 text-center">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600">
            <Crown size={14} /> 阶梯定价 · 持续复购
          </div>
          <h2 className="text-2xl font-bold text-ink-900">选一个适合你的方案</h2>
          <p className="mt-2 text-sm text-ink-600">免费生成体验，满意再升级</p>
        </div>

        <div className="space-y-4">
          {PRICING_TIERS.map((t) => {
            const Icon = TIER_ICON[t.id]
            return (
              <Card
                key={t.id}
                className={cn('relative', t.highlight ? 'border-2 border-brand-500 shadow-card' : '')}
              >
                {t.badge && (
                  <span className={cn('absolute -top-3 left-5 rounded-full px-3 py-1 text-[11px] font-semibold text-white shadow-card', t.highlight ? 'bg-gradient-to-r from-brand-500 to-brand-400' : 'bg-leaf-500')}>
                    {t.badge}
                  </span>
                )}
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white"
                    style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}cc)` }}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-ink-900">{t.name}</h3>
                    <p className="mt-0.5 text-xs text-ink-600">{t.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: t.color }}>¥{t.price}</p>
                    <p className="text-[11px] text-ink-400">/ {t.unit}</p>
                  </div>
                </div>

                <div className="my-4 border-t border-gray-100" />
                <div className="space-y-2.5">
                  {t.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-ink-600">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-leaf-50">
                        <Check size={13} className="text-leaf-500" />
                      </span>
                      {f}
                    </div>
                  ))}
                </div>

                <Button
                  full
                  variant={t.highlight ? 'primary' : 'outline'}
                  className="mt-5"
                  onClick={() => choose(t.id)}
                >
                  {profile?.membership === t.id ? '当前方案 · 继续定制' : `选择${t.name}`}
                  <ArrowRight size={16} />
                </Button>
              </Card>
            )
          })}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 text-center shadow-soft">
            <RefreshCw size={22} className="mx-auto text-brand-500" />
            <p className="mt-2 text-xs font-medium text-ink-900">每周自动更新</p>
            <p className="mt-1 text-[11px] text-ink-400">告别吃腻</p>
          </div>
          <div className="rounded-2xl bg-white p-4 text-center shadow-soft">
            <ShieldCheck size={22} className="mx-auto text-leaf-500" />
            <p className="mt-2 text-xs font-medium text-ink-900">口味记忆闭环</p>
            <p className="mt-1 text-[11px] text-ink-400">越吃越懂你</p>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-ink-400">
          演示版本：支付流程为模拟展示，不涉及真实扣费。<br />
          人格测试仅作趣味破冰，食谱由预算/厨具/忌口/目标四项硬数据决定。
        </p>
      </div>
    </AppShell>
  )
}
