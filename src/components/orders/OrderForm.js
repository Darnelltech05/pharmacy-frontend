import React, { useState } from "react";
import { createOrder } from "../../services/orderService";

function OrderForm() {
    const [userId, setUserId] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");
    const [clinicPickupLocation, setClinicPickupLocation] = useState("");
    const [medicineId, setMedicineId] = useState("");
    const [quantity, setQuantity] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const orderData = {
            userId: Number(userId),
            shippingAddress,
            clinicPickupLocation,
            items: [
                {
                    medicineId: Number(medicineId),
                    quantity: Number(quantity),
                },
            ],
        };

        try {
            const response = await createOrder(orderData);

            alert("Order created successfully!");
            console.log(response);

            setUserId("");
            setShippingAddress("");
            setClinicPickupLocation("");
            setMedicineId("");
            setQuantity("");
        } catch (error) {
            console.error(error);
            alert("Failed to create order.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Create Order</h2>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>User ID</label>
                    <br />
                    <input
                        type="number"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Shipping Address</label>
                    <br />
                    <input
                        type="text"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Clinic Pickup Location</label>
                    <br />
                    <input
                        type="text"
                        value={clinicPickupLocation}
                        onChange={(e) => setClinicPickupLocation(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Medicine ID</label>
                    <br />
                    <input
                        type="number"
                        value={medicineId}
                        onChange={(e) => setMedicineId(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Quantity</label>
                    <br />
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Create Order
                </button>
            </form>
        </div>
    );
}

export default OrderForm;