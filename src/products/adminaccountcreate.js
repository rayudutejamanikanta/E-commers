import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom"; // Corrected import for useNavigate
import * as Yup from "yup";

// IMPORTANT: Define your Supabase URL and Anon Key here for the fetch request
// MAKE SURE THESE KEYS ARE EXACTLY COPIED FROM YOUR SUPABASE PROJECT SETTINGS -> API
const supabaseUrl = "https://mrboihookikugdivqzlb.supabase.co"; // Your Supabase project URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yYm9paG9va2lrdWdkaXZxemxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MDQwNjMsImV4cCI6MjA2MzQ4MDA2M30.CZjpYiLtxXgl4SdUxtXI2hWKFNj1ODgd5LRO4H8NZyU"; // Your Supabase Anon Key

function CreateAdminAccount() {
  const navigate = useNavigate();

  const SubmitData = async (values, { resetForm }) => {
    try {
      // Payload structure adjusted to EXACTLY match your Supabase 'admin dashboard data' table column names
      const payload = {
        firstname: values.firstName, // Maps to 'firstname' column in Supabase
        lastname: values.lastName,   // Maps to 'lastname' column in Supabase
        email: values.email,         // Maps to 'email' column in Supabase
        password: values.password,   // Maps to 'password' column in Supabase (plain text - INSECURE!)
      };

      // Construct the URL for your Supabase table endpoint
      // Table name "admin dashboard data" is URL-encoded here due to spaces
      const tableUrl = `${supabaseUrl}/rest/v1/admin%20dashboard%20data`; 

      const response = await fetch(tableUrl, {
        method: "POST", // Use POST to insert new data
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseAnonKey, // Your Supabase public anon key
          "Authorization": `Bearer ${supabaseAnonKey}`, // Required for authentication
          "Prefer": "return=representation", // Tells Supabase to return the newly inserted data
        },
        body: JSON.stringify(payload), // Send the payload as a JSON string
      });

      if (!response.ok) {
        // If the response is NOT OK (e.g., 4xx or 5xx status), try to parse the error details.
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (jsonParseError) {
          console.warn("Could not parse error response as JSON:", jsonParseError);
          errorData.message = response.statusText || "Unknown error parsing error response";
        }
        throw new Error(errorData.message || `Failed to insert data. Status: ${response.status}`);
      }

      // Parse the response data. For successful POSTs with "Prefer: return=representation",
      // Supabase usually returns an array containing the newly inserted row(s).
      const data = await response.json(); 

      console.log("Admin Account created successfully (data posted via fetch):", data);
      alert("Admin account created successfully! Your data has been stored.");
      resetForm(); // Reset the form after successful submission
      navigate("/adminlogin"); // Navigate to the admin login page

    } catch (error) {
      console.error("Error creating admin account:", error.message);
      alert(`Failed to create admin account. Please try again. Error: ${error.message}`);
    }
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please re-enter your password"),
  });

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={SubmitData}
    >
      {({ handleChange, handleSubmit, values }) => (
        <Form onSubmit={handleSubmit} className="create-admin-account-form">
          <h2 className="form-title">Create Admin Account</h2>

          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <Field
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Enter your first name"
              onChange={handleChange}
              value={values.firstName}
              className="form-input"
            />
            <ErrorMessage name="firstName" component="div" className="error-message" />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <Field
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Enter your last name"
              onChange={handleChange}
              value={values.lastName}
              className="form-input"
            />
            <ErrorMessage name="lastName" component="div" className="error-message" />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <Field
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              onChange={handleChange}
              value={values.email}
              className="form-input"
            />
            <ErrorMessage name="email" component="div" className="error-message" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Create Password:</label>
            <Field
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              onChange={handleChange}
              value={values.password}
              className="form-input"
            />
            <ErrorMessage name="password" component="div" className="error-message" />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Re-enter Password:</label>
            <Field
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Re-enter your password"
              onChange={handleChange}
              value={values.confirmPassword}
              className="form-input"
            />
            <ErrorMessage name="confirmPassword" component="div" className="error-message" />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">Submit</button>
            <button type="button" onClick={() => navigate("/adminlogin")} className="login-button">Login</button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateAdminAccount;