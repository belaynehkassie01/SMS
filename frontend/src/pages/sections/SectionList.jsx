// pages/sections/SectionList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSections, deleteSection } from '../../services/sectionService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const SectionList = () => {
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [filteredSections, setFilteredSections] = useState([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['sections'],
    queryFn: () => getSections(),
  });

  let sections = [];
  if (data?.data && Array.isArray(data?.data)) {
    sections = data.data;
  } else if (data?.data?.data && Array.isArray(data?.data?.data)) {
    sections = data.data.data;
  } else if (Array.isArray(data)) {
    sections = data;
  }

  useEffect(() => {
    if (sections.length > 0) {
      if (search.trim() === '') {
        setFilteredSections(sections);
      } else {
        const filtered = sections.filter(section =>
          (section.SectionName?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (section.CourseTitle?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (section.RoomNumber?.toLowerCase() || '').includes(search.toLowerCase())
        );
        setFilteredSections(filtered);
      }
    } else {
      setFilteredSections([]);
    }
  }, [search, sections]);

  const deleteMutation = useMutation({
    mutationFn: deleteSection,
    onSuccess: async () => {
      success('Section deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['sections'] });
      refetch();
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Failed to delete section');
    },
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete section: ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleRefresh = () => {
    setSearch('');
    refetch();
    success('Sections refreshed successfully');
  };

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
        Error loading sections
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 text-black">
            <i className="bi bi-grid-3x3-gap-fill me-2 text-primary"></i>
            Section Management
          </h2>
          <p className="text-secondary mb-0 mt-1">Manage all class sections</p>
        </div>
        {user?.role === 'Admin' && (
          <Link to="/sections/create" className="btn btn-primary shadow-sm">
            <i className="bi bi-plus-circle me-2"></i>Add New Section
          </Link>
        )}
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-secondary">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0 text-white"
                  placeholder="Search by section name, course or room..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setSearch('')}
                  >
                    <i className="bi bi-x-circle"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-auto ms-auto">
              <button className="btn btn-outline-primary" onClick={handleRefresh}>
                <i className="bi bi-arrow-repeat me-1"></i>Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Section Name</th>
                  <th>Course</th>
                  <th>Year</th>
                  <th>Semester</th>
                  <th>Room</th>
                  <th>Schedule</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSections.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-5 text-secondary">
                      No sections found
                    </td>
                  </tr>
                ) : (
                  filteredSections.map((section) => (
                    <tr key={section.SectionID}>
                      <td className="text-white">{section.SectionID}</td>
                      <td className="text-white fw-semibold">{section.SectionName}</td>
                      <td className="text-white">{section.CourseTitle || '-'}</td>
                      <td className="text-white">{section.Year || '-'}</td>
                      <td className="text-white">{section.Semester || '-'}</td>
                      <td className="text-white">{section.RoomNumber || '-'}</td>
                      <td className="text-white">{section.Schedule || '-'}</td>
                      <td className="text-white">{section.Capacity || '-'}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link to={`/sections/view/${section.SectionID}`} className="btn btn-outline-info" title="View">
                            <i className="bi bi-eye"></i>
                          </Link>
                          {user?.role === 'Admin' && (
                            <>
                              <Link to={`/sections/edit/${section.SectionID}`} className="btn btn-outline-primary" title="Edit">
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(section.SectionID, section.SectionName)}
                                title="Delete"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="text-center text-secondary small mt-3">
        Showing {filteredSections.length} of {sections.length} sections
      </div>
    </div>
  );
};

export default SectionList;