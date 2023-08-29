import { useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import UserAvatar from "./user-avatar";

type TProfilePicture = {
  url?: string;
  onPictureUpload: (file: File) => void;
};

const ProfilePicture = ({ url, onPictureUpload }: TProfilePicture) => {
  const [, setImageFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    onPictureUpload(file);
  };

  return (
    <div className="relative cursor-pointer">
      <div className="absolute inset-0 bg-transparent hover:bg-black/30 rounded-full transition duration-300 ease-in-out text-transparent hover:text-white">
        <label
          htmlFor="profile_pic"
          className="cursor-pointer w-full h-full flex gap-2 flex-col items-center justify-center">
          <span>
            <FaUserEdit className="w-8 h-8" />
          </span>
          <span className="font-normal text-center text-xs">
            Change Profile Picture
          </span>
          <input
            type="file"
            name="profile_pic"
            id="profile_pic"
            className="w-0 h-0"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
          />
        </label>
      </div>
      <UserAvatar profilePicUrl={url} width="100px" />
    </div>
  );
};

export default ProfilePicture;
