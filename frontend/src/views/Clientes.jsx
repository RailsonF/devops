import { useState } from 'react';
import { Users, Plus } from 'lucide-react'; // Ícones que instalamos mais cedo!

export default function Clientes() {
  // Dados falsos temporários para testar o visual
  const [clientes, setClientes] = useState([
    { id: 1, nome: 'João Silva', email: 'joao@email.com' },
    { id: 2, nome: 'Maria Souza', email: 'maria@email.com' }
  ]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Seção */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
          <Users className="w-6 h-6 text-blue-600" />
          Gestão de Clientes
        </h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium">
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{cliente.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cliente.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <button className="text-blue-600 hover:text-blue-900">Editar</button>
                  <button className="text-red-600 hover:text-red-900">Excluir</button>
                  <button className="text-pink-600 hover:text-pink-900 font-bold">❤️ Favoritos</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}