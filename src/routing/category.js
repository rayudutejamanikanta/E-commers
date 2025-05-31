import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Category({ categoryName }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/categories")
      .then((response) => response.json())
      .then((data) => {
        // Find the category based on the provided categoryName prop
        const category = data.find((category) => category.category === categoryName);
        setProducts(category ? category.items : []);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [categoryName]);

  const addToCart = (product) => {
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
    <div className="product-details-container">
      <h1>{categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Products</h1>
      <div className="product-details">
        {products.map((product, index) => (
          <div key={index}>
            <Link
              to={`/home/fulldetails`}
              state={{
                image: product.image,
                productName: product.productName,
                price: product.price
              }}
            >
              <img src={product.image} alt={product.productName} width="200" />
            </Link>

            <h2>{product.productName}</h2>
            <h3>Price: ₹{product.price}</h3>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;
