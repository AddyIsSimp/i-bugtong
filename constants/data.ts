import images from "@/constants/images";
import { ImageSourcePropType } from "react-native";
import { custom_icons } from "./custom_icons";
import { icons } from "./icons";

export interface UserInfoType {
    name: string;
    profile: ImageSourcePropType; // Can be number (local) or { uri: string }
}

export let userInfo: UserInfoType = {
    name: "John Doe",
    profile: images.avatar,
};

export const updateUserInfo = (updates: Partial<UserInfoType>) => {
    userInfo = { ...userInfo, ...updates };
};

export const tabs = [
    { name: 'codex', title: 'Codex', icon: icons.book },
    { name: 'rank', title: 'Rank', icon: icons.rank },
    { name: 'play', title: 'Play', icon: icons.play },
    { name: 'store', title: 'Store', icon: icons.store },
    { name: 'settings', title: 'Settings', icon: icons.menu },
] as const;

export const gameBG = [
    { difficulty: 'easy', background: images.stacked_peaks_vertical },
    { difficulty: 'medium', background: images.stacked_waves_vertical },
    { difficulty: 'hard', background: images.layered_peaks_vertical },
]

export const levels = [
    { name: "Easy", difficulty: 1, background: images.stacked_peaks_horizontal, time: 180, hints: 3, freeHint: 1, locked: false },
    { name: "Medium", difficulty: 2, background: images.stacked_waves_horizontal, time: 120, hints: 2, freeHint: 0, locked: true },
    { name: "Hard", difficulty: 3, background: images.layered_peaks_horizontal, time: 100, hints: 1, freeHint: 0, locked: true },
]

export const gameAssets = [
    { name: 'diamond', quantity: 3, icon: custom_icons.diamond },
    { name: 'life', quantity: 2, icon: custom_icons.heart },
    { name: 'hint', quantity: 10, icon: custom_icons.hint },
]

export const bugtongList: BugtongProps[] = [
    {
        id: 1, difficulty: 'easy', category: 'Parts of the body',
        question: "Isang dampa, lima ang haligi.",
        answer: "Kamay",
        hint: [{ text: "Parts of the body", open: true }, { text: "Used to hold things", open: false }, { text: "K _ M _ Y", open: false }],
        solved: false
    },
    {
        id: 2, difficulty: 'easy', category: 'Parts of the body',
        question: "Dalawang batong itim, malayo ang nararating.",
        answer: "Mata",
        hint: [{ text: "Parts of the body", open: true }, { text: "Used to see the world", open: false }, { text: "M _ T _", open: false }],
        solved: false

    },
    {
        id: 3, difficulty: 'hard', category: 'Parts of the body',
        question: "Maliit na bahay, puno ng mga patay.",
        answer: "Dila",
        hint: [{ text: "Parts of the body", open: true }, { text: "It is inside the mouth", open: false }, { text: "D _ L _", open: false }],
        solved: false

    },
    {
        id: 4, difficulty: 'easy', category: 'Parts of the body',
        question: "Dalawang sangay, laging may dalang bigat.",
        answer: "Paa",
        hint: [{ text: "Parts of the body", open: true }, { text: "Used for walking", open: false }, { text: "P _ _", open: false }],
        solved: false

    },
    {
        id: 5, difficulty: 'medium', category: 'Parts of the body',
        question: "Matigas na parang bato, pero bahagi ng tao.",
        answer: "Kuko",
        hint: [{ text: "Parts of the body", open: true }, { text: "Found at the tips of fingers", open: false }, { text: "K _ K _", open: false }],
        solved: false

    },

    {
        id: 6, difficulty: 'medium', category: 'Things',
        question: "Dalawang bintana, tinitingnan ng madla.",
        answer: "Salamin sa mata",
        hint: [{ text: "Thing", open: true }, { text: "Worn to see better", open: false }, { text: "S _ L _ M _ N", open: false }],
        solved: false

    },
    {
        id: 7, difficulty: 'easy', category: 'Things',
        question: "Yakap ang bewang, walang katawan.",
        answer: "Sinturon",
        hint: [{ text: "Thing", open: true }, { text: "Keeps your pants up", open: false }, { text: "S _ N T _ R _ N", open: false }],
        solved: false

    },
    {
        id: 8, difficulty: 'hard', category: 'Things',
        question: "Naglalakad nang walang paa, nagsusulat nang walang kamay.",
        answer: "Lapis",
        hint: [{ text: "Thing", open: true }, { text: "Used for drawing or writing", open: false }, { text: "L _ P _ S", open: false }],
        solved: false
    },
    {
        id: 9, difficulty: 'easy', category: 'Things',
        question: "Dahon na walang buhay, puti ang kulay.",
        answer: "Papel",
        hint: [{ text: "Thing", open: true }, { text: "You write on it", open: false }, { text: "P _ P _ L", open: false }],
        solved: false
    },
    {
        id: 10, difficulty: 'medium', category: 'Things',
        question: "Bumubukas nang walang bibig, sumasara nang walang kamay.",
        answer: "Susi",
        hint: [{ text: "Thing", open: true }, { text: "Used for locks", open: false }, { text: "S _ S _", open: false }],
        solved: false
    },

    // --- FRUITS/FOODS ---
    {
        id: 11, difficulty: 'easy', category: 'Fruits/Foods',
        question: "Bahay ni Santa, puno ng perlas.",
        answer: "Buko",
        hint: [{ text: "Food", open: true }, { text: "Hard shell, sweet water", open: false }, { text: "B _ K _", open: false }],
        solved: false
    },
    {
        id: 12, difficulty: 'easy', category: 'Fruits/Foods',
        question: "Nang mabili ay berde, nang kainin ay dilaw.",
        answer: "Saging",
        hint: [{ text: "Fruit", open: true }, { text: "Monkeys love this", open: false }, { text: "S _ G _ N G", open: false }],
        solved: false
    },
    {
        id: 13, difficulty: 'medium', category: 'Fruits/Foods',
        question: "Butil na ginto, kinakain ng buong mundo.",
        answer: "Kanin",
        hint: [{ text: "Food", open: true }, { text: "The staple food of Filipinos", open: false }, { text: "K _ N _ N", open: false }],
        solved: false
    },
    {
        id: 14, difficulty: 'easy', category: 'Fruits/Foods',
        question: "Walang kulay, walang lasa, kailangan ng lahat.",
        answer: "Tubig",
        hint: [{ text: "Drink", open: true }, { text: "Quenches your thirst", open: false }, { text: "T _ B _ G", open: false }],
        solved: false
    },
    {
        id: 15, difficulty: 'easy', category: 'Fruits/Foods',
        question: "Hugis puso, kulay ginto, matamis ang loob.",
        answer: "Mangga",
        hint: [{ text: "Fruit", open: true }, { text: "Philippine national fruit", open: false }, { text: "M _ N G G _", open: false }],
        solved: false
    }
];
