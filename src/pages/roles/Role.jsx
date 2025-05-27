import React, { useEffect, useState } from 'react'
import RoleService from '../../services/RoleService';
import { Plus } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';
import RoleCard from '../../components/roles/RoleCard';
import PermissionsModal from '../../components/PermissionsModal';

function Role() {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoading(true);
                const rolesData = await RoleService.getAll();
                console.log(rolesData);
                setRoles(rolesData);
            } catch (error) {
                console.error('Error fetching roles:', error);
                setRoles([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    const openViewPermissionsModal = (role) => {
        setSelectedRole(role);
        setIsOpenModal(true);
    }

    const closeModal = () => {
        setIsOpenModal(false);
        setSelectedRole(null);
    }

    if (loading) {
        return (
            <div className="container-fluid px-4 py-5">
                <div className="text-center">Loading roles...</div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-4 py-5">
            <div className="mb-5">
                <h1 className="h2 fw-bold text-dark">Role Management</h1>
                <p className="text-muted mt-1">
                    Create and manage roles with specific permissions that can be assigned to users.
                </p>
            </div>

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
                <Button variant="primary" className="d-flex align-items-center">
                    <Plus size={16} className="me-2" />
                    Create New Role
                </Button>
            </div>

            <div className="row g-4">
                {roles.map(role => (
                    <div key={role.id} className="col-12 col-md-6 col-lg-4">
                        <RoleCard
                            role={{
                                ...role,
                                handleViewPermissions: () => openViewPermissionsModal(role)
                            }}
                        />
                    </div>
                ))}
            </div>

            {selectedRole && (
                <PermissionsModal
                    isOpen={isOpenModal}
                    role={selectedRole}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
}

export default Role;