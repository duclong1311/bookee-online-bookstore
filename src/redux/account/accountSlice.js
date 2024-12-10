import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: {
        email: "",
        phone: "",
        fullName: "",
        role: "",
        avatar: "",
        id: ""
    }
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        doLoginAction: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.isLoading = false;
        },
        doGetAccountAction: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.isLoading = false;
        },
        doLogoutAction: (state, action) => {
            localStorage.removeItem('access_token');
            state.isAuthenticated = false;
            state.user = {
                email: "",
                phone: "",
                fullName: "",
                role: "",
                avatar: "",
                id: ""
            }
        },
        doUpdateUserInfoAction: (state, action) => {
            state.user.avatar = action.payload.avatar;
            state.user.phone = action.payload.phone;
            state.user.fullName = action.payload.fullName;
        },
        doUploadAvatarAction: (state, action) => {
            state.tempAvatar = action.payload.avatar
        }
    },
});

export const { doLoginAction, doLogoutAction, doUpdateUserInfoAction, doUploadAvatarAction, doGetAccountAction } = accountSlice.actions;

export default accountSlice.reducer;
