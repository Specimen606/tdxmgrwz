import type { TasteProfile, DishRating } from '../types/user'
import type { Dish } from '../types/recipe'

export const TASTE_TAGS = ['清淡', '浓郁', '下饭', '快手', '高蛋白', '低卡', '养胃', '省钱', '素食', '高纤']

export function applyRating(taste: TasteProfile, rating: DishRating, dish: Dish): TasteProfile {
  const likedTags = { ...taste.likedTags }
  const dislikedTags = { ...taste.dislikedTags }
  const likedFlavors = { ...taste.likedFlavors }

  rating.likedTags.forEach((tag) => {
    likedTags[tag] = (likedTags[tag] || 0) + 1
    delete dislikedTags[tag]
  })
  rating.dislikedTags.forEach((tag) => {
    dislikedTags[tag] = (dislikedTags[tag] || 0) + 1
    delete likedTags[tag]
  })
  if (rating.score >= 4) {
    likedFlavors[rating.flavor] = (likedFlavors[rating.flavor] || 0) + 1
  } else if (rating.score <= 2) {
    dislikedTags[dish.name] = (dislikedTags[dish.name] || 0) + 2
  }

  return {
    likedTags,
    dislikedTags,
    likedFlavors,
    historyCount: taste.historyCount + 1,
    ratedDishes: Array.from(new Set([...taste.ratedDishes, rating.dishId])),
  }
}

export function dishScore(dish: Dish, taste: TasteProfile): number {
  let score = 0
  dish.tags.forEach((tag) => {
    score += (taste.likedTags[tag] || 0) * 3
    score -= (taste.dislikedTags[tag] || 0) * 4
  })
  score += (taste.likedFlavors[dish.flavor] || 0) * 2
  score -= (taste.dislikedTags[dish.name] || 0) * 5
  return score
}

export function tasteSummary(taste: TasteProfile): string[] {
  const likes = Object.entries(taste.likedTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => k)
  const dislikes = Object.entries(taste.dislikedTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([k]) => k)
  const result: string[] = []
  if (likes.length) result.push(`偏爱${likes.join('、')}`)
  if (dislikes.length) result.push(`少要${dislikes.join('、')}`)
  return result
}
