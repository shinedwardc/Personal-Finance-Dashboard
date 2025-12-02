import { useState, useRef } from "react";
import { Button } from "./ui/button";
import Papa from "Papaparse";
import { FaFileCsv } from "react-icons/fa6";


const CSVImport = ({ setImportedData }) => {

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    fileRef.current?.click(); // trigger file input
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // parse with Papa.parse(file)
    Papa.parse(file, {
      header: true,     // converts to JSON objects
      skipEmptyLines: true,
      complete: (results) => {
        //console.log("Parsed CSV:", results.data);
        setImportedData(results.data);
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
      >
        <span className="flex flex-row justify-center gap-x-1">
          {<FaFileCsv/>} Import CSV file
        </span>
      </Button>
    </>
  );
};

export default CSVImport;
