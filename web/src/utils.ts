export type ProcessedFormErrorType = Record<string, string[] | string>;

export function parseValidationErrorResponse(detail: ProcessedFormErrorType) {
  const formErrors: ProcessedFormErrorType | null = {};

  Object.keys(detail).forEach((key) => {
    const errors = detail[key];
    formErrors[key] = errors.length == 1 ? errors[0] : errors;
  });

  return formErrors;
}

export function capitalize(value: string) {
  if (value.length == 0) return "";
  if (value.length == 1) return value.toUpperCase();

  let output = "";

  for (const split_value of value.split(" ")) {
    output += split_value.charAt(0).toUpperCase() + split_value.slice(1);
  }

  return output;
}
