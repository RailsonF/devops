import { useState } from 'react';
import { apiService } from '../services/api';

export default function Login({ onLoginSucesso }) {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    try {
      if (modoCadastro) {
        // Chama POST /clientes do contrato
        const res = await apiService.criarCliente(nome, email, senha);
        setMensagem(res.message); // "Cliente cadastrado com sucesso!"
        setModoCadastro(false);
      } else {
        // Chama POST /login do contrato
        const res = await apiService.login(email, senha);
        onLoginSucesso(res.data.id); // Passa o ID do cliente retornado pelo banco
      }
    } catch (err) {
      setErro(err.message); // Exibe o erro exato retornado da API (ex: "E-mail já cadastrado")
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-10">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {modoCadastro ? 'Criar Conta' : 'Identifique-se para Continuar'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {modoCadastro && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required className="mt-1 w-full p-2 border rounded-md" />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">E-mail</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Senha</label>
          <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required className="mt-1 w-full p-2 border rounded-md" />
        </div>

        {erro && <p className="text-red-600 text-sm font-medium">{erro}</p>}
        {mensagem && <p className="text-green-600 text-sm font-medium">{mensagem}</p>}

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md font-medium transition-colors">
          {modoCadastro ? 'Cadastrar' : 'Entrar'}
        </button>
      </form>

      <button 
        onClick={() => { setModoCadastro(!modoCadastro); setErro(''); }}
        className="w-full text-center text-sm text-blue-600 hover:underline mt-4 block"
      >
        {modoCadastro ? 'Já tem uma conta? Faça login' : 'Não tem conta? Cadastre-se'}
      </button>
    </div>
  );
}