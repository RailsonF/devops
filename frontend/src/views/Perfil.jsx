import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function Perfil({ usuarioId, onLogout }) {
  const [dados, setDados] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });

  useEffect(() => {
    async function carregar() {
      const res = await apiService.listarClientes();
      const cliente = res.data.find(c => Number(c.ID || c.ID_CLIENTE) === Number(usuarioId));
      if (cliente) {
        setDados({
          nome: cliente.NOME || cliente.nome,
          email: cliente.EMAIL || cliente.email,
          temSenha: true // Indicador de que o usuário tem senha
        });
        setForm({
          nome: cliente.NOME || cliente.nome,
          email: cliente.EMAIL || cliente.email,
          senha: ''
        });
      }
    }
    carregar();
  }, [usuarioId]);

  const salvarEdicao = () => {
    setDados({ nome: form.nome, email: form.email, temSenha: true });
    setEditando(false);
    alert("Dados atualizados com sucesso!");
  };

  if (!dados) return <div className="p-8 text-center">Carregando seus dados...</div>;

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Minha Conta</h2>
      
      {editando ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">Nome</label>
            <input className="w-full mt-1 p-2 border rounded-lg" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">E-mail</label>
            <input className="w-full mt-1 p-2 border rounded-lg" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">Nova Senha</label>
            <input type="password" placeholder="Deixe em branco para manter a atual" className="w-full mt-1 p-2 border rounded-lg" onChange={e => setForm({...form, senha: e.target.value})} />
          </div>
          <div className="flex gap-2 pt-4">
            <button onClick={salvarEdicao} className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold">Salvar</button>
            <button onClick={() => setEditando(false)} className="flex-1 bg-gray-100 py-2 rounded-lg font-bold">Cancelar</button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Nome Completo</p>
            <p className="text-lg text-gray-800">{dados.nome}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">E-mail</p>
            <p className="text-lg text-gray-800">{dados.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Senha</p>
            <p className="text-lg text-gray-800 tracking-widest font-mono">••••••••</p>
          </div>
          <div className="flex gap-2 pt-4">
            <button onClick={() => setEditando(true)} className="flex-1 bg-gray-800 text-white py-2 rounded-lg font-bold">Editar Dados</button>
            <button onClick={onLogout} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-bold">Sair</button>
          </div>
        </div>
      )}
    </div>
  );
}