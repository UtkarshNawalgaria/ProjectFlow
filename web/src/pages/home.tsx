import { Tab } from "@headlessui/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useAuth, { AuthContextType, TAuthData } from "../context/AuthProvider";

const HomePage = () => {
  const [authData, setAuthData] = useState<TAuthData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { register, login, guestLogin, auth, redirectUrl } =
    useAuth() as AuthContextType;

  useEffect(() => {
    if (auth?.accessToken) {
      window.location.assign(redirectUrl);
    }
  }, []);

  const handleFormSubmit = (
    event: FormEvent<HTMLFormElement>,
    eventType: "login" | "signup"
  ) => {
    event.preventDefault();
    if (eventType == "login") {
      login(authData.email, authData.password, (e) => setError(e.message));
    } else {
      register(
        authData,
        () => {
          setAuthData({
            name: "",
            email: "",
            password: "",
          });
          setSelectedIndex(0);
        },
        (e) => setError(e.message)
      );
    }
  };

  const handleFormDataChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAuthData((data) => {
      return { ...data, [event.target.name]: event.target.value };
    });
    setError("");
  };

  const formGroup =
    "rounded-md border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full mb-8 placeholder:text-gray-300";

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full max-w-md shadow">
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="bg-indigo-500/10 p-2 flex gap-10 rounded-md">
            <Tab
              className={({ selected }) =>
                `w-full rounded-md py-3 px-6 leading-5 text-indigo-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-300 focus:outline-none focus:ring-1 ${
                  selected ? "bg-white shadow" : "hover:bg-white/[0.12]"
                }`
              }>
              Login
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-md py-3 px-6 leading-5 text-indigo-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-300 focus:outline-none focus:ring-1 ${
                  selected ? "bg-white shadow" : "hover:bg-white/[0.12]"
                }`
              }>
              Signup
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel className="px-10 pb-10 pt-5">
              {({ selected }) => {
                return (
                  <>
                    <form onSubmit={(e) => handleFormSubmit(e, "login")}>
                      {selected && error ? (
                        <div className="text-error mb-5">{error}</div>
                      ) : null}
                      <div className="flex flex-col gap-[5px]">
                        <label className="block text-md font-medium text-grey-dark mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={authData.email}
                          onChange={(e) => handleFormDataChange(e)}
                          className={`${formGroup} ${
                            error ? "border-error" : null
                          }`}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-[5px]">
                        <label className="block text-md font-medium text-grey-dark mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          value={authData.password}
                          onChange={(e) => handleFormDataChange(e)}
                          className={`${formGroup} ${
                            error ? "border-error" : null
                          }`}
                          placeholder="Enter password..."
                          required
                        />
                      </div>
                      <input
                        className="cursor-pointer py-3 rounded-md font-bold w-full bg-primary text-white hover:bg-indigo-600 transition"
                        type="submit"
                        value="Login"
                      />
                    </form>
                    <div className="text-center mt-5 text-gray-400 hover:underline cursor-pointer">
                      <a onClick={guestLogin}>Login as guest</a>
                    </div>
                  </>
                );
              }}
            </Tab.Panel>
            <Tab.Panel className="px-10 pb-10 pt-5">
              {({ selected }) => {
                return (
                  <form onSubmit={(e) => handleFormSubmit(e, "signup")}>
                    {selected && error ? (
                      <div className="text-error mb-5">{error}</div>
                    ) : null}
                    <div className="flex flex-col gap-[5px]">
                      <label className="block text-md font-medium text-grey-dark mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={authData?.name}
                        onChange={(e) => handleFormDataChange(e)}
                        className={`${formGroup} ${
                          error ? "border-error" : null
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="flex flex-col gap-[5px]">
                      <label className="block text-md font-medium text-grey-dark mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={authData.email}
                        onChange={(e) => handleFormDataChange(e)}
                        className={`${formGroup} ${
                          error ? "border-error" : null
                        }`}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-[5px]">
                      <label className="block text-md font-medium text-grey-dark mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={authData.password}
                        onChange={(e) => handleFormDataChange(e)}
                        className={`${formGroup} ${
                          error ? "border-error" : null
                        }`}
                        placeholder="Enter password..."
                        required
                      />
                    </div>
                    <input
                      className="cursor-pointer py-3 rounded-md font-bold w-full bg-primary text-white hover:bg-indigo-600 transition"
                      type="submit"
                      value="Signup"
                    />
                  </form>
                );
              }}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default HomePage;
