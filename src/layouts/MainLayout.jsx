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
    Menu,
    X,
    LogOut,
    FolderOpen,
    UserCheck,
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import "../styles/custom.css"

function MainLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [userDropdownOpen, setUserDropdownOpen] = useState(false)
    const location = useLocation()
    const dropdownRef = useRef(null)
    
    // Obtener datos del usuario desde el contexto de autenticación
    const { authUser, logout } = useAuth()

    // Función para verificar si el usuario es administrador
    const isAdmin = () => {
        return authUser?.role === "admin"
    }

    // Función para verificar si el usuario es agente
    const isAgent = () => {
        return authUser?.role === "agent"
    }

    // Función para generar iniciales del nombre
    const getInitials = (name) => {
        if (!name) return "U"
        return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
    }

    // Navegación para administradores
    const adminNavigation = [
        { name: "Tickets", href: "/tickets", icon: Ticket },
        { name: "Categorías", href: "/categories", icon: FolderOpen },
        { name: "Prioridades", href: "/priorities", icon: AlertTriangle },
        { name: "Tags", href: "/tags", icon: Tag },
        { name: "Asignar", href: "/assign", icon: UserCheck },
        { name: "Roles", href: "/roles", icon: Users },
        { name: "Mensajes", href: "/messages", icon: MessageSquare },
    ]

    // Navegación para agentes
    const agentNavigation = [
        { name: "Tickets", href: "/tickets", icon: Ticket },
        { name: "Categorías", href: "/categories", icon: FolderOpen },
        { name: "Prioridades", href: "/priorities", icon: AlertTriangle },
        { name: "Tags", href: "/tags", icon: Tag },
        { name: "Asignar", href: "/assign", icon: UserCheck },
        { name: "Mensajes", href: "/messages", icon: MessageSquare },
    ]

    // Navegación para usuarios normales
    const userNavigation = [
        { name: "Mensajes", href: "/messages", icon: MessageSquare },
    ]

    // Seleccionar navegación según el rol
    const getNavigation = () => {
        if (isAdmin()) return adminNavigation
        if (isAgent()) return agentNavigation
        return userNavigation
    }

    const navigation = getNavigation()

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
                        {/* Logo + Navigation para requester */}
                        {!(isAdmin() || isAgent()) ? (
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
                                {/* Nav pegado al logo para requester */}
                                <nav
                                    className="d-none d-md-flex align-items-center"
                                    style={{ gap: "8px" }}
                                >
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
                            </div>
                        ) : (
                            <>
                                {/* Logo solo */}
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
                                {/* Nav centrado para admin/agent */}
                                <nav
                                    className="d-none d-md-flex align-items-center justify-content-center flex-grow-1"
                                    style={{ gap: "8px" }}
                                >
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
                            </>
                        )}

                        {/* Right side */}
                        <div className="d-flex align-items-center" style={{ gap: "12px" }}>
                            {/* Role Badge - Solo visible para administradores y agentes */}
                            {(isAdmin() || isAgent()) && (
                                <span 
                                    className={`badge text-white px-2 py-1 rounded-pill ${isAdmin() ? 'bg-primary' : 'bg-success'}`}
                                    style={{ fontSize: "10px", fontWeight: "600" }}
                                >
                                    {isAdmin() ? 'Admin' : 'Agente'}
                                </span>
                            )}

                            {/* User Menu - FIXED DROPDOWN */}
                            <div className="position-relative" ref={dropdownRef}>
                                <button
                                    className="btn p-0 border-0 bg-transparent d-flex align-items-center justify-content-center"
                                    style={{ 
                                        width: "40px", 
                                        height: "40px",
                                        borderRadius: "50%",
                                        transition: "transform 0.2s ease"
                                    }}
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                    type="button"
                                    title="Menú de usuario"
                                    onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
                                    onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
                                >
                                    <div
                                        className="d-flex align-items-center justify-content-center w-100 h-100 text-white fw-bold rounded-circle shadow-sm"
                                        style={{ 
                                            fontSize: "14px",
                                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                            border: "2px solid #fff"
                                        }}
                                    >
                                        {getInitials(authUser?.name)}
                                    </div>
                                </button>

                                {/* DROPDOWN MENU FIXED */}
                                <div
                                    className={`position-absolute bg-white shadow-lg rounded-3 ${userDropdownOpen ? "d-block" : "d-none"}`}
                                    style={{
                                        top: "calc(100% + 8px)",
                                        right: "0",
                                        minWidth: "280px",
                                        maxWidth: "320px",
                                        border: "1px solid rgba(0,0,0,0.1)",
                                        borderRadius: "12px",
                                        boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                                        zIndex: 1060,
                                        overflow: "hidden"
                                    }}
                                >
                                    {/* Header del dropdown */}
                                    <div className="p-3" style={{ backgroundColor: "#f8f9fa" }}>
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="d-flex align-items-center justify-content-center text-white fw-bold rounded-circle me-3 flex-shrink-0"
                                                style={{ 
                                                    width: "40px",
                                                    height: "40px",
                                                    fontSize: "14px",
                                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                                }}
                                            >
                                                {getInitials(authUser?.name)}
                                            </div>
                                            <div className="flex-grow-1 min-width-0">
                                                <div className="fw-semibold text-dark text-truncate">
                                                    {authUser?.name || 'Usuario'}
                                                </div>
                                                <small className="text-muted text-truncate d-block">
                                                    {authUser?.email || 'email@ejemplo.com'}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Separador */}
                                    <hr className="my-0" style={{ borderColor: "#e9ecef" }} />
                                    
                                    {/* Botón de logout */}
                                    <div className="p-2">
                                        <button 
                                            className="btn btn-link text-danger d-flex align-items-center w-100 text-start p-2 rounded"
                                            onClick={() => {
                                                setUserDropdownOpen(false)
                                                logout()
                                            }}
                                            style={{ 
                                                fontSize: "14px",
                                                textDecoration: "none",
                                                border: "none",
                                                transition: "background-color 0.2s ease"
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = "#f8d7da"}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                                        >
                                            <LogOut size={18} className="me-3 flex-shrink-0" />
                                            <span>Cerrar sesión</span>
                                        </button>
                                    </div>
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