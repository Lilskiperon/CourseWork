import { BrowserRouter, Routes, Route,} from 'react-router-dom';
import React from 'react';
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

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
} from './pages';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <Routes>
              <Route path="/" element={<Home/> } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/favorites" element={<FavoriteProductsPage />} />
              <Route path="/compare" element={<CompareProductsPage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/news/:id" element={<NewsPage />} />
              <Route path="/product/:id"element={<ProductPage/>} />
              <Route path="/profile" element={<ProfilePage/>}/>
              <Route path="/order-process" element={<OrderProcessPage/>}/>
              <Route path="/cart" element={<CartPage/>}/>
              <Route path="*" element={<div>Страница не найдена</div>} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
        // <Route path="/catalog" component={Catalog} />
        // <Route path="/catalog/:id" render={() => <ProductCard/>}/>
        // <Route path="/servise" component={Servise} />
        // <Route path="/about" component={About} />