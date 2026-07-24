import React, { useState } from "react";

// Calls onSearch({ name, category }) whenever the user searches or clears.
// Parent (MedicineList) owns the actual data fetching.
export default function MedicineSearch({ onSearch }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ name, category });
  };

  const handleClear = () => {
    setName("");
    setCategory("");
    onSearch({ name: "", category: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-5">
        <label className="form-label small fw-bold text-muted text-uppercase" style={{ letterSpacing: '0.05em' }}>Name</label>
        <input
          type="text"
          className="form-control border-light shadow-sm py-2"
          placeholder="Search by name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="col-md-4">
        <label className="form-label small fw-bold text-muted text-uppercase" style={{ letterSpacing: '0.05em' }}>Category</label>
        <input
          type="text"
          className="form-control border-light shadow-sm py-2"
          placeholder="Filter by category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <div className="col-md-3 d-flex align-items-end gap-2">
        <button type="submit" className="btn btn-primary flex-grow-1 fw-bold py-2 shadow-sm">Search</button>
        <button type="button" className="btn btn-light border flex-grow-1 fw-bold py-2 shadow-sm" onClick={handleClear}>
          Clear
        </button>
      </div>
    </form>
  );
}
