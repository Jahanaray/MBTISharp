import { Navigate, Outlet } from 'react-router-dom'

function PublicRoute() {
  const isAuthenticated = localStorage.getItem('authToken') !== null
  
  return isAuthenticated ? <Navigate to="/dashboard" /> : <Outlet />
}

export default PublicRoute
