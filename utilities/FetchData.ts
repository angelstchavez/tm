import { getToken } from "@/lib/GetToken";

export const fetchData = async (
  url: string,
  setData: Function,
  setOriginalData: Function,
  setError: Function,
  setLoading: Function
) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener los datos: ${response.statusText}`);
    }

    const responseData = await response.json();

    if (!responseData.success || !responseData.data) {
      throw new Error("La respuesta no contiene datos válidos.");
    }

    setData(responseData.data);
    setOriginalData(responseData.data);
  } catch (error: any) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
