import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="h-[80px] shadow-md">
      <div className="flex justify-between items-center h-full max-w-6xl mx-auto">
        <div className="text-3xl font-semibold text-indigo-500">
          <Link to="/">
            <img
              src="/images/logo-black.png"
              alt="Projectflow - Project Management made easier"
              width={200}
            />
          </Link>
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
