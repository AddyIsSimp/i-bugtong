import {
    LIFE_REFILL_INTERVAL_MS,
    MAX_LIFE,
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
    lifeRefillNextAt: number | null;
}

interface GameContextType {
    isGameActive: boolean;
    isHydrated: boolean;
    levels: LevelConfig[];
    gameAssets: GameAssetConfig[];
    bugtongs: BugtongProps[];
    lifeMax: number;
    lifeRefillCountdownSeconds: number | null;
    setIsGameActive: (active: boolean) => void;
    setLevels: React.Dispatch<React.SetStateAction<LevelConfig[]>>;
    setGameAssets: React.Dispatch<React.SetStateAction<GameAssetConfig[]>>;
    setBugtongs: React.Dispatch<React.SetStateAction<BugtongProps[]>>;
    syncGameAssetsFromLogin: (assets: Pick<LoginResponseData, 'diamond' | 'life' | 'hint'>) => void;
    addDiamonds: (amount: number) => void;
    purchaseAsset: (assetName: 'hint' | 'life', cost: number) => { success: boolean; message?: string };
    consumeLife: (amount?: number) => void;
    consumeHint: (amount?: number) => void;
    resetGame: () => void;
    resetStoredProgress: () => void;
}

const GAME_STORAGE_KEY = 'game';

const GameContext = createContext<GameContextType | undefined>(undefined);

const getAssetQuantity = (gameAssets: GameAssetConfig[], name: string) =>
    gameAssets.find((asset) => asset.name === name)?.quantity || 0;

