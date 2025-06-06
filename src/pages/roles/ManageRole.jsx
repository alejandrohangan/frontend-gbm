import React, { useState, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import RoleService from '../../services/RoleService';
import PermissionCard from '../../components/roles/PermissionCard';
import toast from 'react-hot-toast';

function ManageRole({ roleId, onClose, onRoleUpdated }) {
    const [formData, setFormData] = useState({ name: '', permissions: [] });
    const [permissions, setPermissions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allPermissions = await RoleService.getPermissions();
                setPermissions(allPermissions);

                if (roleId) {
                    setIsEditing(true);
                    const roleData = await RoleService.getById(roleId);
                    setFormData({
                        name: roleData.name,
                        permissions: roleData.permissions || []
                    });
                }
            } catch (e) {
                console.error('Error loading data:', e);
                toast.error('Error al cargar los datos');
            }
        };

        fetchData();
    }, [roleId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleTogglePermission = (permissionId) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permissionId)
                ? prev.permissions.filter(id => id !== permissionId)
                : [...prev.permissions, permissionId]
        }));
        
        if (errors.permissions) {
            setErrors(prev => ({ ...prev, permissions: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            let response;
            if (isEditing) {
                response = await RoleService.update(roleId, formData);
            } else {
                response = await RoleService.create(formData);
            }

            if (response && response.message) {
                toast.success(isEditing ? 'Rol actualizado correctamente' : 'Rol creado correctamente');
                
                if (onRoleUpdated) {
                    await onRoleUpdated();
                }
                
                onClose();
            } else if (response.errors) {
                setErrors(response.errors);
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: 'Error al guardar el rol' });
            }
            toast.error('Error al guardar el rol');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center p-4">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <Form onSubmit={handleSubmit}>
            {errors.general && (
                <div className="alert alert-danger">{errors.general}</div>
            )}

            <Form.Group controlId="roleName" className="mb-4">
                <Form.Label>Nombre del Rol</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Introduce el nombre del rol"
                    isInvalid={!!errors.name}
                />
                {errors.name && (
                    <Form.Control.Feedback type="invalid">
                        {Array.isArray(errors.name) ? errors.name[0] : errors.name}
                    </Form.Control.Feedback>
                )}
            </Form.Group>

            <Form.Group className="mb-4">
                <Form.Label>Permisos</Form.Label>
                <div className="row g-3">
                    {permissions.map((permission) => (
                        <div key={permission.id} className="col-12 col-md-6 col-lg-4">
                            <PermissionCard
                                permission={permission}
                                isSelected={formData.permissions.includes(permission.id)}
                                onToggle={handleTogglePermission}
                            />
                        </div>
                    ))}
                </div>
                {errors.permissions && (
                    <div className="text-danger mt-2 small">
                        {Array.isArray(errors.permissions) ? errors.permissions[0] : errors.permissions}
                    </div>
                )}
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="primary" type="submit">
                    {isEditing ? 'Actualizar Rol' : 'Crear Rol'}
                </Button>
            </div>
        </Form>
    );
}

export default ManageRole;