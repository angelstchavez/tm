import { useAuthToken } from "@/contexts/AuthContext";
import { useState } from "react";


type useFetchState<T> = {
    data:T[],
    isLoading:boolean,
    hasError: null | Error;
}

const useFetch = <T>() => {

  const [fetchState, setFetchState] = useState<useFetchState<T>>({
    data: [],
    isLoading: true,
    hasError: null,
  });

  const token = useAuthToken();

  const fetchData = async (url:string) => {
    try {
      setFetchState((oldValue) => ({
        ...oldValue,
        isLoading: true,
      }));

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const {data} = await response.json();

      setFetchState({
        data,
        isLoading:false,
        hasError:null
      })

    } catch (error:any) {
        setFetchState({
            data:[],
            isLoading:false,
            hasError: error.messaje
        });
    }
  };

  return {data: fetchState.data,
          isLoading: fetchState.isLoading,
          hasError: fetchState.hasError,
          fetchData
   };
};
