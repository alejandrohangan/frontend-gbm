import React from 'react'

function StatsCard({ title, value, icon }) {
    return (
        <div className="card h-100 shadow-sm" style={{ transition: 'all 0.3s ease' }}>
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <p className="card-text text-muted small mb-1">{title}</p>
                        <h3 className="card-title mb-0 fw-bold">{value}</h3>
                    </div>
                    <div className="p-3 bg-light rounded-circle">
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
}


export default StatsCard;