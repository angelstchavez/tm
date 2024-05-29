"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import DataTable, { TableColumn } from "react-data-table-component";
import Loading from "@/components/utils/Loading";
import { Input } from "@/components/ui/input";
import Section from "@/components/ui/Section";
import { DeleteEntityDialog } from "@/components/api/DeleteEntity";
import CustomTitle from "@/components/utils/CustomTitle";
import ModelUpdate from "./ModelUpdate";
import ExportCsvButton from "@/components/utils/ExportCsvButton";
import GeneralReport from "@/components/utils/GeneralReport";

interface CarModel {
  id: number;
  name: string;
  category: string;
  fuelType: string;
  seatingCapacity: number;
  transmissionType: string;
  carBrand: {
    id: number;
    name: string;
  };
  carBrandId: number;
}

const NoDataComponent = () => (
  <p className="text-red-600 font-bold">
    No se encuentran resultados de tu búsqueda
  </p>
);

const ModelTable: React.FC = () => {
  const [models, setModels] = useState<CarModel[]>([]);
  const [originalModels, setOriginalModels] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [reloadData, setReloadData] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
        const cookieData: { data: { token?: string } } =
          JSON.parse(cookieValue);
        const token = cookieData.data.token;

        if (!token) {
          throw new Error("No se encontró el token en el cookie.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/car-model/get-all`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los modelos de autos.");
        }

        const responseData = await response.json();

        if (!responseData.success || !responseData.data) {
          throw new Error("La respuesta no contiene datos válidos.");
        }

        const fetchedModels = responseData.data;
        setModels(fetchedModels);
        setOriginalModels(fetchedModels);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reloadData]);

  useEffect(() => {
    if (searchTerm === "") {
      setModels(originalModels);
    } else {
      const filteredModels = originalModels.filter((model) =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setModels(filteredModels);
    }
  }, [searchTerm, originalModels]);

  const handleModelDelete = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const handleModelUpdate = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const columns: TableColumn<CarModel>[] = [
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    {
      name: "Categoría",
      selector: (row) => row.category,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Tipo de Combustible",
      selector: (row) => row.fuelType,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Capacidad de Asientos",
      selector: (row) => row.seatingCapacity.toString(),
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Tipo de Transmisión",
      selector: (row) => row.transmissionType,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Marca de Auto",
      selector: (row) => row.carBrand.name,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex space-x-2">
          <ModelUpdate
            id={row.id}
            entity={"car-model"}
            entityName={row.name}
            onComplete={handleModelUpdate}
          ></ModelUpdate>
          <DeleteEntityDialog
            entityId={row.id}
            entity="car-model"
            entityCamelCase="carModel"
            entityName={row.name}
            onComplete={handleModelDelete}
          />
        </div>
      ),
    },
  ];

  return (
    <Section>
      <div className="flex items-center justify-between">
        <CustomTitle title={"Modelos"} />
        <div className="w-1/2 max-w-md py-2">
          <Input
            type="text"
            placeholder="Buscar por nombre de modelo"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      <div className="grid grid-col-1">
        <DataTable
          columns={columns}
          data={models}
          pagination
          highlightOnHover
          progressPending={loading}
          progressComponent={<Loading />}
          noDataComponent={<NoDataComponent />}
        />
        <div className="flex items-center justify-end mt-2">
          <div className="mr-2">
            <ExportCsvButton
              data={models.map((model) => ({
                Nombre: model.name,
                Categoría: model.category,
                "Tipo de Combustible": model.fuelType,
                "Capacidad de Asientos": model.seatingCapacity,
                "Tipo de Transmisión": model.transmissionType,
                "Marca de Auto": model.carBrand.name,
              }))}
              fileName="modelos.csv"
            />
          </div>
          <div>
            <GeneralReport entity={"car-model"}></GeneralReport>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ModelTable;
