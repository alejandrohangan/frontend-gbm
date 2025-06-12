import React, { useEffect, useState } from 'react';
import { Spinner, Badge, Row, Col, Card, Button } from 'react-bootstrap';
import {
    Download,
    FileText,
    User,
    Mail,
    Calendar,
    Clock,
    Tag,
    AlertTriangle,
    X,
    Paperclip
} from 'lucide-react';
import TicketService from '../../services/TicketService';

const ViewTicket = ({ ticketId, onClose }) => {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicketDetails = async () => {
            if (!ticketId) return;

            try {
                setLoading(true);
                const response = await TicketService.getById(ticketId);
                if (response.success) {
                    setTicket(response.data);
                    setError(null);
                } else {
                    setError(response.message);
                }
            } catch (error) {
                console.error('Error fetching ticket details:', error);
                setError('No se pudo cargar los detalles del ticket');
            } finally {
                setLoading(false);
            }
        };

        fetchTicketDetails();
    }, [ticketId]);

    const handleDownload = (attachment) => {
        try {
            const baseURL = import.meta.env.VITE_API_URL;
            const downloadUrl = `${baseURL}/attachments/${attachment.id}/download`;
            window.location.href = downloadUrl;
        } catch (error) {
            console.error('Error al descargar archivo:', error);
            alert('Error al descargar el archivo. Inténtalo de nuevo.');
        }
    };

    const renderStatus = (status) => {
        let variant, className;
        switch (status?.toLowerCase()) {
            case 'abierto':
                variant = 'primary';
                className = 'bg-blue-100 text-blue-600';
                break;
            case 'en progreso':
                variant = 'warning';
                className = 'bg-yellow-100 text-yellow-700';
                break;
            case 'resuelto':
                variant = 'success';
                className = 'bg-green-100 text-green-700';
                break;
            case 'cerrado':
                variant = 'secondary';
                className = 'bg-gray-100 text-gray-700';
                break;
            case 'pendiente':
                variant = 'info';
                className = 'bg-blue-100 text-blue-600';
                break;
            default:
                variant = 'light';
                className = 'bg-gray-100 text-gray-700';
        }
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${className}`}>
                {status}
            </span>
        );
    };

    const renderPriority = (priority) => {
        const name = priority?.name;
        let className;
        switch (name?.toLowerCase()) {
            case 'alta':
                className = 'bg-red-100 text-red-700';
                break;
            case 'media':
                className = 'bg-yellow-100 text-yellow-700';
                break;
            case 'baja':
                className = 'bg-green-100 text-green-700';
                break;
            default:
                className = 'bg-gray-100 text-gray-700';
        }
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${className}`}>
                Prioridad {name}
            </span>
        );
    };

    const renderTags = (tags) => {
        if (!tags || tags.length === 0) {
            return (
                <div className="text-center py-4">
                    <Tag className="text-muted mb-2" size={24} />
                    <p className="text-muted mb-0">Sin etiquetas asignadas</p>
                </div>
            );
        }

        return (
            <div className="d-flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                        {typeof tag === 'string' ? tag : tag.name}
                    </span>
                ))}
            </div>
        );
    };

    const renderAttachments = (attachments) => {
        if (!attachments || attachments.length === 0) {
            return (
                <div className="text-center py-5">
                    <FileText className="text-muted mb-3" size={32} />
                    <p className="text-muted mb-0">No hay archivos adjuntos</p>
                </div>
            );
        }

        return (
            <div className="p-0">
                {attachments.map((attachment, index) => (
                    <div key={index} className="d-flex align-items-center justify-content-between p-3 border-bottom attachment-item">
                        <div className="d-flex align-items-center">
                            <div className="bg-blue-50 rounded p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                <FileText className="text-blue-600" size={20} />
                            </div>
                            <div>
                                <div className="fw-medium text-gray-900">
                                    {attachment.filename || attachment.name || `Archivo ${index + 1}`}
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="link"
                            className="text-blue-600 text-decoration-none d-flex align-items-center p-0"
                            onClick={() => handleDownload(attachment)}
                        >
                            <Download size={16} className="me-1" />
                            Descargar
                        </Button>
                    </div>
                ))}
            </div>
        );
    };

    const formatDate = (dateString) => {
        try {
            if (!dateString) return 'Fecha no disponible';
            
            const date = new Date(dateString);
            
            if (isNaN(date.getTime())) {
                return 'Fecha inválida';
            }

            const options = {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };

            return new Intl.DateTimeFormat('es-ES', options).format(date);
        } catch (error) {
            console.error('Error al formatear fecha:', error);
            return 'Error al formatear fecha';
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" role="status" className="mb-3">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p className="text-muted">Cargando detalles del ticket...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-5">
                <AlertTriangle className="text-danger mb-3" size={32} />
                <p className="text-danger mb-0">{error}</p>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="text-center py-5">
                <p className="text-muted">No se encontró información para este ticket.</p>
            </div>
        );
    }

    return (
        <div className="bg-white" style={{ minHeight: '100vh' }}>
            {/* Header con fondo blanco y botón de cerrar */}
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom bg-white sticky-top">
                <h4 className="mb-0 fw-bold text-gray-900">Detalles del Ticket</h4>
                {onClose && (
                    <Button
                        variant="link"
                        className="text-gray-500 p-0"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </Button>
                )}
            </div>

            <div className="p-4">
                {/* Título y badges */}
                <div className="mb-4">
                    <h2 className="fw-bold text-gray-900 mb-2" style={{ fontSize: '1.5rem' }}>
                        {ticket.title}
                    </h2>
                    <p className="text-muted mb-3">Ticket #{ticket.id}</p>
                    <div className="d-flex flex-wrap gap-2">
                        {renderStatus(ticket.status)}
                        {renderPriority(ticket.priority)}
                    </div>
                </div>

                <Row className="g-4">
                    {/* Columna izquierda - Contenido principal */}
                    <Col lg={8}>
                        {/* Descripción */}
                        <div className="bg-white border rounded-3 mb-4 overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-bottom">
                                <div className="d-flex align-items-center">
                                    <FileText size={18} className="me-2 text-muted" />
                                    <span className="fw-medium text-gray-700">Descripción del Problema</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="mb-0 text-gray-700 lh-lg">{ticket.description}</p>
                            </div>
                        </div>

                        {/* Etiquetas */}
                        <div className="bg-white border rounded-3 mb-4 overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-bottom">
                                <div className="d-flex align-items-center">
                                    <Tag size={18} className="me-2 text-muted" />
                                    <span className="fw-medium text-gray-700">Etiquetas</span>
                                </div>
                            </div>
                            <div className="p-4">
                                {renderTags(ticket.tags)}
                            </div>
                        </div>

                        {/* Archivos adjuntos */}
                        <div className="bg-white border rounded-3 overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-bottom">
                                <div className="d-flex align-items-center">
                                    <Paperclip size={18} className="me-2 text-muted" />
                                    <span className="fw-medium text-gray-700">
                                        Archivos Adjuntos ({ticket.attachments?.length || 0})
                                    </span>
                                </div>
                            </div>
                            <div className="p-0">
                                {renderAttachments(ticket.attachments)}
                            </div>
                        </div>
                    </Col>

                    {/* Columna derecha - Información lateral */}
                    <Col lg={4}>
                        {/* Información del ticket */}
                        <div className="bg-white border rounded-3 mb-4 overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-bottom">
                                <span className="fw-medium text-gray-700">Información del Ticket</span>
                            </div>
                            <div className="p-4">
                                <div className="mb-4">
                                    <small className="text-muted fw-medium d-block mb-2">Categoría</small>
                                    <span className="fw-medium text-gray-900">{ticket.category?.name}</span>
                                </div>
                            </div>
                        </div>

                        {/* Personas asignadas */}
                        <div className="bg-white border rounded-3 overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-bottom">
                                <span className="fw-medium text-gray-700">Personas Asignadas</span>
                            </div>
                            <div className="p-4">
                                <div className="mb-4">
                                    <small className="text-muted fw-medium d-block mb-3">Solicitante</small>
                                    <div className="d-flex align-items-center">
                                        <div className="bg-blue-50 rounded-circle d-flex align-items-center justify-content-center me-3"
                                            style={{ width: '40px', height: '40px' }}>
                                            <User size={16} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="fw-medium text-gray-900">{ticket.requester?.name}</div>
                                            <small className="text-muted d-flex align-items-center">
                                                <Mail size={12} className="me-1" />
                                                {ticket.requester?.email}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <small className="text-muted fw-medium d-block mb-3">Agente Asignado</small>
                                    {ticket.agent ? (
                                        <div className="d-flex align-items-center">
                                            <div className="bg-green-50 rounded-circle d-flex align-items-center justify-content-center me-3"
                                                style={{ width: '40px', height: '40px' }}>
                                                <User size={16} className="text-green-600" />
                                            </div>
                                            <div>
                                                <div className="fw-medium text-gray-900">{ticket.agent.name}</div>
                                                <small className="text-muted d-flex align-items-center">
                                                    <Mail size={12} className="me-1" />
                                                    {ticket.agent.email}
                                                </small>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-muted">
                                            <small>Agente no asignado</small>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ViewTicket;