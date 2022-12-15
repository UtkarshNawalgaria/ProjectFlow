import Sidebar from "../sidebar";
import useUser, { TUserContext } from "../../context/UserProvider";
import { Menu } from "@headlessui/react";
import useAuth, { AuthContextType } from "../../context/AuthProvider";

const AuthenticatedLayout = ({ children }: { children: JSX.Element }) => {
  const { user, initials } = useUser() as TUserContext;
  const { logout } = useAuth() as AuthContextType;

  return (
    <div className="grid grid-rows-[60px_1fr] w-full h-screen overflow-hidden bg-gray-50">
      <header className="logo p-3 shadow-md flex justify-between items-center bg-white">
        <div className="font-extrabold text-3xl">Tasks</div>
        <div className="relative">
          <Menu>
            <Menu.Button className="mr-2 flex gap-2 items-center px-2 py-1 cursor-pointer rounded-md border">
              <span className="bg-red-100 p-2 rounded-full">{initials}</span>
              <span>{user?.name}</span>
            </Menu.Button>
            <Menu.Items className="absolute right-[20px] top-[70px] p-2 bg-white shadow-lg w-[250px] rounded-md border-1 flex flex-col gap-2 z-40">
              <Menu.Item>
                {() => (
                  <a
                    className="block px-8 py-2 bg-gray-50 text-grey-dark font-bold rounded-sm text-center cursor-pointer hover:bg-gray-200 hover:text-primary"
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
        <aside className="w-[260px] m-4 flex flex-col justify-between">
          <Sidebar />
        </aside>
        <main className="h-full p-6">
          <div className="h-full bg-white rounded-md shadow-md p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
