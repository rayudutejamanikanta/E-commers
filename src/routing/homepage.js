import { Link} from "react-router-dom";
import { useEffect, useState } from "react";

function HomePage() {
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user && user.lastName) {
      setLastName(user.lastName);
    }
  }, []);

  return (
    <div className="home-container">
      <div className="appname">
        <h1>App Name</h1>
      </div>


        <input class="form-control" type="search" placeholder="Search" aria-label="Search"/>


      <div className="home-links">
        <Link id="Cart" to="mycart">My Cart</Link><br />

        <div className="profile-dropdown">
          
            <img 
              id="profile-image" 
              src="https://cdn-icons-png.flaticon.com/128/9308/9308008.png" 
              alt="Profile" 
            />
          
          <ul className="dropdown-menu">
          <li className="user-name">{lastName}</li>
          <a href="/"><li className="logout-option">Logout</li></a>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
