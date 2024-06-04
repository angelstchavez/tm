import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Cookies from "js-cookie";
import Loading from "@/components/utils/Loading";

interface PassengersByTripProps {
  tripId: number;
}

interface GetPassengersByTripIdModel {
  names: string;
  surnames: string;
  identificationNumber: string;
  identificationType: string;
  seatNumber: number;
  saleDate: Date;
}

const PassengersByTrip: React.FC<PassengersByTripProps> = ({ tripId }) => {
  const [passengers, setPassengers] = useState<GetPassengersByTripIdModel[]>(
    []
  );
  const [filteredPassengers, setFilteredPassengers] = useState<
    GetPassengersByTripIdModel[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
    const cookieData = cookieValue ? JSON.parse(cookieValue) : null;
    const token = cookieData?.data?.token;

    const fetchData = async () => {
      try {
        if (!token) {
          throw new Error("No se encontró el token en el cookie.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/passenger/trip/${tripId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los datos de los pasajeros.");
        }

        const responseData = await response.json();

        if (!responseData.success || !responseData.data) {
          throw new Error("La respuesta no contiene datos válidos.");
        }

        setPassengers(responseData.data);
        setFilteredPassengers(responseData.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId]);

  useEffect(() => {
    const filteredData = passengers.filter((passenger) =>
      Object.values(passenger).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredPassengers(filteredData);
  }, [searchTerm, passengers]);

  const handleDownloadPDF = () => {
    alert("Descargando PDF...");
  };

  const columns: TableColumn<GetPassengersByTripIdModel>[] = [
    {
      name: "Nombre",
      selector: (row) => `${row.names} ${row.surnames}`,
      sortable: true,
    },
    {
      name: "Identificación",
      selector: (row) => row.identificationNumber,
      sortable: true,
    },
    {
      name: "Tipo",
      sortable: true,
      selector: (row) => row.identificationType,
    },
    {
      name: "Número de Asiento",
      sortable: true,
      selector: (row) => row.seatNumber,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"update"} disabled={passengers.length === 0}>
          Ver pasajeros
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            <h2 className="text-xl font-bold text-gray-800 py-2">Pasajeros</h2>
          </DialogTitle>
          <DialogDescription>
            {loading ? (
              <Loading />
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-center mb-4">
                  <div className="justify-end">
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="px-4 py-2 border rounded w-full"
                    />
                  </div>
                </div>
                <div className="sm:max-w-[650px] border rounded-md">
                  <DataTable
                    columns={columns}
                    data={filteredPassengers}
                    pagination
                    paginationPerPage={10}
                    fixedHeader
                    progressPending={loading}
                    progressComponent={<Loading />}
                  />
                </div>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="justify-end flex">
          <Button variant={"destructive"} onClick={handleDownloadPDF}>
            Descargar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PassengersByTrip;
