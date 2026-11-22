export interface TasteProfile {
  likedTags: Record<string, number>
  dislikedTags: Record<string, number>
  likedFlavors: Record<string, number>
  historyCount: number
  ratedDishes: string[]
}

export interface UserProfile {
  id: string
  createdAt: number
  enneagramType: number
  nickname?: string
  taste: TasteProfile
  weeklyPlans: string[]
  membership: 'none' | 'monthly' | 'group'
}

export interface DishRating {
  dishId: string
  score: number
  likedTags: string[]
  dislikedTags: string[]
  flavor: string
  timestamp: number
}
