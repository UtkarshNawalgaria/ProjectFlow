import Editable from "../../components/editable";
import Meta from "../../components/meta";
import useUser, { TUserContext } from "../../context/UserProvider";

import OrganizationService from "../../services/organization";

const OrganizationSettings = () => {
  const { currentOrganization, updateOrganization } = useUser() as TUserContext;

  return (
    <div className="px-4 mb-8">
      <Meta title="Organization Settings" />
      <Editable
        text={currentOrganization?.title}
        allowEditing={true}
        onConfirm={(value) => {
          OrganizationService.updateOrganization(
            currentOrganization?.id as number,
            {
              title: value,
            }
          ).then((organization) => {
            updateOrganization(organization);
          });
        }}
        Element={
          <h1 className="text-2xl text-grey-dark dark:text-grey-lightest font-bold">
            {currentOrganization?.title}
          </h1>
        }
      />
    </div>
  );
};

export default OrganizationSettings;
