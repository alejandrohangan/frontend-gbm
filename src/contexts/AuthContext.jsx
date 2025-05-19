import { createContext, useContext, useEffect, useState } from "react";
import AuthService from "../services/AuthService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Crear el contexto de autenticación
const AuthContext = createContext({
    user: null,
    token: null,
    login: () => { },
    logout: () => { },
    fetchUser: () => { },
    isAuthenticated: false
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, _setToken] = useState(localStorage.getItem('token') || '');
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const navigate = useNavigate();

    // Función personalizada para sincronizar el estado y localStorage
    const setToken = (newToken) => {
        _setToken(newToken);
        setIsAuthenticated(!!newToken);

        if (newToken) {
            localStorage.setItem('token', newToken);
        } else {
            localStorage.removeItem('token');
        }
    };

    const fetchUser = async () => {
        if (!token) return;

        try {
            const response = await AuthService.me();
            if (response && response.success) {
                setUser(response.user);
            } else {
                // Limpiar si la sesión no es válida
                setUser(null);
                setToken(null);
                toast.error("Tu sesión ha expirado");
            }
        } catch (error) {
            setUser(null);
            setToken(null);
            if (error.response?.status === 401) {
                toast.error("Tu sesión ha expirado");
            } else {
                console.error("Error al obtener datos del usuario:", error);
                toast.error("Error al cargar los datos del usuario");
            }
        }
    }

    const login = async (userData) => {
        try {
            const response = await AuthService.login(userData);
            if (response && response.token) {
                setToken(response.token);
                setUser(response.user); // Ya tenemos el usuario de la respuesta
                toast.success("Inicio de sesión exitoso");
                return { success: true, user: response.user };
            }
            return {
                success: false,
                errors: { general: "Credenciales incorrectas" }
            };
        } catch (error) {
            console.error("Error en login:", error);
            if (error.response?.status === 401) {
                return {
                    success: false,
                    errors: { general: "Credenciales incorrectas" }
                };
            }
            return {
                success: false,
                errors: { general: "Error al iniciar sesión" }
            };
        }
    }

    const logout = async () => {
        try {
            await AuthService.logout();
            setToken(null);
            setUser(null);
            navigate("/login");
            toast.success("Sesión cerrada correctamente");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            // Even if API call fails, we should still log out locally
            setToken(null);
            setUser(null);
            navigate("/login");
            toast.warning("Sesión cerrada localmente, pero hubo un problema con el servidor");
        }
    };

    // Llamar a fetchUser al cargar si hay un token (para restaurar la sesión)
    useEffect(() => {
        if (token) {
            fetchUser();
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            authUser,
            token,
            login,
            logout,
            fetchUser,
            isAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext;