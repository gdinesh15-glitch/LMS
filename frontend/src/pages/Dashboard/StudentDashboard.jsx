import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  Bookmark, Search, Heart, IndianRupee, Smartphone
} from 'lucide-react';

// Sub-pages
import StudentOverview from './StudentOverview';
import CatalogSearch from '../Student/CatalogSearch';
import Wishlist from '../Student/Wishlist';
import StudentFines from '../Student/StudentFines';
import DigitalLibrary from '../Student/DigitalLibrary';
import SettingsPage from './Settings';
import AuditLogs from '../Admin/AuditLogs';
import Profile from './Profile';

import RequestBook from '../Student/RequestBook';

const StudentDashboard = () => {
  const studentSidebar = [
    {
      title: 'Personal Library',
      links: [
        { to: '/student', icon: Bookmark, label: 'My Bookshelf' },
        { to: '/student/catalog', icon: Search, label: 'Find Books' },
        { to: '/student/request', icon: 'fa-hand-paper', label: 'Request Book' },
        { to: '/student/wishlist', icon: Heart, label: 'My Wishlist' },
      ]
    },
    {
      title: 'Accounts',
      links: [
        { to: '/student/fines', icon: IndianRupee, label: 'Fines & Payments' },
        { to: '/student/digital', icon: Smartphone, label: 'Digital Library' },
      ]
    },
    {
      title: 'REPORTS & SETTINGS',
      links: [
        { to: '/student/activity', icon: 'fa-history', label: 'Activity Log' },
        { to: '/student/profile', icon: 'fa-user-circle', label: 'Profile' },
        { to: '/student/settings', icon: 'fa-cog', label: 'Settings' },
      ]
    }
  ];

  return (
    <DashboardLayout 
      sidebarGroups={studentSidebar} 
      title="Student Learning Desk" 
      subtitle="VEMU Academic Library"
    >
      <Routes>
        <Route index element={<StudentOverview />} />
        <Route path="catalog" element={<CatalogSearch />} />
        <Route path="request" element={<RequestBook />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="fines" element={<StudentFines />} />
        <Route path="digital" element={<DigitalLibrary />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="activity" element={<AuditLogs />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </DashboardLayout>
  );
};

export default StudentDashboard;
