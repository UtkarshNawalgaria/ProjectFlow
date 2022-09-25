import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <ul className="flex gap-8">
        <li>
          <Link to="/projects">Projects</Link>
        </li>
        <li>Logout</li>
      </ul>
    </nav>
  );
};

export default Navbar;
