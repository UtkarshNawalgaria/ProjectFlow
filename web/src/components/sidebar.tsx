import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineUsergroupAdd,
  AiOutlineFundProjectionScreen,
} from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import useUser, { TUserContext } from "../context/UserProvider";
import navItems, { organizationNavItems } from "./data/nav";
import Organizations from "./organizations";

const IconMap: Record<string, JSX.Element> = {
  dashboard: <AiOutlineHome className="h-5 w-5" />,
  projects: <AiOutlineFundProjectionScreen className="h-5 w-5" />,
  settings: <AiOutlineSetting className="h-5 w-5" />,
  members: <AiOutlineUsergroupAdd className="h-5 w-5" />,
};

const Sidebar = () => {
  const location = useLocation();
  const { currentOrganization } = useUser() as TUserContext;

  const isPathActive = (linkPath: string, isLink = true): string => {
    const returnCss = isLink
      ? "bg-slate-200 dark:bg-slate-700 rounded-md"
      : "text-white";
    return location.pathname.includes(linkPath) ? returnCss : "";
  };

  return (
    <div>
      <Organizations />
      <nav className="mt-4">
        <div>
          <ul className="border-b dark:border-b-gray-500 pb-2">
            {navItems.map((item, index) => (
              <li
                key={index}
                className={`py-2 pl-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md mb-2 mx-2 text-sm ${isPathActive(
                  item.path
                )}`}>
                <Link
                  className={`flex items-center gap-4 text-slate-900 dark:text-grey-lightest font-medium ${isPathActive(
                    item.path,
                    false
                  )}`}
                  to={item.path}>
                  {item.icon ? <span>{IconMap[item.icon]}</span> : null}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="block pl-4 mt-4 text-md text-slate-900 dark:text-grey-lightest font-medium">
            {currentOrganization?.title}
          </span>
        </div>
        <ul className="border-b dark:border-b-gray-500 pb-2 mt-4">
          {organizationNavItems.map((item, index) => (
            <li
              key={index}
              className={`py-2 pl-2 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md mb-2 mx-2 text-sm ${isPathActive(
                item.path
              )}`}>
              <Link
                className={`flex items-center gap-4 text-slate-900 dark:text-grey-lightest font-medium ${isPathActive(
                  item.path,
                  false
                )}`}
                to={`/organization/${currentOrganization?.id}${item.path}`}>
                {item.icon ? <span>{IconMap[item.icon]}</span> : null}
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
