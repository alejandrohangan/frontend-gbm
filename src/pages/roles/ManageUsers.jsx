import React, { useEffect, useState } from 'react'
import RoleService from '../../services/RoleService';
import { UserMinus, UserPlus, Loader2 } from 'lucide-react';

function ManageUsers({ roleId }) {
  const [users, setUsers] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [unassignedUsers, setUnassignedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({}); // Para manejar loading individual de botones

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

  // Función para asignar rol
  const handleAssignRole = async (userId) => {
    const loadingKey = `assign_${userId}`;

    try {
      setActionLoading(prev => ({ ...prev, [loadingKey]: true }));

      await RoleService.assignRole(roleId, userId);

      // Actualizar estado local instantáneamente
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? { ...user, has_current_role: true }
            : user
        )
      );

      // Opcional: mostrar mensaje de éxito
      console.log('Role assigned successfully');

    } catch (error) {
      console.error('Error assigning role:', error);
      // Opcional: mostrar mensaje de error
      alert('Error assigning role: ' + error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Función para revocar rol
  const handleRevokeRole = async (userId) => {
    const loadingKey = `revoke_${userId}`;

    try {
      setActionLoading(prev => ({ ...prev, [loadingKey]: true }));

      await RoleService.revokeRole(roleId, userId);

      // Actualizar estado local instantáneamente
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? { ...user, has_current_role: false }
            : user
        )
      );

      // Opcional: mostrar mensaje de éxito
      console.log('Role revoked successfully');

    } catch (error) {
      console.error('Error revoking role:', error);
      // Opcional: mostrar mensaje de error
      alert('Error revoking role: ' + error.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Loader2 className="animate-spin mx-auto mb-2" size={32} />
        <div>Loading users...</div>
      </div>
    );
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
                  className={`d-flex align-items-center justify-content-between p-3 ${index < assignedUsers.length - 1 ? 'border-bottom' : ''
                    }`}
                  style={{
                    transition: 'background-color 0.2s',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
                  <button
                    className="btn btn-outline-danger btn-sm d-flex align-items-center"
                    onClick={() => handleRevokeRole(user.id)}
                    disabled={actionLoading[`revoke_${user.id}`]}
                  >
                    {actionLoading[`revoke_${user.id}`] ? (
                      <>
                        <Loader2 size={16} className="me-1 animate-spin" />
                        Revoking...
                      </>
                    ) : (
                      <>
                        <UserMinus size={16} className="me-1" />
                        Revoke
                      </>
                    )}
                  </button>
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
                  className={`d-flex align-items-center justify-content-between p-3 ${index < unassignedUsers.length - 1 ? 'border-bottom' : ''
                    }`}
                  style={{
                    transition: 'background-color 0.2s',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
                  <button
                    className="btn btn-outline-success btn-sm d-flex align-items-center"
                    onClick={() => handleAssignRole(user.id)}
                    disabled={actionLoading[`assign_${user.id}`]}
                  >
                    {actionLoading[`assign_${user.id}`] ? (
                      <>
                        <Loader2 size={16} className="me-1 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} className="me-1" />
                        Assign
                      </>
                    )}
                  </button>
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