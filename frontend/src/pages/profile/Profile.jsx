// pages/profile/Profile.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';

const Profile = () => {
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      success('Profile update feature coming soon');
      setIsEditing(false);
    } catch (err) {
      notifyError(err?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-danger';
      case 'Teacher': return 'bg-primary';
      case 'Student': return 'bg-success';
      default: return 'bg-secondary';
    }
  };

  const getInitials = () => {
    const name = user?.fullName || user?.username || 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-person-circle me-2 text-primary"></i>
            My Profile
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>View your profile information</p>
        </div>
        {!isEditing && (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            <i className="bi bi-pencil me-2"></i>Edit Profile
          </button>
        )}
      </div>

      <div className="row g-4">
        {/* Profile Summary Card */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '100px', height: '100px' }}>
                <span className="fw-bold fs-1 text-primary">{getInitials()}</span>
              </div>
              <h3 className="mb-1 fw-semibold" style={{ color: '#1a1a2e' }}>
                {user?.fullName || user?.username || 'User'}
              </h3>
              <p className="text-primary mb-2">@{user?.username}</p>
              <span className={`badge ${getRoleBadgeColor(user?.role)} px-3 py-2`}>
                {user?.role || 'Guest'}
              </span>
            </div>
            <div className="card-footer bg-transparent text-center border-0 pb-4">
              <small className="text-primary">Member since: {new Date().getFullYear()}</small>
            </div>
          </div>
        </div>

        {/* Profile Info Card */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-body p-4">
              {isEditing ? (
                <form onSubmit={handleUpdateProfile}>
                  <h5 className="mb-3 pb-2 border-bottom">Edit Profile</h5>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        className="form-control"
                        value={formData.fullName}
                        onChange={handleChange}
                        style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                      />
                    </div>
                    <div className="col-12 d-flex justify-content-end gap-2">
                      <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div>
                  <h5 className="mb-3 pb-2 border-bottom">Profile Information</h5>
                  <div className="row">
                    <div className="col-sm-6 mb-3">
                      <label className="text-primary small mb-1 d-block">Full Name</label>
                      <div className="fw-semibold text-dark">{user?.fullName || '-'}</div>
                    </div>
                    <div className="col-sm-6 mb-3">
                      <label className="text-primary small mb-1 d-block">Username</label>
                      <div className="text-dark">{user?.username || '-'}</div>
                    </div>
                    <div className="col-sm-6 mb-3">
                      <label className="text-primary small mb-1 d-block">Role</label>
                      <div className="text-dark">{user?.role || '-'}</div>
                    </div>
                    <div className="col-sm-6 mb-3">
                      <label className="text-primary small mb-1 d-block">User ID</label>
                      <div className="text-dark">{user?.id || '-'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;