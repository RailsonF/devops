const BACKEND_URL = 'http://localhost:8787'; // URL padrão local do Cloudflare Workers
const FAKE_STORE_URL = 'https://fakestoreapi.com';

export const clienteService = {
  listar: () => fetch(`${BACKEND_URL}/clientes`).then(res => res.json()),
  
  criar: (dados) => fetch(`${BACKEND_URL}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  }).then(res => res.json()),
  
  // Depois adicionamos as funções de editar e remover
};