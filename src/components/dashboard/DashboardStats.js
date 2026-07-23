import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../services/orderService";
import { getAllMedicines } from "../../services/medicineService";


function DashboardStats() {

    const [medicines, setMedicines] = useState([]);
    const [orders, setOrders] = useState([]);


    useEffect(() => {

        loadDashboardData();

    }, []);



    const loadDashboardData = async () => {

        try {

            const medicineData = await getAllMedicines();
            const orderData = await getAllOrders();


            console.log("Medicines:", medicineData);
            console.log("Orders:", orderData);


            setMedicines(medicineData);
            setOrders(orderData);


        } catch(error) {

            console.error(
                "Dashboard loading error:",
                error
            );

        }

    };



    const pendingOrders = orders.filter(
        order => order.status === "PENDING"
    );


    const completedOrders = orders.filter(
        order =>
            order.status === "COMPLETED"
    );



    return (

        <div>


            <h2>Dashboard Statistics</h2>


            <div
                style={{
                    display:"flex",
                    gap:"20px"
                }}
            >


                <div>
                    <h3>Available Medicines</h3>
                    <p>{medicines.length}</p>
                </div>



                <div>
                    <h3>My Orders</h3>
                    <p>{orders.length}</p>
                </div>



                <div>
                    <h3>Pending Orders</h3>
                    <p>{pendingOrders.length}</p>
                </div>



                <div>
                    <h3>Completed Orders</h3>
                    <p>{completedOrders.length}</p>
                </div>



            </div>


        </div>

    );

}


export default DashboardStats;