export type ProcessedFormErrorType = Record<string, string[] | string>;

export function capitalize(value: string) {
  if (value.length == 0) return "";
  if (value.length == 1) return value.toUpperCase();

  let output = "";

  for (const split_value of value.split(" ")) {
    output += split_value.charAt(0).toUpperCase() + split_value.slice(1);
  }

  return output;
}
