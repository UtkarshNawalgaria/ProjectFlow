import { Menu } from "@headlessui/react";
import { HiCog } from "react-icons/hi";
import useAuth, { AuthContextType } from "../context/AuthProvider";

const UserSettings = () => {
  const { logout } = useAuth() as AuthContextType;
  return (
    <div className="relative">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button
              className={`w-full py-3 text-grey-dark font-bold cursor-pointer rounded-b-md flex items-center justify-center gap-2 hover:bg-grey-lightest hover:text-primary ${
                open ? "bg-grey-lightest" : null
              }`}>
              <HiCog className="text-xl" aria-hidden="true" />
              <span>Settings</span>
            </Menu.Button>
            {open && (
              <div className="w-full absolute top-[-50px] left-[10px] flex justify-between">
                <Menu.Items className="flex flex-col w-3/4 rounded-md shadow-xl">
                  <Menu.Item>
                    <a
                      className="p-2 text-center border-b hover:bg-gray-100 cursor-pointer"
                      onClick={logout}>
                      Logout
                    </a>
                  </Menu.Item>
                </Menu.Items>
              </div>
            )}
          </>
        )}
      </Menu>
    </div>
  );
};

export default UserSettings;
