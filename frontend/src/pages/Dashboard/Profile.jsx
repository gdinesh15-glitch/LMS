import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, Shield, Calendar, Clock, 
  Edit3, Save, X, Lock, Key, Activity, 
  Camera, CheckCircle, AlertCircle, RefreshCw, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import userService from '../../api/services/userService';

/* ── Toast ─────────────────────────────────────────────────────── */
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);
  const c = type === 'success' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-rose-500/20 border-rose-500/40 text-rose-300';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  return (
    <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-md text-sm font-semibold ${c}`}>
      <Icon className="w-4 h-4 flex-shrink-0" /><span>{msg}</span>
      <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100"><X className="w-4 h-4" /></button>
    </div>
  );
};

/* ── Helpers ───────────────────────────────────────────────────── */
const Field = ({ label, icon: Icon, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: 'rgba(148,163,184,0.8)' }}>
      {Icon && <Icon className="w-3 h-3" />} {label}
    </label>
    {children}
  </div>
);

const inp = "w-full px-4 h-11 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-500/60 placeholder:text-slate-600";
const inpStyle = { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.8)', color: '#e2e8f0' };
const cardStyle = { background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.6)', backdropFilter: 'blur(20px)' };

const Profile = () => {
  const { user: authUser, updateUserData } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Password state
  const [pwState, setPwState] = useState({ current: '', new: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);

  const notify = (msg, type = 'success') => setToast({ msg, type });

  const fetchProfile = async () => {
    setLoading(true);
    try {
        const res = await userService.getMe();
        if (res.success) {
            setProfile(res.data);
        } else {
            notify(res.error || 'Failed to load profile', 'error');
        }
    } catch (err) {
        notify('Connection error', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.target);
    const payload = {
      name: fd.get('name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      department: fd.get('department'),
      userId: fd.get('userId')
    };

    const res = await userService.updateMe(payload);
    if (res.success) {
      setProfile(res.data);
      updateUserData(res.data); // Synchronize context and localStorage
      setIsEditing(false);
      notify('Profile updated successfully!');
    } else {
      notify(res.error || 'Update failed', 'error');
    }
    setSaving(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwState.new !== pwState.confirm) {
      return notify('Passwords do not match', 'error');
    }
    if (pwState.new.length < 6) {
      return notify('Password must be at least 6 characters', 'error');
    }

    setPwSaving(true);
    const res = await userService.changePassword({
      currentPassword: pwState.current,
      newPassword: pwState.new
    });

    if (res.success) {
      setPwState({ current: '', new: '', confirm: '' });
      notify('Password changed successfully!');
    } else {
      notify(res.error || 'Password change failed', 'error');
    }
    setPwSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-indigo-400">
        <RefreshCw className="w-10 h-10 animate-spin" />
        <span className="text-sm font-bold uppercase tracking-widest">Loading Secure Environment...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-6 space-y-6" style={{ background: 'transparent' }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1.5">Account Profile</h1>
          <p className="text-xs font-medium" style={{ color: 'rgba(148,163,184,0.7)' }}>
            Manage your personal information and security settings
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                {profile?.role || 'User'} Access
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Left Column: Identity Card ────────────────────────── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden" style={cardStyle}>
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            <div className="relative mb-6">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl border-4 border-white/10">
                    {profile?.name?.charAt(0) || 'U'}
                </div>
                <button className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white hover:bg-indigo-600 transition-colors">
                    <Camera className="w-4 h-4" />
                </button>
            </div>

            <h2 className="text-xl font-black text-white mb-1">{profile?.name}</h2>
            <p className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-6">{profile?.role}</p>

            <div className="w-full space-y-4 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'rgba(148,163,184,0.6)' }} className="font-bold uppercase">ID Number</span>
                    <span className="text-white font-mono">{profile?.userId}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'rgba(148,163,184,0.6)' }} className="font-bold uppercase">Status</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase text-[9px]">
                        {profile?.status || 'Active'}
                    </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                    <span style={{ color: 'rgba(148,163,184,0.6)' }} className="font-bold uppercase">Joined</span>
                    <span className="text-white font-medium">{new Date(profile?.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
          </div>

          <div className="rounded-3xl p-6 space-y-4" style={cardStyle}>
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                <Activity className="w-4 h-4 text-pink-500" /> Account Security
            </h3>
            <div className="space-y-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-white">Two-Factor Auth</p>
                        <p className="text-[9px] text-slate-500">Enhanced protection enabled</p>
                    </div>
                    <div className="w-8 h-4 rounded-full bg-emerald-500/20 relative">
                        <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-emerald-500"></div>
                    </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 opacity-50">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-white">Login History</p>
                        <p className="text-[9px] text-slate-500">View recent access points</p>
                    </div>
                    <ChevronRight className="w-3 h-3" />
                </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Forms ──────────────────────────────── */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile Form */}
          <div className="rounded-3xl overflow-hidden" style={cardStyle}>
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                    <User className="w-4 h-4 text-indigo-500" /> Personal Information
                </h3>
                {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors">
                        <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                    </button>
                ) : (
                    <button onClick={() => setIsEditing(false)} className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors">
                        <X className="w-3.5 h-3.5" /> Discard
                    </button>
                )}
            </div>

            <form onSubmit={handleUpdateProfile} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Full Identity Name" icon={User}>
                        <input name="name" className={inp} style={inpStyle} defaultValue={profile?.name} readOnly={!isEditing} />
                    </Field>
                    <Field label="Institutional User ID" icon={Key}>
                        <input name="userId" className={inp} style={inpStyle} defaultValue={profile?.userId} readOnly={!isEditing} />
                    </Field>
                    <Field label="Email Address" icon={Mail}>
                        <input name="email" type="email" className={inp} style={inpStyle} defaultValue={profile?.email} readOnly={!isEditing} />
                    </Field>
                    <Field label="Contact Number" icon={Phone}>
                        <input name="phone" className={inp} style={inpStyle} defaultValue={profile?.phone} readOnly={!isEditing} />
                    </Field>
                    <Field label="Associated Department" icon={Shield}>
                        <input name="department" className={inp} style={inpStyle} defaultValue={profile?.department} readOnly={!isEditing} />
                    </Field>
                </div>

                {isEditing && (
                    <div className="mt-8 flex justify-end">
                        <button type="submit" disabled={saving} className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2">
                            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Saving...' : 'Commit Changes'}
                        </button>
                    </div>
                )}
            </form>
          </div>

          {/* Password Change */}
          <div className="rounded-3xl overflow-hidden" style={cardStyle}>
            <div className="px-8 py-6 border-b border-white/5">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                    <Lock className="w-4 h-4 text-purple-500" /> Authentication Security
                </h3>
            </div>
            <form onSubmit={handleChangePassword} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Field label="Current Password">
                        <input type="password" className={inp} style={inpStyle} value={pwState.current} onChange={e => setPwState({...pwState, current: e.target.value})} placeholder="••••••••" required />
                    </Field>
                    <Field label="New Secure Password">
                        <input type="password" className={inp} style={inpStyle} value={pwState.new} onChange={e => setPwState({...pwState, new: e.target.value})} placeholder="••••••••" required />
                    </Field>
                    <Field label="Confirm New Password">
                        <input type="password" className={inp} style={inpStyle} value={pwState.confirm} onChange={e => setPwState({...pwState, confirm: e.target.value})} placeholder="••••••••" required />
                    </Field>
                </div>
                <div className="mt-8 flex justify-between items-center">
                    <p className="text-[10px] text-slate-500 font-medium">Last changed: {new Date(profile?.updatedAt).toLocaleDateString()}</p>
                    <button type="submit" disabled={pwSaving} className="px-8 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 active:scale-[0.98] transition-all flex items-center gap-2">
                        {pwSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                        Update Password
                    </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