const buildStoredGameData = (
    levels: LevelConfig[],
    gameAssets: GameAssetConfig[],
    bugtongs: BugtongProps[],
    lifeRefillNextAt: number | null
): StoredGameData => ({
    levels: levels.map(({ difficulty, locked }) => ({ difficulty, locked })),
    gameAssets: gameAssets.map(({ name, quantity }) => ({ name, quantity })),
    bugtongs: bugtongs.map(({ id, solved, hint }) => ({ id, solved, hint: hint ?? [] })),
    lifeRefillNextAt,
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

    const currentLife = getAssetQuantity(gameAssets, 'life');
    const lifeRefillNextAt =
        currentLife >= MAX_LIFE
            ? null
            : storedGame.lifeRefillNextAt ?? Date.now() + LIFE_REFILL_INTERVAL_MS;

    return { levels, gameAssets, bugtongs, lifeRefillNextAt };
};

export function GameProvider({ children }: { children: ReactNode }) {
    const [isHydrated, setIsHydrated] = useState(false);
    const [isGameActive, setIsGameActive] = useState(false);
    const [levels, setLevels] = useState<LevelConfig[]>(cloneInitialLevels);
    const [gameAssets, setGameAssets] = useState<GameAssetConfig[]>(cloneInitialGameAssets);
    const [bugtongs, setBugtongs] = useState<BugtongProps[]>(cloneInitialBugtongList);
    const [lifeRefillNextAt, setLifeRefillNextAt] = useState<number | null>(null);
    const [countdownNow, setCountdownNow] = useState(Date.now());

    const currentLife = getAssetQuantity(gameAssets, 'life');
    const lifeRefillCountdownSeconds =
        currentLife >= MAX_LIFE || lifeRefillNextAt === null
            ? null
            : Math.max(0, Math.ceil((lifeRefillNextAt - countdownNow) / 1000));

    useEffect(() => {
        const loadGameData = async () => {
            const fallback = buildStoredGameData(
                cloneInitialLevels(),
                cloneInitialGameAssets(),
                cloneInitialBugtongList(),
                null
            );
            const storedGame = await readJsonFile<StoredGameData>(GAME_STORAGE_KEY, fallback);
            const restoredGame = mergeStoredGameData(storedGame);

            setLevels(restoredGame.levels);
            setGameAssets(restoredGame.gameAssets);
            setBugtongs(restoredGame.bugtongs);
            setLifeRefillNextAt(restoredGame.lifeRefillNextAt);
            setCountdownNow(Date.now());
            setIsHydrated(true);
        };

        loadGameData();
    }, []);

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        writeJsonFile(GAME_STORAGE_KEY, buildStoredGameData(levels, gameAssets, bugtongs, lifeRefillNextAt));
    }, [bugtongs, gameAssets, isHydrated, levels, lifeRefillNextAt]);

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        if (currentLife >= MAX_LIFE) {
            if (lifeRefillNextAt !== null) {
                setLifeRefillNextAt(null);
            }
            return;
        }

        if (lifeRefillNextAt === null) {
            setLifeRefillNextAt(Date.now() + LIFE_REFILL_INTERVAL_MS);
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            setCountdownNow(now);

            if (now < lifeRefillNextAt) {
                return;
            }

            let updatedLife = currentLife;

            setGameAssets((prev) =>
                prev.map((asset) => {
                    if (asset.name !== 'life') {
                        return asset;
                    }

                    updatedLife = Math.min(MAX_LIFE, asset.quantity + 1);
                    return { ...asset, quantity: updatedLife };
                })
            );

            setLifeRefillNextAt(updatedLife >= MAX_LIFE ? null : now + LIFE_REFILL_INTERVAL_MS);
        }, 1000);

        return () => clearInterval(interval);
    }, [currentLife, isHydrated, lifeRefillNextAt]);

    const resetGame = () => {
        setIsGameActive(false);
    };

    const syncGameAssetsFromLogin = ({ diamond, life, hint }: Pick<LoginResponseData, 'diamond' | 'life' | 'hint'>) => {
        setGameAssets((prev) =>
            prev.map((asset) => {
                if (asset.name === 'diamond') {
                    return { ...asset, quantity: diamond };
                }

                if (asset.name === 'life') {
                    return { ...asset, quantity: life };
                }

                if (asset.name === 'hint') {
                    return { ...asset, quantity: hint };
                }

                return asset;
            })
        );
        setLifeRefillNextAt(life >= MAX_LIFE ? null : Date.now() + LIFE_REFILL_INTERVAL_MS);
        setCountdownNow(Date.now());
    };

    const addDiamonds = (amount: number) => {
        if (amount <= 0) {
            return;
        }

        setGameAssets((prev) =>
            prev.map((asset) =>
                asset.name === 'diamond'
                    ? { ...asset, quantity: asset.quantity + amount }
                    : asset
            )
        );
    };

    const purchaseAsset = (assetName: 'hint' | 'life', cost: number) => {
        const currentDiamonds = getAssetQuantity(gameAssets, 'diamond');
        const currentAssetQuantity = getAssetQuantity(gameAssets, assetName);

        if (cost <= 0) {
            return { success: false, message: 'Invalid purchase cost.' };
        }

        if (currentDiamonds < cost) {
            return { success: false, message: 'Not enough diamonds.' };
        }

        if (assetName === 'life' && currentAssetQuantity >= MAX_LIFE) {
            return { success: false, message: 'Life is already full.' };
        }

        let updatedLife = currentLife;

        setGameAssets((prev) =>
            prev.map((asset) => {
                if (asset.name === 'diamond') {
                    return { ...asset, quantity: asset.quantity - cost };
                }

                if (asset.name === assetName) {
                    const nextQuantity =
                        assetName === 'life'
                            ? Math.min(MAX_LIFE, asset.quantity + 1)
                            : asset.quantity + 1;

                    if (assetName === 'life') {
                        updatedLife = nextQuantity;
                    }

                    return { ...asset, quantity: nextQuantity };
                }

                return asset;
            })
        );

        if (assetName === 'life') {
            setLifeRefillNextAt(updatedLife >= MAX_LIFE ? null : Date.now() + LIFE_REFILL_INTERVAL_MS);
            setCountdownNow(Date.now());
        }

        return { success: true };
    };

    const consumeLife = (amount = 1) => {
        if (amount <= 0) {
            return;
        }

        let updatedLife = currentLife;

        setGameAssets((prev) =>
            prev.map((asset) => {
                if (asset.name !== 'life') {
                    return asset;
                }

                updatedLife = Math.max(0, asset.quantity - amount);
                return { ...asset, quantity: updatedLife };
            })
        );

        setLifeRefillNextAt(updatedLife >= MAX_LIFE ? null : Date.now() + LIFE_REFILL_INTERVAL_MS);
        setCountdownNow(Date.now());
    };

    const consumeHint = (amount = 1) => {
        if (amount <= 0) {
            return;
        }

        setGameAssets((prev) =>
            prev.map((asset) =>
                asset.name === 'hint'
                    ? { ...asset, quantity: Math.max(0, asset.quantity - amount) }
                    : asset
            )
        );
    };

    const resetStoredProgress = () => {
        setLevels(cloneInitialLevels());
        setGameAssets(cloneInitialGameAssets());
        setBugtongs(cloneInitialBugtongList());
        setIsGameActive(false);
        setLifeRefillNextAt(null);
        setCountdownNow(Date.now());
    };

    return (
        <GameContext.Provider
            value={{
                isGameActive,
                isHydrated,
                levels,
                gameAssets,
                bugtongs,
                lifeMax: MAX_LIFE,
                lifeRefillCountdownSeconds,
                setIsGameActive,
                setLevels,
                setGameAssets,
                setBugtongs,
                syncGameAssetsFromLogin,
                addDiamonds,
                purchaseAsset,
                consumeLife,
                consumeHint,
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
