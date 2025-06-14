import React, { useEffect, useState } from 'react'
import TicketService from '../../services/TicketService';
import CategoryService from '../../services/CategoryService';
import PriorityService from '../../services/PriorityService';
import TicketCard from '../../components/tickets/TicketCard';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';

function AssignTicket() {
    const [openTickets, setOpenTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(true);
    const [loadingFilters, setLoadingFilters] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('recent');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [categories, setCategories] = useState([]);
    const [priorities, setPriorities] = useState([]);

    // Cargar categorías y prioridades primero
    useEffect(() => {
        const fetchFilters = async () => {
            setLoadingFilters(true);
            try {
                const [catRes, prioRes] = await Promise.all([
                    CategoryService.getAll(),
                    PriorityService.getAll()
                ]);
                setCategories(catRes.data || catRes);
                setPriorities(prioRes.data || prioRes);
            } catch (error) {
                toast.error('Error al cargar los filtros');
            } finally {
                setLoadingFilters(false);
            }
        };
        fetchFilters();
    }, []);

    // Cargar tickets después
    useEffect(() => {
        const fetchTickets = async () => {
            setLoadingTickets(true);
            try {
                const { tickets, agents } = await TicketService.getOpenTicketsWithAgents();
                setOpenTickets(tickets);
                setFilteredTickets(tickets);
                setAgents(agents);
            } catch (error) {
                toast.error('Error al cargar los tickets');
            } finally {
                setLoadingTickets(false);
            }
        };
        fetchTickets();
    }, []);

    // Filtrado y búsqueda
    useEffect(() => {
        let filtered = [...openTickets];
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(ticket =>
                ticket.id.toString().includes(searchTerm) ||
                (ticket.title && ticket.title.toLowerCase().includes(searchLower)) ||
                (ticket.description && ticket.description.toLowerCase().includes(searchLower))
            );
        }
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(ticket =>
                ticket.priority?.id?.toString() === priorityFilter
            );
        }
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(ticket =>
                ticket.category?.id?.toString() === categoryFilter
            );
        }
        filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.created_at);
            const dateB = new Date(b.createdAt || b.created_at);
            return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
        });
        setFilteredTickets(filtered);
    }, [searchTerm, sortOrder, priorityFilter, categoryFilter, openTickets]);

    const handleAssignTicket = async (ticketId, agentId = null) => {
        try {
            const response = await TicketService.assignTicket(ticketId, agentId);
            // Refrescar tickets después de asignar
            const { tickets, agents } = await TicketService.getOpenTicketsWithAgents();
            setOpenTickets(tickets);
            setFilteredTickets(tickets);
            setAgents(agents);
            toast.success(response.message || 'Ticket asignado correctamente');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error al asignar el ticket';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="container py-5">
            <h1 className="fw-bold mb-2">Asignar Tickets</h1>
            <p className="text-muted mb-4">Gestiona y asigna tickets de soporte de manera eficiente</p>
            {loadingTickets ? (
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: 48, height: 48 }}></div>
                    <div className="text-muted fs-5">Cargando tickets...</div>
                </div>
            ) : (
                <>
                    <div className="d-flex flex-row align-items-center gap-2 mb-4" style={{ width: '100%' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <input
                                type="text"
                                className="form-control border-0 bg-light ps-5 pe-4 py-3 fs-6"
                                style={{ borderRadius: '12px', height: 40, fontWeight: 500, fontSize: '0.95rem' }}
                                placeholder="Buscar por título, descripción o ID..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <Search size={20} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                        </div>
                        <select
                            className="form-select border-0 bg-light py-2 px-3 fs-6"
                            style={{ borderRadius: '10px', minWidth: '120px', height: 40, maxWidth: 150 }}
                            value={sortOrder}
                            onChange={e => setSortOrder(e.target.value)}
                        >
                            <option value="recent">Más recientes</option>
                            <option value="oldest">Más antiguos</option>
                        </select>
                        <select
                            className="form-select border-0 bg-light py-2 px-3 fs-6"
                            style={{ borderRadius: '10px', minWidth: '120px', height: 40, maxWidth: 150 }}
                            value={priorityFilter}
                            onChange={e => setPriorityFilter(e.target.value)}
                        >
                            <option value="all">Prioridad</option>
                            {priorities.map(prio => (
                                <option key={prio.id} value={prio.id}>{prio.name}</option>
                            ))}
                        </select>
                        <select
                            className="form-select border-0 bg-light py-2 px-3 fs-6"
                            style={{ borderRadius: '10px', minWidth: '120px', height: 40, maxWidth: 150 }}
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">Categoría</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    {filteredTickets.length > 0 ? (
                        <div className="row g-3">
                            {filteredTickets.map(ticket => (
                                <div key={ticket.id} className="col-12 col-md-6 col-lg-4">
                                    <TicketCard
                                        ticket={ticket}
                                        isAssignMode={true}
                                        users={agents}
                                        onAssignTicket={handleAssignTicket}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <h4 className="text-muted">No hay tickets que coincidan con la búsqueda</h4>
                            <p className="text-muted">Intenta con otros términos de búsqueda o filtros.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AssignTicket;