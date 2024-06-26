"use client";

import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Loading from "@/components/utils/Loading";
import { Input } from "@/components/ui/input";
import Section from "@/components/ui/Section";
import { DeleteEntityDialog } from "@/components/api/DeleteEntity";
import CustomTitle from "@/components/utils/CustomTitle";
import AssignmentUpdate from "./AssignmentUpdate";
import ExportCsvButton from "@/components/utils/ExportCsvButton";
import GeneralReport from "@/components/utils/GeneralReport";
import { getToken } from "@/lib/GetToken";

interface Allocation {
  id: number;
  car: {
    plate: string;
    color: string;
    manufacturingYear: number;
    carModel: {
      name: string;
      category: string;
      fuelType: string;
      seatingCapacity: number;
      transmissionType: string;
    };
  };
  mainDriver: {
    person: {
      names: string;
      surnames: string;
    };
  };
  auxiliaryDriver: {
    person: {
      names: string;
      surnames: string;
    };
  };
  isActive: boolean;
  createdAt: string;
}

const NoDataComponent = () => (
  <p className="text-red-600 font-bold">
    No se encuentran resultados de tu búsqueda
  </p>
);

const AssignmentTable: React.FC = () => {
  const [assignments, setAssignments] = useState<Allocation[]>([]);
  const [originalAssignments, setOriginalAssignments] = useState<Allocation[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [reloadData, setReloadData] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/car-driver/get-all`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken()}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener las asignaciones.");
        }

        const responseData = await response.json();

        if (!responseData.success || !responseData.data) {
          throw new Error("La respuesta no contiene datos válidos.");
        }

        const fetchedAssignments = responseData.data;
        setAssignments(fetchedAssignments);
        setOriginalAssignments(fetchedAssignments);
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
      setAssignments(originalAssignments);
    } else {
      const filteredAssignments = originalAssignments.filter(
        (assignment) =>
          assignment.car.plate
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          assignment.mainDriver.person.names
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          assignment.mainDriver.person.surnames
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (assignment.auxiliaryDriver &&
            (assignment.auxiliaryDriver.person.names
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
              assignment.auxiliaryDriver.person.surnames
                .toLowerCase()
                .includes(searchTerm.toLowerCase())))
      );
      setAssignments(filteredAssignments);
    }
  }, [searchTerm, originalAssignments]);

  const handleAssignmentDelete = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const handleAssignmentUpdate = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const columns: TableColumn<Allocation>[] = [
    {
      name: "Placa del vehículo",
      selector: (row) => row.car.plate,
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    {
      name: "Color del vehículo",
      selector: (row) => row.car.color,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Año de fabricación",
      selector: (row) => row.car.manufacturingYear.toString(),
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Modelo del vehículo",
      selector: (row) => row.car.carModel.name,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Conductor principal",
      selector: (row) =>
        `${row.mainDriver.person.names} ${row.mainDriver.person.surnames}`,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Conductor auxiliar",
      selector: (row) =>
        row.auxiliaryDriver
          ? `${row.auxiliaryDriver.person.names} ${row.auxiliaryDriver.person.surnames}`
          : "N/A",
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Estado",
      selector: (row) => (row.isActive ? "Activo" : "Inactivo"),
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Fecha de creación",
      selector: (row) => {
        const date = new Date(row.createdAt);
        return date.toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex space-x-2">
          <AssignmentUpdate
            id={row.id}
            entity={"car-driver"}
            entityName={row.id.toString()}
            onComplete={handleAssignmentUpdate}
          ></AssignmentUpdate>
          <DeleteEntityDialog
            entityId={row.id}
            entity="car-driver"
            entityCamelCase="carDriver"
            entityName={row.car.plate}
            onComplete={handleAssignmentDelete}
          />
        </div>
      ),
    },
  ];

  return (
    <Section>
      <div className="flex items-center justify-between">
        <CustomTitle title={"Asignaciones"} />
        <div className="w-1/2 max-w-md py-2">
          <Input
            type="text"
            placeholder="Buscar por placa del vehículo o nombre del conductor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      <div className="grid grid-col-1">
        <DataTable
          columns={columns}
          data={assignments}
          pagination
          highlightOnHover
          progressPending={loading}
          progressComponent={<Loading />}
          noDataComponent={<NoDataComponent />}
        />
        <div className="flex items-center justify-end mt-2">
          <div className="mr-2">
            <ExportCsvButton
              data={assignments.map((assignment) => ({
                "Placa del vehículo": assignment.car.plate,
                "Color del vehículo": assignment.car.color,
                "Año de fabricación": assignment.car.manufacturingYear,
                "Modelo del vehículo": assignment.car.carModel.name,
                "Conductor principal": `${assignment.mainDriver.person.names} ${assignment.mainDriver.person.surnames}`,
                "Conductor auxiliar": assignment.auxiliaryDriver
                  ? `${assignment.auxiliaryDriver.person.names} ${assignment.auxiliaryDriver.person.surnames}`
                  : "N/A",
                Estado: assignment.isActive ? "Activo" : "Inactivo",
                "Fecha de creación": new Date(
                  assignment.createdAt
                ).toLocaleDateString("es-CO", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }),
              }))}
              fileName="asignaciones.csv"
            />
          </div>
          <div>
            <GeneralReport entity={"car-driver"}></GeneralReport>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default AssignmentTable;
