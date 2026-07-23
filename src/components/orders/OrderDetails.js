import React, { useState } from "react";
import { updateOrderStatus } from "../../services/orderService";

function OrderDetails({ selectedOrder }) {

    const [status, setStatus] = useState("");

    if (!selectedOrder) {
        return (
            <div style={{ marginTop: "30px" }}>
                <h2>Order Details</h2>
                <p>Select an order to view its details.</p>
            </div>
        );
    }

    const handleUpdateStatus = async () => {
        try {

            const newStatus = status || selectedOrder.status;

            await updateOrderStatus(selectedOrder.id, newStatus);

            alert("Order status updated successfully!");

            window.location.reload();

        } catch (error) {

            console.error(error);
            alert("Failed to update order status.");

        }
    };

    return (
        <div style={{ marginTop: "30px" }}>

            <h2>Order Details</h2>

            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
            <p><strong>Customer:</strong> {selectedOrder.user?.username}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Total Amount:</strong> R {selectedOrder.totalAmount}</p>
            <p><strong>Shipping Address:</strong> {selectedOrder.shippingAddress}</p>
            <p><strong>Clinic Pickup:</strong> {selectedOrder.clinicPickupLocation}</p>

            <hr />

            <h3>Update Status</h3>

            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="">Select Status</option>
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
            </select>

            <button
                style={{
                    marginLeft: "10px",
                    padding: "6px 12px",
                    cursor: "pointer"
                }}
                onClick={handleUpdateStatus}
            >
                Update Status
            </button>

            <hr />

            <h3>Medicines</h3>

            <table
                border="1"
                cellPadding="10"
                style={{
                    borderCollapse: "collapse",
                    width: "100%"
                }}
            >
                <thead>
                <tr>
                    <th>Medicine</th>
                    <th>Quantity</th>
                    <th>Price</th>
                </tr>
                </thead>

                <tbody>
                {selectedOrder.orderItems &&
                    selectedOrder.orderItems.map((item) => (
                        <tr key={item.id}>
                            <td>{item.medicine?.name}</td>
                            <td>{item.quantity}</td>
                            <td>R {item.priceAtTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}

export default OrderDetails;