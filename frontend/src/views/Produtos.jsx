import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { ShoppingCart, Heart } from 'lucide-react';

export default function Produtos({ usuarioId, adicionarAoCarrinho, favoritarNoBanco, favoritosIds }) {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    apiService.listarProdutosFakeStore()
      .then(dados => { setProdutos(dados); setCarregando(false); })
      .catch(() => setCarregando(false));
  }, []);

  if (carregando) return <p className="text-center py-10 text-gray-500">Carregando produtos maravilhosos...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {produtos.map(produto => {
        const jaFavoritou = favoritosIds.includes(produto.id);
        return (
          <div key={produto.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between group">
            <div className="relative">
              <img src={produto.image} alt={produto.title} className="w-full h-48 object-contain mb-4 group-hover:scale-105 transition-transform" />
              <button 
                onClick={() => favoritarNoBanco(produto.id)}
                className={`absolute top-2 right-2 p-2 rounded-full shadow-md border cursor-pointer transition-colors ${
                  jaFavoritou ? 'bg-pink-50 border-pink-200 text-pink-600' : 'bg-white border-gray-100 text-gray-400 hover:text-pink-600'
                }`}
              >
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>

            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{produto.category}</span>
              <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mt-1 mb-2 h-10">{produto.title}</h3>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-extrabold text-gray-900">R$ {produto.price.toFixed(2)}</span>
                <button 
                  onClick={() => adicionarAoCarrinho(produto)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> + Carrinho
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}