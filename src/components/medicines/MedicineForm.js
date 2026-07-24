import React, { useState } from "react";
import { useNotification } from "../../context/NotificationContext";

const emptyMedicine = {
  name: "",
  description: "",
  manufacturer: "",
  category: "",
  price: "",
  stockQuantity: "",
  expiryDate: "",
  prescriptionRequired: false,
  imageUrl: "",
};

// Reusable for both create and edit:
// - pass initialData to pre-fill for editing
// - onSubmit receives the finished medicine object
export default function MedicineForm({ initialData, onSubmit, onCancel }) {
  const [medicine, setMedicine] = useState(initialData || emptyMedicine);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { success: notifySuccess, error: notifyError, warning: notifyWarning } = useNotification();

  const isEditing = Boolean(initialData);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMedicine((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!medicine.name || !medicine.category || !medicine.expiryDate) {
      const msg = "Name, category, and expiry date are required.";
      setError(msg);
      notifyWarning(msg);
      return;
    }
    if (Number(medicine.price) <= 0) {
      const msg = "Price must be greater than zero.";
      setError(msg);
      notifyWarning(msg);
      return;
    }
    if (Number(medicine.stockQuantity) < 0) {
      const msg = "Stock quantity cannot be negative.";
      setError(msg);
      notifyWarning(msg);
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        ...medicine,
        price: Number(medicine.price),
        stockQuantity: Number(medicine.stockQuantity),
      });
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong saving this medicine.";
      setError(msg);
      notifyError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card border-0 shadow-sm p-4 mx-auto fade-in" style={{ maxWidth: '800px' }}>
      <h2 className="text-primary fw-bold mb-4">{isEditing ? "Edit Medicine" : "Add Medicine"}</h2>

      {error && <div className="alert alert-danger border-0 rounded-3 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label small fw-bold text-muted">Name</label>
            <input 
              name="name" 
              className="form-control"
              value={medicine.name} 
              onChange={handleChange} 
              placeholder="e.g. Paracetamol"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-bold text-muted">Category</label>
            <input 
              name="category" 
              className="form-control"
              value={medicine.category} 
              onChange={handleChange} 
              placeholder="e.g. Analgesics"
            />
          </div>

          <div className="col-12">
            <label className="form-label small fw-bold text-muted">Image URL</label>
            <input 
              name="imageUrl" 
              className="form-control"
              value={medicine.imageUrl} 
              onChange={handleChange} 
              placeholder="https://example.com/medicine-image.jpg"
            />
            <div className="form-text small">Provide a URL for a professional product image.</div>
          </div>

          <div className="col-12">
            <label className="form-label small fw-bold text-muted">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={medicine.description}
              onChange={handleChange}
              placeholder="Describe the medicine..."
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-bold text-muted">Manufacturer</label>
            <input
              name="manufacturer"
              className="form-control"
              value={medicine.manufacturer}
              onChange={handleChange}
              placeholder="e.g. Aspen Pharmacare"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label small fw-bold text-muted">Price (R)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              className="form-control"
              value={medicine.price}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label small fw-bold text-muted">Stock Quantity</label>
            <input
              type="number"
              name="stockQuantity"
              className="form-control"
              value={medicine.stockQuantity}
              onChange={handleChange}
              disabled={isEditing}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label small fw-bold text-muted">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              className="form-control"
              value={medicine.expiryDate}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 d-flex align-items-center mt-md-4">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="prescriptionRequired"
                name="prescriptionRequired"
                checked={medicine.prescriptionRequired}
                onChange={handleChange}
              />
              <label className="form-check-label small fw-bold text-muted" htmlFor="prescriptionRequired">
                Prescription required
              </label>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="alert alert-info border-0 small mt-4">
             Note: Use the stock +/- controls on the medicine details page to adjust current inventory.
          </div>
        )}

        <div className="d-flex gap-2 mt-5">
          <button type="submit" className="btn btn-primary px-4 py-2 rounded-pill" disabled={submitting}>
            {submitting ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {submitting ? "Saving..." : isEditing ? "Save Changes" : "Add Medicine"}
          </button>
          {onCancel && (
            <button type="button" className="btn btn-light px-4 py-2 rounded-pill" onClick={onCancel} disabled={submitting}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
