import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { 
  GraduationCap, Search, Bookmark, Clock, 
  Send, History, User, Settings, Activity,
  Sliders
} from 'lucide-react';

// Sub-pages
import FacultyOverview from './FacultyOverview';
import BookSearch from '../Faculty/BookSearch';
import Reservations from '../Faculty/Reservations';
import MyLoans from '../Faculty/MyLoans';
import PurchaseRequests from '../Faculty/PurchaseRequests';
import BorrowHistory from '../Faculty/BorrowHistory';
import FacultyActivityLog from '../Faculty/FacultyActivityLog';
import Profile from './Profile';
import SettingsPage from './Settings';

const FacultyDashboard = () => {
  const sidebarMenu = [
    {
      title: 'Academic Desk',
      links: [
        { to: '/faculty', icon: GraduationCap, label: 'Dashboard' },
        { to: '/faculty/search', icon: Search, label: 'Search Books' },
        { to: '/faculty/reserve', icon: Bookmark, label: 'Reserve Books' },
        { to: '/faculty/loans', icon: Clock, label: 'My Loans' },
        { to: '/faculty/recommend', icon: Send, label: 'Recommend Books' },
        { to: '/faculty/history', icon: History, label: 'Borrow History' },
      ]
    },
    {
      title: 'Reports & Settings',
      links: [
        { to: '/faculty/activity', icon: Activity, label: 'Activity Log' },
        { to: '/faculty/profile', icon: User, label: 'Profile' },
        { to: '/faculty/settings', icon: Settings, label: 'Settings' },
      ]
    }
  ];

  return (
    <DashboardLayout 
      sidebarGroups={sidebarMenu} 
      title="Academic Portal" 
      subtitle="Faculty Information Suite"
    >
      <Routes>
        <Route index element={<FacultyOverview />} />
        <Route path="search" element={<BookSearch />} />
        <Route path="reserve" element={<Reservations />} />
        <Route path="loans" element={<MyLoans />} />
        <Route path="recommend" element={<PurchaseRequests />} />
        <Route path="history" element={<BorrowHistory />} />
        <Route path="activity" element={<FacultyActivityLog />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<div className="p-10 text-white/20 font-black uppercase tracking-widest text-center">Module Protocol Offline</div>} />
      </Routes>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
