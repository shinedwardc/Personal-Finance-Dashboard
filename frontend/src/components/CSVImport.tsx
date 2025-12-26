import { useRef, Dispatch, SetStateAction } from "react";
import { TransactionInterface } from "@/interfaces/Transactions";
import { Button } from "./ui/button";
import Papa from "Papaparse";
import { FaFileCsv } from "react-icons/fa6";

const CSVImport = ({
  setImportedData,
}: {
  setImportedData: Dispatch<SetStateAction<TransactionInterface[] | null>>;
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
  }): Omit<TransactionInterface, "id" | "updated_at"> => {
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
      <Button
        variant="secondary"
        onClick={handleClick}
        className="px-10 py-6 text-lg 
                              rounded-full shadow-lg bg-white/20 backdrop-blur-lg 
                              border border-white/30 hover:bg-white/30"
      >
        <span className="flex flex-row justify-center items-center gap-x-1">
          {<FaFileCsv />}
          <p>Import CSV file</p>
        </span>
      </Button>
    </>
  );
};

export default CSVImport;
