import React, { useState } from 'react';
import paymentService from '../../services/paymentService';

const PaymentForm = ({ onPaymentCreated }) => {

    const [formData, setFormData] = useState({
        orderId: '',
        paymentMethod: 'CARD'
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

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

            const response = await paymentService.createPayment({
                orderId: Number(formData.orderId),
                paymentMethod: formData.paymentMethod
            });

            setMessage(response.message);

            setFormData({
                orderId: '',
                paymentMethod: 'CARD'
            });

            if (onPaymentCreated) {
                onPaymentCreated();
            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to create payment."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="card shadow mb-4">

            <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Create Payment</h4>
            </div>

            <div className="card-body">

                {message && (
                    <div className="alert alert-success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">

                        <label className="form-label">
                            Order ID
                        </label>

                        <input
                            type="number"
                            className="form-control"
                            name="orderId"
                            value={formData.orderId}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Payment Method
                        </label>

                        <select
                            className="form-select"
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                        >
                            <option value="CARD">CARD</option>
                            <option value="EFT">EFT</option>
                            <option value="CASH">CASH</option>
                            <option value="MEDICAL_AID">MEDICAL_AID</option>
                        </select>

                    </div>

                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={loading}
                    >
                        {loading ? "Creating Payment..." : "Create Payment"}
                    </button>

                </form>

            </div>

        </div>

    );

};

export default PaymentForm;
