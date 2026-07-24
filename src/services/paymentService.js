import api from './api';

const paymentService = {
    // ✅ Process payment - POST
    createPayment: async (paymentData) => {
        console.log("Creating payment...", paymentData);
        const response = await api.post('/payments', paymentData);
        console.log("Payment response:", response);
        return response.data;
    },

    // ✅ Get payment by order ID - GET
    getPaymentByOrderId: async (orderId) => {
        console.log("Getting payment for order:", orderId);
        const response = await api.get(`/payments/${orderId}`);
        return response.data;
    },

    // ✅ Get all payments - GET
    getAllPayments: async () => {
        console.log("Getting all payments...");
        const response = await api.get('/payments');
        console.log("Payments response:", response);
        return response.data;
    },

    // ✅ Update payment status - PUT
    updatePaymentStatus: async (id, status) => {
        console.log("Updating payment status:", id, status);
        const response = await api.put(`/payments/${id}/status?status=${status}`);
        return response.data;
    },

    // ✅ Delete payment - DELETE
    deletePayment: async (id) => {
        console.log("Deleting payment:", id);
        const response = await api.delete(`/payments/${id}`);
        return response.data;
    }
};

export default paymentService;