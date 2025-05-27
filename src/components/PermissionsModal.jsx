import React from 'react'

function PermissionsModal({ isOpen, closeModal, role }) {
    if (!role) return null;

    return (
        <div className={`modal fade ${isOpen ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: isOpen ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Permissions for {role.name}</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={closeModal}
                        ></button>
                    </div>

                    <div className="modal-body">
                        <div className="mb-4">
                            <p className="text-muted small">
                                This role has {role.permissions?.length || 0} permission{(role.permissions?.length || 0) !== 1 ? 's' : ''}.
                            </p>
                        </div>

                        <div className="border rounded overflow-hidden">
                            {role.permissions?.map((permission, index) => (
                                <div
                                    key={permission.id}
                                    className={`px-3 py-3 ${index < role.permissions.length - 1 ? 'border-bottom' : ''} permission-item`}
                                    style={{ cursor: 'default' }}
                                >
                                    <h6 className="mb-1 fw-medium text-dark">{permission.name}</h6>
                                    <p className="mb-0 text-muted small">{permission.description}</p>
                                </div>
                            )) || (
                                    <div className="px-3 py-3 text-center text-muted">
                                        No permissions found for this role.
                                    </div>
                                )}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PermissionsModal;