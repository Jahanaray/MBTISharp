import { BrowserRouter } from 'react-router-dom'
import { AuthProvider, useAuth } from './store/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import AppRoutes from './routes'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col">
            <HeaderWrapper />
            <main className="flex-1">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  )
}

function HeaderWrapper() {
  const { isAuthenticated } = useAuth()
  
  return (
    <Header isAuthenticated={isAuthenticated} />
  )
}

export default App
