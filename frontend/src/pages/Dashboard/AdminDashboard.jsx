import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  Users, Library, Activity, TrendingUp, Settings, Database
} from 'lucide-react';

// Sub-pages
import AdminOverview from './AdminOverview';
import UserManagement from '../Admin/UserManagement';
import Books from '../Admin/Books';
import QuickActions from '../Admin/QuickActions';
import Donations from '../Admin/Donations';
import Reports from '../Admin/Reports';
import AuditLogs from '../Admin/AuditLogs';
import SystemConfig from '../Admin/SystemConfig';
import SettingsPage from './Settings';
import Profile from './Profile';

const AdminDashboard = () => {
  const adminSidebar = [
    {
      title: 'MAIN',
      links: [
        { to: '/admin', icon: 'fa-th-large', label: 'Dashboard' },
        { to: '/admin/quick-actions', icon: 'fa-bolt', label: 'Quick Actions' },
      ]
    },
    {
      title: 'USER MANAGEMENT',
      links: [
        { to: '/admin/add-librarian', icon: 'fa-user-tie', label: 'Add Librarian' },
        { to: '/admin/add-faculty', icon: 'fa-chalkboard-teacher', label: 'Add Faculty' },
        { to: '/admin/add-student', icon: 'fa-user-graduate', label: 'Add Student' },
        { to: '/admin/users', icon: 'fa-users', label: 'All Users' },
      ]
    },
    {
      title: 'LIBRARY',
      links: [
        { to: '/admin/books', icon: 'fa-books', label: 'View Books' },
        { to: '/admin/browse', icon: 'fa-search', label: 'Browse Books' },
        { to: '/admin/donations', icon: 'fa-hand-holding-heart', label: 'Donations' },
      ]
    },
    {
      title: 'REPORTS & SETTINGS',
      links: [
        { to: '/admin/activity', icon: 'fa-history', label: 'Activity Log' },
        { to: '/admin/profile', icon: 'fa-user-circle', label: 'Profile' },
        { to: '/admin/settings', icon: 'fa-cog', label: 'Settings' },
      ]
    }
  ];

  return (
    <DashboardLayout 
      sidebarGroups={adminSidebar} 
      title="Admin Dashboard" 
      subtitle="VEMU Institute Control Panel"
    >
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="quick-actions" element={<QuickActions />} />
        <Route path="add-librarian" element={<UserManagement defaultRole="librarian" />} />
        <Route path="add-faculty" element={<UserManagement defaultRole="faculty" />} />
        <Route path="add-student" element={<UserManagement defaultRole="student" />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="books" element={<Books />} />
        <Route path="browse" element={<Books />} />
        <Route path="donations" element={<Donations />} />
        <Route path="reports" element={<Reports />} />
        <Route path="audit" element={<AuditLogs />} />
        <Route path="activity" element={<AuditLogs />} />
        <Route path="config" element={<SystemConfig />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;
