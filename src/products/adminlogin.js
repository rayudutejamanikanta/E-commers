import { useEffect } from "react";

function AdminLogin() {

    useEffect(() => {
        fetch("http://localhost:5003/adminusers")
            .then((response) => response.json())
            .then((data) => {
                localStorage.setItem("adminUsers", JSON.stringify(data)); // Store fetched data
            })
            .catch((error) => {
                console.log("Error fetching admin users:", error);
            });
    }, []);

    const handleAdminLogin = (event) => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        const adminUsers = JSON.parse(localStorage.getItem("adminUsers")) || [];

        const adminUser = adminUsers.find(
            (user) => user.email === email && user.password === password
        );

        if (adminUser) {
            localStorage.setItem("loggedInAdminUser", JSON.stringify(adminUser));
            window.location.href = "/adminhome";
        } else {
            alert("Invalid username or password.");
        }
    };

    return (
        <div className="adminlogin">
            <h1>Admin Login</h1>
            <form onSubmit={handleAdminLogin}>
                <label htmlFor="email">Email:</label>
                <input type="text" id="email" name="email" required />

                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />

                <button type="submit">Login</button>
            </form>
            <a href="/createadminaccount">Create Account</a>
        </div>
    );
}

export default AdminLogin;
