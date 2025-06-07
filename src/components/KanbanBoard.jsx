import React, { useState, useEffect } from 'react';
import KanbanColumn from "./KanbanColumn";
import { DndContext, DragOverlay, rectIntersection } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { COLUMNS } from '../utils/kanbanUtils';
import TicketService from '../services/TicketService';
import toast from 'react-hot-toast';
import KanbanCard from './KanbanCard';

function KanbanBoard({ initialTickets, onTicketStatusChange }) {
  // Estado local para manejar los tickets mientras se actualiza la base de datos
  const [localTickets, setLocalTickets] = useState(initialTickets);
  const [activeTicket, setActiveTicket] = useState(null);

  // Actualizar el estado local cuando cambien las props
  useEffect(() => {
    setLocalTickets(initialTickets);
  }, [initialTickets]);

  if (!localTickets || !Array.isArray(localTickets) || localTickets.length === 0) {
    return <div className="text-center p-4">No hay tickets disponibles</div>;
  }

  const handleDragStart = (event) => {
    const { active } = event;
    const ticket = localTickets.find(t => t.id === parseInt(active.id));
    setActiveTicket(ticket);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    setActiveTicket(null);

    if (!over) return;

    const ticketId = active.id;
    const newColumnId = over.id;

    console.log(newColumnId);

    // 1. Actualización optimista inmediata de la UI
    setLocalTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === parseInt(ticketId)
          ? { ...ticket, status: newColumnId }
          : ticket
      )
    );

    // También notificar al componente padre inmediatamente
    onTicketStatusChange(parseInt(ticketId), newColumnId);

    try {
      // 2. Actualizar en el servidor
      const response = await TicketService.updateStatus(ticketId, newColumnId);

      if (!response || !response.id) {
        throw new Error('Error al actualizar el ticket');
      }
    } catch (error) {
      console.error('Error al actualizar el estado del ticket:', error);
      toast.error('Error al actualizar el ticket', {
        position: 'bottom-right',
      });

      // 3. Revertir en caso de error
      const originalTicket = initialTickets.find(t => t.id === parseInt(ticketId));
      if (originalTicket) {
        // Revertir en el estado local
        setLocalTickets(prevTickets =>
          prevTickets.map(ticket =>
            ticket.id === parseInt(ticketId)
              ? { ...ticket, status: originalTicket.status }
              : ticket
          )
        );

        // Revertir en el componente padre
        onTicketStatusChange(parseInt(ticketId), originalTicket.status);
      }
    }
  };

  return (
    <DndContext 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={rectIntersection}
      modifiers={[restrictToWindowEdges]}
    >
      <div 
        className="d-flex gap-4 pb-3"
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          minHeight: '850px' // Aumentamos para acomodar las columnas más altas
        }}
      >
        {COLUMNS.map((column) => (
          <div key={column.id} style={{ flexShrink: 0 }}>
            <KanbanColumn
              id={column.id}
              title={column.title}
              tickets={localTickets.filter(ticket =>
                ticket.status === column.id
              )}
            />
          </div>
        ))}
      </div>
      
      <DragOverlay>
        {activeTicket ? (
          <div style={{ transform: 'rotate(5deg)' }}>
            <KanbanCard ticket={activeTicket} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default KanbanBoard;