import Navbar from "./navbar";
import UserSettings from "./user-settings";

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="dark grid grid-rows-[60px_1fr] w-full h-screen">
      <header className="logo font-extrabold text-3xl p-3 shadow-md">
        Tasks
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
