import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import LoginPage from '../modules/auth/pages/LoginPage';
import HomeLogistica from '../modules/logistica/pages/HomeLogistica';
import PedidosLogistica from '../modules/logistica/pages/PedidosLogistica';
import { DetalhesPedidoPage } from '../modules/logistica/pages/DetalhesPedidoPage';
import CadClienteLogistica from '../modules/logistica/pages/CadClienteLogistica';
import ClientesLogistica from '../modules/logistica/pages/Clientes';
import DetalhesCliente from '../modules/logistica/pages/DetalhesCliente';


import HomeComercial from '../modules/comercial/pages/HomeComercial';


const AppRoutes = () => {
  return (
    <Routes>
      {/* Rota principal */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rota para a página de login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Inicio Logistica */}
      <Route 
        path="/logistica/inicio" 
        element={
          <ProtectedRoute setor="logistica">
            <HomeLogistica />
          </ProtectedRoute>
        } 
      />

      {/* Rota para pedidos logísticos */}
      <Route 
        path="/logistica/pedidos" 
        element={
          <ProtectedRoute setor="logistica">
            <PedidosLogistica />
          </ProtectedRoute>
        } 
      />

      {/* Detalhes do pedido */}
      <Route 
        path="/logistica/pedido/:cod_externo" 
        element={
          <ProtectedRoute setor="logistica">
            <DetalhesPedidoPage />
          </ProtectedRoute>
        } 
      />

      {/* Cadastro de clientes logísticos */}
      <Route 
        path="/logistica/cadastar_clientes" 
        element={
          <ProtectedRoute setor="logistica">
            <CadClienteLogistica />
          </ProtectedRoute>
        } 
      />

      {/* Lista de clientes logísticos */}
      <Route 
        path="/logistica/clientes" 
        element={
          <ProtectedRoute setor="logistica">
            <ClientesLogistica />
          </ProtectedRoute>
        } 
      />

      {/* Detalhes de clientes logísticos */}
      <Route 
        path="/logistica/cliente/:codigo_externo" 
        element={
          <ProtectedRoute setor="logistica">
            <DetalhesCliente />
          </ProtectedRoute>
        } 
      />

      {/* Inicio Logistica */}
      <Route 
        path="/comercial/inicio" 
        element={
          <ProtectedRoute setor="comercial">
            <HomeComercial />
          </ProtectedRoute>
        } 
      />







      {/* Rota para lidar com caminhos não encontrados (opcional) */}
      <Route path="*" element={<div>404 - Página Não Encontrada <script>console.log('123')</script></div>  } />
    </Routes>
  );
};

export default AppRoutes;
