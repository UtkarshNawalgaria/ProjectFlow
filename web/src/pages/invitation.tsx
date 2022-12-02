import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/button";

import UserService, { InvitedUser } from "../services/users";

const Invitation = () => {
  const { code: invitationCode } = useParams();
  const [invitedUser, setInvitedUser] = useState<InvitedUser>({
    name: "",
    email: "",
    password: "",
    organization_name: "",
  });
  const [addNewUser, setAddNewUser] = useState(true);
  const [newUserCreated, setNewUserCreated] = useState(false);

  const handleFormDataChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInvitedUser((data) => {
      return { ...data, [event.target.name]: event.target.value };
    });
  };

  useEffect(() => {
    UserService.acceptInvite(invitationCode as string).then((response) => {
      setAddNewUser(!response.user_exists);
      setInvitedUser({
        name: "",
        email: response.email,
        password: "",
        organization_name: "",
      });
    });
  }, []);

  const addInvitedUser = (e: FormEvent) => {
    e.preventDefault();
    UserService.addInvitedUser(invitationCode as string, invitedUser).then(
      () => {
        setNewUserCreated(true);
        toast.success("Your account is being setup. You will be redirected");
      }
    );
  };

  return (
    <div className="h-full flex justify-center">
      {addNewUser === true ? (
        <div className="w-full max-w-md my-20">
          <div className="text-center mb-10">
            <h4 className="text-lg font-semibold text-gray-700">
              Hi User, you have accepted the Invitation. Now, add your details
              and create your account.
            </h4>
          </div>
          <form className="w-3/4 mx-auto" onSubmit={addInvitedUser}>
            <div className="flex flex-col gap-[5px]">
              <label className="block text-md font-medium text-grey-dark mb-1">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={invitedUser.name}
                onChange={(e) => handleFormDataChange(e)}
                className="rounded-md border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full mb-8 placeholder:text-gray-300"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="flex flex-col gap-[5px]">
              <label className="block text-md font-medium text-grey-dark mb-1">
                Organization Name
              </label>
              <input
                type="text"
                name="organization_name"
                value={invitedUser.organization_name}
                onChange={(e) => handleFormDataChange(e)}
                className="rounded-md border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full mb-8 placeholder:text-gray-300 disabled:bg-gray-200 disabled:cursor-not-allowed"
                placeholder="Enter Organization Name"
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
              extraStyles="w-full"
            />
          </form>
        </div>
      ) : (
        <div className="text-center text-3xl font-bold text-grey-dark mt-20">
          Thank You for accepting the invitation.
        </div>
      )}
    </div>
  );
};

export default Invitation;
