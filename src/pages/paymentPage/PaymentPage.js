import React, { useState, useEffect } from "react";
import "./PaymentPage.css";
import HomeIcon from "../../images/home-icon-silhouette.png";
import { Link } from "react-router-dom";
import Axios from "axios";

function clearCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

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

function PaymentPage() {
  // Sample cart data (you should replace this with your actual cart data)
  const redirectToExternalPage = (link) => {
    window.location.href = link; // Replace with the external URL
  };
  const [cart, setCart] = useState([]);

  // State to manage order information
  const [orderInfo, setOrderInfo] = useState({
    givenNames: "",
    surname: "",
    email: "",
    address: "",
    currency: "EUR",
    // Add more fields as needed
  });

  // Calculate total, shipping cost, and tax
  const [total, setTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [tax, setTax] = useState(0);

  useEffect(() => {
    // Calculate total cost
    const cartTotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const shipping = 10.0;
    const taxAmount = 0.1 * cartTotal;

    setTotal(cartTotal + shipping + taxAmount);
    setShippingCost(shipping);
    setTax(taxAmount);
  }, [cart]);

  const handleOrderInfoChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo({ ...orderInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    orderInfo.totalMoney = total.toFixed(2).toString();
    orderInfo.taxMoney = tax.toFixed(2).toString();
    orderInfo.shippingMoney = shippingCost.toFixed(2).toString();
    console.log("Order Data:", orderInfo);
    if (cart.length <= 0) {
      alert('Add something to the cart');
      return;
    }
    Axios.post("http://localhost:4000/create-order", orderInfo)
      .then((response) => {
        // Handle the response data here
        console.log(response.data);
        redirectToExternalPage(response.data.checkoutUrl);
      })
      .catch((error) => {
        // Handle errors here
        console.error(error);
        window.alert('Something went wrong (check if the server is running or total money exceed 1500)')
      });
  };

  useEffect(() => {
    const cartData = getCookieAsArray("cart");
    setCart(cartData);
  }, []);

  return (
    <div className="cart-page">
      <Link to="/">
        <img
          src={HomeIcon}
          alt="pic"
          style={{
            position: "absolute",
            width: 45,
            height: 45,
            top: 15,
            right: 40,
          }}
        />
      </Link>

      <div className="cart-column">
        <h2>Your Cart</h2>
        <ul>
          {cart.length > 0 ? (
            <div style={{ minHeight: 215 }}>
              {cart.map((item) => (
                <li key={item.id}>
                  {item.description} - ${item.price.toFixed(2)} x{" "}
                  {item.quantity}
                </li>
              ))}
            </div>
          ) : (
            <div
              style={{
                minHeight: 215,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                fontSize: 40,
              }}
            >
              Your shopping cart is empty
            </div>
          )}
        </ul>
        <div className="totals">
          <p>Shipping Cost: ${shippingCost.toFixed(2)}</p>
          <p>Tax: ${tax.toFixed(2)}</p>
          <p>Total: ${total.toFixed(2)}</p>
        </div>
        <button
          className="button"
          onClick={() => {
            clearCookie("cart");
            setCart([]);
          }}
          style={{ marginTop: 15 }}
        >
          Delete Cart
        </button>
      </div>
      <div className="order-info-column">
        <h2>Order Information</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="givenNames">First Name:</label>
            <input
              type="text"
              id="givenNames"
              name="givenNames"
              value={orderInfo.givenNames}
              onChange={handleOrderInfoChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="surname">Last Name:</label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={orderInfo.fullName}
              onChange={handleOrderInfoChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={orderInfo.email}
              onChange={handleOrderInfoChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={orderInfo.address}
              onChange={handleOrderInfoChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="currency">Currency:</label>
            <input
              type="text"
              id="currency"
              name="currency"
              disabled="true"
              value={orderInfo.currency}
              onChange={handleOrderInfoChange}
              required
            />
          </div>

          {/* Add more form fields as needed */}
          <button type="submit">Place Order</button>
        </form>
      </div>
    </div>
  );
}

export default PaymentPage;
