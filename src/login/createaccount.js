import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const supabaseUrl = "https://mrboihookikugdivqzlb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yYm9paG9va2lrdWdkaXZxemxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MDQwNjMsImV4cCI6MjA2MzQ4MDA2M30.CZjpYiLtxXgl4SdUxtXI2hWKFNj1ODgd5LRO4H8NZyU"; // Double-check this key

function CreateAccount() {
  const navigate = useNavigate();

  const SubmitData = async (values, { resetForm }) => {
    try {
      const payload = {
        firstname: values.firstName,
        lastname: values.lastName,
        email: values.email,
        password: values.password,
      };

      const tableUrl = `${supabaseUrl}/rest/v1/Users%20Data`;

      const response = await fetch(tableUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(payload),
      });

      // --- Start of FIX for 'Unexpected end of JSON input' ---
      if (!response.ok) {
        // If the response is NOT OK (e.g., 4xx or 5xx status),
        // try to parse the error details. Use a try-catch for robustness
        // in case the error response itself isn't perfectly formed JSON.
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (jsonParseError) {
          console.warn("Could not parse error response as JSON:", jsonParseError);
          // Fallback to status text if JSON parsing fails
          errorData.message = response.statusText || "Unknown error";
        }
        console.error("Supabase API Error:", errorData);
        throw new Error(errorData.message || `Failed to insert data. Status: ${response.status}`);
      }

      // If response.ok is true (success, typically 201 Created for inserts):
      // Supabase often returns an empty array `[]` for successful inserts.
      // Trying to parse an empty body or `[]` as a full JSON object causes the 'Unexpected end of JSON input'.
      // We don't necessarily need the parsed `data` for a successful insert confirmation.
      // The `response.ok` check is sufficient.
      
      // Optionally, you can try to parse the response if you expect content,
      // but wrap it in a try-catch to handle empty/invalid JSON gracefully.
      let responseData = []; // Default to an empty array for successful inserts
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json") && response.headers.get('content-length') !== '0') {
          // Only attempt to parse JSON if content-type is json AND content-length is not 0
          try {
              responseData = await response.json();
          } catch (jsonError) {
              console.warn("Successful response was not valid JSON or was empty (expected for some Supabase inserts):", jsonError);
              // It's fine; `responseData` remains `[]` or a sensible default
          }
      } else {
          // console.log("Successful response has no JSON content or is empty.");
      }

      // --- End of FIX ---

      console.log("Account created successfully (data posted via fetch). Response:", responseData);
      alert("Account created successfully! Your data has been stored.");
      resetForm();
      navigate("/");

    } catch (error) {
      console.error("Error creating account:", error.message);
      alert(`Failed to create account. Please try again. Error: ${error.message}`);
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
        <Form onSubmit={handleSubmit} className="create-account-form">
          <h2 className="form-title">Create Your Account</h2>

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
            <button type="button" onClick={() => navigate("/")} className="login-button">Login</button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateAccount;