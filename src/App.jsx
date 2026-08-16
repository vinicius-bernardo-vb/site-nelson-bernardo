import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton'
import Home from './pages/Home'
import PropertyDetail from './pages/PropertyDetail'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminPropertyForm from './pages/admin/AdminPropertyForm'
import ProtectedRoute from './components/ProtectedRoute'

function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/imovel/:id" element={<PublicLayout><PropertyDetail /></PublicLayout>} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/imoveis/novo"
        element={
          <ProtectedRoute>
            <AdminPropertyForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/imoveis/:id"
        element={
          <ProtectedRoute>
            <AdminPropertyForm />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
