import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <span className="me-2" style={{ color: 'var(--primary)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                    </span>
                    <span className="fw-bold" style={{ color: 'var(--primary)', letterSpacing: '-0.5px' }}>SA MedConnect</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {user && (
                        <ul className="navbar-nav ms-auto align-items-center">
                            <li className="nav-item">
                                <Link className="nav-link px-3 fw-medium" to="/dashboard">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link px-3 fw-medium" to="/medicines">Medicines</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link px-3 fw-medium" to="/orders">Orders</Link>
                            </li>
                            {(user.role === 'ADMIN' || user.role === 'PHARMACIST') && (
                                <li className="nav-item">
                                    <Link className="nav-link px-3 fw-medium" to="/payments">Payments</Link>
                                </li>
                            )}
                            <li className="nav-item ms-lg-3">
                                <div className="d-flex align-items-center border-start ps-lg-4">
                                    <span className="navbar-text text-dark small me-3 fw-semibold">
                                        {user.username}
                                    </span>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;