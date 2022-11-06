import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/button";

import UserService from "../services/users";

const Invitation = () => {
  const { code: invitationCode } = useParams();
  const [invitedUser, setInvitedUser] = useState<{
    name: string;
    email: string;
    password: string;
  }>({ name: "", email: "", password: "" });
  const [addNewUser, setAddNewUser] = useState<boolean | null>(null);

  const handleFormDataChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInvitedUser((data) => {
      return { ...data, [event.target.name]: event.target.value };
    });
  };

  useEffect(() => {
    UserService.acceptInvite(invitationCode as string)
      .then((response) => {
        setAddNewUser(response.add_new_user);
        setInvitedUser({
          name: "",
          email: response.email,
          password: "",
        });
        window.location.assign("/");
      })
      .catch(() => {
        window.location.assign("/404");
      });
  }, []);

  return (
    <div className="h-full flex justify-center">
      {addNewUser ? (
        <div className="w-full max-w-md my-20">
          <div className="text-center mb-10">
            <h4 className="text-lg font-semibold text-gray-700">
              Hi User, you have accepted the Invitation. Now, add your details
              and create your account.
            </h4>
          </div>
          <form className="w-3/4 mx-auto">
            <div className="flex flex-col gap-[5px]">
              <label className="block text-md font-medium text-grey-dark mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={invitedUser.name}
                onChange={(e) => handleFormDataChange(e)}
                className="rounded-md border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full mb-8 placeholder:text-gray-300"
                placeholder="Enter your name"
                required
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
                value={invitedUser.email}
                onChange={(e) => handleFormDataChange(e)}
                className="rounded-md border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full mb-8 placeholder:text-gray-300 disabled:bg-gray-200 disabled:cursor-not-allowed"
                placeholder="Enter your email"
                required
                disabled={true}
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
                value={invitedUser.password}
                onChange={(e) => handleFormDataChange(e)}
                className="rounded-md border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full mb-8 placeholder:text-gray-300"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button
              as="input"
              type="CONFIRM"
              text="Create Account"
              onClick={() => console.log(invitedUser)}
            />
          </form>
        </div>
      ) : (
        <div className="text-center">Invitation Accepted</div>
      )}
    </div>
  );
};

export default Invitation;
