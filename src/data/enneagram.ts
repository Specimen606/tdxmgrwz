import type { EnneagramQuestion, EnneagramResult } from '../types/enneagram'

export const QUESTIONS: EnneagramQuestion[] = [
  {
    id: 1,
    title: '周末突然没了安排，你的第一反应是？',
    options: [
      { label: '太好了，赶紧约人搞点新鲜事', type: 7 },
      { label: '先规划一下，把该做的事列个清单', type: 1 },
      { label: '有点慌，想确认大家都怎么安排', type: 6 },
    ],
  },
  {
    id: 2,
    title: '室友夸你做的饭好吃，你通常会？',
    options: [
      { label: '开心，下次做个更花样翻新的', type: 7 },
      { label: '觉得还不够完美，下次注意摆盘和营养', type: 1 },
      { label: '先确认是不是客套，然后记下他爱吃的', type: 6 },
    ],
  },
  {
    id: 3,
    title: '点外卖时，你最在意的是什么？',
    options: [
      { label: '有没有没试过的新口味', type: 7 },
      { label: '配料表干不干净、健不健康', type: 1 },
      { label: '这家评价稳不稳定、会不会踩雷', type: 6 },
    ],
  },
  {
    id: 4,
    title: '宿舍团购时，你的角色更像？',
    options: [
      { label: '张罗各种新款，提议"我们试试这个"', type: 7 },
      { label: '把账算得清清楚楚，考虑每人花的钱', type: 1 },
      { label: '反复确认拼单靠谱不靠谱再做决定', type: 6 },
    ],
  },
  {
    id: 5,
    title: '如果食谱连续吃腻了，你会？',
    options: [
      { label: '立马换一批完全不同的菜', type: 7 },
      { label: '分析哪里搭配不合理，调整结构', type: 1 },
      { label: '先问问大家意见，选最稳妥的替换', type: 6 },
    ],
  },
]

export const RESULTS: Record<number, EnneagramResult> = {
  1: {
    type: 1,
    name: '完美主义实干家',
    emoji: '🎯',
    slogan: '讲究均衡，拒绝将就',
    description: '你追求条理与品质，做事有标准。给你的食谱会格外注重营养搭配与结构合理。',
    color: '#1677FF',
  },
  6: {
    type: 6,
    name: '谨慎靠谱守护者',
    emoji: '🛡️',
    slogan: '稳字当头，养胃优先',
    description: '你重视安全感，怕踩雷。食谱偏向清淡养胃、口碑稳定的家常菜，让你吃得安心。',
    color: '#52C41A',
  },
  7: {
    type: 7,
    name: '热情尝鲜探险家',
    emoji: '🎉',
    slogan: '花样翻新，快乐干饭',
    description: '你热爱新鲜与变化，讨厌一成不变。食谱主打 variety，每天换口味不重样。',
    color: '#FF7A45',
  },
}

export function computeResult(answers: number[]): EnneagramResult {
  const count: Record<number, number> = { 1: 0, 6: 0, 7: 0 }
  answers.forEach((t) => {
    count[t] = (count[t] || 0) + 1
  })
  const top = Object.keys(count).reduce((a, b) => (count[Number(a)] >= count[Number(b)] ? a : b))
  return RESULTS[Number(top)] || RESULTS[7]
}
