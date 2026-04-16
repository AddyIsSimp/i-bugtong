import type FontAwesome from "@expo/vector-icons/FontAwesome";
import type { ComponentProps } from "react";

export type IconName = ComponentProps<typeof FontAwesome>["name"];

export const icons = {
    friends: "users",
    play: "gamepad",
    rank: "trophy",
    store: "shopping-bag",
    book: "book",
    menu: "bars",
    back: "arrow-left",
} as const;


