// Signature status logic used by both the list and details views.
// Order matters: expired overrides everything, then low stock,
// then expiring soon, then the default "in stock" state.
export function getMedicineStatus(medicine) {
  const today = new Date();
  const expiry = new Date(medicine.expiryDate);
  const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry < 0) {
    return { key: "expired", label: "Expired" };
  }
  if (medicine.stockQuantity <= 10) {
    return { key: "low-stock", label: "Low Stock" };
  }
  if (daysUntilExpiry <= 30) {
    return { key: "expiring-soon", label: "Expiring Soon" };
  }
  return { key: "in-stock", label: "In Stock" };
}