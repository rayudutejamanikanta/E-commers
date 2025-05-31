import { useLocation } from "react-router-dom";


function FullDetails() {
  const location = useLocation();
  const { image, productName, price } = location.state || {};

  if (!image || !productName || !price) {
    return <h1>Invalid product details. Please check the URL and try again.</h1>;
  }

  const product = {
    id: productName,
    productName: productName,
    price: parseFloat(price),
    image: image,
  };

  const handleAddToCart = () => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }
  
    const cartKey = `cartItems_${user.id}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];
  
    const existingItem = existingCart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
  
    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    alert(`${product.productName} added to cart!`);
  };

  return (
    <div className="full-details-container">
      <div className="image-container">
        <img src={product.image} alt={product.productName} />
      </div>
      <div className="details-container">
        <h1>Product Details</h1>
        <h2>{product.productName}</h2>
        <h3>Price: ₹{product.price.toFixed(2)}</h3>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}

export default FullDetails;