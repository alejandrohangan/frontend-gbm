import React, { useEffect, useState } from 'react'
import RoleService from '../../services/RoleService';
import { Plus } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';
import RoleCard from '../../components/roles/RoleCard';
import CustomModal from '../../components/CustomModal';
import ManageUsers from './ManageUsers';
import ManageRole from './ManageRole';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

function Role() {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [modalType, setModalType] = useState('');
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Movemos fetchRoles fuera del useEffect y la hacemos una función regular
    const fetchRoles = async () => {
        try {
            setLoading(true);
            const rolesData = await RoleService.getAll();
            setRoles(rolesData);
        } catch (error) {
            console.error('Error fetching roles:', error);
            setRoles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    // ✅ Función para refrescar roles después de crear/editar
    const handleRoleUpdated = async () => {
        await fetchRoles();
    };

    const openViewPermissionsModal = (role) => {
        setSelectedRole(role);
        setModalType('permissions');
        setIsOpenModal(true);
    }

    const openManageUsersModal = (role) => {
        setSelectedRole(role);
        setModalType('users');
        setIsOpenModal(true);
    }

    const closeModal = () => {
        setIsOpenModal(false);
        setSelectedRole(null);
        setModalType('');
    }

    const openCreateRoleModal = () => {
        setSelectedRole(null);
        setModalType('create');
        setIsOpenModal(true);
    }

    const openEditRoleModal = (role) => {
        setSelectedRole(role);
        setModalType('edit');
        setIsOpenModal(true);
    }

    const handleDeleteRole = async (id) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede revertir",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                const deleteResult = await RoleService.delete(id);

                if (deleteResult.success) {
                    console.log('Resultado de eliminación:', deleteResult);
                    toast.success('Rol eliminado con éxito');
                    setRoles(prevRoles => prevRoles.filter(role => role.id !== id));
                } else {
                    toast.error('Error al eliminar el rol');
                }
            } catch (error) {
                toast.error('Error al eliminar el rol');
            }
        }
    }

    const getModalTitle = () => {
        switch (modalType) {
            case 'users':
                return selectedRole ? `Manage Users - ${selectedRole.name}` : '';
            case 'permissions':
                return selectedRole ? `View Permissions - ${selectedRole.name}` : '';
            case 'create':
                return 'Create New Role';
            case 'edit':
                return selectedRole ? `Edit Role - ${selectedRole.name}` : '';
            default:
                return '';
        }
    }

    const renderModalContent = () => {
        switch (modalType) {
            case 'users':
                return selectedRole ? <ManageUsers roleId={selectedRole.id} /> : null;
            case 'permissions':
                return selectedRole ? <div>Aquí iría el componente de permisos</div> : null;
            case 'create':
                // ✅ Cambiamos onRefresh por onRoleUpdated
                return <ManageRole roleId={null} onClose={closeModal} onRoleUpdated={handleRoleUpdated}/>;
            case 'edit':
                // ✅ Cambiamos onRefresh por onRoleUpdated
                return selectedRole ? <ManageRole roleId={selectedRole.id} onClose={closeModal} onRoleUpdated={handleRoleUpdated}/> : null;
            default:
                return null;
        }
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
                <Button variant="primary" className="d-flex align-items-center" onClick={openCreateRoleModal}>
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
                                handleViewPermissions: () => openViewPermissionsModal(role),
                                handleManageUsers: () => openManageUsersModal(role),
                                handleEditRole: () => openEditRoleModal(role),
                                handleDeleteRole: () => handleDeleteRole(role.id)
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Modal */}
            <CustomModal
                show={isOpenModal}
                handleClose={closeModal}
                title={getModalTitle()}
                size="lg"
            >
                {renderModalContent()}
            </CustomModal>
        </div>
    );
}

export default Role;