import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Loading from "@/components/utils/Loading";
import { Input } from "@/components/ui/input";
import Section from "@/components/ui/Section";
import ExportCsvButton from "./ExportCsvButton";
import GeneralReport from "./GeneralReport";

interface TableData {
  [key: string]: any;
}

interface CustomTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  error: string;
  NoDataComponent: React.FC;
  handleDelete: () => void;
  handleUpdate: () => void;
  exportCsvData: { [key: string]: any }[];
  exportCsvFileName: string;
  generalReportEntity: string;
}

const CustomTable = <T,>({
  columns,
  data,
  searchTerm,
  setSearchTerm,
  loading,
  error,
  NoDataComponent,
  handleDelete,
  handleUpdate,
  exportCsvData,
  exportCsvFileName,
  generalReportEntity,
}: CustomTableProps<T>) => {
  return (
    <Section>
      <div className="flex items-center justify-between">
        <div className="w-1/2 max-w-md py-2">
          <Input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      <div className="grid grid-col-1">
        <DataTable
          columns={columns}
          data={data}
          pagination
          highlightOnHover
          progressPending={loading}
          progressComponent={<Loading />}
          noDataComponent={<NoDataComponent />}
        />
      </div>
      <div className="flex items-center justify-end mt-2">
        <div className="mr-2">
          <ExportCsvButton data={exportCsvData} fileName={exportCsvFileName} />
        </div>
        <div>
          <GeneralReport entity={generalReportEntity} />
        </div>
      </div>
    </Section>
  );
};

export default CustomTable;
