import Meta from "../components/meta";
import useUser, { TUserContext } from "../context/UserProvider";
import { Tab } from "@headlessui/react";
import { useState } from "react";
import Editable from "../components/editable";
import ProfilePicture from "../components/profile-picture";
import { BASE_URL } from "../services/client";
import useAuth, { AuthContextType } from "../context/AuthProvider";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { user, updateUser, updateUserProfile } = useUser() as TUserContext;
  const { auth } = useAuth() as AuthContextType;
  const [selectedTab, setSelectedTab] = useState(0);

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
            <Tab.List className="flex flex-col w-1/4 text-lg overflow-hidden">
              <Tab className="dark:bg-slate-900 rounded-md dark:hover:bg-slate-700 p-4">
                Profile
              </Tab>
            </Tab.List>
            <Tab.Panels className="grow dark:bg-slate-900 p-4 rounded-md">
              <Tab.Panel className="flex flex-col gap-8">
                <div className="flex items-center gap-8 text-lg">
                  <div>Name</div>
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
                      <div className="font-normal text-base">{user?.name}</div>
                    }
                  />
                </div>
                <div className="flex items-center gap-8 text-lg">
                  <div>Email</div>
                  <Editable
                    text={user?.email}
                    allowEditing={true}
                    onConfirm={(value) => console.log(value)}
                    Element={
                      <div className="font-normal text-base">{user?.email}</div>
                    }
                  />
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
