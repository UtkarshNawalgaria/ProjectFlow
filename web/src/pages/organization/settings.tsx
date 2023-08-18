import useUser, { TUserContext } from "../../context/UserProvider";

const OrganizationSettings = () => {
  const { currentOrganization } = useUser() as TUserContext;

  return (
    <div className="px-4 mb-8">
      <h1 className="text-2xl text-grey-dark dark:text-grey-lightest font-bold">
        {currentOrganization?.title}
      </h1>
    </div>
  );
};

export default OrganizationSettings;
