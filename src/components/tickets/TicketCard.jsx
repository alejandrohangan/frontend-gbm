import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, User } from 'lucide-react';

// Utility functions
const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
        case 'open':
        case 'abierto':
            return 'bg-success';
        case 'pending':
        case 'pendiente':
            return 'bg-warning';
        case 'closed':
        case 'cerrado':
            return 'bg-secondary';
        case 'in_progress':
        case 'en_progreso':
            return 'bg-primary';
        default:
            return 'bg-light text-dark';
    }
};

const formatStatus = (status) => {
    if (!status) return 'Sin estado';

    const statusMap = {
        'open': 'Abierto',
        'pending': 'Pendiente',
        'closed': 'Cerrado',
        'in_progress': 'En Progreso'
    };

    return statusMap[status.toLowerCase()] || status;
};

// UserDropdown component
const UserDropdown = ({ users, onUserSelect }) => {
    return (
        <div className="dropdown-menu show position-absolute end-0 mt-2" style={{ minWidth: '200px' }}>
            <h6 className="dropdown-header">Asignar a:</h6>
            {users && users.length > 0 ? (
                users.map(user => (
                    <button
                        key={user.id}
                        className="dropdown-item d-flex align-items-center"
                        onClick={() => onUserSelect(user.id)}
                    >
                        <User size={16} className="me-2" />
                        {user.name}
                    </button>
                ))
            ) : (
                <span className="dropdown-item-text text-muted">No hay usuarios disponibles</span>
            )}
        </div>
    );
};

function TicketCard({
    ticket,
    isAssignMode = false,
    handleEdit,
    users = [],
    onAssignTicket
}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showUserList, setShowUserList] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
                setShowUserList(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleAssignClick = () => {
        setShowUserList(true);
        setDropdownOpen(false);
    };

    // Función para gestionar (asignar al usuario autenticado)
    const handleManageClick = () => {
        if (onAssignTicket) {
            onAssignTicket(ticket.id, null); // null = asignar al usuario autenticado
        }
        setDropdownOpen(false);
    };

    // Función para asignar a un agente específico
    const handleUserSelect = (userId) => {
        if (onAssignTicket) {
            onAssignTicket(ticket.id, userId);
        }
        setShowUserList(false);
    };

    return (
        <div className="card shadow-sm border-0 overflow-hidden">
            <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex gap-2 flex-wrap">
                        <span className="badge bg-light text-dark d-flex align-items-center">
                            <span className="me-1">#</span>
                            {ticket.id}
                        </span>
                        <span className={`badge ${getStatusClass(ticket.status)}`}>
                            {formatStatus(ticket.status)}
                        </span>
                        <span className="badge bg-light text-dark">
                            {ticket.priority?.name || 'Sin prioridad'}
                        </span>
                    </div>

                    {isAssignMode ? (
                        <div className="position-relative" ref={dropdownRef}>
                            <button
                                className="btn btn-link text-muted p-1"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                style={{ lineHeight: 1 }}
                            >
                                <MoreVertical size={18} />
                            </button>

                            {dropdownOpen && (
                                <div className="dropdown-menu show position-absolute end-0 mt-2">
                                    <button
                                        className="dropdown-item"
                                        onClick={handleManageClick}
                                    >
                                        Gestionar
                                    </button>
                                    <button
                                        className="dropdown-item"
                                        onClick={handleAssignClick}
                                    >
                                        Asignar a agente
                                    </button>
                                </div>
                            )}

                            {showUserList && (
                                <UserDropdown users={users} onUserSelect={handleUserSelect} />
                            )}
                        </div>
                    ) : (
                        <button
                            className="btn btn-link text-primary p-1"
                            onClick={handleEdit}
                            title="Editar ticket"
                            style={{ lineHeight: 1 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                            </svg>
                        </button>
                    )}
                </div>

                <h5 className="card-title h6 mb-2">
                    {ticket.title}
                </h5>

                <p className="card-text text-muted small mb-3" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {ticket.description}
                </p>

                {ticket.category?.name && (
                    <div className="mb-2">
                        <span className="badge bg-primary bg-opacity-25 text-primary">
                            {ticket.category.name}
                        </span>
                    </div>
                )}

                {ticket.tags && Array.isArray(ticket.tags) && ticket.tags.length > 0 && (
                    <div className="mb-3">
                        {ticket.tags.slice(0, 3).map(tag => (
                            <span key={tag.id} className="badge bg-secondary bg-opacity-25 text-secondary me-1 mb-1">
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

                <div className="d-flex justify-content-between align-items-center text-muted small border-top pt-3">
                    <div className="d-flex align-items-center">
                        <User size={14} className="me-1" />
                        <span>{ticket.agent?.name || 'Sin asignar'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketCard;