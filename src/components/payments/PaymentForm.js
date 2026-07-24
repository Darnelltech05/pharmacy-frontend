import React, { useState } from 'react';
import paymentService from '../../services/paymentService';
import { useNotification } from '../../context/NotificationContext';

const PaymentForm = ({ onPaymentCreated }) => {
    const [formData, setFormData] = useState({
        orderId: '',
        paymentMethod: 'CARD',
        amount: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { success: notifySuccess, error: notifyError } = useNotification();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            // ✅ Convert amount to number
            const paymentData = {
                orderId: Number(formData.orderId),
                paymentMethod: formData.paymentMethod,
                amount: Number(formData.amount)
            };

            console.log("Sending payment:", paymentData);

            const response = await paymentService.createPayment(paymentData);

            if (response.success) {
                const successMsg = response.message || 'Payment created successfully!';
                setMessage(successMsg);
                notifySuccess(successMsg);
                setFormData({
                    orderId: '',
                    paymentMethod: 'CARD',
                    amount: ''
                });

                if (onPaymentCreated) {
                    onPaymentCreated();
                }
            } else {
                const errMsg = response.message || 'Failed to create payment';
                setError(errMsg);
                notifyError(errMsg);
            }
        } catch (err) {
            console.error('Payment error:', err);
            const errMsg = err.response?.data?.message || "Failed to create payment. Please try again.";
            setError(errMsg);
            notifyError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card border-0 shadow-sm overflow-hidden fade-in">
            <div className="card-header bg-primary py-3">
                <h5 className="mb-0 fw-bold text-white">Create Payment</h5>
            </div>
            <div className="card-body p-4">
                {message && (
                    <div className="alert alert-success border-0 small mb-4" role="alert">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger border-0 small mb-4" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-muted text-uppercase">Order ID *</label>
                        <input
                            type="number"
                            className="form-control"
                            name="orderId"
                            value={formData.orderId}
                            onChange={handleChange}
                            required
                            placeholder="Enter order ID"
                            min="1"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold text-muted text-uppercase">Amount (R) *</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            placeholder="0.00"
                            min="0.01"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label small fw-bold text-muted text-uppercase">Payment Method *</label>
                        <select
                            className="form-select shadow-none"
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            required
                        >
                            <option value="CARD">Card</option>
                            <option value="EFT">EFT</option>
                            <option value="CASH">Cash</option>
                            <option value="MOBILE">Mobile</option>
                            <option value="MEDICAL_AID">Medical Aid</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 py-3 rounded-pill shadow-sm fw-bold"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Processing...
                            </>
                        ) : (
                            'Create Payment'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;