export type ProcessedFormErrorType = Record<string, string[] | string>;

export function parseValidationErrorResponse(detail: ProcessedFormErrorType) {
  const formErrors: ProcessedFormErrorType | null = {};

  Object.keys(detail).forEach((key) => {
    const errors = detail[key];
    formErrors[key] = errors.length == 1 ? errors[0] : errors;
  });

  return formErrors;
}
