import React from 'react';
import KanbanCard from "./KanbanCard";
import { useDroppable } from '@dnd-kit/core';

function KanbanColumn({ id, title, tickets, maxCards }) {
    const { setNodeRef, isOver } = useDroppable({
        id: id
    });

    return (
        <div
            className={`rounded`}
            style={{
                width: '300px',
                minWidth: '300px',
                height: '800px', // Altura fija para todas las columnas
                backgroundColor: isOver ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                borderWidth: '2px',
                borderStyle: isOver ? 'dashed' : 'solid',
                borderColor: isOver ? '#22c55e' : '#dee2e6',
                boxShadow: isOver ? '0 0 8px rgba(34, 197, 94, 0.2)' : 'none',
                transition: 'all 0.2s ease',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Header fijo */}
            <div className="p-3 pb-2 flex-shrink-0">
                <div className="d-flex justify-content-center">
                    <h5 className="m-0 d-flex align-items-center">
                        <span className="me-2">{title}</span>
                        <span className="badge bg-secondary">{tickets.length}</span>
                    </h5>
                </div>
            </div>

            {/* Contenedor scrollable */}
            <div
                ref={setNodeRef}
                className="flex-grow-1 px-3 pb-3"
                style={{
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e1 transparent'
                }}
            >
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

            {/* Estilos de scrollbar personalizados */}
            <style jsx>{`
                .flex-grow-1::-webkit-scrollbar {
                    width: 6px;
                }
                
                .flex-grow-1::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .flex-grow-1::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 3px;
                    transition: background-color 0.2s ease;
                }
                
                .flex-grow-1::-webkit-scrollbar-thumb:hover {
                    background-color: #94a3b8;
                }
            `}</style>
        </div>
    );
}

export default KanbanColumn;