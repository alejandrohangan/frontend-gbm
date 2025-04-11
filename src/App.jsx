import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Ticket from "./pages/tickets/Ticket"
import Category from "./pages/categories/Category"
import Priority from "./pages/priorities/Priority"
import Tag from "./pages/tags/Tag"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Router>
        <Routes>
          {/* Redirigir a /categories por defecto */}
          <Route path="/" element={<Navigate to="/categories" replace />} />

          {/* Rutas dentro del layout principal */}
          <Route element={<MainLayout />}>
            {/* Categorías */}
            
            <Route path="/tickets" element={<Ticket />} />
            <Route path="/categories" element={<Category/>} />
            <Route path="/priorities" element={<Priority/>} />
            <Route path="/tags" element={<Tag/>} />


            {/* Otras rutas existentes */}
            <Route path="/open" element={<Section title="Open Tickets" />} />
            <Route path="/solved" element={<Section title="Solved Tickets" />} />
            <Route path="/closed" element={<Section title="Closed Tickets" />} />
            <Route path="/pending" element={<Section title="Pending Tickets" />} />
            <Route path="/unassigned" element={<Section title="Unassigned Tickets" />} />
            <Route path="/my-tickets" element={<Section title="My Tickets" />} />
            <Route path="/teams" element={<Section title="Teams" />} />
            <Route path="/management" element={<Section title="Management" />} />

            {/* Ruta para capturar cualquier otra URL y redirigir a /categories */}
            <Route path="*" element={<Navigate to="/categories" replace />} />
          </Route>
        </Routes>
      </Router>
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