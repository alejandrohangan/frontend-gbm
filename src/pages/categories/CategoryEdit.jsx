import React, { useState, useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import CategoryService from '../../services/CategoryService';
import toast from 'react-hot-toast';

const CategoryEdit = ({ categoryId, onClose, onSave }) => {
    const initialFormData = {
        name: '',
        description: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Cargar datos cuando se edita una categoría existente
    useEffect(() => {
        console.log('CategoryEdit - useEffect - categoryId:', categoryId);

        if (categoryId) {
            setIsEditing(true);
            fetchCategoryData();
        } else {
            setFormData(initialFormData);
            setIsEditing(false);
        }
    }, [categoryId]);

    // Función para obtener los datos de la categoría
    const fetchCategoryData = async () => {
        try {
            console.log('CategoryEdit - fetchCategoryData - Iniciando fetch para ID:', categoryId);
            setIsLoading(true);

            const response = await CategoryService.getById(categoryId);
            console.log('CategoryEdit - fetchCategoryData - Respuesta completa:', response);

            if (response.success) {
                // AQUÍ ESTÁ LA CORRECCIÓN: La API devuelve los datos dentro de response.data.data
                // En lugar de response.data directamente
                const categoryData = response.data; // Accedemos a los datos reales de la categoría
                console.log('CategoryEdit - fetchCategoryData - Datos de categoría extraídos:', categoryData);

                if (categoryData) {
                    // Actualizamos el formulario con los datos obtenidos
                    setFormData({
                        name: categoryData.name || '',
                        description: categoryData.description || ''
                    });

                    console.log('CategoryEdit - fetchCategoryData - FormData actualizado:', {
                        name: categoryData.name || '',
                        description: categoryData.description || ''
                    });
                } else {
                    console.error('No se encontraron datos de categoría en la respuesta');
                }
            } else {
                console.error('Error en respuesta:', response.message);
            }
        } catch (error) {
            console.error('Error al cargar la categoría:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Limpiar error para este campo
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            setErrors({});

            let response;
            if (isEditing) {
                response = await CategoryService.update(categoryId, formData);
            } else {
                response = await CategoryService.create(formData);
            }

            if (response.success) {
                (isEditing) ? toast.success('Categoria Actualizada correctamente') : toast.success('Categoria Guardada Correctamente');
                onSave && onSave(response.data);
                onClose && onClose();
            } else {
                // Manejar errores de validación
                if (response.errors) {
                    setErrors(response.errors);
                } else if (response.message) {
                    setErrors({ general: response.message });
                }
            }
        } catch (error) {
            console.error('Error al guardar categoría:', error);

            // Procesar errores de validación
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
            <p className="text-muted">ID de categoría: {categoryId || 'Nueva'}</p>

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
};

export default CategoryEdit;