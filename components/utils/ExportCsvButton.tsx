import { CSVLink } from "react-csv";
import { Button } from "../ui/button";

interface ExportCsvButtonProps {
  data: Array<{ [key: string]: any }>;
  fileName?: string;
}

const ExportCsvButton: React.FC<ExportCsvButtonProps> = ({
  data,
  fileName = "data.csv",
}) => {
  const headers =
    data.length > 0
      ? Object.keys(data[0]).map((key) => ({ label: key, key }))
      : [];

  return (
    <CSVLink data={data} headers={headers} filename={fileName} separator=";">
      <Button variant={"confirm"}>Exportar CSV</Button>
    </CSVLink>
  );
};

export default ExportCsvButton;
