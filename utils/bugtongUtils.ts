// utils/bugtongUtils.ts
import { bugtongList } from '@/constants/data';

/**
 * Get total count of bugtongs by difficulty
 * @param difficulty - 'easy', 'medium', 'hard', or 'all'
 * @returns number of bugtongs
 */
export const getTotalBugtongCount = (difficulty: Difficulty | 'all' = 'all'): number => {
    if (difficulty === 'all') {
        return bugtongList.length;
    }
    return bugtongList.filter(bugtong => bugtong.difficulty === difficulty).length;
};

/**
 * Get count of unsolved bugtongs by difficulty
 * @param difficulty - 'easy', 'medium', 'hard', or 'all'
 * @returns number of unsolved bugtongs
 */
export const getUnsolvedBugtongCount = (difficulty: Difficulty | 'all' = 'all'): number => {
    if (difficulty === 'all') {
        return bugtongList.filter(bugtong => !bugtong.solved).length;
    }
    return bugtongList.filter(bugtong => bugtong.difficulty === difficulty && !bugtong.solved).length;
};

/**
 * Get count of solved bugtongs by difficulty
 * @param difficulty - 'easy', 'medium', 'hard', or 'all'
 * @returns number of solved bugtongs
 */
export const getSolvedBugtongCount = (difficulty: Difficulty | 'all' = 'all'): number => {
    if (difficulty === 'all') {
        return bugtongList.filter(bugtong => bugtong.solved).length;
    }
    return bugtongList.filter(bugtong => bugtong.difficulty === difficulty && bugtong.solved).length;
};

/**
 * Get progress percentage by difficulty
 * @param difficulty - 'easy', 'medium', 'hard', or 'all'
 * @returns progress percentage (0-100)
 */
export const getProgressPercentage = (difficulty: Difficulty | 'all' = 'all'): number => {
    const total = getTotalBugtongCount(difficulty);
    const solved = getSolvedBugtongCount(difficulty);

    if (total === 0) return 0;
    return (solved / total) * 100;
};

/**
 * Get bugtong statistics by difficulty
 * @param difficulty - 'easy', 'medium', 'hard', or 'all'
 * @returns object with total, unsolved, solved, and progress
 */
export const getBugtongStats = (difficulty: Difficulty | 'all' = 'all') => {
    const total = getTotalBugtongCount(difficulty);
    const unsolved = getUnsolvedBugtongCount(difficulty);
    const solved = getSolvedBugtongCount(difficulty);
    const progress = getProgressPercentage(difficulty);

    return {
        total,
        unsolved,
        solved,
        progress,
        message: unsolved === 0 ? '🎉 All bugtongs solved!' : `${unsolved} bugtong(s) remaining`
    };
};

/**
 * Check if all bugtongs in a difficulty are solved
 * @param difficulty - 'easy', 'medium', 'hard'
 * @returns boolean
 */
export const isDifficultyCompleted = (difficulty: Difficulty): boolean => {
    return getUnsolvedBugtongCount(difficulty) === 0;
};

/**
 * Get bugtongs by difficulty
 * @param difficulty - 'easy', 'medium', 'hard'
 * @returns array of bugtongs
 */
export const getBugtongsByDifficulty = (difficulty: Difficulty) => {
    return bugtongList.filter(bugtong => bugtong.difficulty === difficulty);
};

/**
 * Get unsolved bugtongs by difficulty
 * @param difficulty - 'easy', 'medium', 'hard'
 * @returns array of unsolved bugtongs
 */
export const getUnsolvedBugtongsByDifficulty = (difficulty: Difficulty) => {
    return bugtongList.filter(bugtong => bugtong.difficulty === difficulty && !bugtong.solved);
};


/**
 * Get all unique categories with their completion ratio
 * @returns Array of objects with category name and ratio, or null if list is empty
 */
export const getCategoryAndRatio = (): { category: string; ratio: string; completed: number; total: number }[] | null => {
    if (isBugtongListEmpty()) return null;

    // Get all unique categories
    const categories = [...new Set(bugtongList.map(bugtong => bugtong.category))];

    // Calculate ratio for each category
    const categoryStats = categories.map(category => {
        // Get all bugtongs in this category
        const categoryBugtongs = bugtongList.filter(bugtong => bugtong.category === category);

        // Calculate total and completed counts
        const total = categoryBugtongs.length;
        const completed = categoryBugtongs.filter(bugtong => bugtong.solved).length;

        // Calculate ratio as fraction and percentage
        const ratio = `${completed}/${total}`;
        const percentage = total > 0 ? (completed / total) * 100 : 0;

        return {
            category,
            ratio,
            completed,
            total,
            percentage
        };
    });

    return categoryStats;
};

/**
 * Alternative: Get categories with completion percentage
 * @returns Object with categories as keys and completion info as values
 */
export const getCategoryStats = () => {
    if (isBugtongListEmpty()) return null;

    const stats: Record<string, { completed: number; total: number; ratio: string; percentage: number }> = {};

    bugtongList.forEach(bugtong => {
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

/**
 * Get unique categories list only
 * @returns Array of unique category names or empty array if list is empty
 */
export const getUniqueCategories = (): string[] => {
    if (isBugtongListEmpty()) return [];
    return [...new Set(bugtongList.map(bugtong => bugtong.category))];
};

/**
 * Get bugtongs by category
 * @param category - Category name
 * @returns Array of bugtongs in that category
 */
export const getBugtongsByCategory = (category: string) => {
    return bugtongList.filter(bugtong => bugtong.category === category);
};

/**
 * Get category statistics as an array
 * @returns Array of category statistics or empty array if list is empty
 */
export const getCategoryStatsArray = (): { category: string; completed: number; total: number; ratio: string; percentage: number }[] => {
    if (isBugtongListEmpty()) return [];

    const stats: Record<string, { completed: number; total: number; ratio: string; percentage: number }> = {};

    bugtongList.forEach(bugtong => {
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

    // Convert to array 
    return Object.entries(stats).map(([category, statsData]) => ({
        category,
        ...statsData
    }));
};

// Helper function to safely get current bugtong
export const getCurrentBugtong = (difficultyString: string): BugtongProps => {
    const found = bugtongList.find((b) => b.difficulty === difficultyString);
    if (found) return found as BugtongProps;

    // Return a properly typed fallback
    return {
        id: 0,
        difficulty: difficultyString as Difficulty,
        category: 'Unknown',
        question: 'Question not found',
        answer: 'Unknown',
        hint: [],
        solved: false
    };
};

export const isBugtongListEmpty = (): boolean => {
    return bugtongList.length === 0;
}
