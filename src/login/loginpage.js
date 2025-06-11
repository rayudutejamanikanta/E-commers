import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// IMPORTANT: Define your Supabase URL and Anon Key here
// These should be the same as in your CreateAccount.js
const supabaseUrl = "https://mrboihookikugdivqzlb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yYm9paG9va2lrdWdkaXZxemxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MDQwNjMsImV4cCI6MjA2MzQ4MDA2M30.CZjpYiLtxXgl4SdUxtXI2hWKFNj1ODgd5LRO4H8NZyU"; // Double-check this key

function Loginpage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Construct the URL for fetching all data from your 'Users Data' table
        // Table name "Users Data" is URL-encoded here
        const tableUrl = `${supabaseUrl}/rest/v1/Users%20Data`; 

        const response = await fetch(tableUrl, {
          method: "GET", // Use GET method to retrieve data
          headers: {
            "apikey": supabaseAnonKey, // Your Supabase public anon key
            "Authorization": `Bearer ${supabaseAnonKey}`, // Required for authentication
            "Content-Type": "application/json", // Good practice to include
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Supabase fetch error:", errorData);
          throw new Error(errorData.message || "Failed to fetch users from Supabase.");
        }

        const data = await response.json(); // Supabase GET typically returns an array of objects
        setUsers(data); // Set the fetched users data
        console.log("Users fetched successfully:", data);

      } catch (error) {
        console.error("Error fetching users for login:", error.message);
        alert("Failed to load user data. Please try again later.");
      }
    };

    fetchUsers();
  }, []); // Empty dependency array means this runs once on component mount

  const handleLogin = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    if (!users || users.length === 0) {
      alert("User list not loaded yet or no users found. Please try again.");
      return;
    }

    // IMPORTANT: This client-side validation exposes all user credentials.
    // This is HIGHLY INSECURE for production.
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // ✅ Save user data (excluding password ideally, but here saving all for simplicity)
      localStorage.setItem("loggedInUser", JSON.stringify(user)); 
      navigate("/home");
    } else {
      alert("Invalid email or password.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="text" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <a href="/createaccount">Signup</a>
      <a href="/adminlogin">Admin Login</a>
    </div>
  );
}

export default Loginpage;