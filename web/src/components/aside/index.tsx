import { HiX } from "react-icons/hi";

export type AsideProps = {
  open: boolean;
  close: () => void;
  children: JSX.Element[] | JSX.Element;
  title?: string | JSX.Element;
};

const Aside = ({ children, open, close, title }: AsideProps) => {
  return (
    <aside
      className={`fixed top-0 bottom-0 w-[46%] right-0 bg-slate-800 shadow-2xl p-4 transform-translate duration-500 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}>
      <header className="flex justify-between items-center mb-10">
        {title ? (
          <div className="text-xl font-semibold dark:text-grey-lightest">
            {title}
          </div>
        ) : null}
        <span className="mt-1 cursor-pointer text-gray-100 hover:bg-slate-800 p-1">
          <HiX onClick={close} />
        </span>
      </header>
      <div>{children}</div>
    </aside>
  );
};

export default Aside;
