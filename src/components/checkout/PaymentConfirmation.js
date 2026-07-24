import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../common/Navbar';

const PaymentConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { payment, order } = location.state || {};

    if (!payment || !order) {
        return (
            <>
                <Navbar />
                <div className="container py-5 text-center">
                    <div className="card border-0 shadow-sm p-5 rounded-4 d-inline-block">
                        <div className="mb-4">
                            <i className="bi bi-exclamation-triangle-fill text-warning display-1"></i>
                        </div>
                        <h3>Session Expired</h3>
                        <p className="text-muted">We couldn't find your payment details. Please check your order history.</p>
                        <Link to="/orders" className="btn btn-primary px-4 py-2 rounded-pill fw-bold">Go to Orders</Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card border-0 shadow rounded-4 overflow-hidden fade-in">
                            <div className="bg-success py-5 text-center text-white">
                                <div className="mb-3">
                                    <i className="bi bi-check-circle-fill display-1"></i>
                                </div>
                                <h2 className="fw-bold">Payment Successful!</h2>
                                <p className="mb-0 opacity-75">Thank you for your purchase.</p>
                            </div>
                            
                            <div className="card-body p-4 p-md-5">
                                <div className="text-center mb-5">
                                    <h5 className="text-muted text-uppercase small fw-bold mb-1">Amount Paid</h5>
                                    <h2 className="fw-bold text-primary">R {Number(payment.amount || order.totalAmount || order.totalPrice).toFixed(2)}</h2>
                                </div>

                                <div className="row g-4 mb-5">
                                    <div className="col-6">
                                        <div className="small text-muted text-uppercase fw-bold mb-1">Order ID</div>
                                        <div className="fw-bold">#{order.id}</div>
                                    </div>
                                    <div className="col-6 text-end">
                                        <div className="small text-muted text-uppercase fw-bold mb-1">Payment Method</div>
                                        <div className="fw-bold text-capitalize">{payment.paymentMethod?.toLowerCase() || 'Card'}</div>
                                    </div>
                                    <div className="col-6">
                                        <div className="small text-muted text-uppercase fw-bold mb-1">Date</div>
                                        <div className="fw-bold">{new Date().toLocaleDateString()}</div>
                                    </div>
                                    <div className="col-6 text-end">
                                        <div className="small text-muted text-uppercase fw-bold mb-1">Status</div>
                                        <div className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">COMPLETED</div>
                                    </div>
                                </div>

                                <div className="bg-light p-4 rounded-4 mb-5">
                                    <h6 className="fw-bold mb-3">Order Details</h6>
                                    {order.items && order.items.map((item, index) => {
                                        const itemPrice = Number(item.price || item.priceAtTime || item.medicine?.unitPrice || 0);
                                        const itemTotal = item.totalPrice || item.subtotal || (itemPrice * (item.quantity || 0));
                                        return (
                                            <div key={index} className="d-flex justify-content-between mb-2 small">
                                                <span>{item.quantity}x {item.medicineName || (item.medicine?.name) || `Medicine #${item.medicineId}`}</span>
                                                <span className="fw-semibold">R {Number(itemTotal).toFixed(2)}</span>
                                            </div>
                                        );
                                    })}
                                    <hr />
                                    <div className="d-flex justify-content-between fw-bold">
                                        <span>Total</span>
                                        <span>R {Number(payment.amount || order.totalAmount || order.totalPrice).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="d-grid gap-3">
                                    <button 
                                        onClick={() => navigate('/orders')} 
                                        className="btn btn-primary py-3 rounded-pill fw-bold shadow-sm"
                                    >
                                        View Order History
                                    </button>
                                    <button 
                                        onClick={() => window.print()} 
                                        className="btn btn-outline-secondary py-3 rounded-pill fw-bold border-2"
                                    >
                                        <i className="bi bi-printer me-2"></i>
                                        Print Receipt
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-center mt-4">
                            <p className="text-muted small">
                                A confirmation email has been sent to your registered address.<br />
                                Having trouble? <Link to="/support" className="text-primary text-decoration-none fw-bold">Contact Support</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PaymentConfirmation;
