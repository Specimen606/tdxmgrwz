export interface PricingTier {
  id: 'once' | 'monthly' | 'group'
  name: string
  price: number
  unit: string
  badge?: string
  desc: string
  features: string[]
  highlight: boolean
  color: string
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'once',
    name: '单次定制',
    price: 9.9,
    unit: '一份',
    desc: '先试一份，看看合不合胃口',
    features: ['一周三餐定制方案', '分天采购清单', '食材用量明细', '永久在线查看'],
    highlight: false,
    color: '#1677FF',
  },
  {
    id: 'monthly',
    name: '包月会员',
    price: 19.9,
    unit: '每月',
    badge: '最受欢迎',
    desc: '每周自动更新，越吃越懂你',
    features: ['每周自动更新食谱', '每日采购清单', '菜品替换推荐', 'AI 口味记忆持续优化', '永久在线查看'],
    highlight: true,
    color: '#FF7A45',
  },
  {
    id: 'group',
    name: '宿舍拼单',
    price: 29.9,
    unit: '4人套餐',
    badge: '人均7.5元',
    desc: '拉上室友一起，性价比拉满',
    features: ['4人独立口味档案', '4份定制周食谱', '宿舍共享采购清单', 'AI 口味记忆持续优化', '永久在线查看'],
    highlight: false,
    color: '#52C41A',
  },
]
