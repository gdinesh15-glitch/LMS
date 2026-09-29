import api from '../axios';

const bookService = {
  getAllBooks: async () => {
    try {
      const response = await api.get('/books');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch books' };
    }
  },

  getPopularBooks: async () => {
    try {
      const response = await api.get('/books/popular');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to fetch popular books' };
    }
  },

  addBook: async (bookData) => {
    try {
      const response = await api.post('/books', bookData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to add book' };
    }
  },

  updateBook: async (id, bookData) => {
    try {
      const response = await api.put(`/books/${id}`, bookData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update book' };
    }
  },

  deleteBook: async (id) => {
    try {
      const response = await api.delete(`/books/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete book' };
    }
  }
};

export default bookService;
