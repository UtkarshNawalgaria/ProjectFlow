const PageHeader = ({ children }) => {
  return (
    <section className="flex justify-between items-center mb-8">
      {children}
    </section>
  );
};

export default PageHeader;
