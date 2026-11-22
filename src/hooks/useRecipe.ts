import { useState, useCallback } from 'react'
import type { GenerateParams, WeeklyPlan } from '../types/recipe'
import type { TasteProfile } from '../types/user'
import { getRecipeProvider } from '../services/recipeProvider'
import { savePlan as persistPlan, loadActivePlan } from '../services/storage'

export function useRecipe() {
  const [plan, setPlan] = useState<WeeklyPlan | null>(() => loadActivePlan())
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = useCallback(async (params: GenerateParams, taste: TasteProfile): Promise<WeeklyPlan | null> => {
    setGenerating(true)
    setError(null)
    try {
      const provider = getRecipeProvider()
      const result = await provider.generate(params, taste)
      persistPlan(result)
      setPlan(result)
      return result
    } catch (e) {
      console.error('generate failed', e)
      setError('生成失败，请稍后重试')
      return null
    } finally {
      setGenerating(false)
    }
  }, [])

  const setCurrentPlan = useCallback((p: WeeklyPlan | null) => setPlan(p), [])

  const toggleShoppingItem = useCallback((name: string) => {
    setPlan((prev) => {
      if (!prev) return prev
      const shoppingList = prev.shoppingList.map((it) =>
        it.name === name ? { ...it, checked: !it.checked } : it,
      )
      const next = { ...prev, shoppingList }
      persistPlan(next)
      return next
    })
  }, [])

  return { plan, generating, error, generate, setCurrentPlan, toggleShoppingItem }
}
