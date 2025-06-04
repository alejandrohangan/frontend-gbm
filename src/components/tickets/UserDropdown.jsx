import React from 'react';

const UserDropdown = ({ users, onUserSelect }) => {
    return (
        <div className="dropdown-menu show position-absolute end-0 mt-2 border shadow" style={{ width: '16rem', zIndex: 1021 }}>
            <div className="dropdown-header bg-light border-bottom">
                <small className="text-muted fw-semibold">Seleccionar agente</small>
            </div>

            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {users.length > 0 ? (
                    users.map(user => (
                        <button
                            key={user.id}
                            className="dropdown-item d-flex align-items-center"
                            onClick={() => onUserSelect(user.id)}
                        >
                            <div className="flex-shrink-0 me-3">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="rounded-circle"
                                        width="32"
                                        height="32"
                                    />
                                ) : (
                                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                        <span className="small fw-medium text-muted">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <span className="text-truncate">{user.name}</span>
                        </button>
                    ))
                ) : (
                    <div className="dropdown-item-text text-muted small">
                        No hay agentes disponibles
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDropdown;