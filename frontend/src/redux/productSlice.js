import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        cart: [],
        addresses: [],
        selectedAddress: null
    },
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setCart: (state, action) => {
            state.cart = action.payload
        },
        addAddress: (state, action) => {
            if (!state.addresses) state.addresses = [];
            state.addresses.push(action.payload)
        },
        setSelectedAddress: (state, action) => {
            state.selectedAddress = action.payload
        },
        deleteAddress: (state, action) => {
            state.addresses = state.addresses.filter((_, index) => index !== action.payload);

            if (state.selectedAddress === action.payload) {
                state.selectedAddress = null;
            } else if (state.selectedAddress > action.payload) {
                state.selectedAddress -= 1;
            }
        },
        clearAddresses: (state) => {
            state.addresses = [];
            state.selectedAddress = null;
            state.cart = [];
        },
        // Add this to your productSlice.js reducers
        setAddresses: (state, action) => {
            state.addresses = action.payload; // This sets the addresses from the DB
            if (action.payload.length > 0) {
                state.selectedAddress = 0; // Automatically select the first one
            }
        },
    }
})

export const { setProducts, setCart, addAddress, setSelectedAddress, deleteAddress, clearAddresses, setAddresses } = productSlice.actions
export default productSlice.reducer