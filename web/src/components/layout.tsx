import { HiCog } from "react-icons/hi";
import Navbar from "./navbar";

const Layout = ({ children }: { children: JSX.Element[] }) => {
  return (
    <div className="grid grid-rows-[60px_1fr] w-full h-screen">
      <header className="logo font-extrabold text-3xl p-3 shadow-md">
        Tasks
      </header>
      <div className="grid grid-cols-[260px_1fr] bg-gray-100">
        <aside className="w-[260px] shadow-xl bg-white my-4 rounded-md flex flex-col justify-between">
          <Navbar />
          <div className="py-4 text-grey-dark font-bold cursor-pointer rounded-b-md flex items-center justify-center gap-2 hover:bg-grey-lightest hover:text-primary">
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
