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
    <form onSubmit={handleSubmit} className="medicine-search">
      <input
        type="text"
        placeholder="Search by name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Filter by category..."
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button type="submit">Search</button>
      <button type="button" onClick={handleClear}>
        Clear
      </button>
    </form>
  );
}
