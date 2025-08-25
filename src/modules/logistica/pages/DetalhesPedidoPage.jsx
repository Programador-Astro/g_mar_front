import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

/**
 * Componente funcional para a página de Detalhes do Pedido.
 * Esta versão foi modificada para transformar a lista de produtos em uma
 * lista de verificação (checklist). Os valores foram removidos, e o
 * componente agora rastreia quais produtos foram marcados.
 */

// Paleta de cores para consistência visual
const colors = {
  primaryBg: '#13293D',
  secondaryBg: '#E8F1F2',
  accent: '#247BA0',
  text: '#13293D',
  textLight: '#E8F1F2',
  title: '#006494',
  statusPending: '#FFC107',
  statusDelivered: '#28A745',
  cardBg: '#f8f8f8',
  cardBorder: '#e2e8f0',
};

// Animação para o estado de carregamento
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

// Componente estilizado para o texto de carregamento
const LoadingText = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

// Container principal da página, com background e centralização
const MainContainer = styled.div`
  background-color: ${colors.primaryBg};
  min-height: 100vh;
  padding: 2rem 1rem; // Ajuste de padding para mobile
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  color: ${colors.textLight};
  text-align: center;
`;

// Link de navegação para voltar à lista de pedidos
// Ajustado para ser mais compacto e responsivo.
const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${colors.textLight};
  background-color: transparent;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease-in-out;
  border: 1px solid transparent;
  
  &:hover {
    color: ${colors.accent};
    transform: translateX(-5px);
  }

  svg {
    height: 1.5rem;
    width: 1.5rem;
  }
`;

// Wrapper para o BackLink para garantir alinhamento à esquerda
const BackLinkWrapper = styled.div`
  width: 100%;
  max-width: 80rem;
  text-align: left;
  margin-bottom: 2rem;
`;

// Box de conteúdo principal que contém todos os detalhes do pedido
const ContentBox = styled.div`
  background-color: ${colors.secondaryBg};
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 2.5rem;
  width: 100%;
  max-width: 80rem;
  border: 1px solid ${colors.cardBorder};
  color: ${colors.text};
`;

// Seção de cabeçalho com o título e o status do pedido
const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #cbd5e0;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

// Título principal da página
const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  color: ${colors.text};
  line-height: 1.2;
`;

// Componente para o badge de status do pedido
const StatusBadge = styled.span`
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  color: white;
  background-color: ${props => props.status === 'Pendente' ? colors.statusPending : colors.statusDelivered};
`;

// Container para os cartões de informação
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// Card individual para cada seção de informações (Pedido, Cliente, Endereço)
const InfoCard = styled.div`
  padding: 1.5rem;
  border-radius: 1rem;
  background-color: ${colors.cardBg};
  border: 1px solid ${colors.cardBorder};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease-in-out;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

// Título de cada card de informação
const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: ${colors.title};
  display: flex;
  align-items: center;
  gap: 0.5rem; // Espaço entre o ícone e o texto
`;

// Parágrafo para cada item de informação
const InfoItem = styled.p`
  font-size: 1.125rem;
  line-height: 1.75rem;
  margin-top: 0.75rem;

  &:first-child {
    margin-top: 0;
  }
`;

// Label de destaque para cada item de informação
const InfoLabel = styled.span`
  font-weight: 600;
`;

// Novo componente estilizado para os itens da lista de produtos (checklist)
const ChecklistItem = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  margin-top: 0.75rem;
  cursor: pointer;
  transition: color 0.2s ease-in-out;
  
  &:first-child {
    margin-top: 0;
  }

  // Estilo para o texto quando o item está marcado
  ${props => props.checked && `
    color: #a0aec0; // Cor cinza para itens marcados
    text-decoration: line-through;
  `}
`;

// Estilo para o checkbox personalizado
const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  -webkit-appearance: none;
  appearance: none;
  background-color: #fff;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid ${colors.accent};
  border-radius: 0.25rem;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
  cursor: pointer;
  
  &::before {
    content: "";
    width: 0.8rem;
    height: 0.8rem;
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
    transform: scale(0);
    transform-origin: bottom left;
    transition: transform 120ms ease-in-out;
    box-shadow: inset 1em 1em ${colors.accent};
    background-color: ${colors.accent};
  }
  
  &:checked::before {
    transform: scale(1);
  }
`;

