import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { medicineService } from "../../services/medicineService";
import { getMedicineStatus } from "../../utils/medicineStatus";
import { getMedicineImage } from "../../utils/medicineImages";
import { useNotification } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../common/Navbar";
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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success: notifySuccess, error: notifyError } = useNotification();
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'PHARMACIST');
  const isPharmacist = user && user.role === 'PHARMACIST';
  const isCustomer = user && user.role === 'CUSTOMER';

  const loadAll = async () => {
    try {
      setLoading(true);
      const data = await medicineService.getAll();
      setMedicines(data);
      setError("");
    } catch (err) {
      const msg = "Could not load medicines. Please check your connection.";
      setError(msg);
      notifyError(msg);
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
      if (data.length === 0) {
        notifyError("No medicines found matching your criteria.");
      }
    } catch (err) {
      setError("Search failed.");
      notifyError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (medicine) => {
    try {
      await medicineService.create(medicine);
      notifySuccess("Medicine added successfully!");
      setView("list");
      loadAll();
    } catch (err) {
      notifyError("Failed to add medicine.");
    }
  };

  const handleUpdate = async (medicine) => {
    try {
      await medicineService.update(editingMedicine.id, medicine);
      notifySuccess("Medicine updated successfully!");
      setView("list");
      setEditingMedicine(null);
      loadAll();
    } catch (err) {
      notifyError("Failed to update medicine.");
    }
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
      <div className="medicine-details container py-5">
        <button className="btn btn-link text-decoration-none p-0 mb-4" onClick={() => setView("list")}>&larr; Back to catalog</button>
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
    <>
      <Navbar />
      <div className="medicine-list container py-5 fade-in">
        <div className="medicine-list-header d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
          <div>
            <h2 className="text-primary fw-bold mb-1">Medicine Catalog</h2>
            <div className="subtitle text-muted">
              {medicines.length} professional pharmaceutical products available
            </div>
          </div>
          {isAdmin && (
            <button className="btn btn-primary mt-3 mt-md-0 px-4" onClick={() => setView("create")}>
              Add New Product
            </button>
          )}
        </div>

        <div className="card border-0 shadow-sm p-4 mb-5 bg-white rounded-4">
          <MedicineSearch onSearch={handleSearch} />
        </div>

        {loading && (
          <div className="row g-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 border-0 shadow-sm p-4">
                  <div className="skeleton skeleton-title mb-3"></div>
                  <div className="skeleton skeleton-text"></div>
                  <div className="skeleton skeleton-text"></div>
                  <div className="skeleton skeleton-card mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && <div className="alert alert-danger border-0 rounded-3 mb-4 fade-in">{error}</div>}

        {!loading && !error && medicines.length === 0 && (
          <div className="empty-state fade-in bg-white border">
            <div className="mb-4">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><path d="M10 21H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5.5"/><circle cx="9" cy="9" r="2"/></svg>
            </div>
            <h3>No Medicines Found</h3>
            <p className="text-muted mb-4">We couldn't find any medicines matching your criteria in our database.</p>
            <button className="btn btn-outline-primary" onClick={loadAll}>
              Reset Filter
            </button>
          </div>
        )}

        {!loading && medicines.length > 0 && (
          <div className="row g-4 fade-in">
            {medicines.map((m) => {
              const status = getMedicineStatus(m);
              const isOutOfStock = status.key === 'out_of_stock';
              
              return (
                <div key={m.id} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-sm medicine-card overflow-hidden">
                    <div className="medicine-image-container bg-light">
                      <img 
                        src={getMedicineImage(m)} 
                        alt={m.name}
                        className="medicine-card-img"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop';
                        }}
                      />
                    </div>
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <span className={`badge badge-pill badge-soft-${status.key === 'out_of_stock' || status.key === 'expired' ? 'danger' : status.key === 'low_stock' ? 'warning' : 'success'}`}>
                          {status.label}
                        </span>
                        {m.prescriptionRequired && (
                          <span className="badge badge-pill badge-soft-info">
                            RX Required
                          </span>
                        )}
                      </div>
                      
                      <h5 className="card-title fw-bold mb-1">{m.name}</h5>
                      <p className="text-muted small mb-3">{m.manufacturer || "Generic Pharmaceutical"}</p>
                      
                      <div className="mb-4">
                        <span className="medicine-category-badge">
                          {m.category}
                        </span>
                        <p className="card-text text-muted small mt-3 line-clamp-2">
                          {m.description || "Pharmaceutical product description not available."}
                        </p>
                      </div>

                      <div className="mt-auto pt-3 border-top border-light">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <div>
                            <span className="text-muted small d-block fw-bold text-uppercase opacity-75" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Unit Price</span>
                            <span className="price-tag">R {Number(m.price).toFixed(2)}</span>
                          </div>
                          <div className="text-end">
                            <span className="text-muted small d-block fw-bold text-uppercase opacity-75" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Dosage & Expiry</span>
                            <span className="text-dark small fw-bold">
                              {m.dosage || "Standard"} • {m.expiryDate ? new Date(m.expiryDate).toLocaleDateString() : "Valid"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="d-grid gap-2">
                          <button 
                            className="btn btn-primary btn-order py-2 fw-bold"
                            onClick={() => navigate('/orders/new', { state: { medicineId: m.id } })}
                            disabled={isOutOfStock}
                          >
                            {isOutOfStock ? 'Out of Stock' : 'Order Now'}
                          </button>
                          <button 
                            className="btn btn-link btn-sm text-muted text-decoration-none fw-semibold"
                            onClick={() => openDetails(m.id)}
                          >
                            View Specifications
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}