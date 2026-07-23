import axios from "axios";

const BASE_URL = "http://localhost:8080/api/medicines";

// TEMPORARY: backend currently uses Spring's default Basic Auth
// (generated password, changes every restart). Replace this whole
// auth block once Person 1's JWT SecurityConfig is merged in —
// at that point this should read a token from AuthContext/localStorage
// and send it as a Bearer header instead.
const TEMP_BASIC_AUTH = {
  username: "user",
  password: "PASTE_YOUR_CURRENT_GENERATED_PASSWORD_HERE",
};

const client = axios.create({
  baseURL: BASE_URL,
  auth: TEMP_BASIC_AUTH,
});

// NOTE: backend doesn't wrap responses in Response<T> yet.
// If/when it does, change `res.data` to `res.data.data` in every
// method below (one team-wide change, keep this comment until then).

export const medicineService = {
  getAll: async () => {
    const res = await client.get("");
    return res.data;
  },

  getById: async (id) => {
    const res = await client.get(`/${id}`);
    return res.data;
  },

  search: async ({ name, category }) => {
    const res = await client.get("/search", {
      params: { name: name || undefined, category: category || undefined },
    });
    return res.data;
  },

  create: async (medicine) => {
    const res = await client.post("", medicine);
    return res.data;
  },

  update: async (id, medicine) => {
    const res = await client.put(`/${id}`, medicine);
    return res.data;
  },

  remove: async (id) => {
    await client.delete(`/${id}`);
  },

  setStock: async (id, stockQuantity) => {
    const res = await client.patch(`/${id}/stock`, { stockQuantity });
    return res.data;
  },

  increaseStock: async (id, quantity) => {
    const res = await client.patch(`/${id}/stock/increase`, { quantity });
    return res.data;
  },

  decreaseStock: async (id, quantity) => {
    const res = await client.patch(`/${id}/stock/decrease`, { quantity });
    return res.data;
  },
};
