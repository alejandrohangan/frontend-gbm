import React, { useEffect, useState } from 'react';
import { AlertCircle, Upload, X } from 'lucide-react';
import TicketService from '../../services/TicketService';


function TicketEdit({ show = false, onClose, ticketId = null, onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        priority: null,
        category: null,
        description: '',
        tags: []
    });
    const [errors, setErrors] = useState({});
    const [attachment, setAttachment] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [categories, setCategories] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
    const [referenceDataLoaded, setReferenceDataLoaded] = useState(false);

    const loadReferenceData = async () => {
        try {
            const response = await TicketService.getReferenceData();

            setCategories(response.categories || []);
            setPriorities(response.priorities || []);
            setAvailableTags(response.tags || []);
            setReferenceDataLoaded(true);
        } catch (error) {
            console.error('Error loading reference data:', error);
            setReferenceDataLoaded(true); // Marcar como cargado aunque falle
        }
    };

    // useEffect principal - maneja la apertura del modal
    useEffect(() => {
        if (show) {
            // Siempre cargar datos de referencia cuando se abre el modal
            loadReferenceData();

            if (ticketId) {
                setIsEditing(true);
                loadTicketData();
            } else {
                setIsEditing(false);
                resetForm();
            }
        } else {
            // Reset cuando se cierra el modal
            setReferenceDataLoaded(false);
        }
    }, [ticketId, show]);

    const loadTicketData = async () => {
        if (!ticketId) return;

        try {
            setLoading(true);
            // Llamada real al servicio
            const response = await TicketService.getById(ticketId);

            if (response.success && response.data) {
                const ticket = response.data;

                setFormData({
                    title: ticket.title || '',
                    priority: ticket.priority || null,
                    category: ticket.category || null,
                    description: ticket.description || '',
                    tags: ticket.tags || []
                });
            } else {
                console.error('Error: Response not successful:', response.message);
                setErrors({ general: response.message || 'Error al cargar el ticket' });
            }
        } catch (error) {
            console.error('Error loading ticket:', error);
            setErrors({ general: 'Error al cargar el ticket' });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            priority: null,
            category: null,
            description: '',
            tags: []
        });
        setErrors({});
        setAttachment(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        const selectedCategory = categories.find(cat => cat.id === parseInt(categoryId));
        setFormData(prev => ({
            ...prev,
            category: selectedCategory || null
        }));

        if (errors.category) {
            setErrors(prev => ({
                ...prev,
                category: ''
            }));
        }
    };

    const handlePriorityChange = (e) => {
        const priorityId = e.target.value;
        const selectedPriority = priorities.find(priority => priority.id === parseInt(priorityId));
        setFormData(prev => ({
            ...prev,
            priority: selectedPriority || null
        }));

        if (errors.priority) {
            setErrors(prev => ({
                ...prev,
                priority: ''
            }));
        }
    };

    const handleTagToggle = (tag) => {
        setFormData(prev => {
            const isSelected = prev.tags.some(t => t.id === tag.id);
            if (isSelected) {
                return {
                    ...prev,
                    tags: prev.tags.filter(t => t.id !== tag.id)
                };
            } else {
                return {
                    ...prev,
                    tags: [...prev.tags, tag]
                };
            }
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'El título es obligatorio';
        }

        if (!formData.category) {
            newErrors.category = 'La categoría es obligatoria';
        }

        if (!formData.priority) {
            newErrors.priority = 'La prioridad es obligatoria';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La descripción es obligatoria';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);

            const ticketData = {
                ...formData,
                attachment: attachment
            };

            if (isEditing) {
                const response = await TicketService.update(ticketId, ticketData);
                if (!response.success) {
                    setErrors({ general: response.message || 'Error al actualizar el ticket' });
                    return;
                }
                console.log('Ticket updated successfully:', response.data);
            } else {
                const response = await TicketService.create(ticketData);
                if (!response.success) {
                    setErrors({ general: response.message || 'Error al crear el ticket' });
                    return;
                }
                console.log('Ticket created successfully:', response.data);
            }

            // Llamar callback para notificar al componente padre
            if (onSave) {
                onSave();
            }

            onClose();
        } catch (error) {
            console.error('Error saving ticket:', error);
            setErrors({ general: 'Error al guardar el ticket' });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
            setAttachment(file);
        } else {
            alert('El archivo debe ser menor a 5MB');
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.size <= 5 * 1024 * 1024) {
            setAttachment(file);
        } else {
            alert('El archivo debe ser menor a 5MB');
        }
    };

    const removeAttachment = () => {
        setAttachment(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!show) return null;

    // Mostrar loading mientras cargan los datos de referencia
    const isLoadingData = loading || !referenceDataLoaded;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {isEditing ? 'Editar Ticket' : 'Crear Nuevo Ticket'}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                            aria-label="Cerrar"
                            disabled={isLoadingData}
                        ></button>
                    </div>

                    <div className="modal-body">
                        {isLoadingData ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {/* Error general */}
                                {errors.general && (
                                    <div className="alert alert-danger d-flex align-items-center mb-3">
                                        <AlertCircle size={16} className="me-2" />
                                        {errors.general}
                                    </div>
                                )}

                                {/* Title */}
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">
                                        Título <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                        placeholder="Título del ticket"
                                        disabled={loading}
                                    />
                                    {errors.title && (
                                        <div className="invalid-feedback d-flex align-items-center">
                                            <AlertCircle size={14} className="me-1" />
                                            {errors.title}
                                        </div>
                                    )}
                                </div>

                                {/* Priority */}
                                <div className="mb-3">
                                    <label htmlFor="priority" className="form-label">
                                        Prioridad <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={formData.priority?.id || ''}
                                        onChange={handlePriorityChange}
                                        className={`form-select ${errors.priority ? 'is-invalid' : ''}`}
                                        disabled={loading}
                                    >
                                        <option value="">Elige una prioridad</option>
                                        {priorities.map((priority) => (
                                            <option key={priority.id} value={priority.id}>
                                                {priority.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.priority && (
                                        <div className="invalid-feedback d-flex align-items-center">
                                            <AlertCircle size={14} className="me-1" />
                                            {errors.priority}
                                        </div>
                                    )}
                                </div>

                                {/* Category */}
                                <div className="mb-3">
                                    <label htmlFor="category" className="form-label">
                                        Categoría <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category?.id || ''}
                                        onChange={handleCategoryChange}
                                        className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                                        disabled={loading}
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <div className="invalid-feedback d-flex align-items-center">
                                            <AlertCircle size={14} className="me-1" />
                                            {errors.category}
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">
                                        Descripción del Problema <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={5}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        placeholder="Describa el problema en detalle"
                                        disabled={loading}
                                    ></textarea>
                                    {errors.description && (
                                        <div className="invalid-feedback d-flex align-items-center">
                                            <AlertCircle size={14} className="me-1" />
                                            {errors.description}
                                        </div>
                                    )}
                                </div>

                                {/* Tags */}
                                <div className="mb-3">
                                    <label className="form-label">
                                        Etiquetas
                                    </label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {availableTags.map((tag) => {
                                            const isSelected = formData.tags.some((t) => t.id === tag.id);
                                            return (
                                                <button
                                                    key={tag.id}
                                                    type="button"
                                                    onClick={() => handleTagToggle(tag)}
                                                    className={`btn btn-sm ${isSelected
                                                        ? 'btn-primary'
                                                        : 'btn-outline-secondary'
                                                        }`}
                                                    disabled={loading}
                                                >
                                                    {tag.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* File Upload */}
                                <div className="mb-3">
                                    <label className="form-label">
                                        Adjunto
                                    </label>
                                    {!attachment ? (
                                        <div
                                            className={`border border-2 border-dashed rounded p-4 text-center ${isDragging ? 'border-primary bg-light' : 'border-secondary'
                                                }`}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                            onDrop={handleFileDrop}
                                            style={{ borderStyle: 'dashed' }}
                                        >
                                            <div className="d-flex flex-column align-items-center">
                                                <Upload className="text-muted mb-2" size={24} />
                                                <p className="text-muted mb-1">
                                                    Arrastre un archivo aquí o{' '}
                                                    <label className="text-primary" style={{ cursor: 'pointer' }}>
                                                        seleccione un archivo
                                                        <input
                                                            type="file"
                                                            onChange={handleFileChange}
                                                            className="d-none"
                                                            disabled={loading}
                                                        />
                                                    </label>
                                                </p>
                                                <small className="text-muted">
                                                    Máximo 5 MB
                                                </small>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-light p-3 rounded">
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-secondary rounded d-flex align-items-center justify-content-center me-3"
                                                        style={{ width: '40px', height: '40px' }}>
                                                        <small className="text-white fw-bold">
                                                            {attachment.name.split('.').pop()?.toUpperCase()}
                                                        </small>
                                                    </div>
                                                    <div>
                                                        <div className="fw-medium">{attachment.name}</div>
                                                        <small className="text-muted">
                                                            {(attachment.size / 1024).toFixed(1)} KB
                                                        </small>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={removeAttachment}
                                                    className="btn btn-sm btn-outline-secondary"
                                                    aria-label="Eliminar archivo"
                                                    disabled={loading}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>
                        )}
                    </div>

                    <div className="modal-footer bg-light">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn btn-secondary"
                            disabled={isLoadingData}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="btn btn-primary"
                            disabled={isLoadingData}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    {isEditing ? 'Guardando...' : 'Creando...'}
                                </>
                            ) : (
                                <>
                                    {isEditing ? 'Guardar Cambios' : 'Crear Ticket'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketEdit;