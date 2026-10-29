import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {

  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  if (!userId || !userRole) {
    return <Navigate to="/login" replace />;
  }

  // convert backend role (CUSTOMER) → customer
  const formattedRole = userRole.toLowerCase();

  if (!allowedRoles.includes(formattedRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
