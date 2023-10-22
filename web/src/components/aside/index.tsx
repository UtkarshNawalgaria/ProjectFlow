import { HiX } from "react-icons/hi";

export type AsideProps = {
  open: boolean;
  close: () => void;
  children: JSX.Element[] | JSX.Element;
  title?: string | JSX.Element;
  width?: string;
};

const Aside = ({
  children,
  open,
  close,
  title,
  width = "1280px",
}: AsideProps) => {
  return (
    <>
      <div
        id="overlay"
        className={`${
          open ? "absolute bg-white/20 inset-0" : "none"
        } cursor-pointer`}
        onClick={close}></div>
      <aside
        className={`fixed top-[60px] bottom-0 right-0 bg-slate-900 shadow-2xl p-4 transition-all duration-9000 ease-in-out rounded-l-xl`}
        style={{
          width: `min(90%, ${width})`,
          translate: `${open ? 0 : width}`,
        }}>
        <header className="fixed top-0 left-0 right-0 flex justify-between items-center mb-10 p-4">
          {title ? (
            <div className="text-xl font-semibold dark:text-grey-lightest">
              {title}
            </div>
          ) : null}
          <span className="mt-1 cursor-pointer text-gray-100 hover:bg-slate-800 p-1 rounded-md">
            <HiX onClick={close} />
          </span>
        </header>
        <div className="fixed top-[100px] left-0 right-0 bottom-0 px-4">
          {children}
        </div>
      </aside>
    </>
  );
};

export default Aside;
