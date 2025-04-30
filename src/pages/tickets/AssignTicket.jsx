import React, { useEffect, useState } from 'react'
import TicketService from '../../services/TicketService';
import TicketCard from '../../components/tickets/TicketCard';

function AssignTicket() {
    const [openTickets, setOpenTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOpenTickets = async () => {
        try {
            setLoading(true);
            const data = await TicketService.getOpenTickets();
            setOpenTickets(data);
        } catch (error) {   
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOpenTickets();
    }, []);

    return (
        <div className="container py-4">
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : openTickets.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {openTickets.map(ticket => (
                        <div className="col" key={ticket.id}>
                            <TicketCard ticket={ticket} isAssignMode={true}/>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <p className="text-muted">No tickets found</p>
                </div>
            )}
        </div>
    );
}

export default AssignTicket;