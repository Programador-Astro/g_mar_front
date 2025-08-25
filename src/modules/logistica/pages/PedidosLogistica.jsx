import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../components/Navbar";
import styled, { createGlobalStyle } from 'styled-components';

// --- Cores e Estilos Globais ---
const colors = {
  primary: '#13293D',
  secondary: '#006494',
  tertiary: '#247BA0',
  quaternary: '#1B98BE',
  white: '#E8F1F2',
};

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    background-color: ${colors.primary};
    color: ${colors.white};
  }
`;

const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;
  box-sizing: border-box;
`;

const OrdersBox = styled.div`
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

const NewOrderButton = styled.button`
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
      display: none;
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

  &:hover {
    text-decoration: underline;
  }
`;

const Message = styled.p`
  text-align: center;
  color: ${({ error }) => (error ? 'red' : colors.primary)};
  padding: 2rem;
`;

// --- Modal Upload ---
const UploadOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const UploadModal = styled.div`
  background: ${colors.white};
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  color: ${colors.primary};
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
`;

const UploadButton = styled.button`
  background-color: ${colors.quaternary};
  color: ${colors.white};
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${colors.tertiary};
  }
`;

const CancelButton = styled.button`
  margin-top: 1rem;
  margin-left: 1rem;
  background-color: #ccc;
  color: ${colors.primary};
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #aaa;
  }
`;

export default function PedidosPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Usuário não autenticado. Por favor, faça login.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get("/api/logistica/get_pedidos", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
        setOrders(response.data);
    } catch (e) {
      console.error("Failed to fetch orders:", e);
      setError("Falha ao buscar pedidos. Verifique sua conexão ou tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      setUploadMessage(null);
    } else {
      setPdfFile(null);
      setUploadMessage("Apenas arquivos PDF são permitidos.");
    }
  };

  const handleUpload = async () => {
    if (!pdfFile) {
      setUploadMessage("Selecione um arquivo PDF antes de enviar.");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("arquivo", pdfFile);

    try {
      setUploading(true);
      await axios.post("/api/logistica/cadastrar_pedido", formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadMessage("Pedido enviado com sucesso!");
      setPdfFile(null);
      setShowUploadModal(false);
      fetchOrders(); // Recarrega a lista de pedidos
    } catch (error) {
      console.error("Erro ao enviar pedido:", error);
      setUploadMessage("Erro ao enviar o pedido.");
    } finally {
      setUploading(false);
    }
  };

  const tableHeaders = ["N° Pedido", "Status", "Cód. Cliente", "Cliente", "Lançado em", "Data de Entrega", "Bairro", "Cidade"];

  return (
    <>
      <GlobalStyle />
      <Navbar />

      {showUploadModal && (
        <UploadOverlay>
          <UploadModal>
            <h3>Anexar Pedido (PDF)</h3>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            {uploadMessage && <Message error={uploadMessage.includes("Erro")}>{uploadMessage}</Message>}
            <UploadButton onClick={handleUpload} disabled={uploading}>
              {uploading ? "Enviando..." : "Enviar"}
            </UploadButton>
            <CancelButton onClick={() => setShowUploadModal(false)}>Cancelar</CancelButton>
          </UploadModal>
        </UploadOverlay>
      )}

      <MainContainer>
        <OrdersBox>
          <Header>
            <Title>Pedidos</Title>
            <NewOrderButton onClick={() => setShowUploadModal(true)}>
              Novo Pedido
            </NewOrderButton>
          </Header>

          {loading && <Message>Carregando...</Message>}
          {error && <Message error>{error}</Message>}
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
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.cod_externo}>
                      <TableCell data-label="N° Pedido">
                        <TableLink href={`/logistica/pedido/${order.cod_externo}`}>
                          {order.cod_externo}
                        </TableLink>
                      </TableCell>
                      <TableCell data-label="Status">{order.status}</TableCell>
                      <TableCell data-label="Cód. Cliente">{order.cod_cliente}</TableCell>
                      <TableCell data-label="Cliente">{order.cliente}</TableCell>
                      <TableCell data-label="Lançado em">{order.data_criacao}</TableCell>
                      <TableCell data-label="Data de Entrega">{order.data_entrega}</TableCell>
                      <TableCell data-label="Bairro">{order.bairro}</TableCell>
                      <TableCell data-label="Cidade">{order.cidade}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="8" style={{ textAlign: 'center', paddingLeft: 0 }}>
                      Nenhum pedido encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </tbody>
            </StyledTable>
          )}
        </OrdersBox>
      </MainContainer>
    </>
  );
}
