import { Routes, Route } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'
import Home from '../pages/Home'
import Quiz from '../pages/Quiz'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Chat from '../pages/Chat'
import Result from '../pages/Result'
import Legal from '../pages/Legal'

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/login" element={<Login />} />
        <Route path="/result" element={<Result />} />
        <Route path="/legal" element={<Legal />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<Home />} />
    </Routes>
  )
}

export default AppRoutes
