import React, { useState, useRef, useEffect } from 'react';

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
};

function TicketCard({ ticket, isAssignMode = false, handleEdit }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getPriorityColor = () => {
        const priorityName = ticket.priority?.name?.toLowerCase() || 'low';
        switch (priorityName) {
            case "urgente": 
            case "urgent": return "#f87171";
            case "alta":
            case "high": return "#fb923c";
            case "media":
            case "medium": return "#60a5fa";
            case "baja":
            case "low": return "#4ade80";
            default: return "#4ade80";
        }
    };

    const getStatusClass = () => {
        switch (ticket.status) {
            case 'open': return 'bg-warning bg-opacity-25 text-warning';
            case 'in_progress': return 'bg-primary bg-opacity-25 text-primary';
            case 'resolved': return 'bg-success bg-opacity-25 text-success';
            case 'closed': return 'bg-secondary bg-opacity-25 text-secondary';
            case 'on_hold': return 'bg-info bg-opacity-25 text-info';
            case 'cancelled': return 'bg-danger bg-opacity-25 text-danger';
            default: return 'bg-secondary bg-opacity-25 text-secondary';
        }
    };

    const formatStatus = (status) => {
        const statusMap = {
            'open': 'Abierto',
            'in_progress': 'En Progreso',
            'resolved': 'Resuelto',
            'closed': 'Cerrado',
            'on_hold': 'En Espera',
            'cancelled': 'Cancelado'
        };
        return statusMap[status] || status;
    };

    const formatPriority = (priority) => {
        const priorityMap = {
            'low': 'Baja',
            'medium': 'Media',
            'high': 'Alta',
            'urgent': 'Urgente'
        };
        return priorityMap[priority] || priority;
    };

    return (
        <div className="card border-0 shadow-sm h-100" style={{ borderLeft: `4px solid ${getPriorityColor()}`, position: 'relative', overflow: 'visible' }}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex gap-2">
                        <span className="badge bg-light text-dark d-flex align-items-center">
                            <i className="bi bi-hash me-1 small"></i>
                            {ticket.id}
                        </span>
                        <span className={`badge ${getStatusClass()}`}>
                            {formatStatus(ticket.status)}
                        </span>
                        <span className="badge bg-light text-dark">
                            {ticket.priority?.name || 'Sin prioridad'}
                        </span>
                    </div>

                    {isAssignMode ? (
                        <div className="position-static" ref={dropdownRef}>
                            <button
                                className="btn btn-sm btn-link text-secondary p-0"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <i className="bi bi-three-dots-vertical"></i>
                            </button>

                            {dropdownOpen && (
                                <div className="dropdown-menu dropdown-menu-end show py-1 shadow" style={{
                                    position: 'absolute',
                                    zIndex: 1000,
                                    transform: 'translate3d(-10px, 25px, 0px)',
                                    right: 0,
                                    marginRight: '10px',
                                    minWidth: '160px',
                                    border: '1px solid rgba(0,0,0,0.1)',
                                    borderRadius: '4px'
                                }}>
                                    <button className="dropdown-item py-2">
                                        Gestionar
                                    </button>
                                    <button className="dropdown-item py-2">
                                        Asignar a agente
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            className="btn btn-sm btn-link text-primary p-0"
                            onClick={handleEdit}
                            title="Editar ticket"
                        >
                            <i className="bi bi-pencil"></i>
                        </button>
                    )}
                </div>

                <h5 className="card-title fw-medium fs-6 mb-2">
                    {ticket.title}
                </h5>

                <p className="card-text text-secondary small mb-3" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {ticket.description}
                </p>

                {/* Mostrar categoría si existe */}
                {ticket.category?.name && (
                    <div className="mb-2">
                        <span className="badge bg-info bg-opacity-25 text-info">
                            {ticket.category.name}
                        </span>
                    </div>
                )}

                {/* Mostrar tags si existen */}
                {ticket.tags && Array.isArray(ticket.tags) && ticket.tags.length > 0 && (
                    <div className="mb-3">
                        {ticket.tags.slice(0, 3).map(tag => (
                            <span key={tag.id} className="badge bg-secondary me-1 mb-1">
                                {tag.name}
                            </span>
                        ))}
                        {ticket.tags.length > 3 && (
                            <span className="badge bg-light text-dark">
                                +{ticket.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center text-secondary small border-top pt-3">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-person me-1"></i>
                        <span>{ticket.agent?.name || 'Sin asignar'}</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <i className="bi bi-clock me-1"></i>
                        <span>{formatDate(ticket.createdAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketCard;