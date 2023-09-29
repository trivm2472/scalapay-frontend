import React, { useState, useEffect } from "react";
import "./ProductPage.css";
import iphone from "../../images/iphone-14-pro-max-tim-thumb-600x600.jpg";
import products from "../../product/Product";
import ShoppingCartIcon from "../../images/grocery-store.png";
import { Link } from "react-router-dom";

function setCookieWithArray(name, array, days) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  const jsonString = JSON.stringify(array);
  const cookieValue =
    encodeURIComponent(jsonString) +
    "; expires=" +
    expirationDate.toUTCString();
  document.cookie = name + "=" + cookieValue;
}

// Function to get a cookie and parse it as an array of objects
function getCookieAsArray(name) {
  const cookieString = document.cookie;
  const cookies = cookieString.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + "=")) {
      const jsonString = decodeURIComponent(cookie.substring(name.length + 1));
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        console.error("Error parsing cookie:", error);
      }
    }
  }

  // Return an empty array if the cookie with the specified name is not found or cannot be parsed.
  return [];
}

function ProductPage() {
  const handleAddToCart = (id) => {
    // Show the popup when the product is added to the cart
    setShowPopup(true);
    // Hide the popup after 2 seconds
    setTimeout(() => {
      setShowPopup(false);
    }, 800);
    const cartData = getCookieAsArray("cart");
    if (cartData.length > 0) {
      for (let i = 0; i < cartData.length; i++) {
        if (id == cartData[i].id) {
          cartData[i].quantity++;
          setCookieWithArray("cart", cartData, 5);
          return;
        }
      }
    }
    var temp = products.find((item) => item.id == id);
    temp.quantity = 1;
    cartData.push(temp);
    setCookieWithArray("cart", cartData, 5);
    return;
  };
  const [showPopup, setShowPopup] = useState(false);
  return (
    <div className="product-page">
      <h1 style={{ flexBasis: 1 }}>Cellphone Products</h1>
      <Link to="/cart">
        <img
          src={ShoppingCartIcon}
          alt={"Gio hang"}
          style={{
            width: 45,
            height: 45,
            flexBasis: 1,
            position: "absolute",
            top: 15,
            right: 40,
          }}
        />
      </Link>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img
              src={product.image}
              alt={product.name}
              style={{ height: 150 }}
            />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price.toFixed(2)}</p>
            <button
              className="button"
              onClick={() => {
                handleAddToCart(product.id);
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      {showPopup && (
        <div
          className="popup"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: 'lightblue',
            height: 160,
            paddingLeft: 60,
            paddingRight: 60,
            fontSize: 30,
            borderRadius: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          Product added to cart!
        </div>
      )}
    </div>
  );
}

export default ProductPage;
