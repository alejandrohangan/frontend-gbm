import React, { useEffect, useState, useRef } from 'react';
import TicketService from '../../services/TicketService';
import TicketCard from '../../components/tickets/TicketCard';
import TicketEdit from '../tickets/TicketEdit';
import CategoryService from '../../services/CategoryService';
import PriorityService from '../../services/PriorityService';
import { Search } from 'lucide-react';

function UserTickets() {
  const [userTickets, setUserTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const filterDropdownRef = useRef(null);
  const filterButtonRef = useRef(null);
  
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

  // Cargar categorías y prioridades
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [catRes, prioRes] = await Promise.all([
          CategoryService.getAll(),
          PriorityService.getAll()
        ]);
        setCategories(catRes.data || catRes);
        setPriorities(prioRes.data || prioRes);
      } catch (error) {
        // No mostrar toast aquí para no molestar al usuario si no hay filtros
      }
    };
    fetchFilters();
  }, []);

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

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    if (!showFilterDropdown) return;
    const handleClickOutside = (event) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target)
      ) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilterDropdown]);

  // Filtrar tickets cuando cambie la lista de tickets, los estados seleccionados, el término de búsqueda, prioridad o categoría
  useEffect(() => {
    let filtered = userTickets;
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(ticket => selectedStatuses.includes(ticket.status));
    } else {
      filtered = [];
    }
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority?.id?.toString() === priorityFilter);
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.category?.id?.toString() === categoryFilter);
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.id.toString().includes(searchTerm) ||
        (ticket.title && ticket.title.toLowerCase().includes(searchLower)) ||
        (ticket.description && ticket.description.toLowerCase().includes(searchLower))
      );
    }
    setFilteredTickets(filtered);
  }, [userTickets, selectedStatuses, searchTerm, priorityFilter, categoryFilter]);

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
      <h2 className="mb-4">Mis Tickets</h2>
      {loading ? (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: 48, height: 48 }}></div>
          <div className="text-muted fs-5">Cargando tickets...</div>
        </div>
      ) : (
        <>
          {/* Filtros y búsqueda en una sola línea */}
          <div className="d-flex flex-row align-items-center gap-2 mb-4" style={{ width: '100%' }}>
            {/* Dropdown filtro por estado */}
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                ref={filterButtonRef}
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              >
                <i className="bi bi-funnel me-2"></i>
                Filtrar por Estado ({selectedStatuses.length})
              </button>
              {showFilterDropdown && (
                <div
                  ref={filterDropdownRef}
                  className="dropdown-menu show p-3"
                  style={{ minWidth: '280px', marginTop: 10, zIndex: 1000 }}
                >
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
            {/* Barra de búsqueda */}
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
            {/* Filtro por prioridad */}
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
            {/* Filtro por categoría */}
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
            {/* Botón de crear ticket */}
            <button
              className="btn btn-primary"
              onClick={openCreateModal}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Nuevo Ticket
            </button>
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

          {filteredTickets.length > 0 ? (
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
        </>
      )}
    </div>
  );
}

export default UserTickets;