import React, { useEffect, useState } from "react";
import { medicineService } from "../../services/medicineService";
import { getMedicineStatus } from "../../utils/medicineStatus";

export default function MedicineDetails({ medicineId, onEdit, onDeleted }) {
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adjustQty, setAdjustQty] = useState(1);

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
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to increase stock.");
    }
  };

  const handleDecrease = async () => {
    try {
      const updated = await medicineService.decreaseStock(
        medicineId,
        Number(adjustQty)
      );
      setMedicine(updated);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to decrease stock.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${medicine.name}"? This can't be undone.`)) {
      return;
    }
    await medicineService.remove(medicineId);
    if (onDeleted) onDeleted();
  };

  if (loading) return <div>Loading medicine...</div>;
  if (error && !medicine) return <div className="error-message">{error}</div>;
  if (!medicine) return null;

  const status = getMedicineStatus(medicine);
  const isExpired = status.key === "expired";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
        <h2 style={{ margin: 0 }}>{medicine.name}</h2>
        <span className={`status-badge ${status.key}`}>{status.label}</span>
      </div>
      <p>{medicine.description}</p>

      <dl>
        <div>
          <dt>Manufacturer</dt>
          <dd>{medicine.manufacturer || "—"}</dd>
        </div>

        <div>
          <dt>Category</dt>
          <dd>{medicine.category}</dd>
        </div>

        <div>
          <dt>Price</dt>
          <dd>R{Number(medicine.price).toFixed(2)}</dd>
        </div>

        <div>
          <dt>Stock</dt>
          <dd>{medicine.stockQuantity}</dd>
        </div>

        <div>
          <dt>Expiry Date</dt>
          <dd className={isExpired ? "expired" : ""}>{medicine.expiryDate}</dd>
        </div>

        <div>
          <dt>Prescription Required</dt>
          <dd>{medicine.prescriptionRequired ? "Yes" : "No"}</dd>
        </div>

        {medicine.createdAt && (
          <div>
            <dt>Added On</dt>
            <dd>{new Date(medicine.createdAt).toLocaleDateString()}</dd>
          </div>
        )}

        {medicine.updatedAt && (
          <div>
            <dt>Last Updated</dt>
            <dd>{new Date(medicine.updatedAt).toLocaleDateString()}</dd>
          </div>
        )}
      </dl>

      {error && <div className="error-message">{error}</div>}

      <div className="stock-controls">
        <label>
          Quantity
          <input
            type="number"
            min="1"
            value={adjustQty}
            onChange={(e) => setAdjustQty(e.target.value)}
          />
        </label>
        <button onClick={handleIncrease}>+ Add Stock</button>
        <button onClick={handleDecrease}>- Remove Stock</button>
      </div>

      <div className="details-actions">
        {onEdit && <button onClick={() => onEdit(medicine)}>Edit</button>}
        <button onClick={handleDelete} className="danger">
          Delete
        </button>
      </div>
    </div>
  );
}