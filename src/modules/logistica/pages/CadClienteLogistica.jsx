import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import styled from 'styled-components';

const colors = {
  primary: '#0D47A1',
  secondary: '#1976D2',
  accent: '#FFD700',
  background: '#F5F7FA',
  text: '#212121',
  success: '#4CAF50',
  error: '#F44336',
  inputBorder: '#ccc',
  inputFocus: '#0D47A1',
};

const PageContainer = styled.div`
  background-color: ${colors.background};
  min-height: 100vh;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormContainer = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(13, 71, 161, 0.15);
  padding: 2.5rem;
  width: 100%;
  max-width: 1000px;
  margin-top: 2rem;

  @media (max-width: 768px) {
    padding: 1.8rem;
  }

  @media (max-width: 480px) {
    padding: 1.2rem;
  }
`;

const Title = styled.h2`
  color: ${colors.primary};
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.4rem;
  font-weight: 800;

  @media (max-width: 480px) {
    font-size: 1.7rem;
  }
`;

const SectionTitle = styled.h4`
  color: ${colors.secondary};
  border-bottom: 3px solid ${colors.secondary};
  padding-bottom: 0.5rem;
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 700;
  font-size: 1.3rem;

  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: ${colors.text};
  font-size: 1rem;
`;

const Input = styled.input`
  padding: 0.85rem 1rem;
  border: 1.8px solid ${colors.inputBorder};
  border-radius: 6px;
  font-size: 1.05rem;
  transition: border-color 0.25s ease;

  &:focus {
    border-color: ${colors.inputFocus};
    outline: none;
  }
`;

const Button = styled.button`
  background-color: ${(props) => (props.primary ? colors.primary : colors.secondary)};
  color: #fff;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: 1.8rem;
  transition: background-color 0.3s;
  align-self: flex-start;

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.primary ? '#0A3B7A' : '#1565C0')};
  }

  &:disabled {
    background-color: #bbb;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const Message = styled.div`
  padding: 1rem 1.2rem;
  margin-bottom: 1.5rem;
  border-radius: 6px;
  text-align: center;
  font-weight: 700;
  background-color: ${(props) => (props.type === 'success' ? colors.success : colors.error)};
  color: #fff;
  font-size: 1.1rem;
