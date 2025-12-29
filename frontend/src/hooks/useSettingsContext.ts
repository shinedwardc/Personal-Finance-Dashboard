import { useContext } from "react";
import { SettingsContext } from "../context/SettingsContext";

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettingsProvider must be used within a DataProvider");
  }
  return context;
};
