import Meta from "../components/meta";
import useUser, { TUserContext } from "../context/UserProvider";
import { Tab } from "@headlessui/react";
import { useState } from "react";
import Editable from "../components/editable";
import ProfilePicture from "../components/profile-picture";
import { BASE_URL } from "../services/client";
import useAuth, { AuthContextType } from "../context/AuthProvider";
import { toast } from "react-toastify";
import Button from "../components/button";
import UserService from "../services/users";

const ProfilePage = () => {
  const { user, updateUser, updateUserProfile } = useUser() as TUserContext;
  const { auth } = useAuth() as AuthContextType;
  const [selectedTab, setSelectedTab] = useState(0);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleConfirmPassword = () => {
    if (!password && !confirmPassword) return;

    if (password !== confirmPassword && password && confirmPassword) {
      setError("Both passwords should be the same");
      return;
    }

    if (!user?.id) return;

    UserService.resetPassword(user.id as number, password, confirmPassword)
      .then((res) => {
        toast.success(res.message);
        setError("");
      })
      .catch((error) => {
        if (error.message && Array.isArray(error.message)) {
          setError(error.message[0]);
        }
      });
  };

  const uploadImageFile = (file: File) => {
    const formData = new FormData();
    formData.append("profile_pic", file);

    fetch(`${BASE_URL}users/${user?.id}/upload_profile_pic/`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Token ${auth?.accessToken}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("Image Upload Failed");
        }
      })
      .then((data) => {
        if (!user) return;
        updateUser({ ...user, profile_pic: data.profile_pic });
        toast.success("Profile Picture Updated");
      })
      .catch(() => {
        toast.error("Unable to update profile picture");
      });
  };

  return (
    <section>
      <Meta title="Profile" />
      <div className="text-2xl font-semibold dark:text-grey-lightest">
        <div className="mb-10 flex justify-center">
          <ProfilePicture
            url={user?.profile_pic}
            onPictureUpload={uploadImageFile}
          />
        </div>
        <div className="max-w-[75%] mx-auto shadow-lg dark:bg-slate-800 flex gap-4 p-4 rounded-md">
          <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
            <Tab.List className="flex flex-col w-1/5 text-lg overflow-hidden">
              <Tab className="dark:bg-slate-900 rounded-md dark:hover:bg-slate-700 p-4">
                Profile
              </Tab>
            </Tab.List>
            <Tab.Panels className="grow dark:bg-slate-900 p-4 rounded-md">
              <Tab.Panel className="flex flex-col gap-8">
                <div className="flex items-center gap-8 text-lg">
                  <div className="w-1/4">Name</div>
                  <div className="w-3/4">
                    <Editable
                      text={user?.name}
                      allowEditing={true}
                      onConfirm={(value) => {
                        if (!user) return;
                        updateUserProfile(user?.id as number, {
                          ...user,
                          name: value,
                        });
                      }}
                      Element={
                        <div className="font-normal text-base">
                          {user?.name}
                        </div>
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center gap-8 text-lg">
                  <div className="w-1/4">Email</div>
                  <div className="w-3/4">
                    <Editable
                      text={user?.email}
                      allowEditing={true}
                      onConfirm={(value) => console.log(value)}
                      Element={
                        <div className="font-normal text-base">
                          {user?.email}
                        </div>
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center gap-8 text-lg">
                  <div className="w-1/4">Password</div>
                  <div className="w-3/4">
                    <input
                      type="password"
                      id="title"
                      name="title"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={
                        "rounded-md border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-grey-lightest dark:bg-slate-800 w-1/2" +
                        (error ? " border-error" : " border-gray-300")
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center gap-8 text-lg">
                  <div className="w-1/4">Confirm Password</div>
                  <div className="w-3/4">
                    <input
                      type="password"
                      id="title"
                      name="title"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className={
                        "rounded-md border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-grey-lightest dark:bg-slate-800 w-1/2" +
                        (error ? " border-error" : " border-gray-300")
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="w-1/4"></div>
                  <div className="w-3/4">
                    {error ? (
                      <span className="w-1/2 text-center text-red-200 text-sm font-normal block mb-2">
                        {error}
                      </span>
                    ) : null}
                    <Button
                      text="Reset Password"
                      type="CONFIRM"
                      as="button"
                      extraStyles="w-1/2"
                      onClick={handleConfirmPassword}
                    />
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel>Security Panel</Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
