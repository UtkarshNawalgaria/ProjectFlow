import { TError } from "../services/client";

const ErrorList = ({
  errorList,
  styles,
}: {
  errorList: TError;
  styles: string;
}) => {
  if (typeof errorList === "string") {
    return <span className="text-sm text-red-600">{errorList}</span>;
  }

  if (
    typeof errorList === "object" &&
    "non_field_errors" in errorList &&
    Array.isArray(errorList.non_field_errors)
  ) {
    return (
      <div className={styles}>
        {errorList.non_field_errors.map((error, index) => (
          <span className="text-sm text-red-600" key={index}>
            {error}
          </span>
        ))}
      </div>
    );
  }

  return null;
};

export default ErrorList;
