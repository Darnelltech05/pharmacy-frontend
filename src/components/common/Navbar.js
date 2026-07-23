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
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand" to="/dashboard">
                    🏥 SA MedConnect
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {user && (
                        <ul className="navbar-nav ms-auto align-items-center">

                           <li className="nav-item">
         <Link className="nav-link" to="/dashboard">
        Dashboard
    </Link>
</li>

<li className="nav-item">
    <Link className="nav-link" to="/payments">
        Payments
    </Link>
</li>

<li className="nav-item">
    <Link className="nav-link" to="/profile">
        Profile
    </Link>
</li>

                            <li className="nav-item">
                                <span className="navbar-text text-light mx-3">
                                    👤 {user.username}
                                </span>
                            </li>

                            <li className="nav-item">
                                <button
                                    className="btn btn-outline-light btn-sm"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </li>

                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;