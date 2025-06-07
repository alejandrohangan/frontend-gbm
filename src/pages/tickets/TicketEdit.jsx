import React, { useEffect, useState } from 'react';
import { AlertCircle, Upload, X, FileText } from 'lucide-react';
import TicketService from '../../services/TicketService';
import toast from 'react-hot-toast';

function TicketEdit({ show = false, onClose, ticketId = null, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        priority_id: '',
        category_id: '',
        description: '',
        tags: [],
        attachments: []
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isDragging, setIsDragging] = useState(false);
    const [categories, setCategories] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);

    const MAX_FILES = 5;
    const MAX_FILE_SIZE = 10 * 1024 * 1024;

    useEffect(() => {
        if (show) {
            fetchData();
        }
    }, [ticketId, show]);

    const fetchData = async () => {
        try {
            // Solo mostrar loading si estamos editando (necesitamos cargar datos del ticket)
            if (ticketId) {
                setIsLoading(true);
            }

            const response = await TicketService.getReferenceData();

            setCategories(response.categories || []);
            setPriorities(response.priorities || []);
            setAvailableTags(response.tags || []);

            if (ticketId) {
                setIsEditing(true);
                const ticketResponse = await TicketService.getById(ticketId);
                if (ticketResponse.success && ticketResponse.data) {
                    const ticket = ticketResponse.data;
                    setFormData({
                        title: ticket.title || '',
                        priority_id: ticket.priority?.id || '',
                        category_id: ticket.category?.id || '',
                        description: ticket.description || '',
                        tags: ticket.tags?.map(tag => tag.id) || [],
                        attachments: [] // No mostramos archivos existentes en edición
                    });
                }
            } else {
                setIsEditing(false);
                resetForm();
            }
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Error al cargar los datos');
        } finally {
            // Solo ocultar loading si estábamos en modo edición
            if (ticketId) {
                setIsLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            priority_id: '',
            category_id: '',
            description: '',
            tags: [],
            attachments: []
        });
        setErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleToggleTag = (tagId) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tagId)
                ? prev.tags.filter(id => id !== tagId)
                : [...prev.tags, tagId]
        }));

        if (errors.tags) {
            setErrors(prev => ({ ...prev, tags: null }));
        }
    };

    const validateAndAddFiles = (files) => {
        const validFiles = [];
        const errors = [];

        for (let file of files) {
            if (formData.attachments.length + validFiles.length >= MAX_FILES) {
                errors.push(`Solo puedes adjuntar hasta ${MAX_FILES} archivos`);
                break;
            }

            if (file.size > MAX_FILE_SIZE) {
                errors.push(`${file.name} es muy grande (máximo 10MB)`);
                continue;
            }

            const isDuplicate = formData.attachments.some(existing =>
                existing.name === file.name && existing.size === file.size
            );

            if (!isDuplicate) {
                validFiles.push(file);
            } else {
                errors.push(`${file.name} ya está adjunto`);
            }
        }

        if (errors.length > 0) {
            toast.error(errors.join('\n'));
        }

        if (validFiles.length > 0) {
            setFormData(prev => ({
                ...prev,
                attachments: [...prev.attachments, ...validFiles]
            }));
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        validateAndAddFiles(files);
        e.target.value = '';
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
        const files = Array.from(e.dataTransfer.files);
        validateAndAddFiles(files);
    };

    const removeAttachment = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            let response;
            if (isEditing) {
                // Para update, enviamos solo los campos básicos sin archivos
                const updateData = {
                    title: formData.title.trim(),
                    priority_id: parseInt(formData.priority_id),
                    category_id: parseInt(formData.category_id),
                    description: formData.description.trim(),
                    tags: formData.tags
                };

                console.log('Sending update data:', updateData); // Debug
                response = await TicketService.update(ticketId, updateData);
            } else {
                // Para create, enviamos todo incluyendo archivos
                response = await TicketService.create(formData);
            }

            console.log('Response:', response); // Debug

            if (response && (response.success || response.data)) {
                toast.success(isEditing ? 'Ticket actualizado correctamente' : 'Ticket creado correctamente');
                if (onSave) onSave();
                onClose();
            } else if (response.errors) {
                console.log('Validation errors:', response.errors);
                setErrors(response.errors);
            }
        } catch (error) {
            console.log('Error details:', error); // Debug

            if (error.response?.data?.errors) {
                console.log('Backend validation errors:', error.response.data.errors);
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            } else {
                setErrors({ general: 'Error al guardar el ticket' });
            }
            toast.error('Error al guardar el ticket');
        } finally {
            setIsLoading(false);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!show) return null;

    const canAddMoreFiles = formData.attachments.length < MAX_FILES;

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
                            disabled={isLoading}
                        />
                    </div>

                    <div className="modal-body">
                        {isLoading && isEditing ? (
                            <div className="d-flex justify-content-center align-items-center p-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                {errors.general && (
                                    <div className="alert alert-danger d-flex align-items-center mb-3">
                                        <AlertCircle size={16} className="me-2" />
                                        {errors.general}
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Título *</label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                        placeholder="Título del ticket"
                                        disabled={isLoading}
                                    />
                                    {errors.title && (
                                        <div className="invalid-feedback">
                                            {Array.isArray(errors.title) ? errors.title[0] : errors.title}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="priority_id" className="form-label">Prioridad *</label>
                                    <select
                                        id="priority_id"
                                        name="priority_id"
                                        value={formData.priority_id}
                                        onChange={handleInputChange}
                                        className={`form-select ${errors.priority_id ? 'is-invalid' : ''}`}
                                        disabled={isLoading}
                                    >
                                        <option value="">Elige una prioridad</option>
                                        {priorities.map((priority) => (
                                            <option key={priority.id} value={priority.id}>
                                                {priority.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.priority_id && (
                                        <div className="invalid-feedback">
                                            {Array.isArray(errors.priority_id) ? errors.priority_id[0] : errors.priority_id}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="category_id" className="form-label">Categoría *</label>
                                    <select
                                        id="category_id"
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleInputChange}
                                        className={`form-select ${errors.category_id ? 'is-invalid' : ''}`}
                                        disabled={isLoading}
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <div className="invalid-feedback">
                                            {Array.isArray(errors.category_id) ? errors.category_id[0] : errors.category_id}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Descripción *</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={5}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        placeholder="Describa el problema en detalle"
                                        disabled={isLoading}
                                    />
                                    {errors.description && (
                                        <div className="invalid-feedback">
                                            {Array.isArray(errors.description) ? errors.description[0] : errors.description}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Etiquetas</label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {availableTags.map((tag) => {
                                            const isSelected = formData.tags.includes(tag.id);
                                            return (
                                                <button
                                                    key={tag.id}
                                                    type="button"
                                                    onClick={() => handleToggleTag(tag.id)}
                                                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                    disabled={isLoading}
                                                >
                                                    {tag.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.tags && (
                                        <div className="text-danger mt-2 small">
                                            {Array.isArray(errors.tags) ? errors.tags[0] : errors.tags}
                                        </div>
                                    )}
                                </div>

                                {/* Solo mostrar la sección de archivos si NO estamos editando */}
                                {!isEditing && (
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Archivos Adjuntos ({formData.attachments.length}/{MAX_FILES})
                                        </label>

                                        {formData.attachments.length > 0 && (
                                            <div className="mb-3">
                                                {formData.attachments.map((file, index) => (
                                                    <div key={index} className="bg-light p-3 rounded mb-2">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="d-flex align-items-center">
                                                                <div className="bg-secondary rounded d-flex align-items-center justify-content-center me-3"
                                                                    style={{ width: '40px', height: '40px' }}>
                                                                    <FileText size={20} className="text-white" />
                                                                </div>
                                                                <div>
                                                                    <div className="fw-medium">{file.name}</div>
                                                                    <small className="text-muted">
                                                                        {formatFileSize(file.size)}
                                                                    </small>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeAttachment(index)}
                                                                className="btn btn-sm btn-outline-danger"
                                                                disabled={isLoading}
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {canAddMoreFiles && (
                                            <div
                                                className={`border border-2 border-dashed rounded p-4 text-center ${isDragging ? 'border-primary bg-light' : 'border-secondary'}`}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleFileDrop}
                                            >
                                                <div className="d-flex flex-column align-items-center">
                                                    <Upload className="text-muted mb-2" size={24} />
                                                    <p className="text-muted mb-1">
                                                        Arrastre archivos aquí o{' '}
                                                        <label className="text-primary" style={{ cursor: 'pointer' }}>
                                                            seleccione archivos
                                                            <input
                                                                type="file"
                                                                onChange={handleFileChange}
                                                                className="d-none"
                                                                disabled={isLoading}
                                                                multiple
                                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip,.txt"
                                                            />
                                                        </label>
                                                    </p>
                                                    <small className="text-muted">
                                                        Máximo {MAX_FILES - formData.attachments.length} archivo(s) más • 10MB por archivo
                                                    </small>
                                                </div>
                                            </div>
                                        )}

                                        {!canAddMoreFiles && (
                                            <div className="alert alert-info">
                                                <small>Has alcanzado el límite máximo de {MAX_FILES} archivos</small>
                                            </div>
                                        )}

                                        {errors.attachments && (
                                            <div className="text-danger mt-2 small">
                                                {Array.isArray(errors.attachments) ? errors.attachments[0] : errors.attachments}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Mensaje informativo cuando estamos editando */}
                                {isEditing && (
                                    <div className="alert alert-info">
                                        <small>
                                            <strong>Nota:</strong> Los archivos adjuntos no se pueden modificar durante la edición del ticket.
                                        </small>
                                    </div>
                                )}
                            </form>
                        )}
                    </div>

                    <div className="modal-footer bg-light">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn btn-secondary"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    {isEditing ? 'Guardando...' : 'Creando...'}
                                </>
                            ) : (
                                <>
                                    {isEditing ? 'Actualizar Ticket' : 'Crear Ticket'}
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