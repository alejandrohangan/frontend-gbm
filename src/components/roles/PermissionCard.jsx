import React from 'react'

function PermissionCard({ permission, isSelected, onToggle }) {
    return (
        <div
            className={`
        card border position-relative cursor-pointer transition-all
        ${isSelected
                    ? 'border-primary bg-light shadow'
                    : 'border-secondary-subtle'
                }
      `}
            style={{
                cursor: 'pointer',
                transition: 'all 0.2s ease'
            }}
            onClick={() => onToggle(permission.id)}
            onMouseEnter={(e) => {
                if (!isSelected) {
                    e.currentTarget.classList.add('border-primary-subtle', 'bg-primary-subtle');
                }
            }}
            onMouseLeave={(e) => {
                if (!isSelected) {
                    e.currentTarget.classList.remove('border-primary-subtle', 'bg-primary-subtle');
                }
            }}
        >
            <div className="card-body p-3">
                <div className="d-flex align-items-start justify-content-between">
                    <div className="flex-grow-1">
                        <h6 className="card-title mb-0 text-dark fw-medium">{permission.name}</h6>
                    </div>
                    <div className="ms-3 d-flex align-items-center">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={isSelected}
                            onChange={() => onToggle(permission.id)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PermissionCard;