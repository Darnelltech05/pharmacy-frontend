import React from "react";

function OrderStatus({ status }) {
    let color = "gray";

    switch (status) {
        case "PENDING":
            color = "orange";
            break;
        case "APPROVED":
            color = "green";
            break;
        case "REJECTED":
            color = "red";
            break;
        case "COMPLETED":
            color = "blue";
            break;
        default:
            color = "gray";
    }

    return (
        <span
            style={{
                color,
                fontWeight: "bold",
                padding: "5px 10px",
                border: `1px solid ${color}`,
                borderRadius: "5px",
            }}
        >
            {status}
        </span>
    );
}

export default OrderStatus;