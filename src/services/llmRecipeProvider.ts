import type { GenerateParams, WeeklyPlan } from '../types/recipe'
import type { TasteProfile } from '../types/user'
import type { RecipeProvider } from './recipeProvider'

const API_ENDPOINT = 'https://api.example.com/v1/chat/completions'
const API_KEY = ''

export function buildPrompt(params: GenerateParams, taste: TasteProfile): string {
  const likeTags = Object.entries(taste.likedTags)
    .map(([k, v]) => `${k}(${v})`)
    .join('、') || '无'
  const dislikeTags = Object.entries(taste.dislikedTags)
    .map(([k, v]) => `${k}(${v})`)
    .join('、') || '无'
  const goalMap = { budget: '省钱减脂', stomach: '养胃', muscle: '增肌' }

  return `你是宿舍食谱规划助手。请根据以下条件生成一周三餐食谱，严格输出 JSON（结构遵循 WeeklyPlan 类型）。
硬性条件：
- 月度预算：${params.monthlyBudget} 元
- 可用厨具：${params.cookware.join('、')}
- 饮食忌口：${params.restrictions.join('、') || '无'}
- 饮食目标：${goalMap[params.goal]}
口味偏好（软参考，非硬约束）：
- 喜欢标签：${likeTags}
- 不喜欢标签：${dislikeTags}
- 已评价菜品数：${taste.historyCount}
要求：dish 引用菜品库 id；食堂窗口或快手做法二选一；输出含每日预算与分天采购清单。`
}

export function parseLLMResponse(raw: string): WeeklyPlan | null {
  try {
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    if (start < 0 || end < 0) return null
    return JSON.parse(raw.slice(start, end + 1)) as WeeklyPlan
  } catch (error) {
    console.error('parseLLMResponse failed', error)
    return null
  }
}

export class LLMRecipeProvider implements RecipeProvider {
  readonly name = '大模型生成器（预留）'

  async generate(params: GenerateParams, taste: TasteProfile): Promise<WeeklyPlan> {
    const prompt = buildPrompt(params, taste)
    console.info('[LLM Recipe] prompt ready, endpoint:', API_ENDPOINT, 'key configured:', !!API_KEY)
    console.info('[LLM Recipe] prompt length:', prompt.length)

    throw new Error('LLM 适配器为预留接口：请配置 API_ENDPOINT 与 API_KEY 后启用')
  }
}
