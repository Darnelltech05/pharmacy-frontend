import React from "react";
import OrderForm from "./OrderForm";
import OrderHistory from "./OrderHistory";

function OrdersPage() {
    return (
        <div style={{ padding: "20px" }}>
            <h1>Orders</h1>

            <hr />

            <OrderForm />

            <hr />

            <OrderHistory />
        </div>
    );
}

export default OrdersPage;