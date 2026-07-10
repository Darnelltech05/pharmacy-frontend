import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/auth/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/" element={<Login />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;