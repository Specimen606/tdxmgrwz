import { useState } from 'react'
import type { Dish } from '../../types/recipe'
import { getDishImageUrl } from '../../data/dishImages'
import { cn } from './index'

interface DishImageProps {
  dish: Dish
  className?: string
  width?: number
  rounded?: string
}

/** 菜品配图，加载失败时回退到 emoji 占位 */
export function DishImage({ dish, className, width = 480, rounded = 'rounded-2xl' }: DishImageProps) {
  const [failed, setFailed] = useState(false)
  const src = dish.image || getDishImageUrl(dish.id, width)

  if (failed) {
    return (
      <div className={cn('flex items-center justify-center bg-gradient-to-br from-orange-50 via-brand-50 to-brand-100 text-5xl', rounded, className)}>
        {dish.emoji}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={dish.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn('object-cover', rounded, className)}
    />
  )
}
