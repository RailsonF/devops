const BACKEND_URL = 'https://backend.furtadorailson3.workers.dev'; 
const FAKE_STORE_URL = 'https://fakestoreapi.com';

const tratarResposta = async (res) => {
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Ocorreu um erro na requisição');
  }
  return json; 
};

export const apiService = {
  // --- AUTENTICAÇÃO ---
  login: (email, senha) => fetch(`${BACKEND_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  }).then(tratarResposta),

  // --- CRUD DE CLIENTES ---
  listarClientes: () => fetch(`${BACKEND_URL}/clientes`).then(tratarResposta),
  
  criarCliente: (nome, email, senha) => fetch(`${BACKEND_URL}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha })
  }).then(tratarResposta),

  editarCliente: (id, dados) => fetch(`${BACKEND_URL}/clientes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados) 
  }).then(tratarResposta),

  removerCliente: (id) => fetch(`${BACKEND_URL}/clientes/${id}`, { 
    method: 'DELETE' 
  }).then(tratarResposta),

  // --- GESTÃO DE FAVORITOS ---
  listarFavoritos: (clienteId) => fetch(`${BACKEND_URL}/favoritos/${clienteId}`).then(tratarResposta),
  
  adicionarFavorito: (clienteId, produtoId) => fetch(`${BACKEND_URL}/favoritos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cliente_id: Number(clienteId), produto_id: Number(produtoId) })
  }).then(tratarResposta),

  removerFavorito: (id) => fetch(`${BACKEND_URL}/favoritos/${id}`, { 
    method: 'DELETE' 
  }).then(tratarResposta),

  // --- API EXTERNA (FAKE STORE) ---
  listarProdutosFakeStore: () => fetch(`${FAKE_STORE_URL}/products`).then(res => res.json())
};