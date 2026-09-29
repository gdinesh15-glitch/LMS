import api from '../axios';

const userService = {
  getStats: async () => {
    try {
      const response = await api.get('/users/stats');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch stats' };
    }
  },

  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch users' };
    }
  },

  addUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      try {
        const { pushNotif } = await import('../../utils/db');
        pushNotif('fa-user-plus', 'rgba(110,231,183,.15)', '#6ee7b7', `New ${userData.role} added: ${userData.name}`, 'success');
      } catch (e) {}
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to add user' };
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      try {
        const { pushNotif } = await import('../../utils/db');
        pushNotif('fa-user-edit', 'rgba(129,140,248,.15)', '#818cf8', `Profile updated for: ${userData.name}`, 'info');
      } catch (e) {}
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update user' };
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      try {
        const { pushNotif } = await import('../../utils/db');
        pushNotif('fa-trash-alt', 'rgba(248,113,113,.15)', '#f87171', `Identity purged`, 'warning');
      } catch (e) {}
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete user' };
    }
  },

  toggleUserStatus: async (userId) => {
    try {
      const response = await api.put(`/users/${userId}/status`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update status' };
    }
  },

  getMe: async () => {
    try {
      const response = await api.get('/users/profile/me');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch profile' };
    }
  },

  updateMe: async (userData) => {
    try {
      const response = await api.put('/users/profile/me', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update profile' };
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/users/profile/change-password', passwordData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to change password' };
    }
  }
};

export default userService;
