"use client";

import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Loading from "@/components/utils/Loading";
import { Input } from "@/components/ui/input";
import Section from "@/components/ui/Section";
import { DeleteEntityDialog } from "@/components/api/DeleteEntity";
import CustomTitle from "@/components/utils/CustomTitle";
import BrandUpdate from "./BrandUpdate";
import ExportCsvButton from "@/components/utils/ExportCsvButton";
import GeneralReport from "@/components/utils/GeneralReport";
import { getToken } from "@/lib/GetToken";

interface Brand {
  id: number;
  name: string;
}

const NoDataComponent = () => (
  <p className="text-red-600 font-bold">
    No se encuentran resultados de tu búsqueda
  </p>
);

const BrandTable: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [originalBrands, setOriginalBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [reloadData, setReloadData] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/car-brand/get-all`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getToken()}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener las marcas.");
        }

        const responseData = await response.json();

        if (!responseData.success || !responseData.data) {
          throw new Error("La respuesta no contiene datos válidos.");
        }

        const fetchedBrands = responseData.data;
        setBrands(fetchedBrands);
        setOriginalBrands(fetchedBrands);
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
      setBrands(originalBrands);
    } else {
      const filteredBrands = originalBrands.filter((brand) =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setBrands(filteredBrands);
    }
  }, [searchTerm, originalBrands]);

  const handleBrandDelete = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const handleBrandUpdate = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const columns: TableColumn<Brand>[] = [
    {
      name: "Nombre de Marca",
      selector: (row) => row.name,
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex space-x-2">
          <BrandUpdate
            id={row.id}
            entity={"car-brand"}
            entityName={row.name}
            onComplete={handleBrandUpdate}
          ></BrandUpdate>
          <DeleteEntityDialog
            entityId={row.id}
            entity="car-brand"
            entityCamelCase="carBrand"
            entityName={row.name}
            onComplete={handleBrandDelete}
          />
        </div>
      ),
    },
  ];

  return (
    <Section>
      <div className="flex items-center justify-between">
        <CustomTitle title={"Marcas"} />
        <div className="w-1/2 max-w-md py-2">
          <Input
            type="text"
            placeholder="Buscar por nombre de marca"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      <div className="grid grid-col-1">
        <DataTable
          columns={columns}
          data={brands}
          pagination
          highlightOnHover
          progressPending={loading}
          progressComponent={<Loading />}
          noDataComponent={<NoDataComponent />}
        />
        <div className="flex items-center justify-end mt-2">
          <div className="mr-2">
            <ExportCsvButton
              data={brands.map((brand) => ({ "Nombre de Marca": brand.name }))}
              fileName="marcas.csv"
            />
          </div>
          <div>
            <GeneralReport entity={"car-brand"}></GeneralReport>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default BrandTable;