`;

export default function CadClienteLogistica() {
  const [pdfFile, setPdfFile] = useState(null);
  const [jsonData, setJsonData] = useState({
    codigo_externo: '',
    nome: '',
    email: '',
    tell_cadastro: '',
    tell_motorista: '',
    endereco_nota: '',
    numero: '',
    bairro: '',
    cidade: '',
    ponto_ref: '',
    obs: '',
    endereco_motorista: '',
    numero_motorista: '',
    bairro_motorista: '',
    cidade_motorista: '',
    ponto_ref_motorista: '',
    obs_motorista: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  const handlePdfChange = (e) => setPdfFile(e.target.files[0]);
  const handleJsonChange = (e) => {
    const { name, value } = e.target;
    setJsonData({ ...jsonData, [name]: value });
  };

  const API_URL = '/api/logistica/cadastrar_cliente';

  const handleJsonSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage({ text: 'Erro: Token de autenticação não encontrado.', type: 'error' });
      return;
    }

    // validações mínimas
    if (
      !jsonData.codigo_externo.trim() ||
      !jsonData.nome.trim() ||
      !jsonData.tell_cadastro.trim() ||
      !jsonData.endereco_nota.trim() ||
      !jsonData.bairro.trim() ||
      !jsonData.cidade.trim() ||
      !jsonData.bairro_motorista.trim() ||
      !jsonData.cidade_motorista.trim()
    ) {
      setMessage({ text: 'Por favor, preencha todos os campos obrigatórios (*)', type: 'error' });
      return;
    }

    try {
      await axios.post(API_URL, jsonData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      setMessage({ text: 'Cliente cadastrado com sucesso!', type: 'success' });
      setJsonData({
        codigo_externo: '',
        nome: '',
        email: '',
        tell_cadastro: '',
        tell_motorista: '',
        endereco_nota: '',
        numero: '',
        bairro: '',
        cidade: '',
        ponto_ref: '',
        obs: '',
        endereco_motorista: '',
        numero_motorista: '',
        bairro_motorista: '',
        cidade_motorista: '',
        ponto_ref_motorista: '',
        obs_motorista: '',
      });
    } catch (error) {
      const msg = error.response?.data?.msg || 'Erro ao cadastrar cliente.';
      setMessage({ text: `Erro: ${msg}`, type: 'error' });
    }
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <FormContainer>
          <Title>Cadastro de Cliente</Title>
          {message.text && <Message type={message.type}>{message.text}</Message>}

          {/* Cadastro Manual */}
          <form onSubmit={handleJsonSubmit}>
            <SectionTitle>Dados do Cliente</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Código Externo* </Label>
                <Input type="text" name="codigo_externo" value={jsonData.codigo_externo} onChange={handleJsonChange} required />
              </FormGroup>
              <FormGroup>
                <Label>Nome do Cliente* </Label>
                <Input type="text" name="nome" value={jsonData.nome} onChange={handleJsonChange} required />
              </FormGroup>
              <FormGroup>
                <Label>Email</Label>
                <Input type="email" name="email" value={jsonData.email} onChange={handleJsonChange} />
              </FormGroup>
              <FormGroup>
                <Label>Telefone (Nota)*</Label>
                <Input type="tel" name="tell_cadastro" value={jsonData.tell_cadastro} onChange={handleJsonChange} required />
              </FormGroup>
              <FormGroup>
                <Label>Telefone (Motorista)</Label>
                <Input type="tel" name="tell_motorista" value={jsonData.tell_motorista} onChange={handleJsonChange} />
              </FormGroup>
            </FormGrid>

            <SectionTitle>Endereço da Nota</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Endereço* </Label>
                <Input type="text" name="endereco_nota" value={jsonData.endereco_nota} onChange={handleJsonChange} required />
              </FormGroup>
              <FormGroup>
                <Label>Número</Label>
                <Input type="text" name="numero" value={jsonData.numero} onChange={handleJsonChange} />
              </FormGroup>
              <FormGroup>
                <Label>Bairro* </Label>
                <Input type="text" name="bairro" value={jsonData.bairro} onChange={handleJsonChange} required />
              </FormGroup>
              <FormGroup>
                <Label>Cidade* </Label>
                <Input type="text" name="cidade" value={jsonData.cidade} onChange={handleJsonChange} required />
              </FormGroup>
              <FormGroup>
                <Label>Ponto de Referência</Label>
                <Input type="text" name="ponto_ref" value={jsonData.ponto_ref} onChange={handleJsonChange} />
              </FormGroup>
              <FormGroup>
                <Label>Observações</Label>
                <Input type="text" name="obs" value={jsonData.obs} onChange={handleJsonChange} />
              </FormGroup>
            </FormGrid>

            <SectionTitle>Endereço do Motorista</SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Endereço</Label>
                <Input type="text" name="endereco_motorista" value={jsonData.endereco_motorista} onChange={handleJsonChange} />
              </FormGroup>
              <FormGroup>
                <Label>Número</Label>
                <Input type="text" name="numero_motorista" value={jsonData.numero_motorista} onChange={handleJsonChange} />
              </FormGroup>
              <FormGroup>
                <Label>Bairro* </Label>
                <Input type="text" name="bairro_motorista" value={jsonData.bairro_motorista} onChange={handleJsonChange} required />
              </FormGroup>
              <FormGroup>
                <Label>Cidade* </Label>
                <Input type="text" name="cidade_motorista" value={jsonData.cidade_motorista} onChange={handleJsonChange} required />
              </FormGroup>
              <FormGroup>
                <Label>Ponto de Referência</Label>
                <Input type="text" name="ponto_ref_motorista" value={jsonData.ponto_ref_motorista} onChange={handleJsonChange} />
              </FormGroup>
              <FormGroup>
                <Label>Observações</Label>
                <Input type="text" name="obs_motorista" value={jsonData.obs_motorista} onChange={handleJsonChange} />
              </FormGroup>
            </FormGrid>

            <Button type="submit" primary>Cadastrar Cliente</Button>
          </form>
        </FormContainer>
      </PageContainer>
    </>
  );
}
