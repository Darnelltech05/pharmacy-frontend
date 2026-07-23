import api from "./api";

export const getMedicines = () => {
    return api.get("/medicines");
};

export const getOrders = () => {
    return api.get("/orders");
};