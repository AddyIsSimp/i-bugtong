/**
 * Get total count of bugtongs by difficulty
 */
export const getTotalBugtongCount = (
    bugtongs: BugtongProps[],
    difficulty: Difficulty | 'all' = 'all'
): number => {
    if (difficulty === 'all') {
        return bugtongs.length;
    }
    return bugtongs.filter((bugtong) => bugtong.difficulty === difficulty).length;
};

/**
 * Get count of unsolved bugtongs by difficulty
 */
export const getUnsolvedBugtongCount = (
    bugtongs: BugtongProps[],
    difficulty: Difficulty | 'all' = 'all'
): number => {
    if (difficulty === 'all') {
        return bugtongs.filter((bugtong) => !bugtong.solved).length;
    }
    return bugtongs.filter((bugtong) => bugtong.difficulty === difficulty && !bugtong.solved).length;
};

/**
 * Get count of solved bugtongs by difficulty
 */
export const getSolvedBugtongCount = (
    bugtongs: BugtongProps[],
    difficulty: Difficulty | 'all' = 'all'
): number => {
    if (difficulty === 'all') {
        return bugtongs.filter((bugtong) => bugtong.solved).length;
    }
    return bugtongs.filter((bugtong) => bugtong.difficulty === difficulty && bugtong.solved).length;
};

/**
 * Get progress percentage by difficulty
 */
export const getProgressPercentage = (
    bugtongs: BugtongProps[],
    difficulty: Difficulty | 'all' = 'all'
): number => {
    const total = getTotalBugtongCount(bugtongs, difficulty);
    const solved = getSolvedBugtongCount(bugtongs, difficulty);

    if (total === 0) return 0;
    return (solved / total) * 100;
};

/**
 * Get bugtong statistics by difficulty
 */
export const getBugtongStats = (
    bugtongs: BugtongProps[],
    difficulty: Difficulty | 'all' = 'all'
) => {
    const total = getTotalBugtongCount(bugtongs, difficulty);
    const unsolved = getUnsolvedBugtongCount(bugtongs, difficulty);
    const solved = getSolvedBugtongCount(bugtongs, difficulty);
    const progress = getProgressPercentage(bugtongs, difficulty);

    return {
        total,
        unsolved,
        solved,
        progress,
        message: unsolved === 0 ? 'All bugtongs solved!' : `${unsolved} bugtong(s) remaining`,
    };
};

export const isDifficultyCompleted = (bugtongs: BugtongProps[], difficulty: Difficulty): boolean =>
    getUnsolvedBugtongCount(bugtongs, difficulty) === 0;

export const getBugtongsByDifficulty = (bugtongs: BugtongProps[], difficulty: Difficulty) =>
    bugtongs.filter((bugtong) => bugtong.difficulty === difficulty);

export const getUnsolvedBugtongsByDifficulty = (bugtongs: BugtongProps[], difficulty: Difficulty) =>
    bugtongs.filter((bugtong) => bugtong.difficulty === difficulty && !bugtong.solved);

export const getCategoryAndRatio = (
    bugtongs: BugtongProps[]
): { category: string; ratio: string; completed: number; total: number }[] | null => {
    if (isBugtongListEmpty(bugtongs)) return null;

    const categories = [...new Set(bugtongs.map((bugtong) => bugtong.category))];

    return categories.map((category) => {
        const categoryBugtongs = bugtongs.filter((bugtong) => bugtong.category === category);
        const total = categoryBugtongs.length;
        const completed = categoryBugtongs.filter((bugtong) => bugtong.solved).length;

        return {
            category,
            ratio: `${completed}/${total}`,
            completed,
            total,
        };
    });
};

export const getCategoryStats = (bugtongs: BugtongProps[]) => {
    if (isBugtongListEmpty(bugtongs)) return null;

    const stats: Record<string, { completed: number; total: number; ratio: string; percentage: number }> = {};

    bugtongs.forEach((bugtong) => {
        const category = bugtong.category;
        if (!stats[category]) {
            stats[category] = { completed: 0, total: 0, ratio: '0/0', percentage: 0 };
        }
        stats[category].total++;
        if (bugtong.solved) {
            stats[category].completed++;
        }
        stats[category].ratio = `${stats[category].completed}/${stats[category].total}`;
        stats[category].percentage = (stats[category].completed / stats[category].total) * 100;
    });

    return stats;
};

export const getUniqueCategories = (bugtongs: BugtongProps[]): string[] => {
    if (isBugtongListEmpty(bugtongs)) return [];
    return [...new Set(bugtongs.map((bugtong) => bugtong.category))];
};

export const getBugtongsByCategory = (bugtongs: BugtongProps[], category: string) =>
    bugtongs.filter((bugtong) => bugtong.category === category);

export const getCategoryStatsArray = (
    bugtongs: BugtongProps[]
): { category: string; completed: number; total: number; ratio: string; percentage: number }[] => {
    if (isBugtongListEmpty(bugtongs)) return [];

    const stats: Record<string, { completed: number; total: number; ratio: string; percentage: number }> = {};

    bugtongs.forEach((bugtong) => {
        const category = bugtong.category;
        if (!stats[category]) {
            stats[category] = { completed: 0, total: 0, ratio: '0/0', percentage: 0 };
        }
        stats[category].total++;
        if (bugtong.solved) {
            stats[category].completed++;
        }
        stats[category].ratio = `${stats[category].completed}/${stats[category].total}`;
        stats[category].percentage = (stats[category].completed / stats[category].total) * 100;
    });

    return Object.entries(stats).map(([category, statsData]) => ({
        category,
        ...statsData,
    }));
};

export const getCurrentBugtong = (bugtongs: BugtongProps[], difficultyString: string): BugtongProps => {
    const found = bugtongs.find((bugtong) => bugtong.difficulty === difficultyString);
    if (found) return found as BugtongProps;

    return {
        id: 0,
        difficulty: difficultyString as Difficulty,
        category: 'Unknown',
        question: 'Question not found',
        answer: 'Unknown',
        hint: [],
        solved: false,
    };
};

export const isBugtongListEmpty = (bugtongs: BugtongProps[]): boolean => bugtongs.length === 0;

export const getNextUnsolvedBugtong = (
    bugtongs: BugtongProps[],
    currentId: number | string,
    difficulty: string
): BugtongProps | null => {
    const unsolvedBugtongs = bugtongs.filter(
        (bugtong) => bugtong.difficulty === difficulty && !bugtong.solved && bugtong.id !== currentId
    );

    return unsolvedBugtongs[0] ?? null;
};

export const isAllBugtongsSolved = (bugtongs: BugtongProps[], difficulty: string): boolean =>
    bugtongs.filter((bugtong) => bugtong.difficulty === difficulty && !bugtong.solved).length === 0;
