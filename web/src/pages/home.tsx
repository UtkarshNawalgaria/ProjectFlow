import { FormEvent, useState } from "react";
import useFetch from "../hooks/useFetch";

const HomePage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { execute, data } = useFetch();

  const encodeFormData = (data: any) => {
    return Object.keys(data)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
      )
      .join("&");
  };

  const handleFormSubmission = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    execute("auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: encodeFormData({ username: email, password: password }),
    });
    if (data) {
      console.log(data);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={(e) => handleFormSubmission(e)}>
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
    </div>
  );
};

export default HomePage;
