import React from 'react';

export const PriorityDistribution = ({ priorityData = [] }) => {
    const total = priorityData.reduce((sum, item) => sum + item.count, 0);
    const barColor = '#6267f1';

    return (
        <div className="h-100 d-flex flex-column justify-content-between" style={{ minHeight: '16rem' }}>
            <div className="mb-3">
                {priorityData.map((item, index) => {
                    const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;

                    return (
                        <div className="mb-3" key={index}>
                            <div className="d-flex justify-content-between mb-1">
                                <span className="small fw-medium text-dark">{item.priority}</span>
                                <span className="small fw-medium text-muted">{item.count} tickets</span>
                            </div>
                            <div className="progress mb-1" style={{ height: '10px' }}>
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{
                                        backgroundColor: barColor,
                                        width: `${percentage}%`,
                                        transition: 'width 0.5s ease-in-out'
                                    }}
                                    aria-valuenow={percentage}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                            <span className="text-muted" style={{ fontSize: '0.75rem' }}>{percentage}%</span>
                        </div>
                    );
                })}
            </div>

            <div className="d-flex justify-content-between small text-muted">
                <span>Total tickets: {total}</span>
                <span>Based on top 4 priorities</span>
            </div>
        </div>
    );
};