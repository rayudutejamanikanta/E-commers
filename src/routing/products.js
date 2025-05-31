import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";

function Products() {
  const [clothingCategory, setClothingCategory] = useState(null);
  const [vegetableCategory, setVegetableCategory] = useState(null);
  const [fruitCategory, setFruitCategory] = useState(null);
  const [flowerCategory, setFlowerCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5001/categories", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = response.data;

        const clothingData = data.find(
          (category) => category.category.toLowerCase() === "clothing"
        );
        const vegetableData = data.find(
          (category) => category.category.toLowerCase() === "vegetables"
        );
        const fruitData = data.find(
          (category) => category.category.toLowerCase() === "fruits"
        );
        const flowerData = data.find(
          (category) => category.category.toLowerCase() === "flowers"
        );


        setClothingCategory(clothingData || null);
        setVegetableCategory(vegetableData || null);
        setFruitCategory(fruitData || null);
        setFlowerCategory(flowerData || null);
      } catch (error) {
        setError("Error fetching products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="products-container">
      {clothingCategory ? (

        <div className="category-section">
          <h2>{clothingCategory.category.toUpperCase()}</h2>
          <div className="items-container">
            {clothingCategory.items.map((item) => (
              <div key={`clothing-${item.id}`} className="product-card">

                <Link
                  to={`/home/fulldetails`}
                  state={{
                    image: clothingCategory.items[0].image,
                    productName: clothingCategory.items[0].productName,
                    price: clothingCategory.items[0].price
                  }}
                >
                  <img src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>
                  <p>Price: ${item.price}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No clothing products found.</p>
      )}

      {vegetableCategory ? (
        <div className="category-section">
          <h2>{vegetableCategory.category.toUpperCase()}</h2>
          <div className="items-container">
            {vegetableCategory.items.map((item) => (
              <div key={`vegetable-${item.id}`} className="product-card">

                <Link
                  to={`/home/fulldetails`}
                  state={{
                    image: clothingCategory.items[0].image,
                    productName: clothingCategory.items[0].productName,
                    price: clothingCategory.items[0].price
                  }}
                >
                  <img src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>
                  <p>Price: ${item.price}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No vegetable products found.</p>
      )}
      {fruitCategory ? (
        <div className="category-section">
          <h2>{fruitCategory.category.toUpperCase()}</h2>
          <div className="items-container">
            {fruitCategory.items.map((item) => (
              <div key={`fruit-${item.id}`} className="product-card">

                <Link
                  to={`/home/fulldetails`}
                  state={{
                    image: fruitCategory.items[0].image,
                    productName: fruitCategory.items[0].productName,
                    price: fruitCategory.items[0].price
                  }}
                >
                  <img src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>
                  <p>Price: ${item.price}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No fruit products found.</p>
      )}
      {flowerCategory ? (
        <div className="category-section">
          <h2>{flowerCategory.category.toUpperCase()}</h2>
          <div className="items-container">
            {flowerCategory.items.map((item) => (
              <div key={`flower-${item.id}`} className="product-card">

                <Link
                  to={`/home/fulldetails`}
                  state={{
                    image: flowerCategory.items[0].image,
                    productName: flowerCategory.items[0].productName,
                    price: flowerCategory.items[0].price
                  }}
                >
                  <img src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>
                  <p>Price: ${item.price}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No flower products found.</p>
      )}
    </div>
  );
}
export default Products;
