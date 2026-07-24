import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LandingPage = () => {
    return (
        <div className="landing-page fade-in">
            {/* Custom Styles */}
            <style>
                {`
                    .hero-section {
                        background: linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%);
                        color: var(--text-main);
                        padding: 120px 0;
                        border-bottom: 1px solid var(--border-color);
                        position: relative;
                        overflow: hidden;
                    }
                    .feature-card {
                        border: 1px solid var(--glass-border);
                        border-radius: var(--radius-lg);
                        transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                        height: 100%;
                        background: var(--glass-bg);
                        backdrop-filter: blur(8px);
                        -webkit-backdrop-filter: blur(8px);
                        padding: 2rem;
                        box-shadow: var(--shadow-sm);
                    }
                    .feature-card:hover {
                        transform: translateY(-5px);
                        border-color: var(--primary);
                        box-shadow: var(--shadow-lg);
                        background: #ffffff;
                    }
                    .feature-icon-wrapper {
                        width: 60px;
                        height: 60px;
                        background: var(--primary-light);
                        border-radius: var(--radius-md);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 1.5rem;
                        font-size: 1.5rem;
                        color: var(--primary);
                    }
                    .how-it-works-step {
                        text-align: center;
                        padding: 2rem;
                    }
                    .step-number {
                        width: 40px;
                        height: 40px;
                        background-color: var(--primary-light);
                        color: var(--primary);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.25rem;
                        font-weight: 700;
                        margin: 0 auto 1.5rem;
                    }
                    .footer {
                        background-color: #f8f9fa;
                        color: var(--text-muted);
                        padding: 80px 0 40px;
                        border-top: 1px solid var(--border-color);
                    }
                    .footer h5 {
                        color: var(--text-main);
                        font-weight: 700;
                    }
                    .section-padding {
                        padding: 100px 0;
                    }
                    .bg-medical-light {
                        background-color: #f8faff;
                    }
                    .btn-hero {
                        padding: 12px 32px;
                        font-size: 1.1rem;
                        font-weight: 600;
                    }
                `}
            </style>

            {/* Navbar */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom">
                <div className="container">
                    <Link className="navbar-brand d-flex align-items-center" to="/">
                        <span className="me-2" style={{ color: 'var(--primary)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                        </span>
                        <span className="fw-bold" style={{ color: 'var(--primary)', letterSpacing: '-0.5px' }}>SA MedConnect</span>
                    </Link>
                    <div className="ms-auto">
                        <Link to="/login" className="btn btn-link text-decoration-none text-dark me-3 fw-medium">Login</Link>
                        <Link to="/register" className="btn btn-primary">Register</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section bg-pattern-medical">
                <div className="watermark">HEALTHCARE</div>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="row align-items-center">
                        <div className="col-lg-7 text-start">
                            <span className="badge bg-primary-light text-primary mb-3 px-3 py-2 rounded-pill">Welcome to SA MedConnect</span>
                            <h1 className="display-4 fw-bold mb-4" style={{ color: 'var(--primary)' }}>Empowering Health for Every South African</h1>
                            <p className="lead mb-5 text-muted fs-4">A professional pharmacy platform dedicated to improving medicine accessibility through secure digital prescriptions and efficient local pharmacy integration.</p>
                            <div className="d-flex gap-3">
                                <Link to="/register" className="btn btn-primary btn-hero">Create an Account</Link>
                                <Link to="/login" className="btn btn-outline-primary btn-hero">Access Portal</Link>
                            </div>
                        </div>
                        <div className="col-lg-5 d-none d-lg-block text-center">
                            <div className="p-5 bg-primary-light rounded-circle d-inline-block">
                                <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Description Section */}
            <section className="section-padding bg-white position-relative overflow-hidden">
                <div className="watermark" style={{ fontSize: '15rem', opacity: 0.015 }}>ACCESS</div>
                <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <h2 className="fw-bold mb-4">Our Mission</h2>
                            <p className="lead text-secondary">
                                Many South Africans in rural and underserved communities face significant challenges in accessing essential medicines. 
                                SA MedConnect leverages technology to streamline the pharmacy supply chain, allowing patients to check availability 
                                and order medicines online, reducing travel time and ensuring health security for all.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="section-padding bg-pattern-plus">
                <div className="container">
                    <h2 className="text-center fw-bold mb-5">Key Features</h2>
                    <div className="row g-4">
                        <div className="col-md-6 col-lg-3">
                            <div className="card feature-card">
                                <div className="feature-icon-wrapper">🔍</div>
                                <h5 className="fw-bold">Real-time Availability</h5>
                                <p className="text-secondary small mb-0">Check if your required medicine is in stock at your nearest pharmacy before you travel.</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="card feature-card">
                                <div className="feature-icon-wrapper">📱</div>
                                <h5 className="fw-bold">Online Ordering</h5>
                                <p className="text-secondary small mb-0">Place orders for your prescriptions directly through the platform from anywhere.</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="card feature-card">
                                <div className="feature-icon-wrapper">📦</div>
                                <h5 className="fw-bold">Inventory Management</h5>
                                <p className="text-secondary small mb-0">Helping pharmacies track stock levels efficiently to prevent medicine shortages.</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="card feature-card">
                                <div className="feature-icon-wrapper">⚡</div>
                                <h5 className="fw-bold">Faster Collection</h5>
                                <p className="text-secondary small mb-0">Skip the long queues with our prioritized collection system for online orders.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="section-padding bg-white">
                <div className="container">
                    <h2 className="text-center fw-bold mb-5">How It Works</h2>
                    <div className="row">
                        <div className="col-md-4 how-it-works-step">
                            <div className="step-number">1</div>
                            <h5>Search Medicine</h5>
                            <p className="text-secondary">Find the medicine you need and check which pharmacies have it in stock.</p>
                        </div>
                        <div className="col-md-4 how-it-works-step">
                            <div className="step-number">2</div>
                            <h5>Place Order</h5>
                            <p className="text-secondary">Select your pharmacy and place an order using your prescription details.</p>
                        </div>
                        <div className="col-md-4 how-it-works-step">
                            <div className="step-number">3</div>
                            <h5>Collect & Pay</h5>
                            <p className="text-secondary">Receive a notification when it's ready and collect it from the pharmacy.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-md-4 mb-4 mb-md-0">
                            <h5 className="fw-bold mb-3">SA MedConnect</h5>
                            <p>Empowering communities through accessible healthcare technology.</p>
                        </div>
                        <div className="col-md-4 mb-4 mb-md-0">
                            <h5 className="fw-bold mb-3">Contact Us</h5>
                            <p className="mb-1">📧 info@samedconnect.co.za</p>
                            <p className="mb-1">📞 +27 11 123 4567</p>
                            <p>📍 Johannesburg, South Africa</p>
                        </div>
                        <div className="col-md-4">
                            <h5 className="fw-bold mb-3">Important</h5>
                            <p className="small">
                                <strong>Disclaimer:</strong> SA MedConnect is a platform to facilitate medicine access. 
                                Always consult with a qualified healthcare professional before taking any medication. 
                                A valid prescription is required for all regulated medicines.
                            </p>
                        </div>
                    </div>
                    <hr className="bg-secondary" />
                    <div className="text-center small">
                        <p>&copy; 2026 SA MedConnect. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
