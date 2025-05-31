import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
        <Link to="/home"><button>Home</button></Link><br />
        <Link to="/home/clothing"><button>Cloths</button></Link><br />
        <Link to="/home/vegitables"><button>Vegetables</button></Link><br />
        <Link to="/home/fruits"><button>Fruits</button></Link><br />
        <Link to="/home/flowers"><button>Flowers</button></Link><br />
    </div>
  );
}

export default Sidebar;
