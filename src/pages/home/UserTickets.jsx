import React, { useEffect, useState } from 'react';
import TicketService from '../../services/TicketService';
import TicketCard from '../../components/tickets/TicketCard';
import TicketEdit from '../tickets/TicketEdit';

function UserTickets() {
  const [userTickets, setUserTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  // Estados disponibles para filtrar (según la DB)
  const availableStatuses = [
    { key: 'open', label: 'Abierto', color: 'text-success' },
    { key: 'in_progress', label: 'En Progreso', color: 'text-warning' },
    { key: 'on_hold', label: 'En Espera', color: 'text-info' },
    { key: 'closed', label: 'Cerrado', color: 'text-secondary' },
    { key: 'cancelled', label: 'Cancelado', color: 'text-danger' }
  ];

  // Estados seleccionados para filtrar (por defecto abierto y en progreso)
  const [selectedStatuses, setSelectedStatuses] = useState(['open', 'in_progress']);

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

  // Filtrar tickets cuando cambie la lista de tickets o los estados seleccionados
  useEffect(() => {
    if (selectedStatuses.length === 0) {
      setFilteredTickets([]);
    } else {
      const filtered = userTickets.filter(ticket => 
        selectedStatuses.includes(ticket.status)
      );
      setFilteredTickets(filtered);
    }
  }, [userTickets, selectedStatuses]);

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

  // Función para manejar cambios en los checkboxes de estado
  const handleStatusChange = (statusKey) => {
    setSelectedStatuses(prev => {
      if (prev.includes(statusKey)) {
        return prev.filter(status => status !== statusKey);
      } else {
        return [...prev, statusKey];
      }
    });
  };

  // Función para seleccionar/deseleccionar todos
  const handleSelectAll = () => {
    if (selectedStatuses.length === availableStatuses.length) {
      setSelectedStatuses([]);
    } else {
      setSelectedStatuses(availableStatuses.map(status => status.key));
    }
  };

  // Contar tickets por estado seleccionado
  const getStatusCount = (statusKey) => {
    return userTickets.filter(ticket => ticket.status === statusKey).length;
  };

  return (
    <div className="container py-4">
      <div className="row mb-4 align-items-center">
        {/* Filtro por estado */}
        <div className="col-auto">
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <i className="bi bi-funnel me-2"></i>
              Filtrar por Estado ({selectedStatuses.length})
            </button>
            
            {showFilterDropdown && (
              <div className="dropdown-menu show p-3" style={{ minWidth: '280px' }}>
                <h6 className="dropdown-header">Seleccionar Estados</h6>
                
                {/* Opción para seleccionar/deseleccionar todos */}
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="select-all"
                    checked={selectedStatuses.length === availableStatuses.length}
                    onChange={handleSelectAll}
                  />
                  <label className="form-check-label fw-bold" htmlFor="select-all">
                    Seleccionar todos
                  </label>
                </div>
                
                <hr className="dropdown-divider" />
                
                {/* Checkboxes individuales */}
                {availableStatuses.map(status => (
                  <div key={status.key} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`status-${status.key}`}
                      checked={selectedStatuses.includes(status.key)}
                      onChange={() => handleStatusChange(status.key)}
                    />
                    <label className="form-check-label d-flex justify-content-between align-items-center" htmlFor={`status-${status.key}`}>
                      <span className={status.color}>
                        <i className="bi bi-circle-fill me-2" style={{ fontSize: '0.6rem' }}></i>
                        {status.label}
                      </span>
                      <span className="badge bg-light text-dark">
                        {getStatusCount(status.key)}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Botón de crear ticket */}
        <div className="col-auto ms-auto">
          <button
            className="btn btn-primary"
            onClick={openCreateModal}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Nuevo Ticket
          </button>
        </div>
      </div>

      {/* Mostrar estados activos */}
      {selectedStatuses.length > 0 && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="d-flex align-items-center flex-wrap gap-2">
              <small className="text-muted">Mostrando:</small>
              {selectedStatuses.map(statusKey => {
                const status = availableStatuses.find(s => s.key === statusKey);
                return (
                  <span key={statusKey} className={`badge bg-light text-dark ${status.color}`}>
                    <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
                    {status.label}
                    <button 
                      className="btn-close btn-close-sm ms-2" 
                      style={{ fontSize: '0.6rem' }}
                      onClick={() => handleStatusChange(statusKey)}
                    ></button>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredTickets.map(ticket => (
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
          <p className="text-muted">
            {selectedStatuses.length === 0 
              ? 'Selecciona al menos un estado para ver los tickets' 
              : 'No hay tickets con los estados seleccionados'
            }
          </p>
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