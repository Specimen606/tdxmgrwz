import type { GenerateParams, WeeklyPlan } from '../types/recipe'
import type { TasteProfile } from '../types/user'
import { MockRecipeProvider } from './mockRecipeProvider'
import { LLMRecipeProvider } from './llmRecipeProvider'

export interface RecipeProvider {
  readonly name: string
  generate(params: GenerateParams, taste: TasteProfile): Promise<WeeklyPlan>
}

const USE_LLM = false

let activeProvider: RecipeProvider = USE_LLM
  ? new LLMRecipeProvider()
  : new MockRecipeProvider()

export function getRecipeProvider(): RecipeProvider {
  return activeProvider
}

export function setRecipeProvider(provider: RecipeProvider): void {
  activeProvider = provider
}
