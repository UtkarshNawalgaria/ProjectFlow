import { useState } from "react";

const BASE_URL = "http://localhost:8000/";

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

const useFetch = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function execute(url: string, options: any) {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}${url}`, options);
      const resData = await res.json();
      setData(resData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(getErrorMessage(error));
    }
  }

  return { execute, data, loading, error };
};

export default useFetch;
