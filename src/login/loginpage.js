import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Loginpage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5002/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data); // <<--- because API returns array
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleLogin = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
  
    if (!users || users.length === 0) {
      alert("User list not loaded yet. Please try again.");
      return;
    }
  
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
  
    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user)); // ✅ Save user
      navigate("/home");
    }
     else {
      alert("Invalid username or password.");
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
