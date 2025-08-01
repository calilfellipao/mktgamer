import React from 'react';
import { useApp } from '../contexts/AppContext';
import { games } from '../data/gamesList';

// Static games list for UI navigation (not mock data)

export function GameCategories() {
  const { setCurrentPage, setSelectedGame, selectedGame } = useApp();

  const handleGameClick = (gameName: string) => {
    setSelectedGame(gameName);
    setCurrentPage('products');
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Escolha seu <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Jogo</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Encontre as melhores ofertas para seus games favoritos
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {games.slice(0, 24).map((game) => (
            <div
              key={game.name}
              onClick={() => handleGameClick(game.name)}
              className={`group relative rounded-xl p-3 transition-all duration-300 cursor-pointer border hover:scale-105 min-h-[90px] ${
                selectedGame === game.name 
                  ? 'bg-purple-600 border-purple-400 shadow-lg shadow-purple-500/25' 
                  : 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-purple-500/50'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${game.color} ${
                selectedGame === game.name ? 'opacity-20' : 'opacity-0 group-hover:opacity-10'
              } rounded-xl transition-opacity duration-300`} />
              
              <div className="text-center">
                <div className="text-2xl mb-1">{game.icon}</div>
                <h3 className={`font-medium text-xs transition-colors leading-tight ${
                  selectedGame === game.name ? 'text-white font-bold' : 'text-white group-hover:text-purple-300'
                }`}>
                  {game.name}
                </h3>
              </div>
            </div>
          ))}
          
          {/* Botão "Ver Todos" */}
          <div
            onClick={() => setCurrentPage('products')}
            className="group relative bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl p-3 hover:from-purple-700 hover:to-cyan-600 transition-all duration-300 cursor-pointer hover:scale-105 min-h-[90px] flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">🎮</div>
              <h3 className="text-white font-bold text-xs">
                Ver Todos<br/>({games.length}+ jogos)
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}