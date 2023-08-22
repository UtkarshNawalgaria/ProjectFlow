import Sidebar from "../sidebar";
import useUser, { TUserContext } from "../../context/UserProvider";
import useAuth, { AuthContextType } from "../../context/AuthProvider";
import { Menu } from "@headlessui/react";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";

const AuthenticatedLayout = ({ children }: { children: JSX.Element }) => {
  const { user } = useUser() as TUserContext;
  const { logout } = useAuth() as AuthContextType;

  return (
    <div className="grid grid-rows-[60px_1fr] w-full h-screen overflow-hidden bg-white dark:bg-slate-900">
      <header className="logo grid grid-cols-[260px_1fr] border-b border-slate-200 dark:border-b-gray-500">
        <div className="font-extrabold text-2xl border-r border-r-slate-200 dark:border-r-gray-500 w-[260px] h-full flex items-center pl-5 dark:text-white">
          <Link to="/dashboard">
            <img
              src="/images/logo-white.png"
              alt="Projectflow - Project Management made easier"
              width={150}
            />
          </Link>
        </div>
        <div className="relative flex items-center justify-end px-10">
          <Menu>
            <Menu.Button className="mr-2 flex gap-2 items-center cursor-pointer">
              <Avatar name={user?.name} round size="35" />
            </Menu.Button>
            <Menu.Items className="absolute right-[45px] top-[60px] p-2 bg-white dark:bg-slate-800 shadow-2xl dark:shadow-slate-800/50 w-[200px] rounded-sm border-1 flex flex-col gap-2 z-40">
              <Menu.Item>
                {() => (
                  <a
                    className="block px-8 py-1 bg-gray-50 dark:bg-slate-800 dark:text-grey-lightest text-grey-dark font-medium rounded-md text-center cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-700"
                    onClick={logout}>
                    Logout
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </header>
      <div className="grid grid-cols-[260px_1fr]">
        <aside className="my-8 mx-2 flex flex-col justify-between">
          <Sidebar />
        </aside>
        <main className="h-full px-10 py-8 border-l border-l-slate-200 dark:border-l-gray-500">
          <div className="h-full rounded-md">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
