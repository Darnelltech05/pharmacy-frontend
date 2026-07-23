import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Navbar from '../common/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        idNumber: '',
        medicalAidNumber: '',
        medicalAidName: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        clinicAffiliation: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/profile');
            if (response.data.success) {
                setProfile(response.data.data);
                setFormData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await api.put('/users/profile', formData);
            if (response.data.success) {
                setProfile(response.data.data);
                setEditing(false);
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            }
        } catch (error) {
            setMessage({
                type: 'danger',
                text: error.response?.data?.message || 'Failed to update profile'
            });
        } finally {
            setLoading(false);
        }
    };

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
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card shadow">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h2>My Profile</h2>
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={() => setEditing(!editing)}
                                    >
                                        {editing ? 'Cancel' : 'Edit Profile'}
                                    </button>
                                </div>

                                {message && (
                                    <div className={`alert alert-${message.type}`} role="alert">
                                        {message.text}
                                    </div>
                                )}

                                {editing ? (
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Full Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="fullName"
                                                    value={formData.fullName || ''}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    name="phoneNumber"
                                                    value={formData.phoneNumber || ''}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">ID Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="idNumber"
                                                    value={formData.idNumber || ''}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Clinic Affiliation</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="clinicAffiliation"
                                                    value={formData.clinicAffiliation || ''}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Medical Aid Number</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="medicalAidNumber"
                                                    value={formData.medicalAidNumber || ''}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Medical Aid Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="medicalAidName"
                                                    value={formData.medicalAidName || ''}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Emergency Contact Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="emergencyContactName"
                                                    value={formData.emergencyContactName || ''}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Emergency Contact Phone</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    name="emergencyContactPhone"
                                                    value={formData.emergencyContactPhone || ''}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100"
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="row">
                                        <div className="col-md-6">
                                            <p><strong>Username:</strong> {profile?.username}</p>
                                            <p><strong>Email:</strong> {profile?.email}</p>
                                            <p><strong>Full Name:</strong> {profile?.fullName}</p>
                                            <p><strong>Phone:</strong> {profile?.phoneNumber}</p>
                                            <p><strong>Role:</strong> {profile?.role}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>ID Number:</strong> {profile?.idNumber || 'Not set'}</p>
                                            <p><strong>Clinic:</strong> {profile?.clinicAffiliation || 'Not set'}</p>
                                            <p><strong>Medical Aid:</strong> {profile?.medicalAidName || 'Not set'}</p>
                                            <p><strong>Emergency Contact:</strong> {profile?.emergencyContactName || 'Not set'}</p>
                                            <p><strong>Emergency Phone:</strong> {profile?.emergencyContactPhone || 'Not set'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;