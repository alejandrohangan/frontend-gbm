import { Edit, Users } from 'lucide-react';
import React from 'react'
import { Eye, Trash2 } from 'react-bootstrap-icons';

function RoleCard({ role }) {

    const { name, total_permissions, handleViewPermissions, handleManageUsers, handleEditRole, handleDeleteRole } = role;

    return (
        <div className="card shadow-sm h-100" style={{ transition: 'box-shadow 0.2s ease' }}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 className="card-title text-dark mb-1">{name}</h5>
                        <p className="card-text text-muted small">No description available</p>
                    </div>

                    <div className="d-flex">
                        <button
                            className="btn btn-sm btn-outline-light text-muted me-1 rounded-circle p-2"
                            title="Edit role"
                            onClick={handleEditRole}
                            style={{
                                '--bs-btn-hover-color': '#6366f1',
                                '--bs-btn-hover-bg': '#f0f9ff',
                                '--bs-btn-hover-border-color': 'transparent'
                            }}
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            className="btn btn-sm btn-outline-light text-muted rounded-circle p-2"
                            title="Delete role"
                            onClick={handleDeleteRole}
                            style={{
                                '--bs-btn-hover-color': '#dc3545',
                                '--bs-btn-hover-bg': '#fdf2f2',
                                '--bs-btn-hover-border-color': 'transparent'
                            }}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="mt-3">
                    <span className="badge bg-primary small">
                        {total_permissions} {total_permissions === 1 ? 'Permission' : 'Permissions'}
                    </span>
                </div>
            </div>

            <div className="card-footer bg-light border-top d-flex justify-content-between">
                <button
                    className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                    onClick={handleManageUsers}
                >
                    <Users size={16} className="me-1" />
                    Manage Users
                </button>

                <button
                    className="btn btn-light btn-sm d-flex align-items-center"
                    onClick={handleViewPermissions}
                >
                    <Eye size={16} className="me-1" />
                    View Permissions
                </button>
            </div>
        </div>
    );
}

export default RoleCard;