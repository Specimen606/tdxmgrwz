import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { AppShell } from '../components/layout/AppShell'
import { Button, Card, ProgressBar } from '../components/ui'
import { QUESTIONS, computeResult } from '../data/enneagram'
import type { EnneagramResult } from '../types/enneagram'
import { ArrowRight, Info, RotateCcw } from 'lucide-react'

export default function QuizPage() {
  const navigate = useNavigate()
  const { initProfile, updateEnneagram } = useApp()
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [result, setResult] = useState<EnneagramResult | null>(null)

  const question = QUESTIONS[qIndex]

  const pick = (type: number) => {
    const next = [...answers, type]
    setAnswers(next)
    if (qIndex < QUESTIONS.length - 1) {
      setQIndex(qIndex + 1)
    } else {
      const r = computeResult(next)
      setResult(r)
      initProfile(r.type)
    }
  }

  const retry = () => {
    setQIndex(0)
    setAnswers([])
    setResult(null)
  }

  if (result) {
    return (
      <AppShell>
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
          <div
            className="animate-pop flex h-24 w-24 items-center justify-center rounded-[28px] text-6xl shadow-card"
            style={{ background: `linear-gradient(135deg, ${result.color}22, ${result.color}44)` }}
          >
            {result.emoji}
          </div>
          <p className="mt-6 text-sm text-ink-400">你的美食人格是</p>
          <h2 className="mt-1 text-2xl font-bold text-ink-900">{result.name}</h2>
          <p className="mt-1 font-medium" style={{ color: result.color }}>
            {result.slogan}
          </p>

          <Card className="mt-6 w-full text-left">
            <p className="text-sm leading-relaxed text-ink-600">{result.description}</p>
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-gray-50 p-3 text-xs leading-relaxed text-ink-400">
              <Info size={14} className="mt-0.5 shrink-0" />
              <span>
                测试仅供娱乐破冰，仅作展示标签。<strong className="text-ink-600">
                  食谱实际由预算、厨具、忌口、目标四项真实数据决定，与人格无关。
                </strong>
              </span>
            </div>
          </Card>

          <Button size="lg" full className="mt-7" onClick={() => navigate('/params')}>
            开始定制食谱 <ArrowRight size={18} />
          </Button>
          <button onClick={retry} className="mt-4 flex items-center gap-1 text-sm text-ink-400 hover:text-brand-500">
            <RotateCcw size={14} /> 重新测试
          </button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="px-5 pt-6">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs text-ink-400">
            <span>美食人格测试</span>
            <span>
              {qIndex + 1} / {QUESTIONS.length}
            </span>
          </div>
          <ProgressBar value={qIndex + 1} total={QUESTIONS.length} />
        </div>

        <div key={qIndex} className="animate-slide-up">
          <div className="mb-2 text-5xl">🍽️</div>
          <h2 className="text-xl font-bold leading-relaxed text-ink-900">{question.title}</h2>
          <p className="mt-2 text-sm text-ink-400">凭第一感觉选就好</p>

          <div className="mt-8 space-y-3">
            {question.options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => pick(opt.type)}
                className="group flex w-full items-center gap-3 rounded-2xl border-2 border-gray-100 bg-white p-4 text-left shadow-soft transition-all duration-200 hover:border-brand-300 hover:shadow-card active:scale-[0.98]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-50 font-semibold text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  {String.fromCharCode(65 + question.options.indexOf(opt))}
                </span>
                <span className="text-sm font-medium text-ink-900">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {answers.length > 0 && (
          <button onClick={() => { setQIndex(Math.max(0, qIndex - 1)); setAnswers(answers.slice(0, -1)) }} className="mt-6 text-sm text-ink-400">
            上一题
          </button>
        )}
      </div>
    </AppShell>
  )
}
