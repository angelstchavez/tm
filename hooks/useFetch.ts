import { useAuthToken } from "@/contexts/AuthContext";
import { useCallback, useEffect, useState } from "react";

type UseFetchState<T> = {
  isLoading: boolean;
  data: T[];
  hasError: null | Error;
};

const useFetch = <T>(url: string) => {
  const [fetchState, setFetchState] = useState<UseFetchState<T>>({
    data: [],
    isLoading: true,
    hasError: null,
  });

  const token = useAuthToken();

  const getFetch = useCallback(
    async (signal: AbortSignal) => {
      try {
        setFetchState((oldValue) => ({
          ...oldValue,
          isLoading: true,
        }));

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const { data } = await response.json();

        setFetchState({
          data,
          isLoading: false,
          hasError: null,
        });
      } catch (error: any) {
        setFetchState({
          data: [],
          isLoading: false,
          hasError: error.message,
        });
      }
    },
    [token, url]
  );

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    if (token) {
      getFetch(signal);
    }

    return () => {
      controller.abort();
    };
  }, [token, url]); // Ejecutar el efecto cuando token cambie

  return {
    data: fetchState.data,
    isLoading: fetchState.isLoading,
    hasError: fetchState.hasError,
  };
};

export default useFetch;

// type useFetchState<T> = {
//     data:T[],
//     isLoading:boolean,
//     hasError: null | Error;
// }

// export const useFetch = <T>() => {

//   const [fetchState, setFetchState] = useState<useFetchState<T>>({
//     data: [],
//     isLoading: true,
//     hasError: null,
//   });

//   const token = useAuthToken();

//   const fetchData = async (url:string) => {
//     try {
//       setFetchState((oldValue) => ({
//         ...oldValue,
//         isLoading: true,
//       }));

//       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           Accept: "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const {data} = await response.json();

//       setFetchState({
//         data,
//         isLoading:false,
//         hasError:null
//       })

//     } catch (error:any) {
//         setFetchState({
//             data:[],
//             isLoading:false,
//             hasError: error.messaje
//         });
//     }
//   };

//   return {data: fetchState.data,
//           isLoading: fetchState.isLoading,
//           hasError: fetchState.hasError,
//           fetchData
//    };
// };
