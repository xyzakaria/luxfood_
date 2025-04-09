import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ShoppingList from './components/ShoppingList';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import { ShoppingListProvider } from './contexts/ShoppingListContext';
import { AuthProvider } from './contexts/AuthContext';
import './i18n';

function App() {
  return (
    <AuthProvider>
      <ShoppingListProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </div>
            <ShoppingList />
          </div>
        </Router>
      </ShoppingListProvider>
    </AuthProvider>
  );
}

export default App;