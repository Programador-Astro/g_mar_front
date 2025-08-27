import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../modules/auth/pages/LoginPage';
import HomeLogistica from '../modules/logistica/pages/HomeLogistica';
import PedidosLogistica from '../modules/logistica/pages/PedidosLogistica';
import {DetalhesPedidoPage} from '../modules/logistica/pages/DetalhesPedidoPage';
import CadClienteLogistica from '../modules/logistica/pages/CadClienteLogistica'; 
import ClientesLogistica from '../modules/logistica/pages/Clientes';
import DetalhesCliente from '../modules/logistica/pages/DetalhesCliente';


import ProtectedRoute from './ProtectedRoute';
// Importe outros componentes de rotas aqui...

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rota principal */}
       <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rota para a página de login */}
      <Route path="/login" element={<LoginPage />} />

      
      {/* Inicio Logistica */}
      <Route path="/logistica/início" element={<ProtectedRoute><HomeLogistica/></ProtectedRoute>} />
      {/* */}
      <Route path="/logistica/pedidos" element={<ProtectedRoute> <PedidosLogistica/></ProtectedRoute>} />
      {/*  */}
      <Route path="/logistica/pedido/:cod_externo" element={<ProtectedRoute><DetalhesPedidoPage/></ProtectedRoute>} />
      {/* */}
      <Route path="/logistica/cadastar_clientes" element={<ProtectedRoute><CadClienteLogistica/></ProtectedRoute>} />
      {/*  */}
      <Route path="/logistica/clientes" element={<ProtectedRoute><ClientesLogistica/></ProtectedRoute>} />
      {/*  */}
      <Route path="/logistica/cliente/:codigo_externo" element={<ProtectedRoute><DetalhesCliente/></ProtectedRoute>} />
        


      {/* Rota para lidar com caminhos não encontrados (opcional) */}
      <Route path="*" element={<div>404 - Página Não Encontrada</div>} />
    </Routes>
  );
};

export default AppRoutes;