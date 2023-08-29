import { AssociatedUsersList } from "../services/users";
import UserAvatar from "./user-avatar";

const UserList = ({ userList }: { userList?: AssociatedUsersList }) => {
  if (!userList?.length) return null;

  return (
    <div className="flex cursor-pointer">
      {userList.map((obj, index) => (
        <div
          key={obj.user.id}
          className={`${index > 0 ? "-ml-2 shadow-lg -z-2" : ""}`}>
          <UserAvatar profilePicUrl={obj.user.profile_pic} width="32px" />
        </div>
      ))}
    </div>
  );
};

export default UserList;
