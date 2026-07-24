import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import paymentService from '../../services/paymentService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../common/Navbar';

const Checkout = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { success: notifySuccess, error: notifyError } = useNotification();
    
    const [order, setOrder] = useState(null);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('CARD');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await orderService.getOrderById(orderId);
                const orderData = data.data || data;
                
                // Security check: Only the owner can checkout
                if (user?.username) {
                    const orderUser = orderData.username || orderData.customerUsername || orderData.user?.username;
                    if (orderUser && orderUser !== user.username) {
                        notifyError('You are not authorized to checkout this order');
                        navigate('/dashboard');
                        return;
                    }
                }
                
                setOrder(orderData);
                
                // The backend is the single source of truth for the order total.
                // We use totalAmount or totalPrice from the order object.
                const backendTotal = Number(orderData.totalAmount || orderData.totalPrice || 0);
                
                if (backendTotal > 0) {
                    setTotal(backendTotal);
                } else if (orderData.items && orderData.items.length > 0) {
                    // Fallback to calculation ONLY if backend total is missing
                    const calculatedTotal = orderData.items.reduce((acc, item) => {
                        const price = Number(item.price || item.priceAtTime || item.medicine?.unitPrice || 0);
                        const quantity = Number(item.quantity || 0);
                        return acc + (price * quantity);
                    }, 0);
                    setTotal(calculatedTotal);
                } else {
                    setTotal(0);
                }
            } catch (err) {
                notifyError('Failed to load order details');
                navigate('/orders');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId, navigate, notifyError]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const paymentData = {
                orderId: Number(orderId),
                paymentMethod: paymentMethod,
                amount: total
            };

            const response = await paymentService.createPayment(paymentData);

            if (response.success) {
                notifySuccess('Payment processed successfully!');
                navigate('/payment-confirmation', { state: { payment: response.data || response, order } });
            } else {
                notifyError(response.message || 'Payment failed');
            }
        } catch (err) {
            notifyError(err.response?.data?.message || 'An error occurred during payment');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container mt-5 text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </>
        );
    }

    if (!order) return null;

    return (
        <>
            <Navbar />
            <div className="container py-5">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <h4 className="fw-bold mb-4">Review Your Order</h4>
                                
                                <div className="table-responsive">
                                    <table className="table table-borderless align-middle">
                                        <thead className="text-muted small text-uppercase">
                                            <tr>
                                                <th>Product</th>
                                                <th className="text-center">Quantity</th>
                                                <th className="text-end">Price</th>
                                                <th className="text-end">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items && order.items.map((item, index) => {
                                                const itemPrice = Number(item.price || item.priceAtTime || item.medicine?.unitPrice || 0);
                                                const itemTotal = item.subtotal || item.totalPrice || (itemPrice * (item.quantity || 0));
                                                
                                                return (
                                                    <tr key={index} className="border-bottom">
                                                        <td className="py-3">
                                                            <div className="fw-bold">{item.medicineName || (item.medicine?.name) || `Medicine #${item.medicineId}`}</div>
                                                            <div className="text-muted small">Pharmaceutical Care</div>
                                                        </td>
                                                        <td className="text-center">{item.quantity}</td>
                                                        <td className="text-end">R {itemPrice.toFixed(2)}</td>
                                                        <td className="text-end fw-bold">R {Number(itemTotal).toFixed(2)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-4 p-3 bg-light rounded-3">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6 className="fw-bold text-muted text-uppercase small mb-2">Shipping Address</h6>
                                            <p className="mb-0">{order.shippingAddress || 'Pharmacy Pickup'}</p>
                                        </div>
                                        <div className="col-md-6 text-md-end mt-3 mt-md-0">
                                            <h6 className="fw-bold text-muted text-uppercase small mb-2">Order ID</h6>
                                            <p className="mb-0">#{order.id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '2rem' }}>
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4">Order Summary</h5>
                                
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Subtotal</span>
                                    <span>R {total.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Shipping</span>
                                    <span className="text-success">Free</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-4">
                                    <span className="fw-bold">Total</span>
                                    <span className="fw-bold h4 text-primary mb-0">R {total.toFixed(2)}</span>
                                </div>

                                <form onSubmit={handlePayment}>
                                    <h6 className="fw-bold mb-3">Payment Method</h6>
                                    <div className="mb-4">
                                        <div className={`form-check p-3 border rounded-3 mb-2 ${paymentMethod === 'CARD' ? 'border-primary bg-primary-light' : ''}`}>
                                            <input 
                                                className="form-check-input ms-0 me-3" 
                                                type="radio" 
                                                name="paymentMethod" 
                                                id="methodCard" 
                                                value="CARD" 
                                                checked={paymentMethod === 'CARD'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <label className="form-check-input-label fw-semibold" htmlFor="methodCard">
                                                Credit / Debit Card
                                            </label>
                                        </div>
                                        <div className={`form-check p-3 border rounded-3 mb-2 ${paymentMethod === 'EFT' ? 'border-primary bg-primary-light' : ''}`}>
                                            <input 
                                                className="form-check-input ms-0 me-3" 
                                                type="radio" 
                                                name="paymentMethod" 
                                                id="methodEFT" 
                                                value="EFT" 
                                                checked={paymentMethod === 'EFT'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <label className="form-check-input-label fw-semibold" htmlFor="methodEFT">
                                                EFT Transfer
                                            </label>
                                        </div>
                                        <div className={`form-check p-3 border rounded-3 mb-2 ${paymentMethod === 'MEDICAL_AID' ? 'border-primary bg-primary-light' : ''}`}>
                                            <input 
                                                className="form-check-input ms-0 me-3" 
                                                type="radio" 
                                                name="paymentMethod" 
                                                id="methodMedAid" 
                                                value="MEDICAL_AID" 
                                                checked={paymentMethod === 'MEDICAL_AID'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <label className="form-check-input-label fw-semibold" htmlFor="methodMedAid">
                                                Medical Aid
                                            </label>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            `Pay R ${total.toFixed(2)}`
                                        )}
                                    </button>
                                </form>
                                
                                <p className="text-center text-muted small mt-4 mb-0">
                                    <i className="bi bi-shield-lock-fill me-1"></i>
                                    Secure SSL Encrypted Payment
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;
