import { useEffect, useState } from "react";

function MyCart() {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get the logged-in user
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      setUserId(user.id);
      const userCart = JSON.parse(localStorage.getItem(`cartItems_${user.id}`)) || [];
      setCartItems(userCart);
    }
  }, []);

  const saveCart = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem(`cartItems_${userId}`, JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    saveCart(updatedCart);
  };

  const handleQuantityChange = (id, type) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        if (type === "increase") {
          item.quantity += 1;
        } else if (type === "decrease" && item.quantity > 1) {
          item.quantity -= 1;
        }
      }
      return item;
    });
    saveCart(updatedCart);
  };

  if (!userId) {
    return <h1>Please log in to view your cart.</h1>;
  }

  return (
    <div className="mycart-container">
      <h1>My Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div>
                <img src={item.image} alt={item.productName} width="100" />
                <h2>{item.productName}</h2>
              </div>
              <div>
                <p>Price: ₹{item.price * item.quantity}</p>
                <p>Quantity: {item.quantity}</p>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(item.id, "decrease")}>-</button>
                  <button onClick={() => handleQuantityChange(item.id, "increase")}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div>
        <h2>Total Amount: ₹
          {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
        </h2>
      </div>
      <button>Place Order</button>
    </div>
  );
}

export default MyCart;
