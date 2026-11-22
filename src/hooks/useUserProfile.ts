import { useState, useEffect, useCallback } from 'react'
import type { UserProfile, DishRating } from '../types/user'
import type { Dish } from '../types/recipe'
import { createDefaultProfile, loadProfile, saveProfile } from '../services/storage'
import { applyRating } from '../services/tasteEngine'

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    setProfile(loadProfile())
  }, [])

  const initProfile = useCallback((enneagramType: number) => {
    const existing = loadProfile()
    if (existing) {
      setProfile(existing)
      return existing
    }
    const fresh = createDefaultProfile(enneagramType)
    saveProfile(fresh)
    setProfile(fresh)
    return fresh
  }, [])

  const updateEnneagram = useCallback((type: number) => {
    setProfile((prev) => {
      if (!prev) return prev
      const next = { ...prev, enneagramType: type }
      saveProfile(next)
      return next
    })
  }, [])

  const addRating = useCallback((rating: DishRating, dish: Dish) => {
    setProfile((prev) => {
      if (!prev) return prev
      const taste = applyRating(prev.taste, rating, dish)
      const next = { ...prev, taste }
      saveProfile(next)
      return next
    })
  }, [])

  const addPlan = useCallback((planId: string) => {
    setProfile((prev) => {
      if (!prev || prev.weeklyPlans.includes(planId)) return prev
      const next = { ...prev, weeklyPlans: [...prev.weeklyPlans, planId] }
      saveProfile(next)
      return next
    })
  }, [])

  const setMembership = useCallback((m: UserProfile['membership']) => {
    setProfile((prev) => {
      if (!prev) return prev
      const next = { ...prev, membership: m }
      saveProfile(next)
      return next
    })
  }, [])

  return { profile, initProfile, updateEnneagram, addRating, addPlan, setMembership }
}
