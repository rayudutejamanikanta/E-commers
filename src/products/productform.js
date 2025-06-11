import { Formik, Form } from "formik";
import { createClient } from "@supabase/supabase-js"; // Import Supabase client

// Initialize Supabase client
// IMPORTANT: Replace with your actual Supabase project URL and public anon key.
// You can find these in your Supabase project settings under API.
const supabaseUrl = "https://mrboihookikugdivqzlb.supabase.co"; // Based on your previous context
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yYm9paG9va2lrdWdkaXZxemxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MDQwNjMsImV4cCI6MjA2MzQ4MDA2M30.CZjpYiLtxXgl4SdUxtXI2hWKFNj1ODgd5LRO4H8NZyU"; // *** REPLACE THIS WITH YOUR ACTUAL SUPABASE ANON KEY ***
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function Productform() {
  const dataSubmit = async (values) => {
    try {
      const payload = {
        productName: values.productName,
        price: parseFloat(values.price), // Ensure price is a number
        image: values.image,
      };

      const endpointCategory = values.category.toLowerCase();

      // 1. Fetch all categories from Supabase
      const { data: categoriesData, error: fetchError } = await supabase
        .from("categories") // Assuming your table name is 'categories'
        .select("*");

      if (fetchError) {
        throw fetchError;
      }

      // 2. Find the category to update
      const categoryToUpdate = categoriesData.find(
        (cat) => cat.category === endpointCategory
      );

      if (categoryToUpdate) {
        // 3. Prepare the updated items array
        // Ensure 'items' is an array, if it's null or undefined, initialize it
        const updatedItems = Array.isArray(categoryToUpdate.items)
          ? [...categoryToUpdate.items, payload]
          : [payload];

        // 4. Update the category in Supabase
        const { data, error: updateError } = await supabase
          .from("categories")
          .update({ items: updatedItems }) // Update only the 'items' column
          .eq("id", categoryToUpdate.id); // Match by the category's ID

        if (updateError) {
          throw updateError;
        }

        console.log("Product added successfully to category:", data);
        alert("Product added successfully!");
      } else {
        alert("Category not found in Supabase.");
      }
    } catch (error) {
      console.error("Error submitting data to Supabase:", error.message);
      alert("Failed to add product. Please try again. Check console for details.");
    }
  };

  const categories = ["clothing", "vegetables", "fruits", "flowers"]; // Dynamic categories list

  return (
    <Formik
      initialValues={{
        category: "clothing",
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
          <select name="category" onChange={handleChange} value={values.category}>
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