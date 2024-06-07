import CustomTable from "@/components/utils/CustomTable";
import React, { useState, useEffect } from "react";
import { DeleteEntityDialog } from "@/components/api/DeleteEntity";
import ModelUpdate from "./ModelUpdate";
import { fetchData } from "@/utilities/FetchData";

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
    fetchData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/car-model/get-all`,
      setModels,
      setOriginalModels,
      setError,
      setLoading
    );
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

  const columns = [
    {
      name: "Nombre",
      selector: (row: CarModel) => row.name,
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    {
      name: "Categoría",
      selector: (row: CarModel) => row.category,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Tipo de Combustible",
      selector: (row: CarModel) => row.fuelType,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Capacidad de Asientos",
      selector: (row: CarModel) => row.seatingCapacity.toString(),
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Tipo de Transmisión",
      selector: (row: CarModel) => row.transmissionType,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Marca de Auto",
      selector: (row: CarModel) => row.carBrand.name,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Acciones",
      cell: (row: CarModel) => (
        <div className="flex space-x-2">
          <ModelUpdate
            id={row.id}
            entity={"car-model"}
            entityName={row.name}
            onComplete={handleModelUpdate}
          />
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
    <CustomTable
      columns={columns}
      data={models}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      loading={loading}
      error={error}
      NoDataComponent={NoDataComponent}
      handleDelete={handleModelDelete}
      handleUpdate={handleModelUpdate}
      exportCsvData={models.map((model) => ({
        Nombre: model.name,
        Categoría: model.category,
        "Tipo de Combustible": model.fuelType,
        "Capacidad de Asientos": model.seatingCapacity,
        "Tipo de Transmisión": model.transmissionType,
        "Marca de Auto": model.carBrand.name,
      }))}
      exportCsvFileName="modelos.csv"
      generalReportEntity="car-model"
    />
  );
};

export default ModelTable;
