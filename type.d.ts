import type FontAwesome from "@expo/vector-icons/FontAwesome";
import type { ComponentProps } from "react";

declare global {
    interface TabIconProps {
        focused: boolean,
        icon: ComponentProps<typeof FontAwesome>["name"];
    }
}

export {};
