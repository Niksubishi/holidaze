import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthForms from "../components/Auth/AuthForms";

const AuthPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/venues");
    }
  }, [isAuthenticated, navigate]);

  return <AuthForms />;
};

export default AuthPage;
