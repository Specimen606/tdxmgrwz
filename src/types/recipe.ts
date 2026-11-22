export type MealType = 'breakfast' | 'lunch' | 'dinner'
export type DietGoal = 'budget' | 'stomach' | 'muscle'
export type Cookware = 'electricPot' | 'microwave' | 'canteen' | 'airFryer'
export type Restriction = 'noSpicy' | 'noCoriander' | 'noSeafood' | 'noPork' | 'noDairy'
export type Flavor = 'light' | 'medium' | 'rich'

export interface Ingredient {
  name: string
  amount: string
  estimatedCost: number
}

export interface Dish {
  id: string
  name: string
  emoji: string
  image?: string
  meals: MealType[]
  tags: string[]
  flavor: Flavor
  oilLevel: number
  cost: number
  calories: number
  protein: number
  cookware: Cookware[]
  restrictions: Restriction[]
  canteenWindow?: string
  quickRecipe: string
  ingredients: Ingredient[]
  goals: DietGoal[]
}

export interface Meal {
  type: MealType
  dish: Dish
  source: 'canteen' | 'cook'
}

export interface DayMenu {
  day: number
  dateLabel: string
  meals: Meal[]
  estimatedCost: number
}

export interface ShoppingItem {
  name: string
  totalAmount: string
  estimatedCost: number
  checked: boolean
}

export interface WeeklyPlan {
  id: string
  createdAt: number
  params: GenerateParams
  days: DayMenu[]
  shoppingList: ShoppingItem[]
  totalCost: number
  avgDailyCost: number
}

export interface GenerateParams {
  monthlyBudget: number
  cookware: Cookware[]
  restrictions: Restriction[]
  goal: DietGoal
}
