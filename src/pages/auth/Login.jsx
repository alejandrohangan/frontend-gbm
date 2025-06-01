import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error para este campo cuando el usuario escribe
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({}); // Limpiar errores previos

        try {
            const result = await login(userData);

            if (result.success) {
                const { user } = result;
                if (user.rol === 'admin' || user.rol === 'agent') {
                    navigate('/tickets');
                } else {
                    navigate('/categories');
                }
            } else {
                setErrors(result.errors || { general: "Error de autenticación" });
                if (result.errors?.general) {
                    toast.error(result.errors.general);
                }
            }
        } catch (error) {
            setErrors({ general: "Error inesperado" });
            toast.error("Ocurrió un error inesperado");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center align-items-center min-vh-100">
                <div className="col-md-6 col-lg-4">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold">Welcome Back</h2>
                        <p className="text-muted">Please enter your credentials to sign in</p>
                    </div>
                    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-lg">
                        {errors.general && (
                            <div className="alert alert-danger" role="alert">
                                {errors.general}
                            </div>
                        )}
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                id="email"
                                name="email"
                                placeholder="name@example.com"
                                value={userData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                required
                            />
                            {errors.email && (
                                <div className="invalid-feedback">
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <div className="d-flex justify-content-between">
                                <label htmlFor="password" className="form-label">Password</label>
                                <a href="#" className="text-decoration-none small">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={userData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                                required
                            />
                            {errors.password && (
                                <div className="invalid-feedback">
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                disabled={isLoading}
                            />
                            <label className="form-check-label" htmlFor="rememberMe">
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-2 mb-3"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Iniciando sesión...
                                </>
                            ) : 'Sign In'}
                        </button>

                        <p className="text-center mb-0">
                            Don't have an account? <a href="#" className="text-decoration-none">Sign up</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;