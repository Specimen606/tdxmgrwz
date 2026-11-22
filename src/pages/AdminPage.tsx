import { useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { Button, Card, Chip } from '../components/ui'
import { DishImage } from '../components/ui/DishImage'
import { DishEditor } from '../components/admin/DishEditor'
import { useDishes, addDish, updateDish, deleteDish, resetAll, isCustomDish } from '../services/dishStore'
import type { Dish } from '../types/recipe'
import { Search, Plus, Pencil, Trash2, RotateCcw, X, Database } from 'lucide-react'

type View = 'list' | 'editor'

export default function AdminPage() {
  const dishes = useDishes()
  const [view, setView] = useState<View>('list')
  const [editing, setEditing] = useState<Dish | null>(null)
  const [keyword, setKeyword] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<Dish | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const filtered = dishes.filter(
    (d) =>
      !keyword.trim() ||
      d.name.toLowerCase().includes(keyword.trim().toLowerCase()) ||
      d.tags.some((t) => t.includes(keyword.trim())),
  )

  const openAdd = () => { setEditing(null); setView('editor') }
  const openEdit = (d: Dish) => { setEditing(d); setView('editor') }

  const handleSave = (d: Dish) => {
    if (editing) updateDish(d)
    else addDish(d)
    setView('list')
  }

  if (view === 'editor') {
    return (
      <AppShell>
        <div className="px-4 pt-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-ink-900">{editing ? '编辑菜品' : '新增菜品'}</h1>
              <p className="mt-1 text-xs text-ink-400">保存后立即同步到菜谱库与 AI 生成</p>
            </div>
            <button onClick={() => setView('list')} className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-ink-600"><X size={18} /></button>
          </div>
          <DishEditor initial={editing || undefined} onSave={handleSave} onCancel={() => setView('list')} />
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="px-4 pt-5">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-ink-900">菜谱管理</h1>
          <p className="mt-1 text-sm text-ink-600">添加、编辑菜品，改动实时保存在本网站</p>
        </div>

        <div className="mb-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-soft">
          <Search size={18} className="shrink-0 text-ink-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索菜名或标签"
            className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400"
          />
          {keyword && <button onClick={() => setKeyword('')} className="text-ink-400"><X size={16} /></button>}
        </div>

        <div className="mb-4 flex items-center justify-between rounded-2xl bg-brand-50 px-4 py-3">
          <div className="flex items-center gap-2 text-brand-700">
            <Database size={18} />
            <span className="text-sm font-medium">共 {dishes.length} 道菜品</span>
          </div>
          <button onClick={() => setConfirmReset(true)} className="flex items-center gap-1 text-xs text-ink-600 hover:text-brand-600">
            <RotateCcw size={14} /> 恢复默认
          </button>
        </div>

        <Button full className="mb-5" onClick={openAdd}>
          <Plus size={18} /> 添加新菜品
        </Button>

        <div className="space-y-3 pb-4">
          {filtered.map((d) => {
            const custom = isCustomDish(d.id)
            return (
              <Card key={d.id} className="flex items-center gap-3 p-3">
                <DishImage dish={d} width={200} className="h-16 w-16 shrink-0" rounded="rounded-xl" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-ink-900">{d.name}</p>
                    {custom && <span className="shrink-0 rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] text-brand-600">自定义</span>}
                  </div>
                  <p className="mt-0.5 text-xs text-ink-400">
                    {d.meals.map((m) => ({ breakfast: '早', lunch: '午', dinner: '晚' })[m]).join('/')} · ¥{d.cost} · {d.tags.slice(0, 2).join('、') || '无标签'}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => openEdit(d)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 active:scale-95"><Pencil size={15} /></button>
                  <button onClick={() => setConfirmDelete(d)} className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500 active:scale-95"><Trash2 size={15} /></button>
                </div>
              </Card>
            )
          })}
          {!filtered.length && (
            <Card className="py-12 text-center text-sm text-ink-400">没有匹配的菜品</Card>
          )}
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8" onClick={() => setConfirmDelete(null)}>
          <Card className="w-full max-w-[320px] text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-base font-semibold text-ink-900">删除「{confirmDelete.name}」？</p>
            <p className="mt-2 text-xs text-ink-600">删除后将从菜谱库和 AI 生成池中移除</p>
            <div className="mt-5 flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setConfirmDelete(null)}>取消</Button>
              <Button className="flex-1 bg-red-500" onClick={() => { deleteDish(confirmDelete.id); setConfirmDelete(null) }}>删除</Button>
            </div>
          </Card>
        </div>
      )}

      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8" onClick={() => setConfirmReset(false)}>
          <Card className="w-full max-w-[320px] text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-base font-semibold text-ink-900">恢复默认菜谱库？</p>
            <p className="mt-2 text-xs text-ink-600">将清除所有新增、编辑和删除，不可撤销</p>
            <div className="mt-5 flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => setConfirmReset(false)}>取消</Button>
              <Button className="flex-1" onClick={() => { resetAll(); setConfirmReset(false) }}>确认恢复</Button>
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  )
}
