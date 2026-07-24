import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import PaymentForm from '../components/payments/PaymentForm';
import PaymentList from '../components/payments/PaymentList';

const PaymentsPage = () => {
    const [refresh, setRefresh] = useState(false);

    const handlePaymentCreated = () => {
        setRefresh(!refresh);
    };

    return (
        <div className="bg-light min-vh-100">
            <Navbar />
            <div className="container py-5">
                <div className="row mb-4">
                    <div className="col-12">
                        <h2 className="text-primary fw-bold">Payment Management</h2>
                        <p className="text-muted">Process and track customer payments.</p>
                    </div>
                </div>
                <div className="row g-4">
                    <div className="col-lg-4">
                        <PaymentForm onPaymentCreated={handlePaymentCreated} />
                    </div>
                    <div className="col-lg-8">
                        <PaymentList refresh={refresh} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentsPage;