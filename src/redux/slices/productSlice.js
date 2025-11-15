import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:5000/api/products";

// Async CRUD calls
export const fetchProducts = createAsyncThunk("products/get", async () => {
    const res = await axios.get(API);
    return res.data;
});

export const addProduct = createAsyncThunk("products/add", async (product) => {
    const res = await axios.post(API, product);
    return res.data;
});

export const updateProduct = createAsyncThunk(
    "products/update",
    async ({ id, data }) => {
        const res = await axios.put(`${API}/${id}`, data);
        return res.data;
    }
);

export const deleteProduct = createAsyncThunk("products/delete", async (id) => {
    await axios.delete(`${API}/${id}`);
    return id;
});

const productSlice = createSlice({
    name: "products",
    initialState: {
        items: [],
        loading: false,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const idx = state.items.findIndex(p => p._id === action.payload._id);
                state.items[idx] = action.payload;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.items = state.items.filter(p => p._id !== action.payload);
            });
    },
});

export default productSlice.reducer;
