import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="h-[80px] shadow-md">
      <div className="flex justify-between items-center h-full max-w-6xl mx-auto">
        <div className="text-3xl font-semibold text-indigo-500">
          <Link to="/">Tasks</Link>
        </div>
        <div>
          <nav className="flex items-center gap-4">
            <ul>
              <li>
                <Link to="/">Signup / Login</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
