import React, { useEffect, useState } from 'react';
import paymentService from '../../services/paymentService';
import 'bootstrap/dist/css/bootstrap.min.css';

const PaymentList = ({ refresh }) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadPayments = async () => {
        try {
            setLoading(true);
            setError('');

            console.log("Loading payments...");
            const response = await paymentService.getAllPayments();
            console.log("Response:", response);

            if (response.success) {
                // Check if data is an array
                if (Array.isArray(response.data)) {
                    setPayments(response.data);
                } else {
                    setPayments([]);
                }
            } else {
                setError(response.message || 'Failed to load payments');
            }
        } catch (err) {
            console.error('Error loading payments:', err);
            setError(err.response?.data?.message || 'Failed to load payments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPayments();
    }, [refresh]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this payment?");
        if (!confirmed) return;

        try {
            const response = await paymentService.deletePayment(id);
            alert(response.message || 'Payment deleted successfully');
            loadPayments();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete payment.");
        }
    };

    const handleUpdate = async (payment) => {
        const status = window.prompt(
            "Enter new status:\n\nPENDING\nSUCCESSFUL\nFAILED\nREFUNDED",
            payment.status
        );

        if (!status) return;

        try {
            const response = await paymentService.updatePaymentStatus(payment.id, status.toUpperCase());
            alert(response.message || 'Payment updated successfully');
            loadPayments();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update payment.");
        }
    };

    if (loading) {
        return (
            <div className="alert alert-info text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading payments...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger">
                {error}
                <button className="btn btn-sm btn-outline-danger ms-3" onClick={loadPayments}>
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0 fw-bold text-primary">Payment Records</h5>
            </div>
            <div className="card-body p-0">
                {payments.length === 0 ? (
                    <div className="p-5 text-center text-muted">
                        No payments found.
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light text-muted small fw-bold text-uppercase">
                            <tr>
                                <th className="px-4 py-3">Reference</th>
                                <th className="py-3">Order ID</th>
                                <th className="py-3">Amount</th>
                                <th className="py-3">Method</th>
                                <th className="py-3 text-center">Status</th>
                                <th className="py-3">Date</th>
                                <th className="px-4 py-3 text-end">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-4 py-3">
                                        <code className="text-primary fw-bold">{payment.paymentUuid?.substring(0, 8) || 'N/A'}</code>
                                    </td>
                                    <td className="py-3">#{payment.orderId}</td>
                                    <td className="py-3 fw-bold">R{payment.amount?.toFixed(2)}</td>
                                    <td className="py-3 small">{payment.paymentMethod}</td>
                                    <td className="py-3 text-center">
                                            <span className={`badge rounded-pill px-3 py-2 bg-opacity-10 text-${getStatusColor(payment.status)} bg-${getStatusColor(payment.status)}`}>
                                                {payment.status}
                                            </span>
                                    </td>
                                    <td className="py-3 text-muted small">
                                        {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-end">
                                        <div className="d-flex gap-2 justify-content-end">
                                            <button
                                                className="btn btn-sm btn-outline-warning rounded-pill px-3"
                                                onClick={() => handleUpdate(payment)}
                                            >
                                                Status
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                                onClick={() => handleDelete(payment.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper function for status colors
const getStatusColor = (status) => {
    const colors = {
        'PENDING': 'warning',
        'COMPLETED': 'success',
        'FAILED': 'danger',
        'REFUNDED': 'secondary'
    };
    return colors[status] || 'secondary';
};

export default PaymentList;