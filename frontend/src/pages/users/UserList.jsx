// pages/users/UserList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser, resetPassword } from '../../services/userService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const UserList = () => {
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [resettingUserId, setResettingUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
    enabled: user?.role === 'Admin',
  });

  console.log('Users API Response:', data);

  let users = [];
  if (data?.data && Array.isArray(data?.data)) {
    users = data.data;
  } else if (data?.data?.data && Array.isArray(data?.data?.data)) {
    users = data.data.data;
  }

  console.log('Extracted users:', users);

  useEffect(() => {
    if (users.length > 0) {
      if (search.trim() === '') {
        setFilteredUsers(users);
      } else {
        const filtered = users.filter(u =>
          (u.Username?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (u.FirstName?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (u.LastName?.toLowerCase() || '').includes(search.toLowerCase())
        );
        setFilteredUsers(filtered);
      }
    }
  }, [search, users]);

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      success('User deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      refetch();
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Failed to delete user');
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, password }) => resetPassword(id, password),
    onSuccess: () => {
      success('Password reset successfully');
      setResettingUserId(null);
      setNewPassword('');
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Failed to reset password');
    },
  });

  const handleDelete = (id, username) => {
    if (window.confirm(`Are you sure you want to delete user: ${username}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleResetPassword = (id) => {
    if (!newPassword || newPassword.length < 6) {
      notifyError('Password must be at least 6 characters');
      return;
    }
    resetPasswordMutation.mutate({ id, password: newPassword });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-danger';
      case 'Teacher': return 'bg-primary';
      case 'Student': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  // Helper to get role name from various possible field names
  const getRoleName = (u) => {
    return u.RoleName || u.role || u.Role || 'Unknown';
  };

  if (user?.role !== 'Admin') {
    return (
      <div className="alert alert-danger m-3">
        <i className="bi bi-shield-lock me-2"></i>
        Access denied. Admin only.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Error loading users: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-people me-2 text-primary"></i>
            User Management
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>Manage system user accounts</p>
        </div>
        <Link to="/users/create" className="btn btn-primary shadow-sm">
          <i className="bi bi-plus-circle me-2"></i>Create User
        </Link>
      </div>

      {/* Search Bar */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body bg-white">
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-search text-secondary"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Search by username, first name or last name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ color: '#212529' }}
            />
            {search && (
              <button className="btn btn-outline-secondary" onClick={() => setSearch('')}>
                <i className="bi bi-x-circle"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th style={{ width: '150px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-secondary">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.UserID}>
                      <td className="text-white">{u.UserID}</td>
                      <td className="fw-semibold text-white">{u.Username}</td>
                      <td className="text-white">{`${u.FirstName || ''} ${u.LastName || ''}`.trim() || '-'}</td>
                      <td className="text-white">{u.Email || '-'}</td>
                      <td>
                        <span className={`badge ${getRoleBadgeColor(getRoleName(u))}`}>
                          {getRoleName(u)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.IsActive === 1 ? 'bg-success' : 'bg-secondary'}`}>
                          {u.IsActive === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-white">{u.CreatedAt ? new Date(u.CreatedAt).toLocaleDateString() : '-'}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link to={`/users/edit/${u.UserID}`} className="btn btn-outline-primary" title="Edit">
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            className="btn btn-outline-warning"
                            onClick={() => setResettingUserId(resettingUserId === u.UserID ? null : u.UserID)}
                            title="Reset Password"
                          >
                            <i className="bi bi-key"></i>
                          </button>
                          {u.Username !== 'admin' && (
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(u.UserID, u.Username)}
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>
                        
                        {/* Password Reset Input */}
                        {resettingUserId === u.UserID && (
                          <div className="mt-2 d-flex gap-2">
                            <input
                              type="password"
                              className="form-control form-control-sm"
                              placeholder="New password (min 6 chars)"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              style={{ width: '150px' }}
                            />
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleResetPassword(u.UserID)}
                            >
                              Save
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Info footer */}
      <div className="text-center text-secondary small mt-3">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
};

export default UserList;