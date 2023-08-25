import { Tab } from "@headlessui/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useAuth, { AuthContextType, TAuthData } from "../context/AuthProvider";
import { TError } from "../services/client";
import ErrorList from "../components/ErrorList";
import FieldGroup from "../components/form/FieldGroup";

const HomePage = () => {
  const [authData, setAuthData] = useState<TAuthData>({
    name: "",
    email: "guest.projectflow@gmail.com",
    password: "Rainy@Day77",
  });
  const [error, setError] = useState<TError>("");
  const [success, setSuccess] = useState<string>("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { register, login, auth, redirectUrl } = useAuth() as AuthContextType;

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
      login(authData.email, authData.password, (error) => {
        setError(error);
      });
    } else {
      register(
        authData,
        (successMsg: string) => {
          setAuthData({
            name: "",
            email: "",
            password: "",
          });
          setSuccess(successMsg);
          setSelectedIndex(0);
        },
        (e) => setError(e)
      );
    }
  };

  const handleFormDataChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAuthData((data) => {
      return { ...data, [event.target.name]: event.target.value };
    });
    setError("");
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md">
        <div>
          {success ? (
            <div className="text-green-600 text-center mb-6">{success}</div>
          ) : null}
          {typeof error === "string" ? (
            <div className="text-error text-center mb-6">{error}</div>
          ) : null}
        </div>
        <div className="shadow">
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
                <>
                  <div className="mb-8 font-semibold">
                    Login as this guest user to explore the project
                  </div>
                  <form onSubmit={(e) => handleFormSubmit(e, "login")}>
                    <ErrorList errorList={error} styles="mb-4 text-center" />
                    <FieldGroup
                      inputType="email"
                      label="Email"
                      inputName="email"
                      placeholder="Enter email..."
                      inputValue={authData.email}
                      error={error}
                      required={true}
                      onValueChange={handleFormDataChange}
                    />
                    <FieldGroup
                      inputType="password"
                      label="Password"
                      inputName="password"
                      inputValue={authData.password}
                      error={error}
                      onValueChange={handleFormDataChange}
                      required={true}
                      placeholder="Enter password..."
                    />
                    <input
                      className="cursor-pointer py-3 rounded-md font-bold w-full bg-primary text-white hover:bg-indigo-600 transition"
                      type="submit"
                      value="Login"
                    />
                  </form>
                </>
              </Tab.Panel>
              <Tab.Panel className="px-10 pb-10 pt-5">
                <form onSubmit={(e) => handleFormSubmit(e, "signup")}>
                  <ErrorList errorList={error} styles="mb-4 text-center" />
                  <FieldGroup
                    inputType="text"
                    label="Name"
                    inputName="name"
                    placeholder="Enter Full Name..."
                    inputValue={authData.name}
                    error={error}
                    required={true}
                    onValueChange={handleFormDataChange}
                  />
                  <FieldGroup
                    inputType="email"
                    label="Email"
                    inputName="email"
                    placeholder="Enter Email..."
                    inputValue={authData.email}
                    error={error}
                    required={true}
                    onValueChange={handleFormDataChange}
                  />
                  <FieldGroup
                    inputType="password"
                    label="Password"
                    inputName="password"
                    inputValue={authData.password}
                    error={error}
                    onValueChange={handleFormDataChange}
                    required={true}
                    placeholder="Enter password..."
                  />
                  <input
                    className="cursor-pointer py-3 rounded-md font-bold w-full bg-primary text-white hover:bg-indigo-600 transition"
                    type="submit"
                    value="Signup"
                  />
                </form>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
