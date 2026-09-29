import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  Repeat, BookOpen, AlertTriangle, List, TrendingUp, CheckCircle2,
  Plus, Layers, RotateCcw, RefreshCw, Bookmark, Users, GraduationCap,
  UserCheck, FileText, FileBarChart, Bell, Settings
} from 'lucide-react';
import AuditLogs from '../Admin/AuditLogs';
import Profile from './Profile';
import UserManagement from '../Admin/UserManagement';

// Sub-pages
import LibrarianOverview from './LibrarianOverview';
import CatalogManager from '../Librarian/CatalogManager';
import CirculationDesk from '../Librarian/CirculationDesk';
import FinesManager from '../Librarian/FinesManager';
import HoldQueueManager from '../Librarian/HoldQueueManager';
import InventoryAudit from '../Librarian/InventoryAudit';
import SettingsPage from './Settings';

import Notifications from '../Librarian/Notifications';

const LibrarianDashboard = () => {
  const librarianSidebar = [
    {
      title: 'MAIN',
      links: [
        { to: '/librarian', icon: TrendingUp, label: 'Dashboard' },
      ]
    },
    {
      title: 'BOOK MANAGEMENT',
      links: [
        { to: '/librarian/catalog?action=add', icon: Plus, label: 'Add New Book' },
        { to: '/librarian/catalog', icon: BookOpen, label: 'View Books' },
      ]
    },
    {
      title: 'CIRCULATION',
      links: [
        { to: '/librarian/circulation', icon: Repeat, label: 'Issue Book' },
        { to: '/librarian/return', icon: RotateCcw, label: 'Return Book' },
        { to: '/librarian/renew', icon: RefreshCw, label: 'Renew Book' },
        { to: '/librarian/holds', icon: Bookmark, label: 'Reservations' },
      ]
    },
    {
      title: 'MEMBERS',
      links: [
        { to: '/librarian/students', icon: Users, label: 'Students' },
        { to: '/librarian/faculty', icon: GraduationCap, label: 'Faculty' },
        { to: '/librarian/members', icon: UserCheck, label: 'Members' },
      ]
    },
    {
      title: 'REPORTS',
      links: [
        { to: '/librarian/reports/issue', icon: FileBarChart, label: 'Reports' },
        { to: '/librarian/activity', icon: FileText, label: 'Activity Log' },
      ]
    },
    {
      title: 'SETTINGS',
      links: [
        { to: '/librarian/notifications', icon: Bell, label: 'Notifications' },
        { to: '/librarian/profile', icon: UserCheck, label: 'Profile' },
        { to: '/librarian/settings', icon: Settings, label: 'Settings' },
      ]
    }
  ];

  return (
    <DashboardLayout 
      sidebarGroups={librarianSidebar} 
      title="Librarian Work-Center" 
      subtitle="Knowledge Asset Management System"
    >
      <Routes>
        <Route index element={<LibrarianOverview />} />
        <Route path="circulation" element={<CirculationDesk />} />
        <Route path="catalog" element={<CatalogManager />} />
        <Route path="fines" element={<FinesManager />} />
        <Route path="holds" element={<HoldQueueManager />} />
        <Route path="inventory" element={<InventoryAudit />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="activity" element={<AuditLogs />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
        
        {/* Functional helper routes */}
        <Route path="return" element={<CirculationDesk defaultTab="return" />} />
        <Route path="renew" element={<CirculationDesk defaultTab="renew" />} />
        <Route path="students" element={<UserManagement defaultRole="student" />} />
        <Route path="faculty" element={<UserManagement defaultRole="faculty" />} />
        <Route path="members" element={<UserManagement />} />
        <Route path="reports/*" element={<AuditLogs />} />
      </Routes>
    </DashboardLayout>
  );
};

export default LibrarianDashboard;
