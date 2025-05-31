import React, { useEffect, useState } from 'react'
import RoleService from '../../services/RoleService';
import { UserMinus, UserPlus } from 'lucide-react';
import { Button } from 'react-bootstrap';

function ManageUsers({ roleId }) {

  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [unassignedUsers, setUnassignedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect para cargar los datos
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await RoleService.getUserRoles(roleId);
        setUsers(response || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (roleId) {
      fetchUsers();
    }
  }, [roleId]);

  // useEffect separado para filtrar cuando users cambie
  useEffect(() => {
    if (users && users.length > 0) {
      setAssignedUsers(users.filter(user => user.has_current_role));
      setUnassignedUsers(users.filter(user => !user.has_current_role));
    } else {
      setAssignedUsers([]);
      setUnassignedUsers([]);
    }
  }, [users]);

  if (loading) {
    return <div className="text-center py-4">Loading users...</div>;
  }

  return (
    <div>
      {/* Usuarios asignados */}
      <div className="mb-4">
        <h5 className="text-muted mb-3">
          Users with this role ({assignedUsers.length})
        </h5>

        <div className="border rounded">
          {assignedUsers.length > 0 ? (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {assignedUsers.map((user, index) => (
                <div 
                  key={user.id} 
                  className={`d-flex align-items-center justify-content-between p-3 ${
                    index < assignedUsers.length - 1 ? 'border-bottom' : ''
                  }`}
                  style={{ 
                    transition: 'background-color 0.2s',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <div className="d-flex align-items-center">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center text-white me-3"
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#0d6efd',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h6 className="mb-0 text-dark">{user.name}</h6>
                      <small className="text-muted">{user.email}</small>
                    </div>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="d-flex align-items-center"
                  >
                    <UserMinus size={16} className="me-1" />
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted">
              No users assigned to this role
            </div>
          )}
        </div>
      </div>

      {/* Usuarios disponibles */}
      <div>
        <h5 className="text-muted mb-3">
          Available users ({unassignedUsers.length})
        </h5>

        <div className="border rounded">
          {unassignedUsers.length > 0 ? (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {unassignedUsers.map((user, index) => (
                <div 
                  key={user.id} 
                  className={`d-flex align-items-center justify-content-between p-3 ${
                    index < unassignedUsers.length - 1 ? 'border-bottom' : ''
                  }`}
                  style={{ 
                    transition: 'background-color 0.2s',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <div className="d-flex align-items-center">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center text-white me-3"
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#6c757d',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h6 className="mb-0 text-dark">{user.name}</h6>
                      <small className="text-muted">{user.email}</small>
                    </div>
                  </div>
                  <Button
                    variant="outline-success"
                    size="sm"
                    className="d-flex align-items-center"
                  >
                    <UserPlus size={16} className="me-1" />
                    Assign
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted">
              All users have been assigned to this role
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;