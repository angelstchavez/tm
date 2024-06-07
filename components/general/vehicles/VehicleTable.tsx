import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Loading from "@/components/utils/Loading";
import { Input } from "@/components/ui/input";
import Section from "@/components/ui/Section";
import CustomTitle from "@/components/utils/CustomTitle";
import ExportCsvButton from "@/components/utils/ExportCsvButton";
import GeneralReport from "@/components/utils/GeneralReport";
import ActionButtons from "@/components/utils/ActionButtons";
import { fetchData } from "@/utilities/FetchData";

interface Vehicle {
  id: number;
  plate: string;
  color: string;
  manufacturingYear: number;
  carModel: {
    id: number;
    name: string;
    carBrand: {
      id: number;
      name: string;
    };
  };
}

const NoDataComponent = () => (
  <p className="text-red-600 font-bold">
    No se encuentran resultados de tu búsqueda
  </p>
);

const VehicleTable: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [originalVehicles, setOriginalVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [reloadData, setReloadData] = useState<boolean>(false);

  useEffect(() => {
    fetchData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/car/get-all`,
      setVehicles,
      setOriginalVehicles,
      setError,
      setLoading
    );
  }, [reloadData]);

  useEffect(() => {
    if (searchTerm === "") {
      setVehicles(originalVehicles);
    } else {
      const filteredVehicles = originalVehicles.filter((vehicle) =>
        vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setVehicles(filteredVehicles);
    }
  }, [searchTerm, originalVehicles]);

  const handleVehicleDelete = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const handleVehicleEdit = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const columns: TableColumn<Vehicle>[] = [
    {
      name: "Placa",
      selector: (row) => row.plate,
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    {
      name: "Color",
      selector: (row) => row.color,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Año de fabricación",
      selector: (row) => row.manufacturingYear.toString(),
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Modelo de auto",
      selector: (row) => row.carModel.name,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Marca de auto",
      selector: (row) => row.carModel.carBrand.name,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Acciones",
      cell: (row) => (
        <ActionButtons
          row={row}
          onEdit={handleVehicleEdit}
          onDelete={handleVehicleDelete}
          entity="vehicle"
          entityCamelCase="vehicle"
          entityName={row.plate}
        />
      ),
    },
  ];

  return (
    <Section>
      <div className="flex items-center justify-between">
        <CustomTitle title={"Vehículos"} />
        <div className="w-1/2 max-w-md py-2">
          <Input
            type="text"
            placeholder="Buscar por placa"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      <div className="grid grid-col-1">
        <DataTable
          columns={columns}
          data={vehicles}
          pagination
          highlightOnHover
          progressPending={loading}
          progressComponent={<Loading />}
          noDataComponent={<NoDataComponent />}
        />
        <div className="flex items-center justify-end mt-2">
          <div className="mr-2">
            <ExportCsvButton
              data={vehicles.map((vehicle) => ({
                Placa: vehicle.plate,
                Color: vehicle.color,
                "Año de fabricación": vehicle.manufacturingYear,
                "Modelo de auto": vehicle.carModel.name,
                "Marca de auto": vehicle.carModel.carBrand.name,
              }))}
              fileName="vehiculos.csv"
            />
          </div>
          <div>
            <GeneralReport entity={"car"}></GeneralReport>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default VehicleTable;
