import { Outlet } from "react-router-dom";
import Navbar from "../navbar";

const AnonymousLayout = () => {
  return (
    <>
      <div className="flex flex-col h-screen">
        <Navbar />
        <main className="h-full">
          <Outlet />
        </main>
        <footer className="text-center py-6">@ 2022 Utkarsh Nawalgaria</footer>
      </div>
    </>
  );
};

export default AnonymousLayout;
