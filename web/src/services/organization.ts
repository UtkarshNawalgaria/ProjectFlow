import useClient from "./client";

export type Organization = {
  id: number;
  title: number;
};

export default {
  getOrganizationList: () => {
    return useClient<Organization[]>("organization/");
  },
};
