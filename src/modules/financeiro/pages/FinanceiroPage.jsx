import React, { useState } from 'react';

// Componente principal da aplicação
export default function FinanceiroPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Função para simular a chamada à API.
  // Você deve substituir TODO este bloco pela sua lógica de login real usando axios.
  const loginUser = (userEmail, userSenha) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Credenciais de teste
        const testEmail = "test@test.com";
        const testPassword = "123456";

        if (userEmail === testEmail && userSenha === testPassword) {
          // Simula uma resposta de sucesso da API
          resolve({ access_token: "fake-jwt-token-for-test" });
        } else {
          // Simula uma resposta de erro da API com a mensagem "msg"
          reject({ response: { data: { msg: "Email ou senha incorretos." } } });
        }
      }, 1500); // Simula o tempo de espera da requisição
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    if (!email || !senha) {
      setErro('Preencha todos os campos.');
      setLoading(false);
      return;
    }

    try {
      // Chama a função de login (simulada ou real)
      const resposta = await loginUser(email, senha);
      
      // Se a resposta for um objeto e tiver a propriedade access_token
      if (resposta && resposta.access_token) {
        localStorage.setItem('token', resposta.access_token);
        console.log('Login efetuado com sucesso!');
        setIsLoggedIn(true);
      } else {
        setErro('Resposta de login inesperada.');
      }
    } catch (error) {
      console.error("Erro de login:", error);
      // Extrai a mensagem de erro da resposta da API
      const errorMsg = error.response && error.response.data && error.response.data.msg 
                       ? error.response.data.msg 
                       : 'Ocorreu um erro. Tente novamente.';
      setErro(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Se o login for bem-sucedido, exibe a tela de sucesso
  if (isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center animate-fade-in">
          <h1 className="text-3xl font-bold text-green-600 mb-4">Sucesso!</h1>
          <p className="text-gray-700">Login efetuado. Bem-vindo(a) à plataforma.</p>
        </div>
      </div>
    );
  }

  // Tela de login
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 font-sans p-4">
      {/* Container principal do formulário com sombra e bordas arredondadas */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm space-y-6 transform transition-all duration-300 hover:scale-105"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">Grupo Mar</h1>

        {/* Campo de e-mail */}
        <div className="relative">
          <label htmlFor="email" className="absolute left-3 top-2 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
            FINANCEIRO:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 pt-6 pb-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-colors bg-blue-100/30 text-gray-800"
            required
            placeholder=" "
          />
        </div>

        {/* Campo de senha */}
        <div className="relative">
          <label htmlFor="senha" className="absolute left-3 top-2 text-sm text-gray-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
            senha:
          </label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-3 pt-6 pb-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-colors bg-blue-100/30 text-gray-800"
            required
            placeholder=" "
          />
        </div>

        {/* Botão de Enviar */}
        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-bold shadow-md transition-all duration-300
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform'}`}
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Entrar'}
        </button>

        {/* Mensagem de erro */}
        {erro && (
          <p className="text-red-500 text-sm text-center font-semibold animate-fade-in-down">{erro}</p>
        )}
      </form>
    </div>
  );
}
