import { Clock, Edit, Hash, User } from 'lucide-react';
import React from 'react';

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
};

function TicketCard({ ticket }) {
    const getBorderColor = () => {
        switch (ticket.priority) {
            case "Crítica": return "#f87171";
            case "Alta": return "#fb923c";
            case "Media": return "#60a5fa";
            case "Baja": return "#4ade80";
            default: return "#4ade80";
        }
    };

    const statusColors = {
        'open': 'bg-warning-subtle text-warning-emphasis',
        'in-progress': 'bg-info-subtle text-info-emphasis',
        'closed': 'bg-secondary-subtle text-secondary-emphasis',
        'on_hold': 'bg-orange-subtle text-orange-emphasis',
        'cancelled': 'bg-danger-subtle text-danger-emphasis'
    };

    return (
        <div className="card shadow-sm" style={{ borderLeft: `4px solid ${getBorderColor()}`, borderTop: 0, borderRight: 0, borderBottom: 0 }}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-light text-dark d-flex align-items-center">
                            <Hash className="me-1" size={12} />
                            {ticket.id}
                        </span>
                        <span className={`badge ${statusColors[ticket.status]}`}>
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('_', ' ')}
                        </span>
                    </div>
                    <button className="btn btn-link btn-sm p-1 text-primary">
                        <Edit size={14} />
                    </button>
                </div>

                <h5 className="card-title mb-2">
                    {ticket.title}
                </h5>

                <p className="card-text text-muted small mb-3 text-truncate">
                    {ticket.description}
                </p>

                <div className="d-flex justify-content-between align-items-center text-muted small border-top pt-3">
                    <div className="d-flex align-items-center">
                        <User size={14} className="me-1" />
                        <span>{ticket.agent?.name || 'Unassigned'}</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <Clock size={14} className="me-1" />
                        <span>{formatDate(ticket.createdAt)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicketCard;