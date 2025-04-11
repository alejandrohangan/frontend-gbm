import React, { useEffect, useState } from 'react';
import TicketService from '../../services/TicketService';
import DataTable from 'react-data-table-component';
import ActionsTemplate from '../../components/ActionsTemplate';
import CustomModal from '../../components/CustomModal';
import ViewTicket from './ViewTicket';
import { Form, InputGroup } from 'react-bootstrap';
import { Kanban, ListUl, Search } from 'react-bootstrap-icons';
import TruncatedTooltipText from '../../components/TruncatedTooltipText';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import KanbanBoard from '../../components/KanbanBoard';

const Ticket = () => {
    const [tickets, setTickets] = useState([]);
    const [showViewMode, setShowViewMode] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [layoutMode, setLayoutMode] = useState('list');

    const columns = [
        { name: 'ID', selector: row => row.id, sortable: true },
        { name: 'Title', selector: row => <TruncatedTooltipText text={row.title} />, sortable: true },
        { name: 'Estado', selector: row => row.status, sortable: true },
        { name: 'Prioridad', selector: row => row.priority?.name, sortable: true },
        { name: 'Solicitante', selector: row => <TruncatedTooltipText text={row.requester?.name} />, sortable: true },
        { name: 'Agente', selector: row => <TruncatedTooltipText text={row.agent?.name} />, sortable: true },
        { name: 'Categoria', selector: row => row.category?.name, sortable: true },
        {
            name: 'Acciones',
            cell: (row) => (
                <ActionsTemplate
                    ticket={row}
                    onSet={() => setSelectedTicketId(row.id)}
                    onView={() => {
                        setSelectedTicketId(row.id);
                        setShowViewMode(true);
                    }}
                    hasView={true}
                    hasClose={true}
                    onClose={() => handleClose(row.id)}
                />
            )
        },
    ];

    const paginationOptions = {
        rowsPerPageText: 'Filas por página:',
        rangeSeparatorText: 'de',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'Todos',
    };

    // Función para cargar los tickets
    const fetchTickets = async () => {
        try {
            setLoading(true);
            const data = await TicketService.getAll();
            setTickets(data);
            setFilteredTickets(data);
        } catch (error) {
            console.error('Error Fetching Tickets', error);
            toast.error('Error al cargar los tickets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        const result = tickets.filter(ticket => {
            const searchFields = [
                ticket.id?.toString() || '',
                ticket.title || '',
                ticket.status || '',
                ticket.priority?.name || '',
                ticket.requester?.name || '',
                ticket.agent?.name || '',
                ticket.category?.name || ''
            ];

            return searchFields.some(field =>
                field.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });

        setFilteredTickets(result);
    }, [searchTerm, tickets]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClose = async (id) => {
        try {
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: "Esta acción no se puede revertir",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, cerrar",
                cancelButtonText: "Cancelar",
            });

            if (result.isConfirmed) {
                const response = await TicketService.close(id);
                if (response.success) {
                    toast.success('Ticket cerrado correctamente');
                    // Actualizar la lista de tickets después de cerrar uno
                    fetchTickets();
                } else {
                    toast.error('No se pudo cerrar el Ticket');
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al procesar la solicitud');
        }
    };

    const handleViewTicket = (id) => {
        setSelectedTicketId(id);
        setShowViewMode(true);
    };

    // Manejador para actualizar el estado de un ticket (usado por el Kanban)
    const handleTicketStatusChange = (ticketId, newStatus) => {
        setTickets(prevTickets =>
            prevTickets.map(ticket =>
                ticket.id === ticketId
                    ? { ...ticket, status: newStatus }
                    : ticket
            )
        );
    };

    return (
        <div className={`container-fluid ${layoutMode === 'kanban' ? 'px-4' : 'container'} mt-4`}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Lista de Tickets</h2>
                <div className="btn-group">
                    <button
                        className={`btn ${layoutMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setLayoutMode('list')}
                    >
                        <ListUl className="me-1" /> Lista
                    </button>
                    <button
                        className={`btn ${layoutMode === 'kanban' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setLayoutMode('kanban')}
                    >
                        <Kanban className="me-1" /> Kanban
                    </button>
                </div>
            </div>

            {layoutMode === 'list' ? (
                <div className="card p-4 shadow-sm border-0">
                    <div className="mb-3">
                        <InputGroup>
                            <InputGroup.Text>
                                <Search />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Buscar tickets..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </InputGroup>
                    </div>

                    <DataTable
                        columns={columns}
                        data={filteredTickets}
                        pagination
                        paginationComponentOptions={paginationOptions}
                        progressPending={loading}
                        striped
                        highlightOnHover
                        responsive
                        pointerOnHover
                        persistTableHead
                        noDataComponent="No hay tickets disponibles"
                    />
                </div>
            ) : (
                <>
                    <div className="mb-3">
                        <InputGroup>
                            <InputGroup.Text>
                                <Search />
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Buscar tickets..."
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </InputGroup>
                    </div>

                    {loading ? (
                        <div className="text-center p-4">Cargando tickets...</div>
                    ) : (
                        <KanbanBoard
                            initialTickets={tickets}
                            onTicketStatusChange={handleTicketStatusChange}
                        />
                    )}
                </>
            )}

            <CustomModal
                show={showViewMode}
                handleClose={() => setShowViewMode(false)}
                title={`Detalles del Ticket #${selectedTicketId}`}
                size="xl"
            >
                <ViewTicket ticketId={selectedTicketId} />
            </CustomModal>
        </div>
    );
};

export default Ticket;