import React, { useEffect, useState } from 'react'
import TicketService from '../../services/TicketService';
import TicketCard from '../../components/tickets/TicketCard';
import toast from 'react-hot-toast';

function AssignTicket() {
    const [openTickets, setOpenTickets] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOpenTicketsWithAgents = async () => {
        try {
            setLoading(true);
            const { tickets, agents } = await TicketService.getOpenTicketsWithAgents();
            setOpenTickets(tickets);
            setAgents(agents);
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar los tickets');
        } finally {
            setLoading(false);
        }
    }

    const handleAssignTicket = async (ticketId, agentId = null) => {
        try {
            const response = await TicketService.assignTicket(ticketId, agentId);
            await fetchOpenTicketsWithAgents();
            toast.success(response.message || 'Ticket asignado correctamente');
        } catch (error) {
            console.error('Error al asignar ticket:', error);

            // Mostrar el mensaje de error del servidor si existe
            const errorMessage = error.response?.data?.message || 'Error al asignar el ticket';
            toast.error(errorMessage);
        }
    }

    useEffect(() => {
        fetchOpenTicketsWithAgents();
    }, []);

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4">Asignar Tickets</h2>
                </div>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2 text-muted">Cargando tickets...</p>
                    </div>
                </div>
            ) : openTickets.length > 0 ? (
                <div className="row g-3">
                    {openTickets.map(ticket => (
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
                    <h4 className="text-muted">No hay tickets abiertos</h4>
                    <p className="text-muted">Todos los tickets están asignados o no hay tickets disponibles.</p>
                </div>
            )}
        </div>
    );
}

export default AssignTicket;