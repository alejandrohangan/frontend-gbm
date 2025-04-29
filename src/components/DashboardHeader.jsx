"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Bell, LogOut, Menu, Search, Settings, User, X } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

// Función utilitaria cn para combinar clases
const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

// Componentes UI básicos
const Button = ({ variant, size, className, asChild, children, ...props }) => {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  )
}

const Sheet = ({ children }) => {
  return <div>{children}</div>
}

const SheetTrigger = ({ asChild, children }) => {
  return children
}

const SheetContent = ({ side, className, children }) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

const Avatar = ({ className, children }) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

const AvatarImage = ({ src, alt }) => {
  return <img src={src} alt={alt} />
}

const AvatarFallback = ({ children }) => {
  return <div>{children}</div>
}

const Badge = ({ className, children }) => {
  return (
    <span className={className}>
      {children}
    </span>
  )
}

const Input = (props) => {
  return <input {...props} />
}

const DropdownMenu = ({ children }) => {
  return <div>{children}</div>
}

const DropdownMenuTrigger = ({ asChild, children }) => {
  return children
}

const DropdownMenuContent = ({ align, className, children }) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

const DropdownMenuLabel = ({ children }) => {
  return <div>{children}</div>
}

const DropdownMenuGroup = ({ children }) => {
  return <div>{children}</div>
}

const DropdownMenuSeparator = () => {
  return <hr />
}

const DropdownMenuItem = ({ children, className, ...props }) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  )
}

export default function DashboardHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <header className="shadow-sm bg-white position-sticky top-0 z-50">
      <div className="container-fluid">
        <div className="d-flex align-items-center py-3">
          {/* Mobile menu button */}
          <button
            className="btn btn-sm btn-light rounded-3 d-md-none me-2"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
            <span className="visually-hidden">Menú</span>
          </button>

          {/* Logo */}
          <Link to="/" className="d-flex align-items-center text-decoration-none me-4">
            <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10" style={{width: "36px", height: "36px"}}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
                width="20"
                height="20"
              >
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
              </svg>
            </div>
            <span className="fw-bold fs-4 ms-2 text-primary">GBM-TicketSystem</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="d-none d-md-flex">
            <Link
              to="/"
              className="btn btn-sm text-primary bg-primary bg-opacity-10 rounded-3 fw-medium me-2"
            >
              Dashboard
            </Link>
            <Link
              to="/tickets"
              className="btn btn-sm text-secondary bg-transparent rounded-3 fw-medium me-2"
            >
              Tickets
            </Link>
            <Link
              to="/teams"
              className="btn btn-sm text-secondary bg-transparent rounded-3 fw-medium me-2"
            >
              Equipos
            </Link>
            <Link
              to="/reports"
              className="btn btn-sm text-secondary bg-transparent rounded-3 fw-medium me-2"
            >
              Reportes
            </Link>
          </nav>

          {/* Right aligned content */}
          <div className="ms-auto d-flex align-items-center">
            {/* Search */}
            <div className={`position-relative ${isSearchOpen ? "w-100" : ""}`} style={{maxWidth: isSearchOpen ? "250px" : "auto"}}>
              {isSearchOpen ? (
                <div className="position-relative">
                  <input
                    type="search"
                    className="form-control form-control-sm rounded-pill"
                    placeholder="Buscar tickets..."
                    autoFocus
                  />
                  <button
                    className="btn btn-sm position-absolute top-0 end-0 p-1 bg-transparent border-0"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  className="btn btn-sm rounded-circle btn-light"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Notifications */}
            <div className="mx-2">
              <button className="btn btn-sm rounded-circle btn-light position-relative">
                <Bell size={18} />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: "0.6rem"}}>
                  3
                </span>
              </button>
            </div>

            {/* User dropdown */}
            <div className="position-relative">
              <button
                className="btn p-0 border-2 rounded-circle overflow-hidden"
                style={{width: "32px", height: "32px"}}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img
                  src="/placeholder.svg"
                  alt="Avatar"
                  className="img-fluid"
                  width="32"
                  height="32"
                />
              </button>
              
              {isDropdownOpen && (
                <div className="position-absolute end-0 mt-3 dropdown-menu show" style={{minWidth: "220px"}}>
                  <button
                    className="dropdown-item d-flex align-items-center text-danger"
                    onClick={handleLogout}
                  >
                    <LogOut className="me-2" size={16} />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {isSidebarOpen && (
        <>
          <div 
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{zIndex: 1040}}
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <div 
            className="position-fixed top-0 start-0 h-100 bg-white shadow p-3 overflow-auto"
            style={{zIndex: 1050, width: "280px"}}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                    width="20"
                    height="20"
                  >
                    <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                  </svg>
                </div>
                <span className="fw-bold fs-5 ms-2">GBM-TicketSystem</span>
              </div>
              <button 
                className="btn btn-sm btn-light rounded-circle"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <nav className="nav flex-column">
              <Link 
                to="/" 
                className="nav-link rounded mb-1 bg-primary bg-opacity-10 text-primary d-flex align-items-center"
                onClick={() => setIsSidebarOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="20"
                  height="20"
                  className="me-2"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M9 9h6v6H9z" />
                </svg>
                Dashboard
              </Link>
              <Link 
                to="/tickets" 
                className="nav-link rounded mb-1 text-secondary d-flex align-items-center"
                onClick={() => setIsSidebarOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="20"
                  height="20"
                  className="me-2"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                Tickets
              </Link>
              <Link 
                to="/teams" 
                className="nav-link rounded mb-1 text-secondary d-flex align-items-center"
                onClick={() => setIsSidebarOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="20"
                  height="20"
                  className="me-2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Equipos
              </Link>
              <Link 
                to="/reports" 
                className="nav-link rounded mb-1 text-secondary d-flex align-items-center"
                onClick={() => setIsSidebarOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="20"
                  height="20"
                  className="me-2"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
                Reportes
              </Link>
              <Link 
                to="/settings" 
                className="nav-link rounded mb-1 text-secondary d-flex align-items-center"
                onClick={() => setIsSidebarOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="20"
                  height="20"
                  className="me-2"
                >
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                </svg>
                Configuración
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}
