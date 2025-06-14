import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { authUser } = useAuth();
    const location = useLocation();

    // Si no hay usuario autenticado, redirigir al login
    if (!authUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si el rol del usuario no está en los roles permitidos, redirigir al dashboard
    if (!allowedRoles.includes(authUser.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    // Si el usuario tiene el rol correcto, mostrar el componente
    return children;
};

export default RoleProtectedRoute; 