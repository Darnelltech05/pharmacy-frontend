import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import medicineService from '../../services/medicineService';
import orderService from '../../services/orderService';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        activeOrders: 0,
        readyForCollection: 0,
        pendingPayments: 0,
        recentOrders: []
    });

    const isAdmin = user && (user.role === 'ADMIN' || user.role === 'PHARMACIST');
    const isPharmacist = user && user.role === 'PHARMACIST';
    const isCustomer = user && user.role === 'CUSTOMER';

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                // Fetch orders to calculate stats
                let orders = [];
                try {
                    if (user?.role === 'ADMIN' || user?.role === 'PHARMACIST') {
                        const response = await orderService.getAllOrders();
                        orders = response.data || response || [];
                    } else {
                        const historyResponse = await orderService.getOrderHistory();
                        orders = historyResponse.data || historyResponse || [];
                        
                        if (Array.isArray(orders) && user?.username) {
                            const hasUserIdentifier = orders.some(o => o.username || o.customerUsername || o.user?.username);
                            if (hasUserIdentifier) {
                                orders = orders.filter(o => 
                                    o.username === user.username || 
                                    o.customerUsername === user.username ||
                                    o.user?.username === user.username
                                );
                            }
                        }
                    }
                } catch (err) {
                    console.error("Failed to fetch orders", err);
                    orders = [];
                }

                if (!Array.isArray(orders)) orders = [];

                // Calculate patient-specific stats
                const active = orders.filter(o => ['PROCESSING', 'PAID'].includes(o.status)).length;
                const ready = orders.filter(o => ['SHIPPED', 'ARRIVED'].includes(o.status)).length;
                const pendingPay = orders.filter(o => o.status === 'PENDING').length;
                
                // Get 5 most recent orders
                const recent = [...orders].sort((a, b) => {
                    return new Date(b.createdAt || b.orderDate) - new Date(a.createdAt || a.orderDate);
                }).slice(0, 5);

                setStats({
                    activeOrders: active,
                    readyForCollection: ready,
                    pendingPayments: pendingPay,
                    recentOrders: recent
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, navigate]);

    const getStatusBadgeClass = (status) => {
        const colors = {
            'PENDING': 'bg-warning-light text-warning',
            'PAID': 'bg-info-light text-info',
            'PROCESSING': 'bg-primary-light text-primary',
            'SHIPPED': 'bg-success-light text-success',
            'DELIVERED': 'bg-success-light text-success',
            'ARRIVED': 'bg-success-light text-success'
        };
        return colors[status] || 'bg-light text-secondary';
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container py-5">
                    <div className="row g-4 mb-5">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="col-md-4">
                                <div className="card border-0 shadow-sm p-4">
                                    <div className="skeleton skeleton-text w-50 mb-3"></div>
                                    <div className="skeleton skeleton-title w-25"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm p-4 h-100">
                                <div className="skeleton skeleton-title mb-4"></div>
                                <div className="skeleton skeleton-card mb-3" style={{ height: '100px' }}></div>
                                <div className="skeleton skeleton-card mb-3" style={{ height: '100px' }}></div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="skeleton skeleton-card h-100"></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="watermark-logo"></div>
            <div className="container py-5 fade-in position-relative" style={{ zIndex: 1 }}>
                <div className="watermark" style={{ fontSize: '12rem', top: '10%', opacity: 0.01 }}>DASHBOARD</div>
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="d-flex align-items-center justify-content-between">
                            <div>
                                <h2 className="mb-1" style={{ color: 'var(--text-main)', fontWeight: '700' }}>
                                    {user?.role === 'ADMIN' ? 'Administrator Dashboard' : 
                                     user?.role === 'PHARMACIST' ? 'Pharmacist Dashboard' : 'Customer Dashboard'}
                                </h2>
                                <p className="text-muted">
                                    {user?.role === 'ADMIN' 
                                        ? `Welcome back, ${user?.fullName || user?.username}. System-wide summary and reports.`
                                        : user?.role === 'PHARMACIST'
                                        ? `Hello, ${user?.fullName || user?.username}. Manage inventory and prescriptions.`
                                        : `Hello, ${user?.fullName || user?.username}. Here's what's happening with your health.`
                                    }
                                </p>
                            </div>
                            <div className="text-end d-none d-md-block">
                                {isAdmin ? (
                                    <button className="btn btn-primary rounded-pill px-4" onClick={() => navigate('/medicines')}>
                                        {isPharmacist ? 'Manage Inventory' : 'Platform Inventory'}
                                    </button>
                                ) : (
                                    <button className="btn btn-primary rounded-pill px-4" onClick={() => navigate('/orders/new')}>
                                        + New Order
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4 mb-5">
                    <div className="col-md-4">
                        <div className="card h-100 border-0 glass-card overflow-hidden" style={{ borderRadius: '1rem' }}>
                            <div className="card-body p-4 d-flex align-items-center">
                                <div className="bg-primary-light p-3 rounded-circle me-3 text-primary" style={{ boxShadow: 'var(--shadow-inner)' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                                </div>
                                <div>
                                    <h6 className="text-muted mb-1 small fw-bold">
                                        {user?.role === 'ADMIN' ? 'Total Active Orders' : 
                                         user?.role === 'PHARMACIST' ? 'Active Customer Orders' : 'My Active Orders'}
                                    </h6>
                                    <h3 className="mb-0 fw-bold">{stats.activeOrders}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 glass-card overflow-hidden" style={{ borderRadius: '1rem' }}>
                            <div className="card-body p-4 d-flex align-items-center">
                                <div className="bg-success-light p-3 rounded-circle me-3 text-success" style={{ boxShadow: 'var(--shadow-inner)' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 4 12 14.01 9 11.01"/><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/></svg>
                                </div>
                                <div>
                                    <h6 className="text-muted mb-1 small fw-bold">
                                        {user?.role === 'ADMIN' ? 'Platform Deliveries' : 
                                         user?.role === 'PHARMACIST' ? 'Pending Shipments' : 'Ready for Collection'}
                                    </h6>
                                    <h3 className="mb-0 fw-bold">{stats.readyForCollection}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 glass-card overflow-hidden" style={{ borderRadius: '1rem' }}>
                            <div className="card-body p-4 d-flex align-items-center">
                                <div className="bg-warning-light p-3 rounded-circle me-3 text-warning" style={{ boxShadow: 'var(--shadow-inner)' }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                </div>
                                <div>
                                    <h6 className="text-muted mb-1 small fw-bold">Pending Payments</h6>
                                    <h3 className="mb-0 fw-bold">{stats.pendingPayments}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '1rem' }}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="mb-0 fw-bold">Recent Orders</h5>
                                    <button className="btn btn-link btn-sm text-primary p-0 fw-bold text-decoration-none" onClick={() => navigate('/orders')}>View All</button>
                                </div>
                                {stats.recentOrders.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle border-0">
                                            <thead>
                                                <tr className="text-muted small text-uppercase">
                                                    <th className="border-0 px-0">Order ID</th>
                                                    <th className="border-0">Date</th>
                                                    <th className="border-0">Status</th>
                                                    <th className="border-0 text-end px-0">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats.recentOrders.map((order) => (
                                                    <tr key={order.id}>
                                                        <td className="border-0 px-0 fw-medium">#{order.orderUuid?.substring(0, 8) || order.id}</td>
                                                        <td className="border-0 text-muted small">{new Date(order.createdAt || order.orderDate).toLocaleDateString()}</td>
                                                        <td className="border-0">
                                                            <span className={`badge rounded-pill px-3 py-2 ${getStatusBadgeClass(order.status)}`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="border-0 text-end px-0">
                                                            <button 
                                                                className="btn btn-sm btn-outline-light text-primary border-0 fw-bold"
                                                                onClick={() => navigate(`/orders/${order.id}`)}
                                                            >
                                                                Details
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-5">
                                        <p className="text-muted mb-0">No recent orders found.</p>
                                        <button className="btn btn-link" onClick={() => navigate('/orders/new')}>Place your first order</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        {isCustomer ? (
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '1rem', background: 'linear-gradient(135deg, var(--primary), #2d5db1)' }}>
                                <div className="card-body p-4 text-white">
                                    <h5 className="mb-3 fw-bold">Prescription Status</h5>
                                    <p className="small mb-4 opacity-75">
                                        Keep your prescriptions up to date. Orders requiring prescriptions will need a valid upload.
                                    </p>
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-white bg-opacity-25 p-2 rounded me-3">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M9 15h6"/></svg>
                                        </div>
                                        <div className="small fw-semibold">Electronic uploads supported</div>
                                    </div>
                                    <button className="btn btn-light btn-sm w-100 fw-bold py-2 mt-2" style={{ color: 'var(--primary)' }} onClick={() => navigate('/orders/new')}>
                                        Upload New
                                    </button>
                                </div>
                            </div>
                        ) : isPharmacist ? (
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '1rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                                <div className="card-body p-4 text-white">
                                    <h5 className="mb-3 fw-bold">Inventory Alerts</h5>
                                    <p className="small mb-4 opacity-75">
                                        Monitor stock levels and approve pending prescriptions from customers.
                                    </p>
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-white bg-opacity-25 p-2 rounded me-3">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                                        </div>
                                        <div className="small fw-semibold">2 items low in stock</div>
                                    </div>
                                    <button className="btn btn-light btn-sm w-100 fw-bold py-2 mt-2" style={{ color: '#059669' }} onClick={() => navigate('/medicines')}>
                                        Manage Inventory
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '1rem', background: 'linear-gradient(135deg, #4f46e5, #4338ca)' }}>
                                <div className="card-body p-4 text-white">
                                    <h5 className="mb-3 fw-bold">System Health</h5>
                                    <p className="small mb-4 opacity-75">
                                        Platform performance is stable. View detailed analytics and user activity reports.
                                    </p>
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="bg-white bg-opacity-25 p-2 rounded me-3">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                                        </div>
                                        <div className="small fw-semibold">All systems operational</div>
                                    </div>
                                    <button className="btn btn-light btn-sm w-100 fw-bold py-2 mt-2" style={{ color: '#4338ca' }} onClick={() => navigate('/payments')}>
                                        Financial Reports
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
                            <div className="card-body p-4">
                                <h5 className="mb-3 fw-bold">Quick Actions</h5>
                                <div className="d-grid gap-2">
                                    <button className="btn btn-outline-light text-dark text-start border d-flex align-items-center gap-3 p-3" onClick={() => navigate('/medicines')}>
                                        <div className="bg-primary-light p-2 rounded text-primary">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 21H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5.5"/><path d="M17 16h6"/><path d="M20 13v6"/><circle cx="9" cy="9" r="2"/></svg>
                                        </div>
                                        <span className="fw-semibold small">{isAdmin ? 'Manage Medicines' : 'Browse Medicines'}</span>
                                    </button>
                                    {isAdmin && (
                                        <button className="btn btn-outline-light text-dark text-start border d-flex align-items-center gap-3 p-3" onClick={() => navigate('/payments')}>
                                            <div className="bg-info-light p-2 rounded text-info">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                                            </div>
                                            <span className="fw-semibold small">View Payments</span>
                                        </button>
                                    )}
                                    <button className="btn btn-outline-light text-dark text-start border d-flex align-items-center gap-3 p-3" onClick={() => navigate('/profile')}>
                                        <div className="bg-success-light p-2 rounded text-success">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                        </div>
                                        <span className="fw-semibold small">Manage Profile</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;