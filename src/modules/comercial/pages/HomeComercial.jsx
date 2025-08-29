import Navbar from "../components/Navbar";
import styled, { createGlobalStyle } from 'styled-components';

// Definição de cores para manter o design consistente
const colors = {
  primary: '#13293D',
  secondary: '#006494',
  tertiary: '#247BA0',
  quaternary: '#1B98BE',
  white: '#E8F1F2',
};

// Estilos globais injetados de forma mais segura com styled-components
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

// Container principal da página
const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;
  box-sizing: border-box; // Garante que o padding não estoure a largura

  // Em telas menores (mobile), reduzimos o padding lateral
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

// Grid que organiza o conteúdo
const ContentContainer = styled.div`
  display: grid;
  // Sua regra de grid já é excelente e responsiva! 
  // Ela cria colunas de no mínimo 300px e as distribui igualmente.
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px; // Adiciona uma largura máxima para telas muito grandes
  margin-top: 2rem;

  // Em telas menores, reduzimos o espaçamento entre os cards
  @media (max-width: 768px) {
    gap: 1rem;
    grid-template-columns: 1fr; // Força uma única coluna para melhor visualização
  }
`;

// "Cards" de conteúdo
const SectionBox = styled.section`
  background-color: ${colors.secondary};
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  min-height: 250px; // Reduzi um pouco a altura mínima, opcional
`;

// Títulos das seções
const SectionTitle = styled.h3`
  color: ${colors.white};
  margin-top: 0;
  border-bottom: 2px solid ${colors.quaternary};
  padding-bottom: 0.5rem;
  font-weight: 700;
`;

export default function HomeComercial() {
  return (
    <>
      <GlobalStyle /> {/* Componente de estilos globais */}
      <Navbar />
      <MainContainer>
        <ContentContainer>
          <SectionBox>
            <SectionTitle>Pedidos</SectionTitle>
            <p>O conteúdo para "Pedidos" será adicionado aqui.</p>
          </SectionBox>

          <SectionBox>
            <SectionTitle>Pedios e Clientes</SectionTitle>
            <p>O conteúdo para "Pedidos e Clientes" será adicionado aqui.</p>
          </SectionBox>
          
          {/* Você pode adicionar mais seções facilmente */}
          <SectionBox>
            <SectionTitle>Relatórios</SectionTitle>
            <p>O conteúdo para "Comercial" será adicionado aqui.</p>
          </SectionBox>
        </ContentContainer>
      </MainContainer>
    </>
  );
}