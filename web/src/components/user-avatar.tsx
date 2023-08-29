import Avatar from "react-avatar";

const UserAvatar = ({
  profilePicUrl,
  width,
}: {
  profilePicUrl: string | undefined;
  width: string;
}) => {
  const profilePicWidth = width.replace("px", "");
  return (
    <>
      {profilePicUrl ? (
        <div>
          <img
            src={profilePicUrl}
            alt=""
            className="rounded-full"
            width={profilePicWidth}
          />
        </div>
      ) : (
        <Avatar facebookId="100008343750912" round size={width} />
      )}
    </>
  );
};

export default UserAvatar;
