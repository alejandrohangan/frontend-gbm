import React, { useEffect, useState } from 'react'
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { ArrowLeft, Save } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

export const TagForm = ({ initialData, onSubmit, errors = {} }) => {
    const [formData, setFormData] = useState({
        name: '',
    });

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="tagName">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Introduce un nombre"
                                    isInvalid={!!errors.name}
                                />
                                {errors.name && (
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex gap-2">
                        <Link to="/tags">
                            <Button variant="light" className="d-flex align-items-center">
                                <ArrowLeft size={18} className="me-2" />
                                Volver
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            variant="primary"
                            className="d-flex align-items-center ms-auto"
                        >
                            <Save size={18} className="me-2" />
                            {isEditing ? 'Actualizar' : 'Guardar'}
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
}

export default TagForm