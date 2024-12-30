import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/login';
import Layout from './Layout';
import ContactPage from './pages/contact';
import Home from './components/home';
import BookPage from './pages/book';
import RegisterPage from './pages/register';
import { useDispatch, useSelector } from 'react-redux';
import { getAccount } from './services/api';
import { doGetAccountAction, doLoginAction } from './redux/account/accountSlice';
import LoadingPage from './pages/loading';
import ErrorPage from './pages/error';
import AdminPage from './pages/admin';
import PrivateRoute from './pages/protected';
import LayoutAdmin from './LayoutAdmin';
import ManageUserPage from './pages/admin/user';
import MangeBookPage from './pages/admin/book';
import MangeOrderPage from './pages/admin/order';
import './styles/global.scss';
import OrderHistory from './components/order/OrderHistory';
import MangeOrder from './components/admin/order/ManageOrder';

export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.account.isLoading);


  useEffect(() => {
    const getAccountData = async () => {
      if (window.location.pathname === '/login' || window.location.pathname === '/register')
        return;
      const res = await getAccount();
      if (res && res.data) {
        dispatch(doGetAccountAction(res.data));
      }
    }

    getAccountData();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "book/:slug",
          element: <BookPage />,
        },
        {
          path: "order",
          element:
            <PrivateRoute>
              <MangeOrderPage />
            </PrivateRoute>
        },
        {
          path: "order-history",
          element:
            <PrivateRoute>
              <OrderHistory />
            </PrivateRoute>
        },
      ],
    },

    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true, element:
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>,
        },
        {
          path: "dashboard",
          element:
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
        },
        {
          path: "user",
          element:
            <PrivateRoute>
              <ManageUserPage />
            </PrivateRoute>
        },
        {
          path: "book",
          element:
            <PrivateRoute>
              <MangeBookPage />
            </PrivateRoute>
          ,
        },
        {
          path: "order",
          element:
            <PrivateRoute>
              <MangeOrder />
            </PrivateRoute>
          ,
        }
      ],
    },

    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      {isLoading === false
        || window.location.pathname === '/login'
        || window.location.pathname === '/register'
        || window.location.pathname.startsWith('/book')
        || window.location.pathname === '/'
        ?
        <RouterProvider router={router} />
        :
        <LoadingPage />
      }
    </>
  );
}
