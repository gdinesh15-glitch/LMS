import api from '../axios';

const activityLogService = {
  getLogs: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/activity-logs?${query}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch logs' };
    }
  },

  clearLogs: async () => {
    try {
      const response = await api.delete('/activity-logs');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to clear logs' };
    }
  },

  deleteLog: async (id) => {
    try {
      const response = await api.delete(`/activity-logs/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete log' };
    }
  }
};

export default activityLogService;
