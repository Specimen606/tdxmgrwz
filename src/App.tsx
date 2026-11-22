import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import ParamsPage from './pages/ParamsPage'
import GeneratingPage from './pages/GeneratingPage'
import RecipePage from './pages/RecipePage'
import RatePage from './pages/RatePage'
import PricingPage from './pages/PricingPage'
import DiscoverPage from './pages/DiscoverPage'
import AdminPage from './pages/AdminPage'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <div key={location.pathname} className="page-enter">
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/params" element={<ParamsPage />} />
        <Route path="/generating" element={<GeneratingPage />} />
        <Route path="/recipe" element={<RecipePage />} />
        <Route path="/rate" element={<RatePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return <AnimatedRoutes />
}
