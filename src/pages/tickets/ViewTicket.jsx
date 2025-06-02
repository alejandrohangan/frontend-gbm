import React, { useEffect, useState } from 'react';
import { Spinner, Badge, Row, Col, Card, Button } from 'react-bootstrap';
import TicketService from '../../services/TicketService';

const ViewTicket = ({ ticketId }) => {
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
        let variant;
        switch (status?.toLowerCase()) {
            case 'abierto': variant = 'primary'; break;
            case 'en progreso': variant = 'info'; break;
            case 'resuelto': variant = 'success'; break;
            case 'cerrado': variant = 'secondary'; break;
            case 'pendiente': variant = 'warning'; break;
            default: variant = 'light';
        }
        return <Badge bg={variant}>{status}</Badge>;
    };

    const renderPriority = (priority) => {
        const name = priority?.name;
        let variant;
        switch (name?.toLowerCase()) {
            case 'alta': variant = 'danger'; break;
            case 'media': variant = 'warning'; break;
            case 'baja': variant = 'success'; break;
            default: variant = 'light';
        }
        return <Badge bg={variant}>{name}</Badge>;
    };

    const renderTags = (tags) => {
        if (!tags || tags.length === 0) {
            return <span className="text-muted">Sin etiquetas</span>;
        }

        return tags.map((tag, index) => (
            <Badge key={index} bg="secondary" className="me-2">
                {typeof tag === 'string' ? tag : tag.name}
            </Badge>
        ));
    };

    const renderAttachments = (attachments) => {
        if (!attachments || attachments.length === 0) {
            return (
                <div className="text-center text-muted p-3">
                    No existen archivos adjuntos para este ticket
                </div>
            );
        }

        return (
            <div>
                {attachments.map((attachment, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center p-3 border-bottom">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-file-earmark me-3"></i>
                            <span>{attachment.filename || attachment.name || `Archivo ${index + 1}`}</span>
                        </div>
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleDownload(attachment)}
                        >
                            Descargar
                        </Button>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-5 text-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="text-center p-5">
                <p>No se encontró información para este ticket.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <Row className="mb-4">
                <Col>
                    <h4>#{ticket.id} - {ticket.title}</h4>
                    <div className="d-flex gap-2 mt-2">
                        <div>{renderStatus(ticket.status)}</div>
                        <div>{renderPriority(ticket.priority)}</div>
                    </div>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={6}>
                    <Card className="h-100">
                        <Card.Header>Información del Ticket</Card.Header>
                        <Card.Body>
                            <table className="table table-borderless">
                                <tbody>
                                    <tr>
                                        <th className="w-25">Categoría:</th>
                                        <td>{ticket.category?.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Fecha de creación:</th>
                                        <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <th>Última actualización:</th>
                                        <td>{new Date(ticket.updatedAt).toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="h-100">
                        <Card.Header>Personas Asignadas</Card.Header>
                        <Card.Body>
                            <table className="table table-borderless">
                                <tbody>
                                    <tr>
                                        <th className="w-25">Solicitante:</th>
                                        <td>
                                            <div>{ticket.requester?.name}</div>
                                            <small className="text-muted">{ticket.requester?.email}</small>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Agente:</th>
                                        <td>
                                            <div>{ticket.agent?.name}</div>
                                            <small className="text-muted">{ticket.agent?.email}</small>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header>Etiquetas</Card.Header>
                        <Card.Body>
                            {renderTags(ticket.tags)}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header>
                            Archivos Adjuntos ({ticket.attachments?.length || 0})
                        </Card.Header>
                        <Card.Body className="p-0">
                            {renderAttachments(ticket.attachments)}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Header>Descripción del Problema</Card.Header>
                        <Card.Body>
                            <div className="p-2">{ticket.description}</div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ViewTicket;