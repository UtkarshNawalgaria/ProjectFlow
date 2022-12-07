import { parseValidationErrorResponse } from "../utils";

const BASE_URL = import.meta.env.VITE_BASE_API_URL;
export const authTokenKey = "accessToken";

export type FetchConfigType = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
  headers?: Record<string, string> | null;
};

type Default<TObj> = TObj extends unknown ? { message: string } : TObj;

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export default function useClient<T>(
  url: string,
  customConfig: FetchConfigType = {}
): Promise<Default<T>> {
  const token = window.localStorage.getItem(authTokenKey);
  const headers: FetchConfigType["headers"] = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const config = {
    method: customConfig.method ?? "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  return window.fetch(`${BASE_URL}${url}`, config).then(async (response) => {
    if (response.status === 401) {
      window.localStorage.removeItem(authTokenKey);
      window.location.assign("/");
      return Promise.reject(response);
    }

    if (response.ok) {
      return await response.json();
    } else {
      const errorMessage = await response.json();
      const parsedError = parseValidationErrorResponse(errorMessage);
      return Promise.reject(parsedError);
    }
  });
}
