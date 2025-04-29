import React from 'react';
import { useDraggable } from '@dnd-kit/core';

function KanbanCard({ ticket }) {
    const getBorderColor = () => {
        switch (ticket.priority?.name) {
            case "Crítica": return "#f87171";
            case "Alta": return "#fb923c";
            case "Media": return "#60a5fa";
            case "Baja": return "#4ade80";
        }
    };

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: ticket.id,
    });

    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        borderLeft: `4px solid ${getBorderColor()}`,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1000 : 1,
        cursor: 'grab'
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="card shadow-sm"
            style={style}
        >
            <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex gap-2">
                        <span className="badge bg-light text-dark">#{ticket.id}</span>
                        <span className="badge bg-light text-dark">{ticket.status}</span>
                    </div>
                </div>

                <h6 className="mb-3 fw-bold text-truncate">{ticket.title}</h6>

                <div className="mb-2 small text-truncate">
                    {ticket.requester?.name}
                </div>

                <div className="d-flex justify-content-between mb-2">
                    <span className="small text-muted">{ticket.category?.name}</span>
                    <span className="small badge"
                        style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
                        {ticket.priority?.name}
                    </span>
                </div>
                
                <div className="mt-2 pt-2 border-top">
                    <div className="small text-muted text-truncate">
                        {ticket.agent?.name || "Sin asignar"}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KanbanCard;