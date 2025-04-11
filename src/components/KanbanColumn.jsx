import React from 'react';
import KanbanCard from "./KanbanCard";
import { useDroppable } from '@dnd-kit/core';

function KanbanColumn({ id, title, tickets, maxCards }) {
    const { setNodeRef, isOver } = useDroppable({
        id: id
    });

    return (
        <div
            ref={setNodeRef}
            className={`flex-shrink-0 rounded p-3`}
            style={{
                width: '320px',
                minWidth: '320px',
                minHeight: `${maxCards * 140 + 80}px`,
                backgroundColor: isOver ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
                borderWidth: '2px',
                borderStyle: isOver ? 'dashed' : 'solid',
                borderColor: isOver ? '#22c55e' : '#dee2e6',
                boxShadow: isOver ? '0 0 6px rgba(34, 197, 94, 0.3)' : 'none',
                transition: 'background-color 0.15s ease, border-color 0.15s ease, border-style 0.15s ease, box-shadow 0.15s ease',
                willChange: 'background-color, border-color, border-style, box-shadow',
                position: 'relative'
            }}
        >
            <div className="mb-3 d-flex justify-content-center">
                <h5 className="m-0 d-flex align-items-center">
                    <span className="me-2">{title}</span>
                    <span className="badge bg-secondary">{tickets.length}</span>
                </h5>
            </div>
            <div className="d-flex flex-column gap-3">
                {tickets.map((ticket) => (
                    <KanbanCard key={ticket.id} ticket={ticket} />
                ))}
                {tickets.length === 0 && (
                    <div className="text-center text-muted p-3 border border-dashed rounded">
                        Arrastra tickets aquí
                    </div>
                )}
            </div>
        </div>
    );
}

export default KanbanColumn;