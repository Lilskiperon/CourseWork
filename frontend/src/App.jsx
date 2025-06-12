/* eslint-disable react/prop-types */
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import { useEffect } from "react";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Loader from "./components/LoaderComponent";
import { useUserStore } from "./stores/useUserStore";
import { useCartStore } from "./stores/useCartStore";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
    Home,
    FavoriteProductsPage,
    CompareProductsPage,
    LoginPage,
    RegisterPage,
    CatalogPage,
    NewsPage,
    ProductPage,
    ProfilePage,
    OrderProcessPage,
    CartPage,
    ErrorPage,
} from './pages';
import DashboardPage from './pages/admin/Dashboard';
import OrdersPage from './pages/admin/Orders';
import ProductsPage from './pages/admin/Products';
import UsersPage from './pages/admin/Users';
import AdminLayout from './layout/admin/AdminLayout';


function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  const { getCartItems, getComparison,getWishlist } = useCartStore();
  useEffect(() => {
    if (!user && !checkingAuth) {
      checkAuth();
    }
  },[checkAuth, checkingAuth, user]);

  useEffect(() => {
		if (!user) return;
    getWishlist();
    getComparison();
		getCartItems();
	}, [getCartItems,getComparison,getWishlist, user]);
  
  if(checkingAuth){
    return <Loader/>;
  }
   return <AppRouter />;
}


  function AppLayout() {
    return (
        <>
            <Header />
             <Outlet />
            <Footer />
        </>
    );
}


const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            { path: "favorites", element: <FavoriteProductsPage /> },
            { path: "compare", element: <CompareProductsPage /> },
            { path: "catalog", element: <CatalogPage /> },
            { path: "news/:id", element: <NewsPage /> },
            { path: "product/:productId", element: <ProductPage /> },
            { path: "profile/:tab?", element: <ProfilePage /> },
            { path: "order-process", element: <OrderProcessPage /> },
            { path: "cart", element: <CartPage /> },
            { path: "*", element: <ErrorPage /> },
        ],
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {path: "orders", element: <OrdersPage />},
            {path: "products", element: <ProductsPage/>},
            {path: "customers", element: <UsersPage/>},
            // добавь сюда другие admin-страницы, если есть
        ],
    },
]);


  function AppRouter() {
    return (
        <>
            <RouterProvider router={router} />
            <Toaster />
        </>
    );
  }



export default App;
