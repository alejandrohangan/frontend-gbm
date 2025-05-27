import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Ticket from "./pages/tickets/Ticket"
import Category from "./pages/categories/Category"
import Priority from "./pages/priorities/Priority"
import Tag from "./pages/tags/Tag"
import { Toaster } from "react-hot-toast"
import Login from "./pages/auth/Login"
import { AuthProvider } from "./contexts/AuthContext"
import UserTickets from "./pages/tickets/UserTickets"
import AssignTicket from "./pages/tickets/AssignTicket"
import Prueba from "./pages/Prueba"
import InboxMessages from "./pages/messaging/InboxMessages"
import Role from "./pages/roles/Role"

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Redirigir a /categories por defecto */}
            <Route path="/" element={<Navigate to="/categories" replace />} />

            {/* Rutas dentro del layout principal */}
            <Route element={<MainLayout />}>
              <Route path="/tickets" element={<Ticket />} />
              <Route path="/categories" element={<Category />} />
              <Route path="/priorities" element={<Priority />} />
              <Route path="/tags" element={<Tag />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<UserTickets/>} />
              <Route path="/assign" element={<AssignTicket/>} />
              <Route path="/prueba" element={<Prueba/>} />
              <Route path="/messages" element={<InboxMessages/>} />
              <Route path="/roles" element={<Role/>} />

              {/* Ruta para capturar cualquier otra URL */}
              <Route path="*" element={<Navigate to="/categories" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

// Componente auxiliar para las secciones en desarrollo
const Section = ({ title }) => (
  <div className="p-4">
    <h2>{title}</h2>
    <p>Esta sección está en desarrollo</p>
  </div>
)

export default App