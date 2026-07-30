import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Dashboard } from '@/pages/Dashboard'
import { Create } from '@/pages/Create'
import { Gallery } from '@/pages/Gallery'
import { Billing } from '@/pages/Billing'
import { Settings } from '@/pages/Settings'
import { ABTestPage } from '@/pages/ABTest'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<Create />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/ab-test" element={<ABTestPage />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
