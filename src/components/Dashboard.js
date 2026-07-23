import React from "react";
import DashboardStats from "./dashboard/DashboardStats";
import RecentOrders from "./dashboard/RecentOrders";

function Dashboard() {
    return (
        <div style={{ padding: "20px" }}>

            <h1>SA MedConnect Dashboard</h1>

            <p>
                Welcome to SA MedConnect!
            </p>

            <hr />

            <DashboardStats />

            <hr />

            <RecentOrders />

        </div>
    );
}

export default Dashboard;