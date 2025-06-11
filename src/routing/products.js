import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Correct import for Link
import { createClient } from "@supabase/supabase-js"; // Import Supabase client

// Initialize Supabase client
// IMPORTANT: Use your actual Supabase project URL and public anon key.
const supabaseUrl = "https://mrboihookikugdivqzlb.supabase.co"; // Your Supabase URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yYm9paG9va2lrdWdkaXZxemxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MDQwNjMsImV4cCI6MjA2MzQ4MDA2M30.CZjpYiLtxXgl4SdUxtXI2hWKFNj1ODgd5LRO4H8NZyU"; // Your Supabase Anon Key
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function Products() {
  const [categoriesData, setCategoriesData] = useState([]); // Store all categories in one state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch all data from the 'categories' table in Supabase
        const { data, error: fetchError } = await supabase
          .from("categories") // Your table name
          .select("*"); // Select all columns

        if (fetchError) {
          throw fetchError;
        }

        setCategoriesData(data || []); // Set the fetched data
      } catch (error) {
        console.error("Error fetching categories from Supabase:", error.message);
        setError("Error fetching products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this runs once on mount

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (loading) {
    return <p>Loading products...</p>;
  }

  // Helper function to render a category section
  const renderCategorySection = (categoryName) => {
    const category = categoriesData.find(
      (cat) => cat.category.toLowerCase() === categoryName.toLowerCase()
    );

    if (!category || !Array.isArray(category.items) || category.items.length === 0) {
      return <p>No {categoryName} products found.</p>;
    }

    return (
      <div className="category-section">
        <h2>{category.category.toUpperCase()}</h2>
        <div className="items-container">
          {category.items.map((item, index) => (
            <div key={`${category.category}-${item.productName}-${index}`} className="product-card">
              <Link
                to={`/home/fulldetails`}
                state={{
                  image: item.image, // Correct: pass the current item's image
                  productName: item.productName, // Correct: pass the current item's product name
                  price: item.price, // Correct: pass the current item's price
                }}
              >
                <img src={item.image} alt={item.productName} /> {/* Correct: alt is item.productName */}
                <h3>{item.productName}</h3> {/* Correct: display item.productName */}
                <p>Price: ₹{item.price}</p> {/* Using ₹ for Rupee symbol */}
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="products-container">
      {renderCategorySection("clothing")}
      {renderCategorySection("vegetables")}
      {renderCategorySection("fruits")}
      {renderCategorySection("flowers")}
    </div>
  );
}

export default Products;