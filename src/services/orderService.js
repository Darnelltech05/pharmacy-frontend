import api from './api';

const BASE_URL = '/orders';

export const orderService = {
    // ✅ Get all orders
    getAllOrders: async () => {
        try {
            const response = await api.get(BASE_URL);
            console.log('getAllOrders response:', response); // ✅ Debug
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    // ✅ Get order by ID
    getOrderById: async (id) => {
        try {
            const response = await api.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching order:', error);
            throw error;
        }
    },

    // ✅ Create new order
    createOrder: async (orderData) => {
        try {
            const response = await api.post(BASE_URL, orderData);
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    // ✅ Update order status
    updateOrderStatus: async (id, status) => {
        try {
            const response = await api.patch(`${BASE_URL}/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    },

    // ✅ Get order history (current user)
    getOrderHistory: async () => {
        try {
            const response = await api.get(`${BASE_URL}/history`);
            return response.data;
        } catch (error) {
            console.error('Error fetching order history:', error);
            throw error;
        }
    }
};

export default orderService;