import {
    cloneInitialBugtongList,
    cloneInitialGameAssets,
    cloneInitialLevels,
    GameAssetConfig,
    LevelConfig,
} from '@/constants/data';
import { readJsonFile, writeJsonFile } from '@/utils/localStorage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface StoredGameData {
    levels: Pick<LevelConfig, 'difficulty' | 'locked'>[];
    gameAssets: Pick<GameAssetConfig, 'name' | 'quantity'>[];
    bugtongs: Pick<BugtongProps, 'id' | 'solved' | 'hint'>[];
}

interface GameContextType {
    isGameActive: boolean;
    isHydrated: boolean;
    levels: LevelConfig[];
    gameAssets: GameAssetConfig[];
    bugtongs: BugtongProps[];
    setIsGameActive: (active: boolean) => void;
    setLevels: React.Dispatch<React.SetStateAction<LevelConfig[]>>;
    setGameAssets: React.Dispatch<React.SetStateAction<GameAssetConfig[]>>;
    setBugtongs: React.Dispatch<React.SetStateAction<BugtongProps[]>>;
    resetGame: () => void;
    resetStoredProgress: () => void;
}

const GAME_STORAGE_KEY = 'game';

const GameContext = createContext<GameContextType | undefined>(undefined);

const buildStoredGameData = (
    levels: LevelConfig[],
    gameAssets: GameAssetConfig[],
    bugtongs: BugtongProps[]
): StoredGameData => ({
    levels: levels.map(({ difficulty, locked }) => ({ difficulty, locked })),
    gameAssets: gameAssets.map(({ name, quantity }) => ({ name, quantity })),
    bugtongs: bugtongs.map(({ id, solved, hint }) => ({ id, solved, hint: hint ?? [] })),
});

const mergeStoredGameData = (storedGame: StoredGameData) => {
    const baseLevels = cloneInitialLevels();
    const baseAssets = cloneInitialGameAssets();
    const baseBugtongs = cloneInitialBugtongList();

    const levels = baseLevels.map((level) => {
        const storedLevel = storedGame.levels.find((item) => item.difficulty === level.difficulty);
        return storedLevel ? { ...level, locked: storedLevel.locked } : level;
    });

    const gameAssets = baseAssets.map((asset) => {
        const storedAsset = storedGame.gameAssets.find((item) => item.name === asset.name);
        return storedAsset ? { ...asset, quantity: storedAsset.quantity } : asset;
    });

    const bugtongs = baseBugtongs.map((bugtong) => {
        const storedBugtong = storedGame.bugtongs.find((item) => item.id === bugtong.id);
        return storedBugtong
            ? {
                ...bugtong,
                solved: storedBugtong.solved,
                hint: storedBugtong.hint?.map((hint) => ({ ...hint })) ?? [],
            }
            : bugtong;
    });

    return { levels, gameAssets, bugtongs };
};

export function GameProvider({ children }: { children: ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);
    const [isGameActive, setIsGameActive] = useState(false);
    const [levels, setLevels] = useState<LevelConfig[]>(cloneInitialLevels);
    const [gameAssets, setGameAssets] = useState<GameAssetConfig[]>(cloneInitialGameAssets);
    const [bugtongs, setBugtongs] = useState<BugtongProps[]>(cloneInitialBugtongList);

    useEffect(() => {
        const loadGameData = async () => {
            const fallback = buildStoredGameData(
                cloneInitialLevels(),
                cloneInitialGameAssets(),
                cloneInitialBugtongList()
            );
            const storedGame = await readJsonFile<StoredGameData>(GAME_STORAGE_KEY, fallback);
            const restoredGame = mergeStoredGameData(storedGame);

            setLevels(restoredGame.levels);
            setGameAssets(restoredGame.gameAssets);
            setBugtongs(restoredGame.bugtongs);
            setIsHydrated(true);
        };

        loadGameData();
    }, []);

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        writeJsonFile(GAME_STORAGE_KEY, buildStoredGameData(levels, gameAssets, bugtongs));
    }, [bugtongs, gameAssets, isHydrated, levels]);

    const resetGame = () => {
        setIsGameActive(false);
    };

    const resetStoredProgress = () => {
        setLevels(cloneInitialLevels());
        setGameAssets(cloneInitialGameAssets());
        setBugtongs(cloneInitialBugtongList());
        setIsGameActive(false);
    };

    return (
        <GameContext.Provider
            value={{
                isGameActive,
                isHydrated,
                levels,
                gameAssets,
                bugtongs,
                setIsGameActive,
                setLevels,
                setGameAssets,
                setBugtongs,
                resetGame,
                resetStoredProgress,
            }}
        >
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
