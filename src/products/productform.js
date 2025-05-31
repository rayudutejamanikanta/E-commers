import axios from "axios";
import { Formik, Form } from "formik";

function Productform() {
  const dataSubmit = async (values) => {
    try {
      const payload = {
        productName: values.productName,
        price: values.price,
        image: values.image,
      };

      const endpointCategory = values.category.toLowerCase(); // match your backend
      const response = await axios.get(`http://localhost:5001/categories`); // Fetch all categories
      const categoryData = response.data.find(cat => cat.category === endpointCategory);

      if (categoryData) {
        // Push the new product to the correct category's items array
        categoryData.items.push(payload);

        // Update the category with the new product
        await axios.put(`http://localhost:5001/categories/${categoryData.id}`, categoryData);
        console.log("Data submitted successfully:", response.data);
        alert("Product added successfully!");
      } else {
        alert("Category not found.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  const categories = ["clothing", "vegetables", "fruits", "flowers"]; // Dynamic categories list

  return (
    <Formik
      initialValues={{
        category: "clothing", // start with lowercase to match your backend
        productName: "",
        price: "",
        image: "",
      }}
      onSubmit={(values, { resetForm }) => {
        dataSubmit(values);
        resetForm();
      }}
    >
      {({ handleChange, handleSubmit, values }) => (
        <Form onSubmit={handleSubmit}>
          <label htmlFor="category">Category:</label>
          <select
            name="category"
            onChange={handleChange}
            value={values.category}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <br />

          <label htmlFor="productName">Product Name:</label>
          <input
            type="text"
            name="productName"
            placeholder="Enter product name"
            onChange={handleChange}
            value={values.productName}
          />
          <br />

          <label htmlFor="price">Price:</label>
          <input
            type="number"
            name="price"
            placeholder="Enter price"
            onChange={handleChange}
            value={values.price}
          />
          <br />

          <label htmlFor="image">Image URL:</label>
          <input
            type="text"
            name="image"
            placeholder="Enter image URL"
            onChange={handleChange}
            value={values.image}
          />
          <br />

          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
}

export default Productform;
