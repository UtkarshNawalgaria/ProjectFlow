import { HiCog } from "react-icons/hi";
import Navbar from "./navbar";

const Layout = ({ children }) => {
  return (
    <div className="grid grid-rows-[60px_1fr] w-full h-screen">
      <div className="logo font-extrabold text-3xl p-3 shadow-md">Tasks</div>
      <div className="grid grid-cols-[260px_1fr] bg-gray-100">
        <aside className="w-[260px] shadow-xl bg-white my-4 rounded-md flex flex-col justify-between">
          <Navbar />
          <div className="py-4 text-gray-700 font-bold cursor-pointer rounded-b-md flex items-center justify-center gap-2 hover:bg-gray-50 hover:text-indigo-500">
            <HiCog className="text-xl" />
            <span>Settings</span>
          </div>
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
