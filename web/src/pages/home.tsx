import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../context/AuthProvider";

const HomePage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login, auth } = useAuth();

  useEffect(() => {
    if (auth?.accessToken) {
      window.location.assign("/books");
    }
  }, []);

  const handleLoginFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(email, password);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      {auth?.accessToken ? (
        <div>
          <p>User Logged in</p>
          <Link to={"/books"}>Books</Link>
        </div>
      ) : (
        <form onSubmit={(e) => handleLoginFormSubmit(e)}>
          <div className="flex flex-col gap-[5px]">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-8 rounded-md"
              placeholder="Enter your email"
            />
          </div>
          <div className="flex flex-col gap-[5px]">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-8 rounded-md"
              placeholder="Enter password..."
            />
          </div>
          <input
            className="cursor-pointer py-2 rounded-md font-bold w-full bg-red-300"
            type="submit"
            value="Login"
          />
        </form>
      )}
    </div>
  );
};

export default HomePage;
