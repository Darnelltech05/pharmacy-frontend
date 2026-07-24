import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import PrivateRoute from './components/common/PrivateRoute';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';

import Dashboard from './components/dashboard/Dashboard';

import MedicineList from './components/medicines/MedicineList';
import MedicineForm from './components/medicines/MedicineForm';
import MedicineDetails from './components/medicines/MedicineDetails';

import OrderForm from './components/orders/OrderForm';
import OrderHistory from './components/orders/OrderHistory';
import OrderDetails from './components/orders/OrderDetails';

import Checkout from './components/checkout/Checkout';
import PaymentConfirmation from './components/checkout/PaymentConfirmation';

import PaymentsPage from './pages/PaymentsPage';
import LandingPage from './pages/LandingPage';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    return (
        <Router>
            <NotificationProvider>
                <AuthProvider>

                    <div className="App">

                        <Routes>

                            {/* Public Routes */}

                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Dashboard */}

                            <Route
                                path="/dashboard"
                                element={
                                    <PrivateRoute>
                                        <Dashboard />
                                    </PrivateRoute>
                                }
                            />

                            {/* Profile */}

                            <Route
                                path="/profile"
                                element={
                                    <PrivateRoute>
                                        <Profile />
                                    </PrivateRoute>
                                }
                            />

                            {/* Medicines */}

                            <Route
                                path="/medicines"
                                element={
                                    <PrivateRoute>
                                        <MedicineList />
                                    </PrivateRoute>
                                }
                            />

                            {/* Pharmacist/Admin Only */}

                            <Route
                                path="/medicines/new"
                                element={
                                    <PrivateRoute roles={['PHARMACIST', 'ADMIN']}>
                                        <MedicineForm />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/medicines/edit/:id"
                                element={
                                    <PrivateRoute roles={['PHARMACIST', 'ADMIN']}>
                                        <MedicineForm />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/medicines/:id"
                                element={
                                    <PrivateRoute>
                                        <MedicineDetails />
                                    </PrivateRoute>
                                }
                            />

                            {/* Customer Orders */}

                            <Route
                                path="/orders/new"
                                element={
                                    <PrivateRoute roles={['CUSTOMER']}>
                                        <OrderForm />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/orders"
                                element={
                                    <PrivateRoute>
                                        <OrderHistory />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/orders/:id"
                                element={
                                    <PrivateRoute>
                                        <OrderDetails />
                                    </PrivateRoute>
                                }
                            />

                            {/* Payments */}

                            <Route
                                path="/payments"
                                element={
                                    <PrivateRoute roles={['PHARMACIST', 'ADMIN']}>
                                        <PaymentsPage />
                                    </PrivateRoute>
                                }
                            />

                            {/* Checkout */}

                            <Route
                                path="/checkout/:orderId"
                                element={
                                    <PrivateRoute roles={['CUSTOMER']}>
                                        <Checkout />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/payment-confirmation"
                                element={
                                    <PrivateRoute roles={['CUSTOMER']}>
                                        <PaymentConfirmation />
                                    </PrivateRoute>
                                }
                            />

                        </Routes>

                    </div>

                </AuthProvider>
            </NotificationProvider>
        </Router>
    );
}

export default App;