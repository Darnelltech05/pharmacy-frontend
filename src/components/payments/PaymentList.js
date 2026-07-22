import React, { useEffect, useState } from 'react';
import paymentService from '../../services/paymentService';

const PaymentList = ({ refresh }) => {

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadPayments = async () => {

        try {

            setLoading(true);

            const response = await paymentService.getAllPayments();

            if (response.success) {
                setPayments(response.data);
            } else {
                setError(response.message);
            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                'Failed to load payments.'
            );

        } finally {

            setLoading(false);

        }

    };

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this payment?"
        );

        if (!confirmed) {
            return;
        }

        try {

            const response = await paymentService.deletePayment(id);

            alert(response.message);

            loadPayments();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to delete payment."
            );

        }

    };

    const handleUpdate = async (payment) => {

        const status = window.prompt(
            "Enter new status:\n\nPENDING\nSUCCESSFUL\nFAILED\nREFUNDED",
            payment.paymentStatus
        );

        if (!status) {
            return;
        }

        try {

            const response = await paymentService.updatePaymentStatus(
                payment.id,
                status.toUpperCase()
            );

            alert(response.message);

            loadPayments();

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to update payment."
            );

        }

    };

    useEffect(() => {

        loadPayments();

    }, [refresh]);

    if (loading) {
        return (
            <div className="alert alert-info">
                Loading payments...
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger">
                {error}
            </div>
        );
    }

    return (

        <div className="card shadow">

            <div className="card-header bg-dark text-white">
                <h4 className="mb-0">Payments</h4>
            </div>

            <div className="card-body">

                {payments.length === 0 ? (

                    <div className="alert alert-warning">
                        No payments found.
                    </div>

                ) : (

                    <table className="table table-striped table-hover">

                        <thead>

                        <tr>
                            <th>ID</th>
                            <th>Reference</th>
                            <th>Order ID</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>

                        </thead>

                        <tbody>

                        {payments.map((payment) => (

                            <tr key={payment.id}>

                                <td>{payment.id}</td>

                                <td>{payment.paymentReference}</td>

                                <td>{payment.orderId}</td>

                                <td>R {payment.amount}</td>

                                <td>{payment.paymentMethod}</td>

                                <td>{payment.paymentStatus}</td>

                                <td>
                                    {new Date(payment.paymentDate).toLocaleString()}
                                </td>

                                <td>

                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleUpdate(payment)}
                                    >
                                        Update
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(payment.id)}
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>

    );

};

export default PaymentList;