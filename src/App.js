import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/common/PrivateRoute";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import OrdersPage from "./components/orders/OrdersPage";
import Dashboard from "./components/Dashboard";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">

                    <Routes>

                        <Route
                            path="/"
                            element={<Login />}
                        />

                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="/register"
                            element={<Register />}
                        />

                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />

                        <Route
                            path="/orders"
                            element={
                                <PrivateRoute>
                                    <OrdersPage />
                                </PrivateRoute>
                            }
                        />

                    </Routes>

                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;