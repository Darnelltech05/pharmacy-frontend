import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        idNumber: '',
        clinicAffiliation: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const { success: notifySuccess, error: notifyError } = useNotification();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await register(formData);
            if (result.success) {
                notifySuccess('Account created successfully! Welcome to SA MedConnect.');
                navigate('/dashboard');
            } else {
                setError(result.message || 'Registration failed');
                notifyError(result.message || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred during registration');
            notifyError('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center bg-pattern-medical py-5 fade-in position-relative">
            <div className="watermark-logo"></div>
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="row justify-content-center">
                    <div className="col-md-11 col-lg-9">
                        <div className="card border-0 glass-card">
                            <div className="card-body p-0">
                                <div className="row g-0">
                                    <div className="col-lg-4 bg-primary p-5 text-white d-none d-lg-flex flex-column">
                                        <Link className="d-flex align-items-center text-decoration-none text-white mb-5" to="/">
                                            <span className="me-2">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                                            </span>
                                            <span className="fw-bold h5 mb-0" style={{ letterSpacing: '-0.5px' }}>SA MedConnect</span>
                                        </Link>
                                        <h2 className="fw-bold mb-4">Patient Portal</h2>
                                        <p className="mb-4 opacity-75">Access a modern medicine management and ordering platform designed for reliability and speed.</p>
                                        <div className="mt-auto">
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="bg-white bg-opacity-20 p-2 rounded-circle me-3">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                </div>
                                                <span className="small">Real-time availability</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="bg-white bg-opacity-20 p-2 rounded-circle me-3">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                </div>
                                                <span className="small">Fast online ordering</span>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div className="bg-white bg-opacity-20 p-2 rounded-circle me-3">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                </div>
                                                <span className="small">Professional support</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-8 p-4 p-md-5">
                                        <div className="mb-4">
                                            <h3 className="fw-bold text-dark mb-1">Create Account</h3>
                                            <p className="text-muted">Register to start managing your medications online.</p>
                                        </div>

                                        {error && (
                                            <div className="alert alert-danger border-0 small mb-4 py-2" role="alert">
                                                {error}
                                            </div>
                                        )}

                                        <form onSubmit={handleSubmit}>
                                            <div className="row g-3">
                                                <div className="col-md-6 mb-2">
                                                    <label className="form-label small fw-semibold text-muted">USERNAME</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="username"
                                                        value={formData.username}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="johndoe"
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-2">
                                                    <label className="form-label small fw-semibold text-muted">EMAIL ADDRESS</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="john@example.com"
                                                    />
                                                </div>
                                                <div className="col-md-12 mb-2">
                                                    <label className="form-label small fw-semibold text-muted">FULL NAME</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="fullName"
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-2">
                                                    <label className="form-label small fw-semibold text-muted">PASSWORD</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-2">
                                                    <label className="form-label small fw-semibold text-muted">PHONE NUMBER</label>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        name="phoneNumber"
                                                        value={formData.phoneNumber}
                                                        onChange={handleChange}
                                                        placeholder="+27 00 000 0000"
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-2">
                                                    <label className="form-label small fw-semibold text-muted">ID NUMBER</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="idNumber"
                                                        value={formData.idNumber}
                                                        onChange={handleChange}
                                                        placeholder="RSA ID Number"
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-4">
                                                    <label className="form-label small fw-semibold text-muted">CLINIC AFFILIATION</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="clinicAffiliation"
                                                        value={formData.clinicAffiliation}
                                                        onChange={handleChange}
                                                        placeholder="Optional"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100 py-2 fw-bold shadow-sm mb-3"
                                                disabled={loading}
                                            >
                                                {loading ? 'Creating Account...' : 'Complete Registration'}
                                            </button>
                                        </form>

                                        <div className="text-center">
                                            <p className="mb-0 text-muted small">
                                                Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Sign In here</Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;