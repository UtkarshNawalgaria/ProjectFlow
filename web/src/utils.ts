export type ValidationErrorResponseType = {
  msg: string;
  type: string;
  ctx: Record<string, string>;
  loc: string[];
};

export type ProcessedFormErrorType = Record<string, string>;

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
