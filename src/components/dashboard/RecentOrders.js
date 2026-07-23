import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../services/orderService";

function RecentOrders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadRecentOrders();
    }, []);


    const loadRecentOrders = async () => {
        try {

            const data = await getAllOrders();

            console.log("Dashboard Orders:", data);

            setOrders(data.slice(0, 5));

        } catch (error) {

            console.error("Error loading recent orders:", error);

        }
    };


    return (
        <div>

            <h2>Recent Orders</h2>


            {orders.length === 0 ? (

                <p>No orders available yet.</p>

            ) : (

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
                        <th>Order ID</th>
                        <th>Status</th>
                        <th>Total Amount</th>
                        <th>Clinic Pickup</th>
                    </tr>

                    </thead>


                    <tbody>

                    {orders.map(order => (

                        <tr key={order.id}>

                            <td>
                                {order.id}
                            </td>


                            <td>
                                {order.status}
                            </td>


                            <td>
                                R {order.totalAmount}
                            </td>


                            <td>
                                {order.clinicPickupLocation}
                            </td>

                        </tr>

                    ))}


                    </tbody>

                </table>

            )}

        </div>
    );
}


export default RecentOrders;