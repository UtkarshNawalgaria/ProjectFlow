export type ValidationErrorResponseType = {
  msg: string;
  type: string;
  ctx: {
    [key: string]: string;
  };
  loc: string[];
};

export type ProcessedFormErrorType = {
  [field: string]: string;
};

export function parseValidationErrorResponse(
  detail: ValidationErrorResponseType[]
) {
  const formErrors: ProcessedFormErrorType | null = {};

  detail.forEach((errorIn) => {
    const field = errorIn.loc[1];
    formErrors[field] = errorIn.msg;
  });

  return formErrors;
}
