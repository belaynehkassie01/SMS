// pages/dashboard/AdminDashboard.jsx
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../../services/dashboardService";
import { useNotification } from "../../context/NotificationContext";
import StatsCard from "../../components/dashboard/StatsCard";
import Chart from "../../components/dashboard/Chart";
import RecentActivity from "../../components/dashboard/RecentActivity";

const AdminDashboard = () => {
  const { error: notifyError } = useNotification();

  const {
    data: stats = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
    retry: 1,
  });

  useEffect(() => {
    if (error) {
      notifyError("Failed to load dashboard data");
    }
  }, [error, notifyError]);

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        Failed to load dashboard.
      </div>
    );
  }

  const cards = [
    {
      title: "Students",
      value: stats.students ?? 0,
      icon: "bi-people",
      color: "primary",
    },
    {
      title: "Teachers",
      value: stats.teachers ?? 0,
      icon: "bi-person-badge",
      color: "success",
    },
    {
      title: "Courses",
      value: stats.courses ?? 0,
      icon: "bi-book",
      color: "warning",
    },
    {
      title: "Departments",
      value: stats.departments ?? 0,
      icon: "bi-building",
      color: "secondary",
    },
    {
      title: "Sections",
      value: stats.sections ?? 0,
      icon: "bi-grid-3x3-gap-fill",
      color: "info",
    },
    {
      title: "Enrollments",
      value: stats.enrollments ?? 0,
      icon: "bi-journal-check",
      color: "danger",
    },
    {
      title: "Payments",
      value: stats.payments ?? 0,
      icon: "bi-credit-card",
      color: "dark",
    },
  ];

  // Chart data for monthly revenue
  const monthlyData = stats.monthlyRevenue || [
    { label: 'Jan', value: 12000 },
    { label: 'Feb', value: 15000 },
    { label: 'Mar', value: 18000 },
    { label: 'Apr', value: 14000 },
    { label: 'May', value: 22000 },
    { label: 'Jun', value: 25000 },
  ];

  // Recent activities
  const recentActivities = stats.recentActivities || [
    { type: 'student', description: 'New student enrolled', timestamp: '2 hours ago', link: '/students' },
    { type: 'payment', description: 'Payment received', timestamp: '5 hours ago', link: '/payments' },
    { type: 'enrollment', description: 'New enrollment created', timestamp: 'Yesterday', link: '/enrollments' },
  ];

  return (
    <div className="container-fluid">
      <h2 className="mb-4 text-primary">Admin Dashboard</h2>

      {/* Stats Cards Row - Using StatsCard component */}
      <div className="row g-3 mb-4">
        {cards.map((card) => (
          <div key={card.title} className="col-md-3">
            <StatsCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
            />
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-7">
          <Chart 
            title="Monthly Revenue (ETB)" 
            data={monthlyData}
            type="bar"
            height={350}
          />
        </div>
        <div className="col-md-5">
          <RecentActivity 
            activities={recentActivities}
            title="Recent Activities"
            viewAllLink="/enrollments"
          />
        </div>
      </div>

      {/* Financial Summary and Attendance Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Total Revenue</h5>
              <h3 className="text-success">
                {Number(stats.totalRevenue || 0).toLocaleString()} ETB
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Attendance Rate</h5>
              <h3>{stats.attendanceRate ?? 0}%</h3>
              <div className="progress">
                <div
                  className="progress-bar"
                  style={{
                    width: `${stats.attendanceRate ?? 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Enrollments Table */}
      {stats.recentEnrollments?.length > 0 && (
        <div className="card shadow-sm">
          <div className="card-header">
            <h5 className="mb-0">Recent Enrollments</h5>
          </div>
          <div className="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentEnrollments.map((item, index) => (
                  <tr key={index}>
                    <td>{item.studentName}</td>
                    <td>{item.courseTitle}</td>
                    <td>
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;