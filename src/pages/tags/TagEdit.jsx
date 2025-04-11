import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import TagService from '../../services/TagService';
import toast from 'react-hot-toast';

function TagEdit({ tagId, onClose, onSave }) {
    const initialFormData = {
        name: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (tagId) {
            setIsEditing(true);
            fetchTagData();
        } else {
            setFormData(initialFormData);
            setIsEditing(false);
        }
    }, [tagId]);

    const fetchTagData = async () => {
        try {
            setIsLoading(true);
            const response = await TagService.getById(tagId);

            if (response.success) {
                const tagData = response.data;

                if (tagData) {
                    setFormData({
                        name: tagData.name || ''
                    });
                } else {
                    console.log(tagData)
                    console.error('No se encontraron datos del tag.');
                }
            } else {
                console.error('Error en respuesta:', response.message);
            }
        } catch (error) {
            console.error('Error al cargar el tag:', error);
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
                response = await TagService.update(tagId, formData);
            } else {
                response = await TagService.create(formData);
            }

            if (response.success) {
                (isEditing) ? toast.success('Tag Actualizada correctamente') : toast.success('Tag Guardada Correctamente');
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
            console.error('Error al guardar tag:', error);

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
                setErrors({ general: 'Error al guardar el tag' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <p className="text-muted">ID del tag: {tagId || 'Nuevo'}</p>

            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center p-4">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Form onSubmit={handleSubmit}>
                    {errors.general && (
                        <div className="alert alert-danger">{errors.general}</div>
                    )}

                    <Form.Group controlId="tagName" className="mb-3">
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

export default TagEdit;
