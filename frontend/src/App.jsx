import Clientes from './views/Clientes'; // <- Importando a tela

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">
          🛒 Gerenciador de Clientes & Favoritos
        </h1>
      </header>

      <main className="flex-grow p-6 max-w-5xl mx-auto w-full">
        {/* Aqui renderizamos o componente que acabamos de criar */}
        <Clientes />
      </main>

      <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
        <p className="text-sm">
          Desenvolvido pela Equipe Railson e Michely — 2026
        </p>
      </footer>
    </div>
  );
}