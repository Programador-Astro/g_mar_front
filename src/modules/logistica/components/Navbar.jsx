import React from 'react';

// Objeto de cores para manter o design consistente e fácil de atualizar.
const colors = {
  primary: '#13293D',
  secondary: '#006494',
  tertiary: '#247BA0',
  quaternary: '#1B98BE',
  white: '#E8F1F2',
};

/**
 * Componente Navbar.
 * Renderiza uma barra de navegação com links para diferentes seções.
 * O design inclui cantos arredondados e alinhamento à direita com margens.
 * Os links têm um efeito de hover para melhor interação.
 */
export default function Navbar() {
  const navStyles = {
    // Layout Flexbox para alinhar os itens
    display: 'flex',
    justifyContent: 'flex-end', // Alinha a barra de navegação à direita
    alignItems: 'center',
    // Posicionamento e margens para não encostar nas bordas
    marginTop: '2rem',
    marginRight: '2rem',
  };

  const navContainerStyles = {
    backgroundColor: colors.secondary,
    borderRadius: '12px', // Cantos arredondados
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    padding: '0.8rem 1.5rem', // Padding interno para a barra
  };

  const navListStyles = {
    listStyle: 'none', // Remove os marcadores de lista
    margin: 0,
    padding: 0,
    display: 'flex',
    gap: '1.5rem', // Espaçamento entre os links
  };

  const navItemLinkStyles = {
    color: colors.white,
    textDecoration: 'none',
    fontWeight: '600',
    padding: '0.5rem 0', // Padding vertical para os links
    transition: 'color 0.3s ease',
  };

  // Efeitos de hover nos links
  const handleMouseEnter = (e) => {
    e.target.style.color = colors.quaternary;
  };

  const handleMouseLeave = (e) => {
    e.target.style.color = colors.white;
  };
  
  const navItems = ['Início', 'Pedidos',  'Clientes','Rotas', 'Veículos', 'Usuários', 'Estoque'];

  return (
    <nav style={navStyles}>
      <div style={navContainerStyles}>
        <ul style={navListStyles}>
          {navItems.map((item) => (
            <li key={item}>
              <a
                href={`/logistica/${item.toLowerCase().replace('ç', 'c')}`}
                style={navItemLinkStyles}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
