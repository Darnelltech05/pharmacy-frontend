import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        setTimeout(() => setLoading(false), 500);
    }, [user, navigate]);

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

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <h2 className="mb-4">Welcome, {user?.fullName || user?.username}! 👋</h2>

                                <div className="row">
                                    <div className="col-md-3 mb-3">
                                        <div className="card bg-primary text-white">
                                            <div className="card-body">
                                                <h5>Total Orders</h5>
                                                <h2>0</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <div className="card bg-success text-white">
                                            <div className="card-body">
                                                <h5>Medicines Available</h5>
                                                <h2>0</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <div className="card bg-warning text-white">
                                            <div className="card-body">
                                                <h5>Pending Orders</h5>
                                                <h2>0</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <div className="card bg-info text-white">
                                            <div className="card-body">
                                                <h5>Role</h5>
                                                <h5>{user?.role || 'CUSTOMER'}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h5>Quick Actions</h5>
                                    <div className="d-flex gap-2 flex-wrap">
                                        <button className="btn btn-primary" onClick={() => navigate('/medicines')}>
                                            Browse Medicines
                                        </button>
                                        <button className="btn btn-success" onClick={() => navigate('/orders/new')}>
                                            Place Order
                                        </button>
                                        <button className="btn btn-info" onClick={() => navigate('/orders')}>
                                            Order History
                                        </button>
                                        <button className="btn btn-secondary" onClick={() => navigate('/profile')}>
                                            My Profile
                                        </button>
                                    </div>
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