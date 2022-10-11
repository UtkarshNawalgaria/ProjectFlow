import { useEffect, useState } from "react";
import Navbar from "./navbar";
import UserSettings from "./user-settings";
import UserService, { UserProfile } from "../services/users";

const Layout = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<UserProfile>();
  const [initials, setInitials] = useState<string>();

  useEffect(() => {
    UserService.me().then((authenticatedUser) => {
      const name = authenticatedUser.user.name.split(" ");
      const init = name.length > 1 ? name[0][0] + name[1][0] : name[0][0];
      setUser(authenticatedUser);
      setInitials(init.toUpperCase());
    });
  }, []);

  return (
    <div className="dark grid grid-rows-[60px_1fr] w-full h-screen">
      <header className="logo p-3 shadow-md flex justify-between items-center">
        <div className="font-extrabold text-3xl">Tasks</div>
        <div className="mr-2 flex gap-2 items-center hover:bg-gray-100 px-2 py-1 cursor-pointer rounded-md">
          <span className="bg-red-100 py-1 px-2 rounded-full">{initials}</span>
          <span>{user?.user.name}</span>
        </div>
      </header>
      <div className="grid grid-cols-[260px_1fr] bg-gray-100">
        <aside className="w-[260px] shadow-xl bg-white my-4 rounded-md flex flex-col justify-between">
          <Navbar />
          <UserSettings />
        </aside>
        <main className="h-full p-4">
          <div className="h-full bg-white rounded-md shadow-md p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
