// UserDropdown component simple y efectivo
const UserDropdown = ({ users, onUserSelect }) => {
    return (
        <div 
            className="position-absolute bg-white border rounded shadow-lg"
            style={{ 
                top: '100%',
                right: '0',
                minWidth: '250px',
                maxWidth: '300px',
                maxHeight: '300px',
                zIndex: 9999,
                marginTop: '8px',
                border: '1px solid #dee2e6',
                boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
            }}
        >
            {/* Header simple */}
            <div className="px-3 py-2 bg-light border-bottom">
                <small className="fw-semibold text-dark">Seleccionar agente</small>
            </div>

            {/* Lista de usuarios con scroll */}
            <div 
                className="overflow-auto"
                style={{ maxHeight: '240px' }}
            >
                {users && users.length > 0 ? (
                    users.map(user => (
                        <button
                            key={user.id}
                            className="w-100 border-0 bg-transparent d-flex align-items-center p-3 text-start"
                            onClick={() => onUserSelect(user.id)}
                            style={{
                                transition: 'background-color 0.2s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                            }}
                        >
                            {/* Avatar simple */}
                            <div className="me-3">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="rounded-circle"
                                        width="32"
                                        height="32"
                                        style={{ objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div 
                                        className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white fw-bold" 
                                        style={{ width: '32px', height: '32px', fontSize: '14px' }}
                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* Información del usuario */}
                            <div className="flex-grow-1">
                                <div className="fw-medium text-dark mb-0" style={{ fontSize: '14px' }}>
                                    {user.name}
                                </div>
                                {user.email && (
                                    <small className="text-muted d-block" style={{ fontSize: '12px' }}>
                                        {user.email}
                                    </small>
                                )}
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="text-center py-4 text-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-x mb-2" viewBox="0 0 16 16">
                            <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-.646-4.854.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708Z"/>
                        </svg>
                        <div>No hay agentes disponibles</div>
                    </div>
                )}
            </div>

            {/* Footer con contador */}
            {users && users.length > 5 && (
                <div className="px-3 py-2 border-top bg-light">
                    <small className="text-muted">
                        Total: {users.length} agentes
                    </small>
                </div>
            )}
        </div>
    );
};