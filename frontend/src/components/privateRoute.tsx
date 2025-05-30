import { Navigate } from "react-router-dom";
import { useProfileContext } from "@/hooks/useProfileContext";

const PrivateRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {

  const { authState } = useProfileContext();

  if (authState.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!authState.isLoggedIn) {
    return <Navigate to="/about" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
