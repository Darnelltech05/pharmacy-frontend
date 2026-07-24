import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {
        try {
            setLoading(true);
            const response = await orderService.getOrderById(id);
            if (response.success) {
                const orderData = response.data;
                
                // Security: Patients can only view their own orders
                if (!canUpdateStatus && user?.username) {
                    const orderUser = orderData.username || orderData.customerUsername || orderData.user?.username;
                    if (orderUser && orderUser !== user.username) {
                        setError('You are not authorized to view this order');
                        return;
                    }
                }
                
                setOrder(orderData);
                setNewStatus(orderData.status);
            }
        } catch (err) {
            setError('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'PENDING': 'warning',
            'PAID': 'info',
            'PROCESSING': 'primary',
            'SHIPPED': 'success',
            'DELIVERED': 'success'
        };
        return colors[status] || 'secondary';
    };

    // ✅ Handle status update (PHARMACIST/ADMIN only)
    const handleStatusUpdate = async () => {
        if (!newStatus || newStatus === order.status) {
            return;
        }

        try {
            setUpdating(true);
            const response = await orderService.updateOrderStatus(id, newStatus);
            if (response.success) {
                setOrder({ ...order, status: newStatus });
                alert('Order status updated successfully!');
            }
        } catch (err) {
            alert('Failed to update order status');
        } finally {
            setUpdating(false);
        }
    };

    // ✅ Check if user is PHARMACIST or ADMIN
    const canUpdateStatus = user?.role === 'PHARMACIST' || user?.role === 'ADMIN';

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">{error || 'Order not found'}</div>
                <Link to="/orders" className="btn btn-secondary">Back to Orders</Link>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h2 className="text-primary fw-bold mb-1">Order Details</h2>
                                <p className="text-muted mb-0">Order Reference: <code className="fw-bold">{order.orderUuid}</code></p>
                            </div>
                            <Link to="/orders" className="btn btn-light border rounded-pill px-4">
                                &larr; Back to History
                            </Link>
                        </div>

                        <div className="row g-4">
                            <div className="col-md-8">
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-header bg-white border-bottom py-3">
                                        <h5 className="mb-0 fw-bold text-primary">Order Items</h5>
                                    </div>
                                    <div className="card-body p-0">
                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle mb-0">
                                                <thead className="bg-light text-muted small fw-bold text-uppercase">
                                                    <tr>
                                                        <th className="px-4 py-3">Medicine</th>
                                                        <th className="py-3 text-center">Qty</th>
                                                        <th className="py-3 text-end">Price</th>
                                                        <th className="px-4 py-3 text-end">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.items?.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="px-4 py-3 fw-semibold">{item.medicineName || `Medicine ID: ${item.medicineId}`}</td>
                                                            <td className="py-3 text-center">{item.quantity}</td>
                                                            <td className="py-3 text-end text-muted small">R{item.priceAtTime?.toFixed(2) || '0.00'}</td>
                                                            <td className="px-4 py-3 text-end fw-bold">R{(item.subtotal || 0).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-light">
                                                    <tr>
                                                        <td colSpan="3" className="px-4 py-3 text-end fw-bold">Total Amount:</td>
                                                        <td className="px-4 py-3 text-end fw-bold text-primary fs-5">R{order.totalAmount?.toFixed(2)}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div className="card border-0 shadow-sm">
                                    <div className="card-header bg-white border-bottom py-3">
                                        <h5 className="mb-0 fw-bold text-primary">Additional Information</h5>
                                    </div>
                                    <div className="card-body p-4">
                                        <div className="row g-4">
                                            <div className="col-md-6">
                                                <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>Shipping Address</small>
                                                <p className="mb-0 fw-medium text-muted">{order.shippingAddress || 'N/A'}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>Pickup Location</small>
                                                <p className="mb-0 fw-medium text-muted">{order.clinicPickupLocation || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-body p-4 text-center">
                                        <small className="text-muted d-block text-uppercase fw-bold mb-2" style={{ fontSize: '0.7rem' }}>Order Status</small>
                                        <span className={`badge rounded-pill px-4 py-3 bg-opacity-10 text-${getStatusColor(order.status)} bg-${getStatusColor(order.status)} fs-6`}>
                                            {order.status}
                                        </span>
                                        <hr className="my-4" />
                                        <div className="text-start mb-3">
                                            <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>Order Date</small>
                                            <p className="mb-0 fw-medium small text-muted">{new Date(order.orderDate).toLocaleString()}</p>
                                        </div>
                                        <div className="text-start">
                                            <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.7rem' }}>Last Update</small>
                                            <p className="mb-0 fw-medium small text-muted">{order.updatedAt ? new Date(order.updatedAt).toLocaleString() : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {order.status === 'PENDING' && (
                                    <div className="card border-0 shadow-sm mb-4 bg-primary text-white">
                                        <div className="card-body p-4">
                                            <h5 className="fw-bold mb-2">Payment Required</h5>
                                            <p className="small mb-4 opacity-75">This order is currently pending payment. Complete your payment to process the order.</p>
                                            <Link to={`/checkout/${order.id}`} className="btn btn-white w-100 rounded-pill fw-bold text-primary shadow-sm">
                                                Proceed to Checkout
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {canUpdateStatus && (
                                    <div className="card border-0 shadow-sm bg-primary-light">
                                        <div className="card-body p-4">
                                            <h6 className="fw-bold text-primary mb-3">Update Order Status</h6>
                                            <div className="mb-3">
                                                <select
                                                    className="form-select border-0 shadow-none"
                                                    value={newStatus}
                                                    onChange={(e) => setNewStatus(e.target.value)}
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="PAID">Paid</option>
                                                    <option value="PROCESSING">Processing</option>
                                                    <option value="SHIPPED">Shipped</option>
                                                    <option value="DELIVERED">Delivered</option>
                                                </select>
                                            </div>
                                            <button
                                                className="btn btn-primary w-100 rounded-pill shadow-sm fw-bold"
                                                onClick={handleStatusUpdate}
                                                disabled={updating || newStatus === order.status}
                                            >
                                                {updating ? 'Updating...' : 'Save Status'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetails;