import api from './api';

const paymentService = {

    createPayment: async (paymentData) => {

        console.log("Creating payment...");

        const response = await api.post('/payments', paymentData);

        console.log(response);

        return response.data;
    },

    getAllPayments: async () => {

        console.log("getAllPayments called");

        const response = await api.get('/payments');

        console.log("API Response:", response);

        return response.data;
    },

    getPaymentById: async (id) => {

        const response = await api.get(`/payments/${id}`);

        return response.data;
    },

    getPaymentByOrderId: async (orderId) => {

        const response = await api.get(`/payments/order/${orderId}`);

        return response.data;
    },

    updatePaymentStatus: async (id, status) => {

        const response = await api.put(`/payments/${id}/status?status=${status}`);

        return response.data;
    },

    deletePayment: async (id) => {

        const response = await api.delete(`/payments/${id}`);

        return response.data;
    }

};

export default paymentService;