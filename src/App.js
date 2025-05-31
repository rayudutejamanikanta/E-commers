import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import './App.css';
import HomePage from "./routing/homepage";
import Sidebar from "./routing/sidebar";
import Footer from "./routing/footer";
import Category from "./routing/category";  // Import the Category component
import Productform from "./products/productform";
import MyCart from "./routing/mycart";
import Loginpage from "./login/loginpage";
import CreateAccount from "./login/createaccount";
import FullDetails from "./routing/showdetails";
import Products from "./routing/products";
import AdminLogin from "./products/adminlogin";
import CreateAdminAccount from "./products/adminaccountcreate";
import AdminHome from "./products/adminhome";

function Dynamicpage() {
  return (
    <div>
      <HomePage />
      <div className="screen">
        <div className="sidebar-container">
        <Sidebar />
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Loginpage />
  },
  {
    path: "createaccount",
    element: <CreateAccount />
  },
  {
    path: "adminlogin",
    element: <AdminLogin />
  },
  {
    path: "createadminaccount",
    element: <CreateAdminAccount />
  },
  {
    path: "adminhome",
    element: <AdminHome />
  },
  {
    path: "addproducts",
    element: <Productform />
  },
  {
    path: "home",
    element: <Dynamicpage />,
    children: [
      {
        index: true,
        element: <Products />
      },
      {
        path: "clothing",
        element: <Category categoryName="clothing" />
      },
      {
        path: "vegitables",
        element: <Category categoryName="vegetables" />
      },    
      {
        path: "fruits",
        element: <Category categoryName="fruits" />
      },
      {
        path: "flowers",
        element: <Category categoryName="flowers" />
      },
      {
        path: "mycart",
        element: <MyCart />
      },
      {
        path: "fulldetails",
        element: <FullDetails />,
      }
      
    ]
  }
]);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RouterProvider router={router} />
      </header>
    </div>
  );
}

export default App;
