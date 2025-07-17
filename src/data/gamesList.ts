// Lista expandida de jogos populares (80+ títulos)
export const games = [
  // Battle Royale
  { name: 'Free Fire', icon: '🔥', color: 'from-orange-500 to-red-500' },
  { name: 'Fortnite', icon: '🏆', color: 'from-blue-500 to-cyan-500' },
  { name: 'PUBG Mobile', icon: '🎯', color: 'from-yellow-600 to-orange-600' },
  { name: 'PUBG PC', icon: '🎮', color: 'from-gray-600 to-gray-800' },
  { name: 'Apex Legends', icon: '🎪', color: 'from-orange-600 to-red-600' },
  { name: 'Call of Duty Warzone', icon: '🔫', color: 'from-green-600 to-gray-800' },
  { name: 'Fall Guys', icon: '🎈', color: 'from-pink-400 to-purple-500' },

  // FPS/Tactical
  { name: 'Valorant', icon: '🎯', color: 'from-red-500 to-pink-500' },
  { name: 'CS:GO', icon: '💎', color: 'from-yellow-500 to-orange-500' },
  { name: 'CS2', icon: '⚡', color: 'from-blue-600 to-purple-600' },
  { name: 'Rainbow Six Siege', icon: '🛡️', color: 'from-blue-700 to-indigo-700' },
  { name: 'Overwatch 2', icon: '🦸', color: 'from-orange-500 to-blue-500' },
  { name: 'Call of Duty Mobile', icon: '📱', color: 'from-green-500 to-blue-600' },
  { name: 'Paladins', icon: '⚔️', color: 'from-purple-600 to-pink-600' },

  // MOBA
  { name: 'League of Legends', icon: '⚡', color: 'from-purple-500 to-indigo-500' },
  { name: 'Dota 2', icon: '🗡️', color: 'from-red-600 to-black' },
  { name: 'Mobile Legends', icon: '🏰', color: 'from-blue-500 to-purple-600' },
  { name: 'Arena of Valor', icon: '⚔️', color: 'from-gold-500 to-yellow-600' },

  // RPG/Adventure
  { name: 'Genshin Impact', icon: '🌟', color: 'from-blue-400 to-purple-500' },
  { name: 'Elden Ring', icon: '🗡️', color: 'from-yellow-600 to-gray-800' },
  { name: 'The Witcher 3', icon: '🐺', color: 'from-gray-700 to-red-600' },
  { name: 'Cyberpunk 2077', icon: '🤖', color: 'from-cyan-400 to-purple-600' },
  { name: 'Hogwarts Legacy', icon: '🪄', color: 'from-purple-600 to-yellow-500' },
  { name: 'Destiny 2', icon: '🚀', color: 'from-blue-600 to-white' },
  { name: 'World of Warcraft', icon: '🏰', color: 'from-blue-700 to-gold-500' },
  { name: 'Final Fantasy XIV', icon: '⚔️', color: 'from-blue-500 to-purple-600' },

  // Sandbox/Survival
  { name: 'Minecraft', icon: '🧱', color: 'from-green-600 to-lime-500' },
  { name: 'Roblox', icon: '🎮', color: 'from-red-500 to-blue-500' },
  { name: 'Terraria', icon: '⛏️', color: 'from-green-500 to-blue-600' },
  { name: 'Rust', icon: '🔧', color: 'from-orange-600 to-red-700' },
  { name: 'ARK Survival', icon: '🦕', color: 'from-green-700 to-brown-600' },
  { name: 'Valheim', icon: '🪓', color: 'from-blue-600 to-gray-700' },

  // Sports
  { name: 'FIFA 24', icon: '⚽', color: 'from-green-400 to-blue-500' },
  { name: 'FIFA 23', icon: '🏆', color: 'from-blue-500 to-green-500' },
  { name: 'PES/eFootball', icon: '⚽', color: 'from-red-500 to-blue-600' },
  { name: 'NBA 2K24', icon: '🏀', color: 'from-orange-500 to-red-600' },
  { name: 'Rocket League', icon: '🚗', color: 'from-blue-500 to-orange-500' },

  // Mobile Games
  { name: 'Clash Royale', icon: '👑', color: 'from-blue-600 to-purple-600' },
  { name: 'Clash of Clans', icon: '🏰', color: 'from-green-500 to-yellow-500' },
  { name: 'Brawl Stars', icon: '⭐', color: 'from-yellow-400 to-red-500' },
  { name: 'Pokémon GO', icon: '🔴', color: 'from-red-500 to-yellow-500' },
  { name: 'Among Us', icon: '👾', color: 'from-red-400 to-pink-500' },
  { name: 'Subway Surfers', icon: '🚇', color: 'from-green-400 to-blue-500' },
  { name: 'Candy Crush', icon: '🍭', color: 'from-pink-400 to-purple-500' },

  // Simulation
  { name: 'The Sims 4', icon: '🏠', color: 'from-green-400 to-blue-500' },
  { name: 'Cities Skylines', icon: '🏙️', color: 'from-blue-500 to-gray-600' },
  { name: 'Euro Truck Simulator', icon: '🚛', color: 'from-blue-600 to-gray-700' },
  { name: 'Flight Simulator', icon: '✈️', color: 'from-blue-400 to-white' },

  // Strategy
  { name: 'Age of Empires IV', icon: '🏰', color: 'from-yellow-600 to-brown-600' },
  { name: 'Civilization VI', icon: '🌍', color: 'from-blue-500 to-green-600' },
  { name: 'StarCraft II', icon: '🚀', color: 'from-blue-600 to-purple-600' },

  // Horror/Thriller
  { name: 'Dead by Daylight', icon: '💀', color: 'from-red-600 to-black' },
  { name: 'Phasmophobia', icon: '👻', color: 'from-purple-600 to-black' },
  { name: 'Resident Evil 4', icon: '🧟', color: 'from-red-700 to-black' },

  // Racing
  { name: 'Forza Horizon 5', icon: '🏎️', color: 'from-yellow-500 to-red-600' },
  { name: 'Gran Turismo 7', icon: '🏁', color: 'from-blue-600 to-red-600' },
  { name: 'Need for Speed', icon: '🚗', color: 'from-orange-500 to-red-600' },

  // Fighting
  { name: 'Street Fighter 6', icon: '👊', color: 'from-red-500 to-yellow-500' },
  { name: 'Tekken 8', icon: '🥊', color: 'from-purple-600 to-red-600' },
  { name: 'Mortal Kombat 1', icon: '⚔️', color: 'from-yellow-500 to-red-700' },

  // Indie/Others
  { name: 'Stardew Valley', icon: '🌾', color: 'from-green-500 to-yellow-500' },
  { name: 'Hades', icon: '🔱', color: 'from-red-600 to-purple-600' },
  { name: 'Hollow Knight', icon: '🗡️', color: 'from-gray-700 to-blue-600' },
  { name: 'Celeste', icon: '🏔️', color: 'from-pink-400 to-blue-500' },

  // Platform Exclusives
  { name: 'God of War', icon: '⚔️', color: 'from-red-600 to-gray-800' },
  { name: 'Spider-Man', icon: '🕷️', color: 'from-red-500 to-blue-600' },
  { name: 'Halo Infinite', icon: '👽', color: 'from-blue-500 to-green-500' },
  { name: 'Forza Motorsport', icon: '🏎️', color: 'from-blue-600 to-gray-700' },

  // Card Games
  { name: 'Hearthstone', icon: '🃏', color: 'from-blue-500 to-yellow-500' },
  { name: 'Magic Arena', icon: '🔮', color: 'from-purple-600 to-blue-600' },
  { name: 'Legends of Runeterra', icon: '🎴', color: 'from-blue-500 to-gold-500' },

  // Auto Battlers
  { name: 'Teamfight Tactics', icon: '♟️', color: 'from-purple-500 to-blue-500' },
  { name: 'Auto Chess', icon: '👑', color: 'from-yellow-500 to-red-500' },

  // Retro/Classic
  { name: 'Counter-Strike 1.6', icon: '🔫', color: 'from-gray-600 to-yellow-600' },
  { name: 'Tibia', icon: '🗡️', color: 'from-green-600 to-brown-600' },
  { name: 'Ragnarok Online', icon: '⚔️', color: 'from-blue-500 to-purple-600' },

  // Outros populares
  { name: 'Steam', icon: '💨', color: 'from-blue-600 to-gray-700' },
  { name: 'Epic Games', icon: '🎮', color: 'from-gray-800 to-white' },
  { name: 'Origin/EA', icon: '🎯', color: 'from-orange-500 to-red-600' },
  { name: 'Ubisoft Connect', icon: '🎮', color: 'from-blue-500 to-purple-600' },
  { name: 'Battle.net', icon: '⚡', color: 'from-blue-600 to-purple-600' }
].sort((a, b) => a.name.localeCompare(b.name)); // Ordem alfabética