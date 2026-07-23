import React from "react";

function DashboardCard({ title, value }) {
    return (
        <div style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            width: "200px",
            textAlign: "center",
            margin: "10px"
        }}>
            <h3>{title}</h3>
            <h2>{value}</h2>
        </div>
    );
}

export default DashboardCard;