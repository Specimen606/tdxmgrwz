export interface EnneagramOption {
  label: string
  type: number
}

export interface EnneagramQuestion {
  id: number
  title: string
  options: EnneagramOption[]
}

export interface EnneagramResult {
  type: number
  name: string
  emoji: string
  slogan: string
  description: string
  color: string
}
