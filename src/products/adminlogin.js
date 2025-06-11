import { useEffect, useState } from "react"; // Import useState
import { useNavigate } from "react-router-dom"; // Use react-router-dom for useNavigate

// IMPORTANT: Define your Supabase URL and Anon Key here
// These should be the same as in your other components and accurate.
const supabaseUrl = "https://mrboihookikugdivqzlb.supabase.co"; // Your Supabase project URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yYm9paG9va2lrdWdkaXZxemxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MDQwNjMsImV4cCI6MjA2MzQ4MDA2M30.CZjpYiLtxXgl4SdUxtXI2hWKFNj1ODgd5LRO4H8NZyU"; // Your Supabase Anon Key

function AdminLogin() {
  const [adminUsers, setAdminUsers] = useState([]); // State to store fetched admin users
  const [loading, setLoading] = useState(true);   // State for loading status
  const [error, setError] = useState(null);     // State for error messages
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        // Construct the URL for fetching all data from your 'admin dashboard data' table
        // Table name "admin dashboard data" is URL-encoded here due to spaces
        const tableUrl = `${supabaseUrl}/rest/v1/admin%20dashboard%20data`; 

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
          throw new Error(errorData.message || "Failed to fetch admin users from Supabase.");
        }

        const data = await response.json(); // Supabase GET typically returns an array of objects
        setAdminUsers(data); // Set the fetched admin users data
        console.log("Admin users fetched successfully:", data);

      } catch (error) {
        console.error("Error fetching admin users for login:", error.message);
        setError("Failed to load admin data. Please check your network or Supabase config.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminUsers();
  }, []); // Empty dependency array means this runs once on component mount

  const handleAdminLogin = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    
    if (loading) { // Prevent login attempt while data is loading
      alert("Admin user data is still loading. Please wait.");
      return;
    }
    if (error) { // Prevent login attempt if there was an error loading data
      alert("Could not log in: Failed to load admin user data.");
      return;
    }

    // IMPORTANT: This client-side validation exposes all admin credentials.
    // This is HIGHLY INSECURE for production.
    const adminUser = adminUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (adminUser) {
      // ✅ Save admin user data (excluding password ideally, but here saving all for simplicity)
      localStorage.setItem("loggedInAdminUser", JSON.stringify(adminUser)); 
      navigate("/adminhome"); // Navigate to the admin home page
    } else {
      alert("Invalid email or password.");
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center' }}>Loading admin data...</p>;
  }

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>;
  }

  return (
    <div className="admin-login-container" style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Admin Login</h1>
      <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
          <input type="text" id="email" name="email" required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }} />
        </div>
        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password:</label>
          <input type="password" id="password" name="password" required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px' }} />
        </div>
        <button type="submit" style={{ padding: '12px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', transition: 'background-color 0.2s ease-in-out' }}>Login</button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <a href="/createadminaccount" style={{ color: '#007bff', textDecoration: 'none', marginRight: '15px' }}>Create Admin Account</a>
        {/* If you have a general user login page, you might link to it here */}
        {/* <a href="/">User Login</a> */}
      </div>
    </div>
  );
}

export default AdminLogin;