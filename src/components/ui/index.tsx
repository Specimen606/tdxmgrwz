import type { ButtonHTMLAttributes, ReactNode, MouseEvent } from 'react'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Star } from 'lucide-react'

export function cn(...inputs: (string | false | null | undefined)[]) {
  return twMerge(clsx(inputs))
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'md' | 'lg'
  full?: boolean
}

export function Button({ variant = 'primary', size = 'md', full, className, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed',
        size === 'lg' ? 'py-4 text-base' : 'py-3 text-sm',
        full && 'w-full',
        variant === 'primary' &&
          'bg-gradient-to-r from-brand-500 to-brand-400 text-white shadow-card hover:shadow-lg hover:brightness-105',
        variant === 'outline' && 'border-2 border-brand-500 text-brand-600 bg-white hover:bg-brand-50',
        variant === 'ghost' && 'bg-brand-50 text-brand-600 hover:bg-brand-100',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function Card({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: (e: MouseEvent) => void }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-3xl bg-white p-5 shadow-soft',
        onClick && 'cursor-pointer transition-all duration-200 hover:shadow-card hover:-translate-y-0.5 active:scale-[0.99]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Chip({
  label,
  active,
  onClick,
  icon,
}: {
  label: string
  active?: boolean
  onClick?: () => void
  icon?: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-95',
        active
          ? 'border-brand-500 bg-brand-500 text-white shadow-card'
          : 'border-gray-200 bg-white text-ink-600 hover:border-brand-300 hover:text-brand-600',
      )}
    >
      {icon}
      {label}
    </button>
  )
}

export function ProgressBar({ value, total }: { value: number; total: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500"
        style={{ width: `${(value / total) * 100}%` }}
      />
    </div>
  )
}

export function StarRating({ value, onChange, size = 28 }: { value: number; onChange: (v: number) => void; size?: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button type="button" key={n} onClick={() => onChange(n)} className="transition-transform hover:scale-110 active:scale-95">
          <Star
            size={size}
            className={cn('transition-colors', n <= value ? 'fill-brand-400 text-brand-400' : 'fill-gray-200 text-gray-200')}
          />
        </button>
      ))}
    </div>
  )
}

export function SectionTitle({ emoji, title, sub }: { emoji?: string; title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-ink-900">
        {emoji && <span>{emoji}</span>}
        {title}
      </h2>
      {sub && <p className="mt-1 text-sm text-ink-600">{sub}</p>}
    </div>
  )
}
