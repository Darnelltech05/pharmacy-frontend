import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { useNotification } from '../../context/NotificationContext';
import Navbar from '../common/Navbar';
import api from '../../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const OrderForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { success: notifySuccess, error: notifyError } = useNotification();
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [requiresPrescription, setRequiresPrescription] = useState(false);
    const [prescriptionFile, setPrescriptionFile] = useState(null);
    const [prescriptionFileName, setPrescriptionFileName] = useState('');

    const preSelectedMedicineId = location.state?.medicineId || '';

    const [orderData, setOrderData] = useState({
        shippingAddress: '',
        clinicPickupLocation: '',
        items: [{ medicineId: preSelectedMedicineId, quantity: 1 }]
    });

    useEffect(() => {
        loadMedicines();
    }, []);

    const loadMedicines = async () => {
        try {
            setLoading(true);

            const response = await api.get('/medicines?page=0&size=100');

            console.log("API Response:", response);
            console.log("Response Data:", response.data);

            let medicinesData = [];

            if (Array.isArray(response.data)) {
                medicinesData = response.data;
            } else if (response.data.data?.content) {
                medicinesData = response.data.data.content;
            } else if (Array.isArray(response.data.data)) {
                medicinesData = response.data.data;
            }

            console.log("Medicines Loaded:", medicinesData);
            setMedicines(medicinesData);

            // Re-check prescription requirement if there was a pre-selected medicine
            if (preSelectedMedicineId) {
                const needsPrescription = medicinesData.some(m => 
                    m.id.toString() === preSelectedMedicineId.toString() && m.requiresPrescription
                );
                setRequiresPrescription(needsPrescription);
            }

        } catch (err) {
            console.error("Error loading medicines:", err);
            setError("Failed to load medicines");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setOrderData({
            ...orderData,
            [e.target.name]: e.target.value
        });
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...orderData.items];
        updatedItems[index][field] = value;
        setOrderData({ ...orderData, items: updatedItems });
        checkPrescriptionRequirement(updatedItems);
    };

    const addItem = () => {
        const updatedItems = [...orderData.items, { medicineId: '', quantity: 1 }];
        setOrderData({
            ...orderData,
            items: updatedItems
        });
        checkPrescriptionRequirement(updatedItems);
    };

    const removeItem = (index) => {
        if (orderData.items.length > 1) {
            const updatedItems = orderData.items.filter((_, i) => i !== index);
            setOrderData({ ...orderData, items: updatedItems });
            checkPrescriptionRequirement(updatedItems);
        }
    };

    const checkPrescriptionRequirement = (items) => {
        const needsPrescription = items.some(item => {
            const medicine = medicines.find(m => m.id.toString() === item.medicineId.toString());
            return medicine && medicine.requiresPrescription;
        });
        setRequiresPrescription(needsPrescription);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPrescriptionFile(file);
            setPrescriptionFileName(file.name);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        if (requiresPrescription && !prescriptionFile) {
            setError('A prescription document is required for this order.');
            notifyError('Please upload your prescription.');
            setSubmitting(false);
            return;
        }

        try {
            // Note: In a production app, we would use FormData to upload the file
            // For now, we follow the existing flow and simulate the upload
            // since the backend orderService.createOrder only expects JSON
            const dataToSubmit = {
                ...orderData,
                prescriptionRequired: requiresPrescription,
                prescriptionName: prescriptionFileName // Just to record that a prescription was provided
            };

            const response = await orderService.createOrder(dataToSubmit);
            if (response.success) {
                notifySuccess('Order placed successfully! Redirecting to checkout...');
                setSuccess('Order placed successfully!');
                const orderId = response.data?.id || response.id;
                setTimeout(() => navigate(`/checkout/${orderId}`), 1500);
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to place order. Please check your details.';
            setError(msg);
            notifyError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-light min-vh-100">
                <Navbar />
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm p-5 text-center">
                                <div className="skeleton skeleton-title mb-4 mx-auto w-50"></div>
                                <div className="skeleton skeleton-text mb-2"></div>
                                <div className="skeleton skeleton-text mb-2"></div>
                                <div className="skeleton skeleton-card mt-4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-light min-vh-100">
            <Navbar />
            <div className="container py-5 fade-in">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm overflow-hidden">
                            <div className="card-header bg-primary py-3">
                                <h4 className="mb-0 fw-bold text-white">Place New Order</h4>
                            </div>
                            <div className="card-body p-4 p-md-5">
                                {error && <div className="alert alert-danger border-0 rounded-3 mb-4">{error}</div>}
                                {success && <div className="alert alert-success border-0 rounded-3 mb-4">{success}</div>}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <h5 className="fw-bold text-primary border-bottom pb-2 mb-3">Shipping & Pickup</h5>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-muted text-uppercase">Shipping Address *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="shippingAddress"
                                                    value={orderData.shippingAddress}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Enter your street address"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold text-muted text-uppercase">Clinic Pickup Location *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="clinicPickupLocation"
                                                    value={orderData.clinicPickupLocation}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Enter clinic name"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                                            <h5 className="fw-bold text-primary mb-0">Order Items</h5>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary rounded-pill px-3"
                                                onClick={addItem}
                                            >
                                                + Add Another
                                            </button>
                                        </div>
                                        
                                        {orderData.items.map((item, index) => (
                                            <div key={index} className="card bg-light border-0 mb-3 p-3 position-relative">
                                                {orderData.items.length > 1 && (
                                                    <button 
                                                        type="button" 
                                                        className="btn-close position-absolute top-0 end-0 m-2" 
                                                        style={{ fontSize: '0.7rem' }}
                                                        onClick={() => removeItem(index)}
                                                    ></button>
                                                )}
                                                <div className="row g-3 align-items-end">
                                                    <div className="col-md-8">
                                                        <label className="form-label small fw-bold text-muted text-uppercase">Medicine</label>
                                                        <select
                                                            className="form-select border-0 shadow-none"
                                                            value={item.medicineId}
                                                            onChange={(e) => handleItemChange(index, 'medicineId', e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Select a medicine</option>
                                                            {medicines.map((m) => (
                                                                <option key={m.id} value={m.id}>
                                                                    {m.name} (Stock: {m.stockQuantity}){m.requiresPrescription ? ' - [Prescription Required]' : ''}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label small fw-bold text-muted text-uppercase">Quantity</label>
                                                        <input
                                                            type="number"
                                                            className="form-control border-0 shadow-none"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {requiresPrescription && (
                                        <div className="mb-4 fade-in">
                                            <div className="card border-warning bg-light">
                                                <div className="card-body">
                                                    <div className="d-flex align-items-center mb-3">
                                                        <div className="bg-warning text-white rounded-circle p-2 me-3">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                                                                <path d="M7 5.5a.5.5 0 0 0-1 0v1H5a.5.5 0 0 0 0 1h1v1a.5.5 0 0 0 1 0v-1h1a.5.5 0 0 0 0-1H7v-1z"/>
                                                            </svg>
                                                        </div>
                                                        <h5 className="fw-bold mb-0 text-dark">Prescription Required</h5>
                                                    </div>
                                                    <p className="text-muted small mb-4">
                                                        One or more items in your order require a valid prescription. 
                                                        Please upload a clear image or PDF of your doctor's prescription.
                                                    </p>
                                                    <div className="upload-container bg-white border border-dashed rounded-3 p-4 text-center">
                                                        <input 
                                                            type="file" 
                                                            id="prescriptionUpload" 
                                                            className="visually-hidden" 
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            onChange={handleFileChange}
                                                        />
                                                        <label htmlFor="prescriptionUpload" className="btn btn-outline-primary rounded-pill px-4 mb-2 cursor-pointer">
                                                            {prescriptionFileName ? 'Change Document' : 'Choose File'}
                                                        </label>
                                                        <p className="small text-muted mb-0">
                                                            {prescriptionFileName ? (
                                                                <span className="text-success fw-bold">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                                                                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.42-5.447z"/>
                                                                    </svg>
                                                                    Selected: {prescriptionFileName}
                                                                </span>
                                                            ) : 'Accepted formats: PDF, JPG, PNG (Max 5MB)'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="d-flex gap-2 mt-5">
                                        <button
                                            type="submit"
                                            className="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-sm flex-grow-1"
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Placing Order...
                                                </>
                                            ) : (
                                                'Confirm & Place Order'
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-light border rounded-pill px-4 py-3 text-muted"
                                            onClick={() => navigate('/orders')}
                                            disabled={submitting}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderForm;