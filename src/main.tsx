import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import LandingApp from './LandingApp.tsx'
import './index.css'

const isLanding = import.meta.env.VITE_LANDING_MODE === 'true'
const RootApp = isLanding ? LandingApp : App

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
)
