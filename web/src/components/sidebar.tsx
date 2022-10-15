import { Link, useLocation } from "react-router-dom";
import navItems from "./data/nav.json";

const Sidebar = () => {
  const location = useLocation();

  const isPathActive = (linkPath: string, isLink = true): string => {
    const returnCss = isLink
      ? "bg-grey-lightest border-r-8 border-primary"
      : "text-primary";

    return location.pathname.includes(linkPath) ? returnCss : "";
  };

  return (
    <nav className="mt-4">
      <ul className="">
        {navItems.map((item, index) => (
          <li
            key={index}
            className={`py-2 pl-4 cursor-pointer hover:bg-grey-lightest hover:border-r-8 hover:border-primary ${isPathActive(
              item.path
            )}`}>
            <Link
              className={`block text-grey-dark font-bold hover:text-primary active:text-primary ${isPathActive(
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

export default Sidebar;
