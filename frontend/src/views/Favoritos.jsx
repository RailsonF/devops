import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { HeartCrack, ShoppingCart } from 'lucide-react'; // Importei o ShoppingCart

export default function Favoritos({ usuarioId, atualizarFavoritosGlobais, adicionarAoCarrinho }) { // Recebe a prop
  const [favoritosCompletos, setFavoritosCompletos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const carregarDadosFavoritos = async () => {
    try {
      setCarregando(true);
      const resBackend = await apiService.listarFavoritos(usuarioId);
      const dadosMapeados = (resBackend.data || []).map(fav => {
        return {
          idDoRegistroNoBanco: fav.ID,
          id: fav.ID, // Garante que o ID existe para o carrinho
          title: fav.TITULO || 'Produto sem título',
          image: fav.IMAGEM || 'https://via.placeholder.com/150',
          price: Number(fav.PRECO || 0)
        };
      });
      setFavoritosCompletos(dadosMapeados);
      const idsGlobais = dadosMapeados.map(f => Number(f.id)).filter(id => !isNaN(id));
      atualizarFavoritosGlobais(idsGlobais);
    } catch (err) {
      console.error("Erro ao carregar favoritos:", err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (usuarioId) carregarDadosFavoritos();
  }, [usuarioId]);

  const desfavoritar = async (idBanco) => {
    try {
      await apiService.removerFavorito(idBanco);
      alert("Favorito removido com sucesso!");
      carregarDadosFavoritos();
    } catch (err) {
      alert(`Erro ao remover: ${err.message}`);
    }
  };

  if (carregando) return <p className="text-center py-10 text-gray-500">Carregando seus favoritos...</p>;

  if (favoritosCompletos.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200 p-6">
        <p className="text-gray-500 text-lg font-medium">Sua lista de favoritos está vazia.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {favoritosCompletos.map(fav => (
        <div key={`fav-${fav.id}`} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="h-40 w-full flex items-center justify-center mb-4">
            <img src={fav.image} alt={fav.title} className="max-h-full max-w-full object-contain" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 line-clamp-2 h-10 mb-2">{fav.title}</h3>
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-extrabold text-gray-900">R$ {fav.price.toFixed(2)}</span>
              <div className="flex gap-2">
                {/* BOTÃO DE CARRINHO ADICIONADO */}
                <button 
                  onClick={() => adicionarAoCarrinho(fav)} 
                  className="text-blue-600 hover:text-blue-800 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => desfavoritar(fav.idDoRegistroNoBanco)}
                  className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <HeartCrack className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}