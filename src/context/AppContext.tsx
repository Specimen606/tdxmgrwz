import { createContext, useContext, useState, type ReactNode } from 'react'
import type { GenerateParams } from '../types/recipe'
import { useUserProfile } from '../hooks/useUserProfile'
import { useRecipe } from '../hooks/useRecipe'

interface AppContextValue {
  profile: ReturnType<typeof useUserProfile>['profile']
  initProfile: ReturnType<typeof useUserProfile>['initProfile']
  updateEnneagram: ReturnType<typeof useUserProfile>['updateEnneagram']
  addRating: ReturnType<typeof useUserProfile>['addRating']
  addPlan: ReturnType<typeof useUserProfile>['addPlan']
  setMembership: ReturnType<typeof useUserProfile>['setMembership']
  plan: ReturnType<typeof useRecipe>['plan']
  generating: boolean
  error: string | null
  generate: ReturnType<typeof useRecipe>['generate']
  setCurrentPlan: ReturnType<typeof useRecipe>['setCurrentPlan']
  toggleShoppingItem: ReturnType<typeof useRecipe>['toggleShoppingItem']
  draftParams: GenerateParams
  setDraftParams: (p: GenerateParams) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const user = useUserProfile()
  const recipe = useRecipe()
  const defaultParams: GenerateParams = {
    monthlyBudget: 900,
    cookware: ['electricPot', 'canteen'],
    restrictions: [],
    goal: 'budget',
  }
  const [draftParams, setDraftParams] = useState<GenerateParams>(defaultParams)

  return (
    <AppContext.Provider
      value={{
        profile: user.profile,
        initProfile: user.initProfile,
        updateEnneagram: user.updateEnneagram,
        addRating: user.addRating,
        addPlan: user.addPlan,
        setMembership: user.setMembership,
        plan: recipe.plan,
        generating: recipe.generating,
        error: recipe.error,
        generate: recipe.generate,
        setCurrentPlan: recipe.setCurrentPlan,
        toggleShoppingItem: recipe.toggleShoppingItem,
        draftParams,
        setDraftParams,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
