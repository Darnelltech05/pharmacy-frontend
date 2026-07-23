import React, { useEffect, useState } from "react";
import {
    getAllOrders,
    searchOrders,
    filterOrdersByStatus
} from "../../services/orderService";

import OrderDetails from "./OrderDetails";


function OrderHistory() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [username, setUsername] = useState("");
    const [status, setStatus] = useState("");


    useEffect(() => {
        fetchOrders();
    }, []);



    const fetchOrders = async () => {

        try {

            const data = await getAllOrders();

            setOrders(data);

        } catch (error) {

            console.error(error);
            setOrders([]);

        } finally {

            setLoading(false);

        }
    };



    const handleSearch = async () => {

        try {

            const data = await searchOrders(username);

            setOrders(data);

        } catch (error) {

            console.error(error);

        }

    };



    const handleStatusFilter = async () => {

        try {

            const data = await filterOrdersByStatus(status);

            setOrders(data);

        } catch (error) {

            console.error(error);

        }

    };



    if (loading) {
        return <p>Loading orders...</p>;
    }



    return (

        <div style={{ padding: "20px" }}>


            <h2>Order History</h2>


            <div style={{ marginBottom: "20px" }}>


                <input
                    type="text"
                    placeholder="Search username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />


                <button
                    onClick={handleSearch}
                    style={{ marginLeft: "10px" }}
                >
                    Search
                </button>



                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ marginLeft: "20px" }}
                >

                    <option value="">
                        Select Status
                    </option>

                    <option value="PENDING">
                        PENDING
                    </option>

                    <option value="PAID">
                        PAID
                    </option>

                    <option value="PROCESSING">
                        PROCESSING
                    </option>

                    <option value="SHIPPED">
                        SHIPPED
                    </option>

                    <option value="DELIVERED">
                        DELIVERED
                    </option>

                </select>


                <button
                    onClick={handleStatusFilter}
                    style={{ marginLeft: "10px" }}
                >
                    Filter
                </button>


                <button
                    onClick={fetchOrders}
                    style={{ marginLeft: "10px" }}
                >
                    Reset
                </button>


            </div>



            {orders.length === 0 ? (

                <p>No orders found.</p>

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
                        <th>User</th>
                        <th>Status</th>
                        <th>Total Amount</th>
                        <th>Shipping Address</th>
                        <th>Clinic Pickup</th>

                    </tr>

                    </thead>



                    <tbody>

                    {orders.map((order) => (

                        <tr
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            style={{
                                cursor: "pointer"
                            }}
                        >

                            <td>
                                {order.id}
                            </td>


                            <td>
                                {order.user?.username}
                            </td>


                            <td>
                                {order.status}
                            </td>


                            <td>
                                R {order.totalAmount}
                            </td>


                            <td>
                                {order.shippingAddress}
                            </td>


                            <td>
                                {order.clinicPickupLocation}
                            </td>


                        </tr>

                    ))}


                    </tbody>


                </table>

            )}



            <OrderDetails
                selectedOrder={selectedOrder}
            />


        </div>

    );

}


export default OrderHistory;