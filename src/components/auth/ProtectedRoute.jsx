import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Guardar la ubicación actual para redirigir después del login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si está autenticado, mostrar el componente
    return children;
};

export default ProtectedRoute;