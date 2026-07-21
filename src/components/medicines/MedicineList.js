import React, { useEffect, useState } from "react";
import { medicineService } from "../../services/medicineService";
import { getMedicineStatus } from "../../utils/medicineStatus";
import MedicineSearch from "./MedicineSearch";
import MedicineForm from "./MedicineForm";
import MedicineDetails from "./MedicineDetails";
import "../../styles/medicines.css";

export default function MedicineList() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [editingMedicine, setEditingMedicine] = useState(null);

  const loadAll = async () => {
    try {
      setLoading(true);
      const data = await medicineService.getAll();
      setMedicines(data);
      setError("");
    } catch (err) {
      setError("Could not load medicines. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSearch = async ({ name, category }) => {
    if (!name && !category) {
      loadAll();
      return;
    }
    try {
      setLoading(true);
      const data = await medicineService.search({ name, category });
      setMedicines(data);
      setError("");
    } catch (err) {
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (medicine) => {
    await medicineService.create(medicine);
    setView("list");
    loadAll();
  };

  const handleUpdate = async (medicine) => {
    await medicineService.update(editingMedicine.id, medicine);
    setView("list");
    setEditingMedicine(null);
    loadAll();
  };

  const openDetails = (id) => {
    setSelectedId(id);
    setView("details");
  };

  const openEdit = (medicine) => {
    setEditingMedicine(medicine);
    setView("edit");
  };

  if (view === "create") {
    return (
      <MedicineForm onSubmit={handleCreate} onCancel={() => setView("list")} />
    );
  }

  if (view === "edit") {
    return (
      <MedicineForm
        initialData={editingMedicine}
        onSubmit={handleUpdate}
        onCancel={() => setView("list")}
      />
    );
  }

  if (view === "details") {
    return (
      <div className="medicine-details">
        <button onClick={() => setView("list")}>&larr; Back to list</button>
        <MedicineDetails
          medicineId={selectedId}
          onEdit={openEdit}
          onDeleted={() => {
            setView("list");
            loadAll();
          }}
        />
      </div>
    );
  }

  return (
    <div className="medicine-list">
      <div className="medicine-list-header">
        <div>
          <h2>Medicines</h2>
          <div className="subtitle">
            {medicines.length} item{medicines.length === 1 ? "" : "s"} in catalog
          </div>
        </div>
        <button onClick={() => setView("create")}>+ Add Medicine</button>
      </div>

      <MedicineSearch onSearch={handleSearch} />

      {loading && <div>Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && medicines.length === 0 && (
        <div>No medicines found. Add your first one above.</div>
      )}

      {!loading && medicines.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Expiry</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => {
              const status = getMedicineStatus(m);
              return (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.category}</td>
                  <td>
                    <span className={`status-badge ${status.key}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="price">R{Number(m.price).toFixed(2)}</td>
                  <td className="stock">{m.stockQuantity}</td>
                  <td>{m.expiryDate}</td>
                  <td>
                    <button onClick={() => openDetails(m.id)}>View</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}