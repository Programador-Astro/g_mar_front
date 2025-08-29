import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, setor }) {
  const token = sessionStorage.getItem("token"); // Verifica se o token está presente no localStorage
  const userSetor = sessionStorage.getItem("setor"); // Obtém o setor do usuário do sessionStorage

  // Se não houver token, redireciona para a página de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se o setor do usuário não for o necessário para a rota, redireciona para a página de erro (ou outro comportamento)
  if (userSetor !== setor) {
    return <Navigate to="/404" replace />;
  }

  return children;
}
