import React, { useState } from "react";

const emptyMedicine = {
  name: "",
  description: "",
  manufacturer: "",
  category: "",
  price: "",
  stockQuantity: "",
  expiryDate: "",
  prescriptionRequired: false,
};

// Reusable for both create and edit:
// - pass initialData to pre-fill for editing
// - onSubmit receives the finished medicine object
export default function MedicineForm({ initialData, onSubmit, onCancel }) {
  const [medicine, setMedicine] = useState(initialData || emptyMedicine);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      setError("Name, category, and expiry date are required.");
      return;
    }
    if (Number(medicine.price) <= 0) {
      setError("Price must be greater than zero.");
      return;
    }
    if (Number(medicine.stockQuantity) < 0) {
      setError("Stock quantity cannot be negative.");
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
      setError(
        err.response?.data?.message ||
          "Something went wrong saving this medicine."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="medicine-form">
      <h2>{isEditing ? "Edit Medicine" : "Add Medicine"}</h2>

      {error && <div className="error-message">{error}</div>}

      <label>
        Name
        <input name="name" value={medicine.name} onChange={handleChange} />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={medicine.description}
          onChange={handleChange}
        />
      </label>

      <label>
        Manufacturer
        <input
          name="manufacturer"
          value={medicine.manufacturer}
          onChange={handleChange}
        />
      </label>

      <label>
        Category
        <input
          name="category"
          value={medicine.category}
          onChange={handleChange}
        />
      </label>

      <label>
        Price (R)
        <input
          type="number"
          step="0.01"
          name="price"
          value={medicine.price}
          onChange={handleChange}
        />
      </label>

      <label>
        Stock Quantity
        <input
          type="number"
          name="stockQuantity"
          value={medicine.stockQuantity}
          onChange={handleChange}
          disabled={isEditing}
        />
      </label>
      {isEditing && (
        <small>
          Use the stock +/- controls on the medicine details page to change
          stock, not this form.
        </small>
      )}

      <label>
        Expiry Date
        <input
          type="date"
          name="expiryDate"
          value={medicine.expiryDate}
          onChange={handleChange}
        />
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="prescriptionRequired"
          checked={medicine.prescriptionRequired}
          onChange={handleChange}
        />
        Prescription required
      </label>

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : isEditing ? "Save Changes" : "Add Medicine"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
