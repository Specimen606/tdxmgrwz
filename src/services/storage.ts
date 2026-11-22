import type { UserProfile, TasteProfile } from '../types/user'
import type { WeeklyPlan } from '../types/recipe'

const KEYS = {
  PROFILE: 'dormfood_profile',
  PLANS: 'dormfood_plans',
  ACTIVE_PLAN: 'dormfood_active_plan',
}

function defaultTaste(): TasteProfile {
  return {
    likedTags: {},
    dislikedTags: {},
    likedFlavors: {},
    historyCount: 0,
    ratedDishes: [],
  }
}

export function createDefaultProfile(enneagramType: number): UserProfile {
  return {
    id: `user_${Date.now()}`,
    createdAt: Date.now(),
    enneagramType,
    taste: defaultTaste(),
    weeklyPlans: [],
    membership: 'none',
  }
}

export function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE)
    if (!raw) return null
    const p = JSON.parse(raw) as UserProfile
    if (!p.taste) p.taste = defaultTaste()
    return p
  } catch (error) {
    console.error('loadProfile failed', error)
    return null
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile))
  } catch (error) {
    console.error('saveProfile failed', error)
  }
}

export function loadPlan(id: string): WeeklyPlan | null {
  try {
    const raw = localStorage.getItem(`${KEYS.PLANS}_${id}`)
    return raw ? (JSON.parse(raw) as WeeklyPlan) : null
  } catch (error) {
    console.error('loadPlan failed', error)
    return null
  }
}

export function savePlan(plan: WeeklyPlan): void {
  try {
    localStorage.setItem(`${KEYS.PLANS}_${plan.id}`, JSON.stringify(plan))
    localStorage.setItem(KEYS.ACTIVE_PLAN, plan.id)
  } catch (error) {
    console.error('savePlan failed', error)
  }
}

export function loadActivePlan(): WeeklyPlan | null {
  try {
    const id = localStorage.getItem(KEYS.ACTIVE_PLAN)
    return id ? loadPlan(id) : null
  } catch (error) {
    console.error('loadActivePlan failed', error)
    return null
  }
}

export function clearAll(): void {
  try {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
    localStorage.removeItem(KEYS.ACTIVE_PLAN)
  } catch (error) {
    console.error('clearAll failed', error)
  }
}
