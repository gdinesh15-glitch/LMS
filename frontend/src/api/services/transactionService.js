import api from '../axios';

const transactionService = {
  issueBook: async (data) => {
    try {
      const response = await api.post('/transactions/issue', data);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to issue book' };
    }
  },

  returnBook: async (data) => {
    try {
      const response = await api.post('/transactions/return', data);
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to return book' };
    }
  },

  getUserTransactions: async (userId) => {
    try {
      const response = await api.get(`/transactions/user/${userId}`);
      return response.data;
    } catch (error) {
      return { success: false, error: 'Failed to fetch transaction history' };
    }
  }
};

export default transactionService;
