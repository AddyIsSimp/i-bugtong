import images from "@/constants/images";
import { custom_icons } from "./custom_icons";
import { icons } from "./icons";

export const userInfo = {
    name: "John Doe",
    profile: images.avatar,
}


export const tabs = [
    { name: 'codex', title: 'Codex', icon: icons.book },
    { name: 'store', title: 'Store', icon: icons.store },
    { name: 'play', title: 'Play', icon: icons.play },
    { name: 'rank', title: 'Rank', icon: icons.rank },
    { name: 'friends', title: 'Friends', icon: icons.friends },
] as const;

export const gameBG = [
    {difficulty: 'easy', background: images.stacked_peaks_vertical},
    {difficulty: 'medium', background: images.stacked_waves_vertical},
    {difficulty: 'hard', background: images.layered_peaks_vertical},
]

export const levels = [
    { name: "Easy", difficulty: 1, background: images.stacked_peaks_horizontal, time: '1 min', hints: 3, freeHint: 1, locked: false},
    { name: "Medium", difficulty: 2, background: images.stacked_waves_horizontal, time: '40 s', hints: 2, freeHint: 0, locked: true},
    { name: "Hard", difficulty: 3, background: images.layered_peaks_horizontal, time: '30 s', hints: 1, freeHint: 0, locked: true },
]

export const gameAssets = [
    { name: 'diamond', quantity: 3, icon: custom_icons.diamond },
    { name: 'life', quantity: 2, icon: custom_icons.heart },
    { name: 'hint', quantity: 1, icon: custom_icons.hint },
]

export const bugtongList = [
    { id: 1, difficulty: 'easy', category: 'Parts of the body', question: "What is hand?", answer: "Hand", hint: ["Parts of the body", "Use to hold things", "H _ _ D"] },
    { id: 2, difficulty: 'easy', category: 'Thing', question: "What is pencil?", answer: "Pencil", hint: ["Thing", "Use to write", "P _ N C _ L"] },
    { id: 3, difficulty: 'easy', category: 'Food', question: "What is coconut?", answer: "Coconut", hint: ["Food", "Grows on trees", "C _ _ N _ T"] },
    { id: 4, difficulty: 'easy', category: 'Food', question: "What is Rice?", answer: "Rice", hint: ["Food", "Grows in water", "R _ C _"] },
    { id: 5, difficulty: 'easy', category: 'Parts of the body', question: "What is eyes?", answer: "Eyes", hint: ["Parts of the body", "Use to see", "E _ _ S"] }
]
