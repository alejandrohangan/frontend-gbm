import React, { useEffect, useState } from 'react';
import TicketService from '../../services/TicketService';
import TicketCard from '../../components/tickets/TicketCard';
import TicketEdit from '../tickets/TicketEdit';

function UserTickets() {
  const [userTickets, setUserTickets] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
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

  // Función para abrir modal de edición con ticket específico
  const openEditModal = (ticketId) => {
    setSelectedTicketId(ticketId);
    setShowEditModal(true);
  };

  // Función para abrir modal de creación (sin ticketId)
  const openCreateModal = () => {
    setSelectedTicketId(null);
    setShowEditModal(true);
  };

  // Función para cerrar modal
  const closeModal = () => {
    setShowEditModal(false);
    setSelectedTicketId(null);
  };

  // Función que se ejecuta después de guardar (crear o editar)
  const handleSave = () => {
    fetchUserTickets(); // Recargar la lista de tickets
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col col-md-6 col-lg-4 ms-auto mb-4">
          <button
            className="btn btn-primary w-100"
            onClick={openCreateModal}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Nuevo Ticket
          </button>
        </div>
      </div>

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
              <TicketCard
                ticket={ticket}
                handleEdit={() => openEditModal(ticket.id)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <p className="text-muted">No tickets found</p>
        </div>
      )}

      {/* Modal para crear/editar tickets */}
      <TicketEdit
        show={showEditModal}
        onClose={closeModal}
        ticketId={selectedTicketId}
        onSave={handleSave}
      />
    </div>
  );
}

export default UserTickets;