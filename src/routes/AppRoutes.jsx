import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../modules/auth/pages/LoginPage';
import HomeLogistica from '../modules/logistica/pages/HomeLogistica';
import PedidosLogistica from '../modules/logistica/pages/PedidosLogistica';
import {DetalhesPedidoPage} from '../modules/logistica/pages/DetalhesPedidoPage';
import CadClienteLogistica from '../modules/logistica/pages/CadClienteLogistica'; 
import ClientesLogistica from '../modules/logistica/pages/Clientes';

// Importe outros componentes de rotas aqui...

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rota para a página de login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rota principal ou outras rotas */}
      <Route path="/" element={<div>Página Inicial</div>} />
      {/* Rota principal ou outras rotas */}
      <Route path="/logistica/início" element={<HomeLogistica/>} />
      {/* Rota principal ou outras rotas */}
      <Route path="/logistica/pedidos" element={<PedidosLogistica/>} />
      {/* Rota principal ou outras rotas */}
      <Route path="/logistica/pedido/:cod_externo" element={<DetalhesPedidoPage/>} />
      {/* Rota principal ou outras rotas */}
      <Route path="/logistica/cadastar_clientes" element={<CadClienteLogistica/>} />
      {/* Rota principal ou outras rotas */}
      <Route path="/logistica/clientes" element={<ClientesLogistica/>} />
        


      {/* Rota para lidar com caminhos não encontrados (opcional) */}
      <Route path="*" element={<div>404 - Página Não Encontrada</div>} />
    </Routes>
  );
};

export default AppRoutes;