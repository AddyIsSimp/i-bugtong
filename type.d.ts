import type FontAwesome from "@expo/vector-icons/FontAwesome";
import type { ComponentProps } from "react";

declare global {
    interface TabIconProps {
        focused: boolean,
        icon: ComponentProps<typeof FontAwesome>["name"];
    }

    type Difficulty = 'easy' | 'medium' | 'hard'

    interface Hint {
        text: string;
        open: boolean;
    }

    interface BugtongProps {
        id: number | string;
        difficulty: Difficulty;
        category: string;
        question: string;
        answer: string;
        hint?: Hint[];
        solved: boolean;
    }

    interface APIResponse {
        status: number,
        message?: string,
        error?: string,
    }

    interface CreateAccountRequest {
        username: string;
        email: string;
        password: string;
        points?: number;
    }
}

export { };

