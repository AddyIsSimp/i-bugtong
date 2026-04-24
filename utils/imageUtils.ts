// utils/imageUtils.ts

/**
 * Get bugtong image source by ID
 * @param id - The bugtong ID
 * @returns Image source require statement or null if not found
 */
export const getBugtongImageById = (id: number): any => {
    const imageMap: Record<number, any> = {
        // Parts of the body (JPEG)
        1: require('@/assets/bugtongImage/1_1.jpg'),
        2: require('@/assets/bugtongImage/2_1.jpg'),
        3: require('@/assets/bugtongImage/3_1.jpg'),
        4: require('@/assets/bugtongImage/4_1.jpg'),
        5: require('@/assets/bugtongImage/5_1.jpg'),
        
        // Things (JPEG)
        6: require('@/assets/bugtongImage/6_1.jpg'),
        7: require('@/assets/bugtongImage/7_1.jpg'),
        8: require('@/assets/bugtongImage/8_1.jpg'),
        9: require('@/assets/bugtongImage/9_1.jpeg'), // Note: .jpeg format
        10: require('@/assets/bugtongImage/10_1.jpg'),
        
        // Fruits/Foods (PNG)
        11: require('@/assets/bugtongImage/11_1.png'),
        12: require('@/assets/bugtongImage/12_1.png'),
        13: require('@/assets/bugtongImage/13_1.png'),
        14: require('@/assets/bugtongImage/14_1.png'),
        15: require('@/assets/bugtongImage/15_1.png'),
    };
    
    return imageMap[id] || null;
};

// Export the main function as getBugtongImage for backward compatibility
export const getBugtongImage = getBugtongImageById;