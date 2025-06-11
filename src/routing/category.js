import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client directly within this file
// IMPORTANT: Use your actual Supabase project URL and public anon key.
const supabaseUrl = "https://mrboihookikugdivqzlb.supabase.co";
// MAKE SURE THIS KEY IS EXACTLY COPIED FROM YOUR SUPABASE PROJECT SETTINGS -> API -> anon (public)
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yYm9paG9va2lrdWdkaXZxemxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MDQwNjMsImV4cCI6MjA2MzQ4MDA2M30.CZjpYiLtxXgl4SdUxtXI2hWKFNj1ODgd5LRO4H8NZyU"; // **VERIFY THIS KEY**
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function Category({ categoryName }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('categories') // Your table name (should be 'categories')
          .select('*');

        if (fetchError) {
          throw fetchError;
        }

        const category = data.find((cat) => cat.category.toLowerCase() === categoryName.toLowerCase());
        setProducts(category && Array.isArray(category.items) ? category.items : []);
      } catch (error) {
        console.error("Error fetching products from Supabase:", error.message);
        setError("Failed to load products for this category. Please check your network and Supabase configuration.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  const addToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }

    const cartKey = `cartItems_${user.id}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingItem = existingCart.find((item) => item.productName === product.productName);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem(cartKey, JSON.stringify(existingCart));
    alert(`${product.productName} added to cart!`);
  };

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading {categoryName} products...</p>;
  }

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>;
  }

  if (products.length === 0) {
    return <p style={{ textAlign: 'center' }}>No {categoryName} products found.</p>;
  }

  return (
    <div className="product-details-container" style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Products
      </h1>
      <div className="product-details">
        {products.map((product, index) => (
          // REMINDER: Ensure `className` is used instead of `class` if you add CSS classes here
          <div key={`${categoryName}-${product.productName}-${index}`} className="product-card" >
            <Link
              to={`/product/${categoryName.toLowerCase()}/${product.productName.replace(/\s+/g, '-').toLowerCase()}`}
              state={{ 
                categoryName: categoryName,
                image: product.image,
                productName: product.productName,
                price: product.price,
              }}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <img src={product.image} alt={product.productName} width="200" style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px', marginBottom: '10px' }} />
              <h3>{product.productName}</h3>
              <p>Price: ₹{product.price}</p>
            </Link>
            <button
              onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;