import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './i18n'

// Initialize document direction based on stored language preference
const savedLang = localStorage.getItem('i18nextLng') || 'en'
document.dir = savedLang === 'fa' ? 'rtl' : 'ltr'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration.scope)
      })
      .catch(error => {
        console.log('SW registration failed:', error)
      })
  })
}
