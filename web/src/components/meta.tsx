import useUser, { TUserContext } from "../context/UserProvider";

const Meta = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => {
  const { currentOrganization } = useUser() as TUserContext;
  const defaultTitle = document.title;
  const metaDescription = document.querySelector('meta[name="description"]');
  document.title = `${title} | ${currentOrganization?.title}` ?? defaultTitle;

  if (description) {
    metaDescription?.setAttribute("content", description);
  }

  return null;
};

export default Meta;
