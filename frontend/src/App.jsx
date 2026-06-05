import { useState, useEffect } from 'react';
import Login from './views/Login';
import Produtos from './views/Produtos';
import Favoritos from './views/Favoritos';
import Perfil from './views/Perfil';
import { apiService } from './services/api';
import { ShoppingCart, Heart, Store, User, LogIn, X } from 'lucide-react';

export default function App() {
  // 1. Estados Iniciais
  const [usuarioId, setUsuarioId] = useState(() => {
    const salvo = localStorage.getItem('usuarioId');
    return salvo ? Number(salvo) : null;
  });

  const [abaAtiva, setAbaAtiva] = useState('produtos');
  const [favoritosIds, setFavoritosIds] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);

  // 2. Carregamento de Favoritos
  useEffect(() => {
    if (usuarioId) {
      localStorage.setItem('usuarioId', usuarioId);
      apiService.listarFavoritos(usuarioId)
        .then(res => {
          // Extrai a chave "ID" que vem do banco de dados
          const ids = (res.data || []).map(f => f.ID).filter(Boolean);
          setFavoritosIds(ids.map(Number));
        })
        .catch(err => console.error("Erro ao carregar favoritos:", err));
    } else {
      localStorage.removeItem('usuarioId');
      setFavoritosIds([]);
    }
  }, [usuarioId]);

  // 3. Ações
  const favoritarNoBanco = async (produtoId) => {
    if (!usuarioId) {
      alert("Você precisa se identificar para salvar favoritos!");
      setAbaAtiva('login');
      return;
    }

    try {
      if (favoritosIds.includes(produtoId)) {
        alert("Este produto já está nos favoritos!");
        return;
      }
      await apiService.adicionarFavorito(usuarioId, produtoId);
      setFavoritosIds([...favoritosIds, produtoId]);
      alert("Adicionado aos favoritos!");
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  const adicionarAoCarrinho = (produto) => {
    if (!usuarioId) {
      alert("Você precisa se identificar para adicionar ao carrinho!");
      setAbaAtiva('login');
      return;
    }

    setCarrinho(atuais => {
      const existe = atuais.find(item => item.id === produto.id);
      if (existe) {
        return atuais.map(item =>
          item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...atuais, { ...produto, quantidade: 1 }];
    });
    setCarrinhoAberto(true);
  };

  const totalItensCarrinho = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  const subtotalCarrinho = carrinho.reduce((acc, item) => acc + (item.price * item.quantidade), 0);

  // 4. Renderização
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-blue-600 text-white shadow-md sticky top-0 z-40 p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1
            onClick={() => setAbaAtiva('produtos')}
            className="text-xl font-bold flex items-center gap-2 tracking-wide cursor-pointer"
          >
            🛍️ Loja DevOps
          </h1>

          <div className="flex items-center gap-6">
            <nav className="flex gap-4 text-sm font-medium">
              <button
                onClick={() => setAbaAtiva('produtos')}
                className={`flex items-center gap-1 cursor-pointer py-1 border-b-2 transition-colors ${abaAtiva === 'produtos' ? 'border-white text-white' : 'border-transparent text-blue-100 hover:text-white'}`}
              >
                <Store className="w-4 h-4" /> Vitrine
              </button>

              {usuarioId ? (
                <>
                  <button
                    onClick={() => setAbaAtiva('favoritos')}
                    className={`flex items-center gap-1 cursor-pointer py-1 border-b-2 transition-colors ${abaAtiva === 'favoritos' ? 'border-white text-white' : 'border-transparent text-blue-100 hover:text-white'}`}
                  >
                    <Heart className="w-4 h-4" /> Meus Favoritos
                  </button>
                  <button
                    onClick={() => setAbaAtiva('perfil')}
                    className={`flex items-center gap-1 cursor-pointer py-1 border-b-2 transition-colors ${abaAtiva === 'perfil' ? 'border-white text-white' : 'border-transparent text-blue-100 hover:text-white'}`}
                  >
                    <User className="w-4 h-4" /> Meu Perfil
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setAbaAtiva('login')}
                  className={`flex items-center gap-1 cursor-pointer py-1 border-b-2 transition-colors ${abaAtiva === 'login' ? 'border-white text-white' : 'border-transparent text-blue-100 hover:text-white'}`}
                >
                  <LogIn className="w-4 h-4" /> Entrar
                </button>
              )}
            </nav>

            <button
              onClick={() => setCarrinhoAberto(true)}
              className="relative p-2 bg-blue-700 hover:bg-blue-800 rounded-full cursor-pointer transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItensCarrinho > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItensCarrinho}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow p-6 max-w-5xl mx-auto w-full">
        {abaAtiva === 'produtos' && (
          <Produtos
            usuarioId={usuarioId}
            adicionarAoCarrinho={adicionarAoCarrinho}
            favoritarNoBanco={favoritarNoBanco}
            favoritosIds={favoritosIds}
          />
        )}
        {abaAtiva === 'favoritos' && usuarioId && (
          <Favoritos
            usuarioId={usuarioId}
            atualizarFavoritosGlobais={setFavoritosIds}
            adicionarAoCarrinho={adicionarAoCarrinho} // <--- ADICIONE APENAS ESTA LINHA AQUI

          />
          
        )}
        {abaAtiva === 'perfil' && usuarioId && (
          <Perfil
            usuarioId={usuarioId}
            onLogout={() => {
              setUsuarioId(null);
              setAbaAtiva('produtos');
              setCarrinho([]);
            }}
          />
        )}
        {abaAtiva === 'login' && (
          <Login
            onLoginSucesso={(id) => {
              setUsuarioId(id);
              setAbaAtiva('produtos');
            }}
          />
        )}
      </main>

      {/* Sidebar do Carrinho */}
      {carrinhoAberto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <ShoppingCart className="text-blue-600" /> Sacola
                </h2>
                <button
                  onClick={() => setCarrinhoAberto(false)}
                  className="text-gray-400 hover:text-gray-700 font-bold p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[65vh] space-y-4 pr-1">
                {carrinho.length === 0 ? (
                  <p className="text-gray-400 text-center py-10">Carrinho vazio.</p>
                ) : (
                  carrinho.map(item => (
                    <div key={item.id} className="flex gap-3 items-center border-b pb-3 border-gray-100">
                      <img src={item.image} alt={item.title} className="w-10 h-10 object-contain" />
                      <div className="flex-grow">
                        <h4 className="text-xs font-bold text-gray-800 line-clamp-1">{item.title}</h4>
                        <p className="text-xs text-gray-400">Qtd: {item.quantidade}</p>
                      </div>
                      <span className="font-bold text-xs text-gray-900">
                        R$ {(item.price * item.quantidade).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {carrinho.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-base text-gray-800 mb-4">
                  <span>Subtotal:</span>
                  <span>R$ {subtotalCarrinho.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => {
                    alert("Pedido finalizado!");
                    setCarrinho([]);
                    setCarrinhoAberto(false);
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-colors cursor-pointer text-sm"
                >
                  Finalizar Compra
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="bg-gray-800 text-white text-center py-3 text-xs mt-auto">
        <p>Desenvolvido pela Equipe Railson e Michely — 2026</p>
      </footer>
    </div>
  );
}