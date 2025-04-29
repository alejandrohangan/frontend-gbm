import React, { useEffect, useState } from 'react';
import TicketService from '../../services/TicketService';
import TicketCard from '../../components/tickets/TicketCard';

function UserTickets() {
  const [userTickets, setUserTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      const data = await TicketService.getUserTickets();
      setUserTickets(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTickets();
  }, []);

  return (
    <div className="container py-4">
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : userTickets.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {userTickets.map(ticket => (
            <div className="col" key={ticket.id}>
              <TicketCard ticket={ticket} />
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

export default UserTickets;