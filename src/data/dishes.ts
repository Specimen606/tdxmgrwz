import type { Dish } from '../types/recipe'
import { breakfastDishes } from './dishes/breakfast'
import { lunchDishes } from './dishes/lunch'
import { dinnerDishes } from './dishes/dinner'

/** 内置菜品基础库（不含用户编辑），供 dishStore 合并使用 */
export const ALL_DISHES: Dish[] = [...breakfastDishes, ...lunchDishes, ...dinnerDishes]

export function getDishById(id: string): Dish | undefined {
  return ALL_DISHES.find((d) => d.id === id)
}
