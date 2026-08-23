import { Route, Routes } from 'react-router-dom'
import { KunjunganProvider } from './context/KunjunganContext'
import AppLayout from './components/layout/AppLayout'
import PortalLayout from './components/layout/PortalLayout'
import StaffGate from './pages/staff/StaffGate'
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
        {/* Situs publik — titik masuk utama (default) untuk tamu. */}
        <Route path="/" element={<PortalLayout />}>
          <Route index element={<PortalHome />} />
          <Route path="ajukan" element={<PortalForm />} />
          <Route path="sukses/:id" element={<PortalSuccess />} />
          <Route path="status" element={<PortalStatus />} />
        </Route>

        {/* Gerbang masuk petugas — halaman publik, bukan bagian dari AppLayout,
            supaya pengunjung baru tidak langsung nyasar ke panel internal. */}
        <Route path="petugas" element={<StaffGate />} />

        {/* Panel internal petugas, hanya dapat dicapai lewat gerbang di atas. */}
        <Route path="petugas" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="kunjungan" element={<KunjunganList />} />
          <Route path="kunjungan/baru" element={<KunjunganForm />} />
          <Route path="kunjungan/:id" element={<KunjunganDetail />} />
          <Route path="kunjungan/:id/edit" element={<KunjunganForm />} />
          <Route path="agenda" element={<Agenda />} />
        </Route>
      </Routes>
    </KunjunganProvider>
  )
}
