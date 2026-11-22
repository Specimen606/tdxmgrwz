import { useState } from 'react'
import type { Dish, MealType, Cookware, Restriction, DietGoal, Flavor, Ingredient } from '../../types/recipe'
import { Button, Card, Chip, SectionTitle, cn } from '../ui'
import { DishImage } from '../ui/DishImage'
import { Trash2, Plus, X } from 'lucide-react'

const OPTION_SETS = {
  meals: [{ id: 'breakfast', label: '早餐' }, { id: 'lunch', label: '午餐' }, { id: 'dinner', label: '晚餐' }] as { id: MealType; label: string }[],
  cookware: [{ id: 'electricPot', label: '小电锅' }, { id: 'microwave', label: '微波炉' }, { id: 'airFryer', label: '空气炸锅' }, { id: 'canteen', label: '食堂' }] as { id: Cookware; label: string }[],
  restrictions: [{ id: 'noSpicy', label: '含辣' }, { id: 'noCoriander', label: '含香菜' }, { id: 'noSeafood', label: '含海鲜' }, { id: 'noPork', label: '含猪肉' }, { id: 'noDairy', label: '含乳制品' }] as { id: Restriction; label: string }[],
  goals: [{ id: 'budget', label: '省钱减脂' }, { id: 'stomach', label: '养胃' }, { id: 'muscle', label: '增肌' }] as { id: DietGoal; label: string }[],
  flavors: [{ id: 'light', label: '清淡' }, { id: 'medium', label: '适中' }, { id: 'rich', label: '浓郁' }] as { id: Flavor; label: string }[],
}

function emptyDish(): Dish {
  return {
    id: `custom_${Date.now()}`,
    name: '',
    emoji: '🍲',
    meals: ['lunch'],
    tags: [],
    flavor: 'light',
    oilLevel: 2,
    cost: 6,
    calories: 400,
    protein: 15,
    cookware: ['electricPot'],
    restrictions: [],
    quickRecipe: '',
    ingredients: [],
    goals: ['budget'],
  }
}

function TextField({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-600">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none transition-colors focus:border-brand-500"
      />
    </label>
  )
}

function toggle<T>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v]
}

