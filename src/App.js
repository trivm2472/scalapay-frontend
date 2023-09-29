import React from 'react';
import ProductPage from './pages/productPage/ProductPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PaymentPage from './pages/paymentPage/PaymentPage';

function App() {
  return (
    // <div className="product-page">
    //   <h1>Cellphone Products</h1>
    //   <div className="product-grid">
    //     {products.map((product) => (
    //       <div className="product-card" key={product.id}>
    //         <img src={product.image} alt={product.name} />
    //         <h2>{product.name}</h2>
    //         <p>{product.description}</p>
    //         <p>Price: ${product.price.toFixed(2)}</p>
    //         <button>Add to Cart</button>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductPage />} />
        <Route path="/cart" element={<PaymentPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
