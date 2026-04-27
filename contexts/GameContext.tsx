import React, { createContext, ReactNode, useContext, useState } from 'react';

interface GameContextType {
    isGameActive: boolean;
    setIsGameActive: (active: boolean) => void;
    resetGame: () => void;  // Add reset function
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
    const [isGameActive, setIsGameActive] = useState(false);

    const resetGame = () => {
        setIsGameActive(false);
    };

    return (
        <GameContext.Provider value={{ isGameActive, setIsGameActive, resetGame }}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
}