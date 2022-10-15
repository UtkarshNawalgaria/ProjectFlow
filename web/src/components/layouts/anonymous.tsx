import Navbar from "../navbar";

const AnonymousLayout = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <div className="flex flex-col h-screen">
        <Navbar />
        <main className="h-full">{children}</main>
        <footer className="text-center py-6">@ 2022 Utkarsh Nawalgaria</footer>
      </div>
    </>
  );
};

export default AnonymousLayout;
