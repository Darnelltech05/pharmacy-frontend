import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { success: notifySuccess, error: notifyError } = useNotification();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(username, password);
            if (result.success) {
                notifySuccess('Welcome back!');
                navigate('/dashboard');
            } else {
                setError(result.message || 'Login failed');
                notifyError(result.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred during login');
            notifyError('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center bg-pattern-medical fade-in position-relative">
            <div className="watermark-logo"></div>
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card border-0 glass-card">
                            <div className="card-body p-4 p-md-5">
                                <div className="text-center mb-4">
                                    <Link className="d-flex align-items-center justify-content-center text-decoration-none mb-3" to="/">
                                        <span className="me-2" style={{ color: 'var(--primary)' }}>
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                                        </span>
                                        <h3 className="fw-bold mb-0" style={{ color: 'var(--primary)', letterSpacing: '-0.5px' }}>SA MedConnect</h3>
                                    </Link>
                                    <p className="text-muted">Sign in to your healthcare portal</p>
                                </div>

                                {error && (
                                    <div className="alert alert-danger border-0 small mb-4 py-2" role="alert">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label small fw-semibold text-muted">USERNAME</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            placeholder="Enter your username"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label small fw-semibold text-muted">PASSWORD</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="Enter your password"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2 fw-bold"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        ) : 'Sign In'}
                                    </button>
                                </form>

                                <div className="text-center mt-4">
                                    <p className="mb-0 text-muted small">
                                        New to SA MedConnect? <Link to="/register" className="text-primary fw-bold text-decoration-none">Create an account</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;