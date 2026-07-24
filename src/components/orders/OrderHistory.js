import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderHistory = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const isAdmin = user && (user.role === 'ADMIN' || user.role === 'PHARMACIST');

    useEffect(() => {
        loadOrders();
    }, [user]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError('');

            console.log('Fetching orders...'); // ✅ Debug log

            let response;
            if (isAdmin) {
                response = await orderService.getAllOrders();
            } else {
                response = await orderService.getOrderHistory();
            }

            console.log('Orders response:', response); // ✅ Debug log

            if (response.success) {
                let data = response.data || [];
                
                // Extra frontend safety for patients
                if (!isAdmin && user?.username) {
                    const hasUserIdentifier = data.some(o => o.username || o.customerUsername || o.user?.username);
                    if (hasUserIdentifier) {
                        data = data.filter(o => 
                            o.username === user.username || 
                            o.customerUsername === user.username ||
                            o.user?.username === user.username
                        );
                    }
                }
                
                setOrders(data);
            } else {
                setError(response.message || 'Failed to load orders');
            }
        } catch (err) {
            console.error('Error loading orders:', err); // ✅ Debug log
            setError(err.response?.data?.message || 'Failed to load order history');
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

    const filteredOrders = orders.filter(order => {
        let match = true;
        if (searchTerm) {
            match = match && order.orderUuid?.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (filterStatus) {
            match = match && order.status === filterStatus;
        }
        return match;
    });

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container py-5">
                <div className="row mb-4">
                    <div className="col-12 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <h2 className="text-primary fw-bold mb-1">Order History</h2>
                            <p className="text-muted mb-0">Track and manage your medicine orders.</p>
                        </div>
                        <Link to="/orders/new" className="btn btn-primary rounded-pill px-4 py-2 shadow-sm">
                            <span className="me-2">+</span>Place New Order
                        </Link>
                    </div>
                </div>

                <div className="card border-0 shadow-sm p-4 mb-4">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small fw-bold text-muted text-uppercase">Search</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Order Reference ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-muted text-uppercase">Status</label>
                            <select
                                className="form-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="PENDING">Pending</option>
                                <option value="PAID">Paid</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                            </select>
                        </div>
                        <div className="col-md-3 d-flex align-items-end">
                            <button
                                className="btn btn-light w-100 py-2 border rounded-3"
                                onClick={() => {
                                    setSearchTerm('');
                                    setFilterStatus('');
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger border-0 rounded-3 mb-4" role="alert">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {!loading && filteredOrders.length === 0 && !error ? (
                    <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                        <div className="mb-3" style={{ fontSize: '3rem' }}>📦</div>
                        <h4 className="fw-bold">No orders found</h4>
                        <p className="text-muted mb-4">You haven't placed any orders matching your filters.</p>
                        <Link to="/orders/new" className="btn btn-primary rounded-pill px-4">
                            Place Your First Order
                        </Link>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <div className="card border-0 shadow-sm overflow-hidden">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="px-4 py-3 text-muted small fw-bold text-uppercase">Reference</th>
                                        <th className="py-3 text-muted small fw-bold text-uppercase">Date</th>
                                        <th className="py-3 text-muted small fw-bold text-uppercase">Total</th>
                                        <th className="py-3 text-muted small fw-bold text-uppercase">Status</th>
                                        <th className="py-3 text-muted small fw-bold text-uppercase d-none d-md-table-cell">Pickup Location</th>
                                        <th className="px-4 py-3 text-end text-muted small fw-bold text-uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className="px-4 py-3">
                                                <code className="text-primary fw-bold">{order.orderUuid?.substring(0, 8) || 'N/A'}</code>
                                            </td>
                                            <td className="py-3 small text-muted">
                                                {new Date(order.orderDate).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 fw-bold text-primary">
                                                R{order.totalAmount?.toFixed(2)}
                                            </td>
                                            <td className="py-3">
                                                <span className={`badge rounded-pill px-3 py-2 bg-opacity-10 text-${getStatusColor(order.status)} bg-${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-3 small d-none d-md-table-cell text-muted">
                                                {order.clinicPickupLocation}
                                            </td>
                                            <td className="px-4 py-3 text-end">
                                                <Link
                                                    to={`/orders/${order.id}`}
                                                    className="btn btn-sm btn-outline-primary rounded-pill px-3"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
};

export default OrderHistory;