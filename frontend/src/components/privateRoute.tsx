import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  isLoggedIn: boolean;
  isLoading: boolean;
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ isLoggedIn, isLoading, children }) => {
  if (isLoading) {
    return;
  }
  if (!isLoggedIn) {
    //console.log(location.pathname);
    return <Navigate to="/login"/>;
  }
  //console.log('children', children.type.name);
  return <>{children}</>
};

export default PrivateRoute;
