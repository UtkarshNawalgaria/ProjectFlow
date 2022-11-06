const ErrorPage = () => {
  return (
    <div className="my-10 flex flex-col items-center justify-center">
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <div>We can't find what you are looking for !!</div>
      <img src="/images/404.jpg" alt="404 error" />
    </div>
  );
};

export default ErrorPage;
