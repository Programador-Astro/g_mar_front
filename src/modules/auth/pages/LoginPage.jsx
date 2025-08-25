import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

// Componente principal da página de login
function LoginPage() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Estilos em JavaScript para replicar o design e a responsividade
  const containerStyle = {
    // Usamos position: fixed para garantir que o formulário seja centralizado no ecrã, independentemente do layout do pai
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#14293D', // Cor de fundo da imagem
    fontFamily: "'Inter', sans-serif", // Fonte mais comum
  };

  const formCardStyle = {
    width: '90%', // 90% da largura em mobile
    maxWidth: '350px', // Limita a largura máxima para desktop
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '1rem',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)', // Sombra mais proeminente
    position: 'relative',
    transition: 'all 0.3s ease-in-out',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 500,
    textAlign: 'center',
    color: '#333',
    marginBottom: '2rem',
    letterSpacing: '0.05em',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem', // Espaçamento entre os campos
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
  };

  const labelStyle = {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#555',
    marginBottom: '0.5rem',
  };

  const inputStyle = {
    width: 'calc(100% - 2rem)', // Usando calc para subtrair o padding e manter a largura total de 100%
    padding: '0.75rem 1rem',
    border: '2px solid #5a91ad', // Borda com cor da imagem
    borderRadius: '0.5rem',
    backgroundColor: '#fff',
    color: '#333',
    transition: 'border-color 0.3s ease-in-out',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
  };
  
  const buttonStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#5a91ad', // Cor de fundo do botão da imagem
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease-in-out',
  };

  const disabledButtonStyle = {
    backgroundColor: '#b0c7d3',
    cursor: 'not-allowed',
  };

  const messageStyle = {
    marginTop: '1.5rem',
    textAlign: 'center',
    fontWeight: 500,
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/auth/login', {
        email,
        pwd,
      });

      if (response.data.access_token) {
        // Salva o token no localStorage
        localStorage.setItem('token', response.data.access_token);
        setMessage('Login realizado com sucesso! Redirecionando...');
        
        // Redireciona o usuário para a página de logística
        // useNavigate é a forma moderna de fazer redirecionamento no React Router
        navigate('/logistica/início');

      } else {
        setMessage('Erro inesperado na resposta da API.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage('Usuario ou Senha Incorretos. Verifique e tente novamente.');
      } else {
        setMessage('Erro ao conectar com o servidor. Tente novamente mais tarde.');
        console.error('Erro de login:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <h2 style={titleStyle}>Grupo Mar</h2>
        <form style={formStyle} onSubmit={handleSubmit}>
          <div style={formGroupStyle}>
            <label htmlFor="email" style={labelStyle}>email:</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={formGroupStyle}>
            <label htmlFor="password" style={labelStyle}>senha:</label>
            <input
              id="pwd"
              name="pwd"
              type="password"
              required
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ 
              ...buttonStyle, 
              ...(loading ? disabledButtonStyle : {}),
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        {message && (
          <p style={{
            ...messageStyle,
            color: message.includes('sucesso') ? '#16a34a' : '#ef4444'
          }}>
            {message}
          </p>
        )}
      </div>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" />
    </div>
  );
}

// O componente principal da aplicação para renderizar a página de login
export default function App() {
  return <LoginPage />;
}
