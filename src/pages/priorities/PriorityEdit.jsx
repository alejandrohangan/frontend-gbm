import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import PriorityService from '../../services/PriorityService';
import toast from 'react-hot-toast';

function PriorityEdit({ priorityId, onClose, onSave }) {
    const initialFormData = {
        name: '',
        description: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (priorityId) {
            setIsEditing(true);
            fetchPriorityData();
        } else {
            setFormData(initialFormData);
            setIsEditing(false);
        }
    }, [priorityId]);

    const fetchPriorityData = async () => {
        try {
            setIsLoading(true);
            const response = await PriorityService.getById(priorityId);

            if (response.success) {
                const priorityData = response.data;

                if (priorityData) {
                    setFormData({
                        name: priorityData.name || '',
                        description: priorityData.description || ''
                    });

                } else {
                    console.error('No se encontraron datos de la prioridad en la respuesta');
                }
            } else {
                console.error('Error en respuesta:', response.message);
            }
        } catch (error) {
            console.error('Error al cargar la prioridad:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            setErrors({});

            let response;
            if (isEditing) {
                response = await PriorityService.update(priorityId, formData);
            } else {
                response = await PriorityService.create(formData);
            }

            if (response.success) {
                (isEditing) ? toast.success('Prioridad Actualizada correctamente') : toast.success('Prioridad Guardada Correctamente');
                onSave && onSave(response.data);
                onClose && onClose();
            } else {
                if (response.errors) {
                    setErrors(response.errors);
                } else if (response.message) {
                    setErrors({ general: response.message });
                }
            }
        } catch (error) {
            console.error('Error al guardar prioridad:', error);

            if (error.response?.data) {
                const errorData = error.response.data;

                if (errorData.errors) {
                    setErrors(errorData.errors);
                } else if (typeof errorData === 'string') {
                    setErrors({ general: errorData });
                } else if (errorData.message) {
                    setErrors({ general: errorData.message });
                }
            } else {
                setErrors({ general: 'Error al guardar la categoría' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <p className="text-muted">ID de categoría: {priorityId || 'Nueva'}</p>

            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center p-4">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Form onSubmit={handleSubmit}>
                    {errors.general && (
                        <div className="alert alert-danger">{errors.general}</div>
                    )}

                    <Form.Group controlId="categoryName" className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Introduce un nombre"
                            isInvalid={!!errors.name}
                            disabled={isLoading}
                        />
                        {errors.name && (
                            <Form.Control.Feedback type="invalid">
                                {Array.isArray(errors.name) ? errors.name[0] : errors.name}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>

                    <Form.Group controlId="categoryDescription" className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Introduce una descripción"
                            isInvalid={!!errors.description}
                            disabled={isLoading}
                        />
                        {errors.description && (
                            <Form.Control.Feedback type="invalid">
                                {Array.isArray(errors.description) ? errors.description[0] : errors.description}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" disabled={isLoading}>
                            {isEditing ? 'Actualizar' : 'Guardar'}
                        </Button>
                    </div>
                </Form>
            )}
        </div>
    );
}

export default PriorityEdit;