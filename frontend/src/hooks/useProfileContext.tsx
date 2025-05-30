import { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfileContext must be used within a DataProvider");
  }
  return context;
};
