import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";

// --- Cores e Estilos Globais ---
const colors = {
  primary: "#13293D",
  secondary: "#006494",
  tertiary: "#247BA0",
  quaternary: "#1B98BE",
  white: "#E8F1F2",
};

const GlobalStyle = createGlobalStyle`
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    background-color: ${colors.primary};
    color: ${colors.white};
  }
`;

// --- Styled Components ---
const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;
  box-sizing: border-box;
`;

const ClientsBox = styled.div`
  background-color: ${colors.white};
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  width: 100%;
  max-width: 1200px;
  margin-top: 2rem;
  color: ${colors.primary};
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  color: ${colors.primary};
  font-weight: 700;
  margin: 0;
`;

const NewClientButton = styled.button`
  background-color: ${colors.quaternary};
  color: ${colors.white};
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${colors.tertiary};
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  @media (max-width: 768px) {
    thead {
      display: none; // Esconde o cabeçalho da tabela no mobile
    }
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ccc;

  &:last-of-type {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    display: block;
    border-bottom: 2px solid ${colors.tertiary};
    margin-bottom: 1rem;
    padding-bottom: 1rem;
  }
`;

const TableHeader = styled.th`
  background-color: ${colors.tertiary};
  color: ${colors.white};
  padding: 0.75rem 1rem;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 0.75rem 1rem;

  @media (max-width: 768px) {
    display: block;
    text-align: right;
    padding-left: 50%;
    position: relative;

    &::before {
      content: attr(data-label);
      position: absolute;
      left: 1rem;
      width: 45%;
      text-align: left;
      font-weight: bold;
      color: ${colors.primary};
    }
  }
`;

const TableLink = styled.a`
  color: ${colors.secondary};
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

// Aqui alteramos para msgType, não passar booleana direto para o DOM
const Message = styled.p`
  text-align: center;
  color: ${({ msgType }) => (msgType === "error" ? "red" : colors.primary)};
  padding: 2rem;
`;

// --- Componente da Página ---
export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado. Por favor, faça login.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get("/api/logistica/get_clientes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientes(response.data.dados);
      } catch (e) {
        console.error("Failed to fetch clients:", e);
        setError("Falha ao buscar clientes. Verifique sua conexão ou tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    fetchClientes();
  }, []);

  const tableHeaders = ["Código", "Nome", "Email", "Telefone"];

  return (
    <>
      <GlobalStyle />
      <Navbar />
      <MainContainer>
        <ClientsBox>
          <Header>
            <Title>Clientes</Title>
            <NewClientButton onClick={() => navigate("/logistica/cadastar_clientes")}>
              Novo Cliente
            </NewClientButton>
          </Header>

          {loading && <Message>Carregando...</Message>}
          {error && <Message msgType="error">{error}</Message>}
          {!loading && !error && (
            <StyledTable>
              <thead>
                <TableRow>
                  {tableHeaders.map((header) => (
                    <TableHeader key={header}>{header}</TableHeader>
                  ))}
                </TableRow>
              </thead>
              <tbody>
                {clientes.length > 0 ? (
                  clientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell data-label="Código">
                        <TableLink onClick={() => navigate(`/logistica/cliente/${cliente.codigo_externo}`)}>
                          {cliente.codigo_externo}
                        </TableLink>
                      </TableCell>
                      <TableCell data-label="Nome">{cliente.nome}</TableCell>
                      <TableCell data-label="Email">{cliente.email || "-"}</TableCell>
                      <TableCell data-label="Telefone">{cliente.telefone_cadastro || "-"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="4" style={{ textAlign: "center", paddingLeft: 0 }}>
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </StyledTable>
          )}
        </ClientsBox>
      </MainContainer>
    </>
  );
}
