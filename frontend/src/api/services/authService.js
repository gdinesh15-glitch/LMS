import api from '../axios';

const authService = {
  login: async (userId, password, role) => {
    try {
      const response = await api.post('/auth/login', { userId, password, role });
      const data = response.data;

      // Backend returns { success: true, token, user } on success
      if (data && data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('session', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }

      return { success: false, error: 'Login failed. Invalid server response.' };
    } catch (error) {
      let msg = 'Login failed. Check your credentials or backend connection.';
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        msg = 'Server is waking up (Render cold start). Please wait 30 seconds and try again.';
      } else if (!error.response) {
        msg = 'Cannot reach server. Check your VITE_API_URL environment variable on Render.';
      } else {
        msg = error.response?.data?.message || msg;
      }
      return { success: false, error: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('session');
    window.location.href = '/login';
  }
};

export default authService;
