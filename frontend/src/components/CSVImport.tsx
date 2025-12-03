import { useRef, Dispatch, SetStateAction } from "react";
import { ExpenseInterface } from "@/interfaces/expenses";
import { Button } from "./ui/button";
import Papa from "Papaparse";
import { FaFileCsv } from "react-icons/fa6";

const CSVImport = ({
  setImportedData,
}: {
  setImportedData: Dispatch<SetStateAction<ExpenseInterface[] | null>>;
}) => {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileRef.current?.click(); // trigger file input
  };

  const mapImportedRowToExpense = (row: {
    title: string;
    category: string;
    amount: string;
    date: string;
    notes: string | null;
  }): Omit<ExpenseInterface, "id" | "updated_at"> => {
    return {
      name: row.title.trim(),
      category: row.category.trim(),
      amount: Number(row.amount), // convert string → number
      date: row.date,
      notes: row.notes || "",
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // parse with Papa.parse(file)
    Papa.parse(file, {
      header: true, // converts to JSON objects
      skipEmptyLines: true,
      complete: (results: { data: []; errors: []; meta: any }) => {
        const transformed = results.data.map((row) =>
          mapImportedRowToExpense(row),
        );
        console.log(transformed);
        setImportedData(transformed);
        e.target.value = "";
      },
    });
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        ref={fileRef}
        onChange={handleFileUpload}
        className="hidden"
      />
      <Button variant="secondary" onClick={handleClick}>
        <span className="flex flex-row justify-center gap-x-1">
          {<FaFileCsv />} Import CSV file
        </span>
      </Button>
    </>
  );
};

export default CSVImport;
