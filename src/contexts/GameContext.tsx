import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Position, Keys } from '../types';

interface GameState {
  position: Position;
  isWalking: boolean;
  keys: Keys;
}

interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    position: { x: -180, y: -250 },
    isWalking: false,
    keys: { w: false, a: false, s: false, d: false }
  });

  return (
    <GameContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};