import { useSyncExternalStore } from 'react'
import type { Dish } from '../types/recipe'
import { ALL_DISHES as BUILTIN_DISHES } from '../data/dishes'

const STORAGE_KEY = 'dormfood_dish_store'

interface DishStoreData {
  added: Dish[]
  overrides: Record<string, Dish>
  deletedIds: string[]
}

const EMPTY: DishStoreData = { added: [], overrides: {}, deletedIds: [] }

function load(): DishStoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...EMPTY }
    const parsed = JSON.parse(raw) as DishStoreData
    return {
      added: Array.isArray(parsed.added) ? parsed.added : [],
      overrides: parsed.overrides && typeof parsed.overrides === 'object' ? parsed.overrides : {},
      deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [],
    }
  } catch (error) {
    console.error('dishStore load failed', error)
    return { ...EMPTY }
  }
}

let data: DishStoreData = load()
const listeners = new Set<() => void>()

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('dishStore persist failed', error)
  }
}

function commit(next: DishStoreData): void {
  data = next
  persist()
  listeners.forEach((l) => l())
}

/** 获取合并后的完整菜品列表（内置 + 新增 - 删除，应用编辑覆盖） */
export function getAllDishes(): Dish[] {
  const builtins = BUILTIN_DISHES.filter((d) => !data.deletedIds.includes(d.id)).map(
    (d) => data.overrides[d.id] || d,
  )
  const added = data.added.filter((d) => !data.deletedIds.includes(d.id))
  return [...builtins, ...added]
}

export function getDish(id: string): Dish | undefined {
  return getAllDishes().find((d) => d.id === id)
}

export function addDish(dish: Dish): void {
  commit({ ...data, added: [...data.added.filter((d) => d.id !== dish.id), dish] })
}

export function updateDish(dish: Dish): void {
  const isAdded = data.added.some((d) => d.id === dish.id)
  if (isAdded) {
    commit({
      ...data,
      added: data.added.map((d) => (d.id === dish.id ? dish : d)),
    })
  } else {
    commit({
      ...data,
      overrides: { ...data.overrides, [dish.id]: dish },
    })
  }
}

export function deleteDish(id: string): void {
  if (data.added.some((d) => d.id === id)) {
    commit({ ...data, added: data.added.filter((d) => d.id !== id) })
  } else {
    commit({ ...data, deletedIds: [...new Set([...data.deletedIds, id])] })
  }
}

export function resetAll(): void {
  commit({ ...EMPTY })
}

export function isCustomDish(id: string): boolean {
  return data.added.some((d) => d.id === id) || !!data.overrides[id] || data.deletedIds.includes(id)
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): DishStoreData {
  return data
}

/** 组件订阅菜品数据变化 */
export function useDishStore(): DishStoreData {
  return useSyncExternalStore(subscribe, getSnapshot)
}

/** 响应式获取全部菜品 */
export function useDishes(): Dish[] {
  useDishStore()
  return getAllDishes()
}
