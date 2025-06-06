"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Ticket from "./pages/tickets/Ticket"
import Category from "./pages/categories/Category"
import Priority from "./pages/priorities/Priority"
import Tag from "./pages/tags/Tag"
import { Toaster } from "react-hot-toast"
import Login from "./pages/auth/Login"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import AssignTicket from "./pages/tickets/AssignTicket"
import InboxMessages from "./pages/messaging/InboxMessages"
import Role from "./pages/roles/Role"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import Dashboard from "./pages/home/Dashboard"
import ChatLayout from "./pages/messaging/ChatLayout"

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Ruta pública de login */}
            <Route path="/login" element={<LoginRoute />} />

            {/* Rutas protegidas dentro del layout principal */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              {/* Dashboard como ruta por defecto después del login */}
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tickets" element={<Ticket />} />
              <Route path="categories" element={<Category />} />
              <Route path="priorities" element={<Priority />} />
              <Route path="tags" element={<Tag />} />
              <Route path="assign" element={<AssignTicket />} />
              <Route path="messages" element={<ChatLayout/>} />
              <Route path="roles" element={<Role />} />
            </Route>

            {/* Capturar cualquier otra URL */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

// Componente para manejar el login y evitar acceso si ya está autenticado
const LoginRoute = () => {
  const { isAuthenticated } = useAuth()

  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Login />
}

export default App;