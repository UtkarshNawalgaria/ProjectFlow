import Header from "./header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="flex w-full">
        <aside className="w-[260px] bg-red-300"></aside>
        <main className="w-full">{children}</main>
      </div>
    </>
  );
};

export default Layout;
