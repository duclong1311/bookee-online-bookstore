import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
    carts: [],
};

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        doAddBookAction: (state, action) => {
            let orders = [...state.carts];
            const item = action.payload;

            const isExistIndex = orders.findIndex(c => c._id === item._id);

            if (isExistIndex > -1) {
                orders[isExistIndex].quantity += item.quantity;
                if (orders[isExistIndex].quantity > orders[isExistIndex].detail.quantity) {
                    orders[isExistIndex].quantity = orders[isExistIndex].detail.quantity
                }
            } else {
                orders.push(action.payload);
            }

            state.carts = orders;

            message.success("Sản phẩm đã được thêm vào Giỏ hàng");
        },
        doUpdateCartAction: (state, action) => {
            let orders = [...state.carts];
            const item = action.payload;

            const isExistIndex = orders.findIndex(c => c._id === item._id);

            if (isExistIndex > -1) {
                orders[isExistIndex].quantity = item.quantity;
                if (orders[isExistIndex].quantity > orders[isExistIndex].detail.quantity) {
                    orders[isExistIndex].quantity = orders[isExistIndex].detail.quantity
                }
            } else {
                orders.push(action.payload);
            }

            state.carts = orders;
        },
        doDeleteBookAction: (state, action) => {
            let orders = [...state.carts];

            const filtered = orders.filter(item => item._id !== action.payload._id);

            state.carts = filtered;
            message.success("Xóa sản phẩm thành công");
        },
        doClearCartAction: (state, action) => {
            let order = [];
            state.carts = order;
        }
    },
});

export const { doAddBookAction, doDeleteBookAction, doUpdateCartAction, doClearCartAction } = orderSlice.actions;

export default orderSlice.reducer;
