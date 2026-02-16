import { useState } from 'react'
import './App.css'
import Shell from './components/ipod/Shell'
import LoginScreen from './components/LoginScreen'
import OnboardingGuide from './components/OnboardingGuide'
import { AuthProvider, useAuth } from './context/AuthContext'
import { PlayerProvider } from './context/PlayerContext'
import { PlaylistProvider } from './context/PlaylistContext'

function AppContent() {
  const { user, authLoading } = useAuth()
  const [showGuide, setShowGuide] = useState(() => {
    return !localStorage.getItem('ipod_onboarding_done')
  })

  // Loading state
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        Loading...
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return <LoginScreen />
  }

  // Logged in — show iPod (and optionally the guide)
  return (
    <>
      <div className="app-container">
        <Shell />
      </div>
      {showGuide && (
        <OnboardingGuide onComplete={() => setShowGuide(false)} />
      )}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <PlaylistProvider>
          <AppContent />
        </PlaylistProvider>
      </PlayerProvider>
    </AuthProvider>
  )
}

export default App
