import { Link, useLocation } from "react-router-dom";
import navItems from "./data/nav.json";

const Navbar = () => {
  const location = useLocation();

  const isPathActive = (linkPath: string, isLink = true): string => {
    const returnCss = isLink
      ? "bg-gray-50 border-r-8 border-indigo-500"
      : "text-indigo-500";

    return location.pathname.includes(linkPath) ? returnCss : "";
  };

  return (
    <nav className="mt-4">
      <ul className="">
        {navItems.map((item, index) => (
          <li
            key={index}
            className={`py-2 pl-4 cursor-pointer hover:bg-gray-50 hover:border-r-8 hover:border-indigo-500 ${isPathActive(
              item.path
            )}`}>
            <Link
              className={`block text-gray-700 font-bold hover:text-indigo-500 active:text-indigo-500 ${isPathActive(
                item.path,
                false
              )}`}
              to={item.path}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
