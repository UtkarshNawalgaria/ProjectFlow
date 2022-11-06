import Sidebar from "../sidebar";
import useUser, { TUserContext } from "../../context/UserProvider";

const AuthenticatedLayout = ({ children }: { children: JSX.Element }) => {
  const { user, initials } = useUser() as TUserContext;

  return (
    <div className="grid grid-rows-[60px_1fr] w-full h-screen overflow-hidden bg-gray-50">
      <header className="logo p-3 shadow-md flex justify-between items-center bg-white">
        <div className="font-extrabold text-3xl">Tasks</div>
        <div className="mr-2 flex gap-2 items-center px-2 py-1 cursor-pointer rounded-md border">
          <span className="bg-red-100 p-2 rounded-full">{initials}</span>
          <span>{user?.name}</span>
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
