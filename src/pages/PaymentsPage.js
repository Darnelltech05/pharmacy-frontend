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

        <>
            <Navbar />

            <div className="container mt-4">

                <div className="row">

                    <div className="col-12">

                        <h2 className="mb-4">
                            Payment Management
                        </h2>

                    </div>

                </div>

                <div className="row">

                    <div className="col-lg-4">

                        <PaymentForm
                            onPaymentCreated={handlePaymentCreated}
                        />

                    </div>

                    <div className="col-lg-8">

                        <PaymentList
                            refresh={refresh}
                        />

                    </div>

                </div>

            </div>

        </>

    );

};

export default PaymentsPage;