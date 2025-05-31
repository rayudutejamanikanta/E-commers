import axios from "axios";
import { Formik,Form, ErrorMessage } from "formik";
import { useNavigate } from "react-router";
import * as Yup from "yup";

function CreateAccount() {

    const navigate = useNavigate();


  const SubmitData = async (values, { resetForm }) => {
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      };

      const response = await axios.post("http://localhost:5002/users", payload);
      console.log("Account created successfully:", response.data);
      resetForm(); // Reset the form after successful submission
      navigate("/")

    } catch (error) {
      console.error("Error creating account:", error);
      alert("Failed to create account. Please try again.");
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
        <Form onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            name="firstName"
            placeholder="Enter your first name"
            onChange={handleChange}
            value={values.firstName}
          />
          <ErrorMessage name="firstName" component="div" className="error" />
          <br />

          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            name="lastName"
            placeholder="Enter your last name"
            onChange={handleChange}
            value={values.lastName}
          />
          <ErrorMessage name="lastName" component="div" className="error" />
          <br />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            value={values.email}
          />
          <ErrorMessage name="email" component="div" className="error" />
          <br />

          <label htmlFor="password">Create Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            value={values.password}
          />
          <ErrorMessage name="password" component="div" className="error" />
          <br />

          <label htmlFor="confirmPassword">Re-enter Password:</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your password"
            onChange={handleChange}
            value={values.confirmPassword}
          />
          <ErrorMessage name="confirmPassword" component="div" className="error" />
          <br />
          <div className="login-link">
          <button type="submit">Submit</button>
          <button type="button" onClick={() => navigate("/")}>Login</button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateAccount;