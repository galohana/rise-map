import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import StudioPage from './pages/StudioPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/studio/:slug" element={<StudioPage />} />
      </Routes>
    </BrowserRouter>
  )
}
