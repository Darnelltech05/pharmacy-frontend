import React, { useEffect, useState } from "react";
import { medicineService } from "../../services/medicineService";
import { getMedicineStatus } from "../../utils/medicineStatus";
import { getMedicineImage } from "../../utils/medicineImages";
import { useNotification } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";

export default function MedicineDetails({ medicineId, onEdit, onDeleted }) {
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adjustQty, setAdjustQty] = useState(1);
  const { user } = useAuth();
  const { success: notifySuccess, error: notifyError } = useNotification();
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'PHARMACIST');
  const isPharmacist = user && user.role === 'PHARMACIST';
  const isCustomer = user && user.role === 'CUSTOMER';

  const loadMedicine = async () => {
    try {
      setLoading(true);
      const data = await medicineService.getById(medicineId);
      setMedicine(data);
      setError("");
    } catch (err) {
      setError("Could not load this medicine.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicineId]);

  const handleIncrease = async () => {
    try {
      const updated = await medicineService.increaseStock(
        medicineId,
        Number(adjustQty)
      );
      setMedicine(updated);
      notifySuccess("Stock updated successfully!");
      setError("");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to increase stock.";
      setError(msg);
      notifyError(msg);
    }
  };

  const handleDecrease = async () => {
    try {
      const updated = await medicineService.decreaseStock(
        medicineId,
        Number(adjustQty)
      );
      setMedicine(updated);
      notifySuccess("Stock updated successfully!");
      setError("");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to decrease stock.";
      setError(msg);
      notifyError(msg);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${medicine.name}"? This can't be undone.`)) {
      return;
    }
    await medicineService.remove(medicineId);
    notifySuccess("Medicine deleted successfully!");
    if (onDeleted) onDeleted();
  };

  if (loading) return (
    <div className="card border-0 shadow-sm p-5 text-center">
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Retrieving pharmaceutical data...</p>
    </div>
  );
  if (error && !medicine) return (
    <div className="alert alert-danger border-0 shadow-sm p-4">
        <h5 className="fw-bold">Connection Error</h5>
        <p className="mb-0">{error}</p>
    </div>
  );
  if (!medicine) return null;

  const status = getMedicineStatus(medicine);
  const isExpired = status.key === "expired";

  return (
    <div className="card border-0 shadow-sm p-0 overflow-hidden">
      <div className="bg-primary p-0 text-white position-relative">
        <div className="medicine-details-image-container">
           <img 
              src={getMedicineImage(medicine)} 
              alt={medicine.name}
              className="medicine-details-img"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop';
              }}
            />
            <div className="medicine-details-overlay p-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 w-100">
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                            <h2 className="fw-bold mb-0 text-white">{medicine.name}</h2>
                            <span className={`badge px-2 py-1 bg-white bg-opacity-20 text-white border border-white border-opacity-25`}>
                                {status.label.toUpperCase()}
                            </span>
                        </div>
                        <p className="mb-0 text-white opacity-75">{medicine.description || "Pharmaceutical product details"}</p>
                    </div>
                    {isAdmin && (
                        <div className="d-flex gap-2">
                            {onEdit && (
                                <button className="btn btn-light btn-sm fw-bold px-3" onClick={() => onEdit(medicine)}>
                                    Edit Product
                                </button>
                            )}
                            <button className="btn btn-outline-light btn-sm fw-bold px-3" onClick={handleDelete}>
                                Archive
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="p-4">
        <div className="row g-4 mb-4">
            <div className="col-sm-6 col-md-4">
                <div className="border p-3 rounded-2">
                    <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Manufacturer</small>
                    <span className="fw-semibold text-dark">{medicine.manufacturer || "Generic Pharmaceutical"}</span>
                </div>
            </div>
            <div className="col-sm-6 col-md-4">
                <div className="border p-3 rounded-2">
                    <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Therapeutic Class</small>
                    <span className="fw-semibold text-dark">{medicine.category}</span>
                </div>
            </div>
            <div className="col-sm-6 col-md-4">
                <div className="border p-3 rounded-2">
                    <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Unit Price</small>
                    <span className="fw-bold text-primary">R {Number(medicine.price).toFixed(2)}</span>
                </div>
            </div>
            <div className="col-sm-6 col-md-4">
                <div className="border p-3 rounded-2">
                    <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Current Inventory</small>
                    <span className={`fw-bold ${medicine.stockQuantity < 10 ? 'text-danger' : 'text-success'}`}>{medicine.stockQuantity} Units</span>
                </div>
            </div>
            <div className="col-sm-6 col-md-4">
                <div className="border p-3 rounded-2">
                    <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Expiration Date</small>
                    <span className={`fw-semibold ${isExpired ? "text-danger" : "text-dark"}`}>{medicine.expiryDate || "N/A"}</span>
                </div>
            </div>
            <div className="col-sm-6 col-md-4">
                <div className="border p-3 rounded-2">
                    <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Regulatory Status</small>
                    <span className="fw-semibold text-dark">{medicine.prescriptionRequired ? "Prescription Required" : "OTC (Over-The-Counter)"}</span>
                </div>
            </div>
        </div>

        {error && <div className="alert alert-danger border-0 small mb-4">{error}</div>}

        {isAdmin && (
            <div className="bg-light p-4 rounded-2 border">
                <h6 className="fw-bold text-dark mb-3 text-uppercase small" style={{ letterSpacing: '0.05em' }}>Inventory Management</h6>
                <div className="row align-items-end g-3">
                    <div className="col-auto">
                        <label className="form-label small fw-semibold text-muted">ADJUSTMENT QUANTITY</label>
                        <input
                            type="number"
                            className="form-control"
                            min="1"
                            style={{ width: '120px' }}
                            value={adjustQty}
                            onChange={(e) => setAdjustQty(e.target.value)}
                        />
                    </div>
                    <div className="col-auto d-flex gap-2">
                        <button className="btn btn-primary fw-bold" onClick={handleIncrease}>Restock</button>
                        <button className="btn btn-outline-primary fw-bold bg-white" onClick={handleDecrease}>Reduce</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}