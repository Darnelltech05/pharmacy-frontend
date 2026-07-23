import axios from "axios";

const API_URL = "http://localhost:8080/api/orders";


const getAuthHeader = () => {

    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};


export const getAllOrders = async () => {

    const response = await axios.get(
        API_URL,
        getAuthHeader()
    );

    return response.data;
};


export const createOrder = async (orderData) => {

    const response = await axios.post(
        API_URL,
        orderData,
        getAuthHeader()
    );

    return response.data;
};



export const searchOrders = async (username) => {

    const response = await axios.get(
        `${API_URL}/search?username=${username}`,
        getAuthHeader()
    );

    return response.data;
};



export const filterOrdersByStatus = async (status) => {

    const response = await axios.get(
        `${API_URL}/status?status=${status}`,
        getAuthHeader()
    );

    return response.data;
};



export const updateOrderStatus = async (id, status) => {

    const response = await axios.patch(
        `${API_URL}/${id}/status?status=${status}`,
        {},
        getAuthHeader()
    );

    return response.data;
};