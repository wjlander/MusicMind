import { useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import GameHub from './components/GameHub'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <GameHub />
      </div>
    </ThemeProvider>
  )
}

export default App
