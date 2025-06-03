"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useLocation, Outlet } from "react-router-dom"
import {
    Ticket,
    Tag,
    ListChecks,
    AlertTriangle,
    Users,
    MessageSquare,
    Home,
    Bell,
    Search,
    Menu,
    X,
    LogOut,
    User,
    HelpCircle,
    Settings,
} from "lucide-react"
import "../styles/custom.css"

// Navegación actualizada según tus rutas reales
const navigation = [
    { name: "Tickets", href: "/tickets", icon: Ticket },
    { name: "Roles", href: "/roles", icon: Users },
    { name: "Mensajes", href: "/messages", icon: MessageSquare },
]

function MainLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userDropdownOpen, setUserDropdownOpen] = useState(false)
    const location = useLocation()
    const dropdownRef = useRef(null)

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setUserDropdownOpen(false)
            }
        }

        if (userDropdownOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [userDropdownOpen])

    return (
        <div className="min-vh-100" style={{ backgroundColor: "#f5f5f5" }}>
            {/* Header */}
            <header className="bg-white shadow-sm sticky-top" style={{ zIndex: 1050, borderBottom: "1px solid #e5e5e5" }}>
                <div className="container-fluid" style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
                    <div className="d-flex justify-content-between align-items-center" style={{ height: "64px" }}>
                        {/* Logo */}
                        <div className="d-flex align-items-center">
                            <Link to="/dashboard" className="d-flex align-items-center text-decoration-none">
                                <img
                                    src="/globomatik-logo.png"
                                    alt="Globomatik Logo"
                                    style={{
                                        width: "200px",
                                        height: "150px",
                                        objectFit: "contain"
                                    }}
                                    className="me-3"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/50x50?text=Logo";
                                    }}
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="d-none d-md-flex align-items-center" style={{ gap: "8px" }}>
                            {navigation.map((item) => {
                                const isActive =
                                    location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href))
                                const IconComponent = item.icon
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`d-flex align-items-center text-decoration-none px-3 py-2 rounded ${isActive
                                            ? "text-primary fw-medium"
                                            : "text-muted"
                                            }`}
                                        style={{
                                            transition: "all 0.2s ease",
                                            fontSize: "14px",
                                            backgroundColor: isActive ? "#f0f8ff" : "transparent"
                                        }}
                                    >
                                        <IconComponent size={16} className="me-2" />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            })}
                        </nav>

                        {/* Right side */}
                        <div className="d-flex align-items-center" style={{ gap: "12px" }}>
                            {/* Notifications */}
                            <button
                                className="btn p-0 border-0 bg-transparent position-relative d-flex align-items-center justify-content-center"
                                style={{ width: "32px", height: "32px", color: "#6b7280" }}
                                title="Notificaciones"
                            >
                                <Bell size={18} />
                                <span
                                    className="position-absolute bg-danger rounded-circle d-flex align-items-center justify-content-center text-white"
                                    style={{
                                        fontSize: "10px",
                                        width: "16px",
                                        height: "16px",
                                        top: "-2px",
                                        right: "-2px",
                                        fontWeight: "600"
                                    }}
                                >
                                    3
                                </span>
                            </button>

                            {/* User Menu */}
                            <div className="dropdown" ref={dropdownRef}>
                                <button
                                    className="btn p-0 border-0 bg-transparent d-flex align-items-center justify-content-center"
                                    style={{ width: "32px", height: "32px" }}
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    type="button"
                                    title="Menú de usuario"
                                >
                                    <div
                                        className="d-flex align-items-center justify-content-center w-100 h-100 bg-secondary text-white fw-bold rounded-circle"
                                        style={{ fontSize: "12px" }}
                                    >
                                        JP
                                    </div>
                                </button>

                                <div
                                    className={`dropdown-menu dropdown-menu-end shadow-sm ${userDropdownOpen ? "show" : ""}`}
                                    style={{
                                        minWidth: "240px",
                                        marginTop: "8px",
                                        border: "1px solid #e5e5e5",
                                        borderRadius: "8px"
                                    }}
                                >
                                    <div className="dropdown-header py-2">
                                        <div className="fw-semibold text-dark">Juan Pérez</div>
                                        <small className="text-muted">juan.perez@globomatik.com</small>
                                    </div>
                                    <div className="dropdown-divider my-1"></div>
                                    <Link to="/profile" className="dropdown-item d-flex align-items-center py-2">
                                        <User size={16} className="me-3 text-muted" />
                                        <span>Perfil</span>
                                    </Link>
                                    <Link to="/settings" className="dropdown-item d-flex align-items-center py-2">
                                        <Settings size={16} className="me-3 text-muted" />
                                        <span>Configuración</span>
                                    </Link>
                                    <button className="dropdown-item d-flex align-items-center py-2">
                                        <HelpCircle size={16} className="me-3 text-muted" />
                                        <span>Ayuda</span>
                                    </button>
                                    <div className="dropdown-divider my-1"></div>
                                    <button className="dropdown-item d-flex align-items-center py-2 text-danger">
                                        <LogOut size={16} className="me-3" />
                                        <span>Cerrar sesión</span>
                                    </button>
                                </div>
                            </div>

                            {/* Mobile menu button */}
                            <button
                                className="btn p-0 border-0 bg-transparent d-md-none d-flex align-items-center justify-content-center"
                                style={{ width: "32px", height: "32px", color: "#6b7280" }}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="d-md-none bg-white" style={{ borderTop: "1px solid #e5e5e5" }}>
                        <div className="container-fluid py-3" style={{ padding: "12px 24px" }}>
                            <div className="d-flex flex-column" style={{ gap: "8px" }}>
                                {navigation.map((item) => {
                                    const isActive =
                                        location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href))
                                    const IconComponent = item.icon
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={`d-flex align-items-center p-3 rounded text-decoration-none ${isActive
                                                ? "text-primary fw-medium"
                                                : "text-muted"
                                                }`}
                                            onClick={() => setMobileMenuOpen(false)}
                                            style={{
                                                transition: "all 0.2s ease",
                                                backgroundColor: isActive ? "#f0f8ff" : "transparent"
                                            }}
                                        >
                                            <IconComponent size={20} className="me-3" />
                                            <span>{item.name}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content - Aquí se renderizarán las rutas hijas */}
            <main style={{
                maxWidth: "1400px",
                margin: "0 auto",
                padding: "24px"
            }}>
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout;