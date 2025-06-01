import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Ticket from "./pages/tickets/Ticket"
import Category from "./pages/categories/Category"
import Priority from "./pages/priorities/Priority"
import Tag from "./pages/tags/Tag"
import { Toaster } from "react-hot-toast"
import Login from "./pages/auth/Login"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import UserTickets from "./pages/tickets/UserTickets"
import AssignTicket from "./pages/tickets/AssignTicket"
import Prueba from "./pages/Prueba"
import InboxMessages from "./pages/messaging/InboxMessages"
import Role from "./pages/roles/Role"
import ProtectedRoute from "./components/auth/ProtectedRoute"

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Ruta pública de login */}
            <Route path="/login" element={<Login />} />

            {/* Rutas protegidas dentro del layout principal */}
            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/tickets" element={<Ticket />} />
              <Route path="/categories" element={<Category />} />
              <Route path="/priorities" element={<Priority />} />
              <Route path="/tags" element={<Tag />} />
              <Route path="/dashboard" element={<UserTickets />} />
              <Route path="/assign" element={<AssignTicket />} />
              <Route path="/prueba" element={<Prueba />} />
              <Route path="/messages" element={<InboxMessages />} />
              <Route path="/roles" element={<Role />} />
            </Route>

            {/* Redirigir la raíz según el estado de autenticación */}
            <Route path="/" element={<RootRedirect />} />

            {/* Ruta para capturar cualquier otra URL */}
            <Route path="*" element={<NotFoundRedirect />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

// Componente para manejar la redirección de la raíz
const RootRedirect = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/categories" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

// Componente para manejar rutas no encontradas
const NotFoundRedirect = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/categories" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default App