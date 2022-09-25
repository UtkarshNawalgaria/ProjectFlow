const BASE_URL = "http://localhost:8000/";
export const authTokenKey = "accessToken";

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export default function client<T>(
  endpoint: string,
  customConfig = {}
): Promise<T> {
  const token = window.localStorage.getItem(authTokenKey);
  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method: customConfig.method ?? "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  return window
    .fetch(`${BASE_URL}${endpoint}`, config)
    .then(async (response) => {
      if (response.status === 401) {
        window.localStorage.removeItem(authTokenKey);
        window.location.assign("/");
        return Promise.reject(response);
      }
      if (response.ok) {
        return await response.json();
      } else {
        const errorMessage = await response.json();
        return Promise.reject(new Error(errorMessage.detail));
      }
    });
}