export function DetalhesPedidoPage() {
  const { cod_externo } = useParams();
  const [pedido, setPedido] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [enderecoAdm, setEnderecoAdm] = useState(null);
  const [enderecoMotorista, setEnderecoMotorista] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state to manage the checked status of each product
  const [checkedProducts, setCheckedProducts] = useState({});

  useEffect(() => {
    const fetchOrderData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError("Usuário não autenticado. Por favor, faça login.");
        setLoading(false);
        return;
      }

      const apiUrl = `/api/logistica/get_pedido/${cod_externo}`;
      
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const contentType = response.headers.get("content-type");
        if (!response.ok) {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json(); 
            throw new Error(`Erro na API: ${response.status} ${response.statusText}. Detalhes: ${errorData.message || 'Sem detalhes.'}`);
          } else {
            const errorText = await response.text();
            throw new Error(`Resposta inesperada da API. Esperado JSON, mas recebido '${contentType}'. Resposta do servidor: ${errorText.substring(0, 100)}...`);
          }
        }
        
        const data = await response.json();
        
        setPedido(data.pedido);
        setCliente(data.cliente);
        setEnderecoAdm(data.endereco_adm);
        setEnderecoMotorista(data.endereco_motorista);
        setProdutos(data.produtos || []);
        
        // Initialize the checkedProducts state based on the fetched products
        const initialCheckedState = {};
        (data.produtos || []).forEach((product, index) => {
          initialCheckedState[index] = false;
        });
        setCheckedProducts(initialCheckedState);

      } catch (err) {
        setError(err.message);
        console.error("Falha ao buscar os dados do pedido:", err);
      } finally {
        setLoading(false);
      }
    };

    if (cod_externo) {
      fetchOrderData();
    }
  }, [cod_externo]);
  
  // Handler for when a product is checked/unchecked
  const handleProductCheck = (index) => {
    setCheckedProducts(prevState => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  if (loading) {
    return (
      <MainContainer>
        <LoadingText>Carregando detalhes do pedido...</LoadingText>
      </MainContainer>
    );
  }

  if (error) {
    return (
      <MainContainer>
        <p style={{ color: 'red', fontSize: '1.5rem' }}>Erro ao carregar os dados.</p>
        <p style={{ color: colors.textLight, marginTop: '0.5rem' }}>{error}</p>
      </MainContainer>
    );
  }

  if (!pedido) {
    return (
      <MainContainer>
        <p style={{ color: 'red', fontSize: '1.5rem' }}>Pedido não encontrado.</p>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <BackLinkWrapper>
        <BackLink to="/logistica/pedidos">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Voltar para Pedidos</span>
        </BackLink>
      </BackLinkWrapper>

      <ContentBox>
        <HeaderSection>
          <Title>Pedido #{pedido.cod_externo}</Title>
          <StatusBadge status={pedido.status}>
            {pedido.status}
          </StatusBadge>
        </HeaderSection>
        
        <InfoGrid>
          <InfoCard>
            <CardTitle>📝 Detalhes do Pedido</CardTitle>
            <InfoItem><InfoLabel>Status:</InfoLabel> {pedido.status}</InfoItem>
            <InfoItem><InfoLabel>Data de Criação:</InfoLabel> {pedido.data_criacao}</InfoItem>
            <InfoItem><InfoLabel>Data de Entrega:</InfoLabel> {pedido.data_entrega || 'Não agendado'}</InfoItem>
          </InfoCard>

          <InfoCard>
            <CardTitle>👤 Cliente</CardTitle>
            <InfoItem><InfoLabel>Nome:</InfoLabel> {cliente?.nome || 'Não informado'}</InfoItem>
            <InfoItem><InfoLabel>Email:</InfoLabel> {cliente?.email || 'Não informado'}</InfoItem>
            <InfoItem><InfoLabel>Telefone:</InfoLabel> {cliente?.telefone_cadastro || 'Não informado'}</InfoItem>
          </InfoCard>

          <InfoCard>
            <CardTitle>📍 Endereço de Entrega</CardTitle>
            <InfoItem><InfoLabel>Endereço:</InfoLabel> {enderecoAdm?.endereco}, {enderecoAdm?.numero}</InfoItem>
            <InfoItem><InfoLabel>Bairro:</InfoLabel> {enderecoAdm?.bairro}</InfoItem>
            <InfoItem><InfoLabel>Cidade:</InfoLabel> {enderecoAdm?.cidade}</InfoItem>
            <InfoItem><InfoLabel>Ponto Ref:</InfoLabel> {enderecoAdm?.ponto_ref || 'Não informado'}</InfoItem>
            <InfoItem><InfoLabel>Ponto Ref:</InfoLabel> {enderecoAdm?.ponto_ref || 'Não informado'}</InfoItem>
            <a
                      href={`https://www.google.com/maps?q=${enderecoAdm?.latitude},${enderecoAdm?.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#007bff", textDecoration: "underline", marginTop: "4px" }}
                    >
                      📍 Ver no Maps
                    </a>
          
          </InfoCard>
        </InfoGrid>

        <InfoCard style={{ marginTop: "2rem", gridColumn: "1 / -1" }}>
          <CardTitle>📦 Produtos</CardTitle>
          {produtos.length > 0 ? (
            <ul>
              {produtos.map((p, i) => (
                <ChecklistItem key={i} checked={checkedProducts[i]}>
                  <Checkbox 
                    checked={checkedProducts[i]} 
                    onChange={() => handleProductCheck(i)}
                  />
                  <span>
                    <InfoLabel>{p.nome}</InfoLabel> — {p.quantidade}x
                  </span>
                </ChecklistItem>
              ))}
            </ul>
          ) : (
            <InfoItem>Nenhum produto encontrado.</InfoItem>
          )}
        </InfoCard>
      </ContentBox>
    </MainContainer>
  );
}