export function DishEditor({ initial, onSave, onCancel }: { initial?: Dish; onSave: (d: Dish) => void; onCancel: () => void }) {
  const [dish, setDish] = useState<Dish>(initial ? { ...initial } : emptyDish())
  const [tagText, setTagText] = useState((initial?.tags || []).join('、'))
  const [error, setError] = useState('')

  const set = <K extends keyof Dish>(key: K, value: Dish[K]) => setDish((d) => ({ ...d, [key]: value }))

  const save = () => {
    if (!dish.name.trim()) {
      setError('请填写菜名后再保存')
      return
    }
    setError('')
    onSave({
      ...dish,
      name: dish.name.trim(),
      tags: tagText.split(/[、,，\s]+/).map((t) => t.trim()).filter(Boolean),
      cost: Number(dish.cost) || 0,
      calories: Number(dish.calories) || 0,
      protein: Number(dish.protein) || 0,
      oilLevel: Number(dish.oilLevel) || 1,
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle emoji="🖼️" title="菜品预览" sub="图片留空则使用默认配图" />
        <div className="flex items-center gap-3">
          <DishImage dish={dish} width={300} className="h-20 w-20" rounded="rounded-2xl" />
          <div className="flex-1">
            <TextField label="图片链接（可选）" value={dish.image || ''} onChange={(v) => set('image', v)} placeholder="https://..." />
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle emoji="📝" title="基本信息" />
        <div className="space-y-3">
          <TextField label="菜名 *" value={dish.name} onChange={(v) => set('name', v)} placeholder="例如：番茄炒蛋" />
          <div className="flex gap-3">
            <div className="w-24">
              <TextField label="图标" value={dish.emoji} onChange={(v) => set('emoji', v)} />
            </div>
            <div className="flex-1">
              <TextField label="食堂窗口（可选）" value={dish.canteenWindow || ''} onChange={(v) => set('canteenWindow', v)} placeholder="例如：食堂二楼" />
            </div>
          </div>
          <TextField label="标签（用逗号或顿号分隔）" value={tagText} onChange={setTagText} placeholder="快手、高蛋白、养胃" />
          <TextField label="做法 / 描述" value={dish.quickRecipe} onChange={(v) => set('quickRecipe', v)} placeholder="简单描述怎么做" />
        </div>
      </Card>

      <Card>
        <SectionTitle emoji="🔢" title="数值与分类" />
        <div className="grid grid-cols-2 gap-3">
          <TextField label="单份花费 ¥" type="number" value={dish.cost} onChange={(v) => set('cost', Number(v))} />
          <TextField label="热量 kcal" type="number" value={dish.calories} onChange={(v) => set('calories', Number(v))} />
          <TextField label="蛋白质 g" type="number" value={dish.protein} onChange={(v) => set('protein', Number(v))} />
          <TextField label="油腻度 1-5" type="number" value={dish.oilLevel} onChange={(v) => set('oilLevel', Number(v))} />
        </div>
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-ink-600">口味</p>
          <div className="flex flex-wrap gap-2">
            {OPTION_SETS.flavors.map((o) => (
              <Chip key={o.id} label={o.label} active={dish.flavor === o.id} onClick={() => set('flavor', o.id)} />
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle emoji="🍽️" title="适用餐次" />
        <div className="flex flex-wrap gap-2">
          {OPTION_SETS.meals.map((o) => (
            <Chip key={o.id} label={o.label} active={dish.meals.includes(o.id)} onClick={() => set('meals', toggle(dish.meals, o.id))} />
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle emoji="🎯" title="饮食目标" sub="影响 AI 生成时的优先级" />
        <div className="flex flex-wrap gap-2">
          {OPTION_SETS.goals.map((o) => (
            <Chip key={o.id} label={o.label} active={dish.goals.includes(o.id)} onClick={() => set('goals', toggle(dish.goals, o.id))} />
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle emoji="🍳" title="所需厨具" />
        <div className="flex flex-wrap gap-2">
          {OPTION_SETS.cookware.map((o) => (
            <Chip key={o.id} label={o.label} active={dish.cookware.includes(o.id)} onClick={() => set('cookware', toggle(dish.cookware, o.id))} />
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle emoji="🚫" title="所含致忌成分" sub="勾选后，忌口该成分的用户不会看到此菜" />
        <div className="flex flex-wrap gap-2">
          {OPTION_SETS.restrictions.map((o) => (
            <Chip key={o.id} label={o.label} active={dish.restrictions.includes(o.id)} onClick={() => set('restrictions', toggle(dish.restrictions, o.id))} />
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle emoji="🛒" title="食材用量" />
        <div className="space-y-2">
          {dish.ingredients.map((ing, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={ing.name} onChange={(e) => { const arr = [...dish.ingredients]; arr[i] = { ...ing, name: e.target.value }; set('ingredients', arr) }} placeholder="食材" className="min-w-0 flex-1 rounded-lg border border-gray-200 px-2 py-2 text-sm outline-none focus:border-brand-500" />
              <input value={ing.amount} onChange={(e) => { const arr = [...dish.ingredients]; arr[i] = { ...ing, amount: e.target.value }; set('ingredients', arr) }} placeholder="用量" className="w-16 rounded-lg border border-gray-200 px-2 py-2 text-sm outline-none focus:border-brand-500" />
              <input type="number" value={ing.estimatedCost} onChange={(e) => { const arr = [...dish.ingredients]; arr[i] = { ...ing, estimatedCost: Number(e.target.value) }; set('ingredients', arr) }} placeholder="¥" className="w-14 rounded-lg border border-gray-200 px-2 py-2 text-sm outline-none focus:border-brand-500" />
              <button onClick={() => set('ingredients', dish.ingredients.filter((_, j) => j !== i))} className="text-ink-400 hover:text-red-500"><X size={16} /></button>
            </div>
          ))}
          <button
            onClick={() => set('ingredients', [...dish.ingredients, { name: '', amount: '', estimatedCost: 0 } as Ingredient])}
            className="flex w-full items-center justify-center gap-1 rounded-xl border border-dashed border-brand-300 py-2.5 text-sm text-brand-600 hover:bg-brand-50"
          >
            <Plus size={15} /> 添加食材
          </button>
        </div>
      </Card>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-2.5 text-center text-sm text-red-500">{error}</div>
      )}
      <div className="flex gap-3 pb-4">
        <Button variant="ghost" className="flex-1" onClick={onCancel}>取消</Button>
        <Button className="flex-[2]" onClick={save}>保存菜品</Button>
      </div>
    </div>
  )
}
