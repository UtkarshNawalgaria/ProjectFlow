// eslint-disable-next-line react/prop-types
const PageHeader: React.FC<{ children: JSX.Element[] }> = ({ children }) => {
  return (
    <section className="flex justify-between items-center mb-8 px-4">
      {children}
    </section>
  );
};

export default PageHeader;
