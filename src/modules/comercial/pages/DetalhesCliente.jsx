import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, TextField, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, Link,
  Collapse, Modal
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function DetalhesCliente() {
  const { codigo_externo } = useParams();
  const [cliente, setCliente] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({});
  const [enderecos, setEnderecos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [expandedPedido, setExpandedPedido] = useState(null);

  // Modal novo endereço
  const [openModal, setOpenModal] = useState(false);
  const [novoEndereco, setNovoEndereco] = useState({
    cidade: "",
    bairro: "",
    endereco: "",
    numero: "",
    ponto_ref: "",
    obs: ""
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const url = `/api/logistica/get_cliente/${codigo_externo}`;
    axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setCliente(res.data.dados);
      setFormData({
        nome: res.data.dados.nome || "",
        codigo_externo: res.data.dados.codigo_externo || "",
        email: res.data.dados.email || "",
        telefone: res.data.dados.telefone_cadastro || "",
        telefone_motorista: res.data.dados.telefone_motorista || "",
      });
      setEnderecos(res.data.dados.enderecos_adm || []);
      setPedidos(res.data.dados.pedidos || []);
    }).catch(console.error);
  }, [codigo_externo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEnderecoChange = (index, e) => {
    const { name, value } = e.target;
    setEnderecos(prev => {
      const novos = [...prev];
      novos[index] = { ...novos[index], [name]: value };
      return novos;
    });
  };

  const handleSalvar = () => {
    const token = sessionStorage.getItem("token");

    const payload = {
      cliente: {
        nome: formData.nome,
        codigo_externo: formData.codigo_externo,
        email: formData.email,
        telefone_cadastro: formData.telefone,
        telefone_motorista: formData.telefone_motorista,
      },
      enderecos_adm: enderecos.map(e => ({
        id: e.id,
        endereco: e.endereco,
        numero: e.numero,
        ponto_ref: e.ponto_ref,
        obs: e.obs,
      })),
    };

    axios.post(`/api/logistica/update_cliente/${codigo_externo}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setEditando(false);
      setCliente(prev => ({ ...prev, ...payload.cliente, enderecos_adm: payload.enderecos_adm }));
    }).catch(console.error);
  };

  const handleCadastrarEndereco = () => {
    const token = sessionStorage.getItem("token");
    const payload = {
      ...novoEndereco,
      cliente_id: cliente?.id
    };

    axios.post(`1'123`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setOpenModal(false);
      setNovoEndereco({ cidade: "", bairro: "", endereco: "", numero: "", ponto_ref: "", obs: "" });
      setEnderecos(prev => [...prev, payload]);
    }).catch(console.error);
  };

  if (!cliente) return <Typography sx={{ padding: 4 }}>Carregando cliente...</Typography>;

  return (
    <Box sx={{ maxWidth: "100vw", bgcolor: "#f5faff", minHeight: "100vh", p: { xs: 2, md: 6 } }}>
      <Typography variant="h3" gutterBottom sx={{ color: "#003366", fontWeight: "bold" }}>
        Detalhes do Cliente
      </Typography>

      {/* Dados do cliente */}
      <Paper sx={{ p: 4, mb: 6, maxWidth: 900, mx: "auto", bgcolor: "#fff", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", borderRadius: 2 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <TextField label="Nome" name="nome" value={formData.nome} onChange={handleInputChange} disabled={!editando} fullWidth sx={{ bgcolor: editando ? "#e6f0ff" : "transparent" }} />
          <TextField label="Código Externo" name="codigo_externo" value={formData.codigo_externo} disabled fullWidth />
          <TextField label="Email" name="email" value={formData.email} onChange={handleInputChange} disabled={!editando} fullWidth sx={{ bgcolor: editando ? "#e6f0ff" : "transparent" }} />
          <TextField label="Telefone" name="telefone" value={formData.telefone} onChange={handleInputChange} disabled={!editando} fullWidth sx={{ bgcolor: editando ? "#e6f0ff" : "transparent" }} />
          <TextField label="Telefone adicional (Motorista)" name="telefone_motorista" value={formData.telefone_motorista} onChange={handleInputChange} disabled={!editando} fullWidth sx={{ bgcolor: editando ? "#e6f0ff" : "transparent" }} />

          {!editando ? (
            <Button variant="contained" onClick={() => setEditando(true)} sx={{ bgcolor: "#0059b3", ":hover": { bgcolor: "#004080" } }}>
              Editar Cliente
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSalvar} sx={{ bgcolor: "#0073e6", ":hover": { bgcolor: "#005bb5" } }}>
              Salvar Alterações
            </Button>
          )}
        </Box>
      </Paper>

      {/* Endereços */}
      <Paper sx={{ p: 4, maxWidth: 900, mx: "auto", bgcolor: "#fff", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", borderRadius: 2, mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ color: "#003366", fontWeight: "bold" }}>
          Endereços Administrativos
        </Typography>

        {enderecos.length === 0 ? (
          <Typography>Nenhum endereço encontrado.</Typography>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "#e0f0ff" }}>
              <TableRow>
                <TableCell>Endereço</TableCell>
                <TableCell>Número</TableCell>
                <TableCell>Ponto de Referência</TableCell>
                {editando && <TableCell>Observações</TableCell>}
                <TableCell>Mapa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enderecos.map((end, i) => (
                <TableRow key={end.id}>
                  <TableCell>{editando ? <TextField name="endereco" value={end.endereco} onChange={e => handleEnderecoChange(i, e)} fullWidth variant="standard" sx={{ bgcolor: "#e6f0ff" }} /> : end.endereco}</TableCell>
                  <TableCell>{editando ? <TextField name="numero" value={end.numero} onChange={e => handleEnderecoChange(i, e)} variant="standard" sx={{ width: 80, bgcolor: "#e6f0ff" }} /> : end.numero}</TableCell>
                  <TableCell>{editando ? <TextField name="ponto_ref" value={end.ponto_ref} onChange={e => handleEnderecoChange(i, e)} fullWidth variant="standard" sx={{ bgcolor: "#e6f0ff" }} /> : (end.ponto_ref || "-")}</TableCell>
                  {editando && (<TableCell><TextField name="obs" value={end.obs || ""} onChange={e => handleEnderecoChange(i, e)} fullWidth variant="standard" sx={{ bgcolor: "#e6f0ff" }} /></TableCell>)}
                  <TableCell>
                    <Link href={`https://www.google.com/maps/search/?api=1&query=${end.latitude},${end.longitude}`} target="_blank" rel="noopener noreferrer" sx={{ color: "#0073e6" }}>
                      Ver no mapa
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Pedidos */}
      <Paper sx={{ p: 4, maxWidth: 900, mx: "auto", bgcolor: "#fff", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", borderRadius: 2, mb: 6 }}>
        <Typography variant="h5" gutterBottom sx={{ color: "#003366", fontWeight: "bold" }}>
          Pedidos
        </Typography>

        {pedidos.length === 0 ? (
          <Typography>Nenhum pedido encontrado.</Typography>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: "#e0f0ff" }}>
              <TableRow>
                <TableCell />
                <TableCell>Código</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.map((pedido) => (
                <>
                  <TableRow key={pedido.id} hover>
                    <TableCell>
                      <Button onClick={() => setExpandedPedido(expandedPedido === pedido.id ? null : pedido.id)}>
                        {expandedPedido === pedido.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Link href={`/logistica/pedido/${pedido.cod_externo}`} sx={{ color: "#0073e6", fontWeight: "bold" }}>
                        #{pedido.cod_externo}
                      </Link>
                    </TableCell>
                    <TableCell>{pedido.status}</TableCell>
                    <TableCell>{pedido.data_criacao}</TableCell>
                    <TableCell>R$ {pedido.valor}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} sx={{ p: 0 }}>
                      <Collapse in={expandedPedido === pedido.id} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, bgcolor: "#f9f9f9" }}>
                          <Typography><strong>Produto:</strong> {pedido.produto}</Typography>
                          <Typography><strong>Quantidade Total:</strong> {pedido.quantidade_total}</Typography>
                          <Typography>
                            <strong>Endereço de entrega:</strong><br />
                            <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pedido.endereco)}`} target="_blank" rel="noopener noreferrer" sx={{ color: "#0073e6" }}>
                              {pedido.endereco}
                            </Link>
                          </Typography>
                          <Typography><strong>Observações:</strong> {pedido.obs || "Nenhuma"}</Typography>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Botão cadastrar endereço */}
      <Box textAlign="center" mb={6}>
        <Button variant="contained" sx={{ bgcolor: "#28a745", ":hover": { bgcolor: "#218838" } }} onClick={() => setOpenModal(true)}>
          Cadastrar novo endereço
        </Button>
      </Box>

      {/* Modal novo endereço */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "white", boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>Cadastrar novo endereço</Typography>
          <TextField fullWidth label="Cidade" name="cidade" value={novoEndereco.cidade} onChange={e => setNovoEndereco({ ...novoEndereco, cidade: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Bairro" name="bairro" value={novoEndereco.bairro} onChange={e => setNovoEndereco({ ...novoEndereco, bairro: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Endereço" name="endereco" value={novoEndereco.endereco} onChange={e => setNovoEndereco({ ...novoEndereco, endereco: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Número" name="numero" value={novoEndereco.numero} onChange={e => setNovoEndereco({ ...novoEndereco, numero: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Ponto de Referência" name="ponto_ref" value={novoEndereco.ponto_ref} onChange={e => setNovoEndereco({ ...novoEndereco, ponto_ref: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Observações" name="obs" value={novoEndereco.obs} onChange={e => setNovoEndereco({ ...novoEndereco, obs: e.target.value })} sx={{ mb: 2 }} />
          <Button fullWidth variant="contained" onClick={handleCadastrarEndereco}>
            Salvar Endereço
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
