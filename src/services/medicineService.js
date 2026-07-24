import api from './api';

const BASE_URL = '/medicines';

// ✅ Use named exports instead of default
export const medicineService = {
    // ✅ Get all medicines (paginated)
    getAll: async () => {
        try {
            const response = await api.get(`${BASE_URL}?page=0&size=100`);
            // Handle different response formats
            if (response.data.success) {
                // If data has content (paginated response)
                if (response.data.data && response.data.data.content) {
                    return response.data.data.content;
                }
                // If data is an array directly
                if (Array.isArray(response.data.data)) {
                    return response.data.data;
                }
            }
            // Fallback: if no wrapper, return as is
            if (Array.isArray(response.data)) {
                return response.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching medicines:', error);
            throw error;
        }
    },

    // ✅ Get medicine by ID
    getById: async (id) => {
        try {
            const response = await api.get(`${BASE_URL}/${id}`);
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error fetching medicine:', error);
            throw error;
        }
    },

    // ✅ Search medicines
    search: async ({ name, category }) => {
        try {
            const params = {};
            if (name) params.name = name;
            if (category) params.category = category;
            const response = await api.get(`${BASE_URL}/search`, { params });
            return response.data.data || response.data || [];
        } catch (error) {
            console.error('Error searching medicines:', error);
            throw error;
        }
    },

    // ✅ Create medicine (PHARMACIST only)
    create: async (medicine) => {
        try {
            const response = await api.post(BASE_URL, medicine);
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error creating medicine:', error);
            throw error;
        }
    },

    // ✅ Update medicine (PHARMACIST only)
    update: async (id, medicine) => {
        try {
            const response = await api.put(`${BASE_URL}/${id}`, medicine);
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error updating medicine:', error);
            throw error;
        }
    },

    // ✅ Delete medicine (ADMIN only)
    remove: async (id) => {
        try {
            await api.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            console.error('Error deleting medicine:', error);
            throw error;
        }
    },

    // ✅ Increase stock
    increaseStock: async (id, quantity) => {
        try {
            const response = await api.patch(`${BASE_URL}/${id}/stock/increase`, { quantity });
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error increasing stock:', error);
            throw error;
        }
    },

    // ✅ Decrease stock
    decreaseStock: async (id, quantity) => {
        try {
            const response = await api.patch(`${BASE_URL}/${id}/stock/decrease`, { quantity });
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error decreasing stock:', error);
            throw error;
        }
    },

    // ✅ Set stock
    setStock: async (id, stockQuantity) => {
        try {
            const response = await api.patch(`${BASE_URL}/${id}/stock`, { stockQuantity });
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error setting stock:', error);
            throw error;
        }
    },

    // ✅ Get low stock medicines
    getLowStock: async (threshold = 10) => {
        try {
            const response = await api.get(`${BASE_URL}/low-stock?threshold=${threshold}`);
            return response.data.data || response.data || [];
        } catch (error) {
            console.error('Error fetching low stock medicines:', error);
            throw error;
        }
    }
};

// ✅ Also export as default for backward compatibility
export default medicineService;