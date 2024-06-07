import CustomTable from "@/components/utils/CustomTable";
import React, { useState, useEffect } from "react";
import { DeleteEntityDialog } from "@/components/api/DeleteEntity";
import BrandUpdate from "./BrandUpdate";
import { TableColumn } from "react-data-table-component";
import { fetchData } from "@/utilities/FetchData";

interface Brand {
  id: number;
  name: string;
}

const NoDataComponent = () => (
  <p className="text-red-600 font-bold">
    No se encuentran resultados de tu búsqueda
  </p>
);

const BrandTable = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [originalBrands, setOriginalBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [reloadData, setReloadData] = useState<boolean>(false);

  useEffect(() => {
    fetchData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/car-brand/get-all`,
      setBrands,
      setOriginalBrands,
      setError,
      setLoading
    );
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

  const columns = [
    {
      name: "Nombre de Marca",
      selector: (row: Brand) => row.name,
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    {
      name: "Acciones",
      cell: (row: Brand) => (
        <div className="flex space-x-2">
          <BrandUpdate
            id={row.id}
            entity={"car-brand"}
            entityName={row.name}
            onComplete={handleBrandUpdate}
          />
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
  ] as TableColumn<Brand>[];

  return (
    <CustomTable
      columns={columns}
      data={brands}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      loading={loading}
      error={error}
      NoDataComponent={NoDataComponent}
      handleDelete={handleBrandDelete}
      handleUpdate={handleBrandUpdate}
      exportCsvData={brands.map((brand) => ({
        "Nombre de Marca": brand.name,
      }))}
      exportCsvFileName="marcas_de_auto.csv"
      generalReportEntity="car-brand"
    />
  );
};

export default BrandTable;
