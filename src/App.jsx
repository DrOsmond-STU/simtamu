import { Route, Routes } from 'react-router-dom'
import { KunjunganProvider } from './context/KunjunganContext'
import AppLayout from './components/layout/AppLayout'
import PortalLayout from './components/layout/PortalLayout'
import Dashboard from './pages/Dashboard'
import KunjunganList from './pages/KunjunganList'
import KunjunganDetail from './pages/KunjunganDetail'
import KunjunganForm from './pages/KunjunganForm'
import Agenda from './pages/Agenda'
import PortalHome from './pages/portal/PortalHome'
import PortalForm from './pages/portal/PortalForm'
import PortalSuccess from './pages/portal/PortalSuccess'
import PortalStatus from './pages/portal/PortalStatus'

export default function App() {
  return (
    <KunjunganProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="kunjungan" element={<KunjunganList />} />
          <Route path="kunjungan/baru" element={<KunjunganForm />} />
          <Route path="kunjungan/:id" element={<KunjunganDetail />} />
          <Route path="kunjungan/:id/edit" element={<KunjunganForm />} />
          <Route path="agenda" element={<Agenda />} />
        </Route>

        <Route path="portal" element={<PortalLayout />}>
          <Route index element={<PortalHome />} />
          <Route path="ajukan" element={<PortalForm />} />
          <Route path="sukses/:id" element={<PortalSuccess />} />
          <Route path="status" element={<PortalStatus />} />
        </Route>
      </Routes>
    </KunjunganProvider>
  )
}
