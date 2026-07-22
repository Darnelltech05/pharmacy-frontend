import React, { useEffect, useState } from 'react';
import paymentService from '../../services/paymentService';

const PaymentList = ({ refresh }) => {

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadPayments = async () => {

        try {

            setLoading(true);

            console.log("========== CALLING BACKEND ==========");

            const response = await paymentService.getAllPayments();

            console.log("SUCCESS RESPONSE:");
            console.log(response);

            if (response.success) {
                setPayments(response.data);
            } else {
                setError(response.message);
            }

        } catch (err) {

            console.log("========== ERROR ==========");
            console.log(err);

            if (err.response) {
                console.log("Status:", err.response.status);
                console.log("Data:", err.response.data);
            } else if (err.request) {
                console.log("Request:", err.request);
            } else {
                console.log("Message:", err.message);
            }

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load payments."
            );

        } finally {

            setLoading(false);

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
                                    >
                                        Update
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
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