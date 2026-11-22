import type { Dish, GenerateParams, WeeklyPlan, DayMenu, Meal, ShoppingItem, MealType } from '../types/recipe'
import type { TasteProfile } from '../types/user'
import { getAllDishes } from './dishStore'
import { dishScore } from './tasteEngine'
import type { RecipeProvider } from './recipeProvider'

const DAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const MEALS: MealType[] = ['breakfast', 'lunch', 'dinner']

function hashSeed(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function eligibleDishes(type: MealType, params: GenerateParams): Dish[] {
  const cookware = params.cookware.length ? params.cookware : ['canteen']
  const all = getAllDishes()
  const pool = all.filter((d) => d.meals.includes(type))
  const strict = pool.filter(
    (d) =>
      !d.restrictions.some((r) => params.restrictions.includes(r)) &&
      d.cookware.some((c) => cookware.includes(c)),
  )
  if (strict.length >= 3) return strict
  console.error(`[MockRecipe] ${type} 可用菜品不足，回退到基础模板`)
  return pool.length ? pool : all.filter((d) => d.meals.includes(type))
}

function rankDishes(dishes: Dish[], params: GenerateParams, taste: TasteProfile, rand: () => number): Dish[] {
  const dailyBudget = Math.max(params.monthlyBudget / 30, 8)
  const perMeal = dailyBudget / 3
  return [...dishes]
    .map((dish) => {
      let score = dish.goals.includes(params.goal) ? 10 : 0
      score += dishScore(dish, taste)
      score -= Math.max(0, dish.cost - perMeal) * 1.5
      score += rand() * 7
      return { dish, score }
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.dish)
}

function buildShoppingList(days: DayMenu[]): ShoppingItem[] {
  const map = new Map<string, { amounts: string[]; cost: number }>()
  days.forEach((day) =>
    day.meals.forEach((meal) =>
      meal.dish.ingredients.forEach((ing) => {
        const cur = map.get(ing.name) || { amounts: [], cost: 0 }
        cur.amounts.push(ing.amount)
        cur.cost += ing.estimatedCost
        map.set(ing.name, cur)
      }),
    ),
  )
  return Array.from(map.entries())
    .map(([name, v]) => {
      const unique = Array.from(new Set(v.amounts))
      const totalAmount = unique.length === 1 ? `${unique[0]} ×${v.amounts.length}` : unique.join('、')
      return { name, totalAmount, estimatedCost: Math.round(v.cost * 10) / 10, checked: false }
    })
    .sort((a, b) => b.estimatedCost - a.estimatedCost)
}

export class MockRecipeProvider implements RecipeProvider {
  readonly name = '本地模拟生成器'

  async generate(params: GenerateParams, taste: TasteProfile): Promise<WeeklyPlan> {
    const seedStr = `${JSON.stringify(params)}|${taste.historyCount}|${JSON.stringify(taste.likedTags)}`
    const rand = mulberry32(hashSeed(seedStr))

    const ranked: Record<MealType, Dish[]> = {
      breakfast: rankDishes(eligibleDishes('breakfast', params), params, taste, rand),
      lunch: rankDishes(eligibleDishes('lunch', params), params, taste, rand),
      dinner: rankDishes(eligibleDishes('dinner', params), params, taste, rand),
    }

    const days: DayMenu[] = DAY_LABELS.map((label, i) => {
      const usedToday = new Set<string>()
      const meals: Meal[] = MEALS.map((type) => {
        const pool = ranked[type]
        let pick = pool[i % pool.length]
        if (usedToday.has(pick.id)) {
          const alt = pool.find((d) => !usedToday.has(d.id))
          if (alt) pick = alt
        }
        usedToday.add(pick.id)
        const source: Meal['source'] =
          pick.canteenWindow && params.cookware.includes('canteen') ? 'canteen' : 'cook'
        return { type, dish: pick, source }
      })
      return {
        day: i + 1,
        dateLabel: label,
        meals,
        estimatedCost: Math.round(meals.reduce((s, m) => s + m.dish.cost, 0) * 10) / 10,
      }
    })

    const shoppingList = buildShoppingList(days)
    const totalCost = Math.round(days.reduce((s, d) => s + d.estimatedCost, 0) * 10) / 10

    return {
      id: `plan_${Date.now()}`,
      createdAt: Date.now(),
      params,
      days,
      shoppingList,
      totalCost,
      avgDailyCost: Math.round((totalCost / 7) * 10) / 10,
    }
  }
}
