import { create } from "zustand";

type AppState = {
    headerIndex: number;
    customizationIndex: number;
    customizationButtons: { text: string; desiredIndex: number }[]
}
type AppActions = {
    selectHeaderIndex: (index: number) => void;
    selectCustomizationButton: (index: number) => void;
    selectCustomizationButtonByPath: (path: string) => void;
    isCustomizationButtonActive: (currentIndex: number) => boolean;
}

export const useAppStore = create<AppState & AppActions>((set, get) => ({
    headerIndex: -1,
    customizationIndex: 0,
    customizationButtons: [{ text: "Incidents", desiredIndex: 0 }, { text: "Components", desiredIndex: 1 }, { text: "Listeners", desiredIndex: 2 }],
    selectHeaderIndex(index: number) {
        set({ headerIndex: index });
    },
    selectCustomizationButton(index: number) {
        set({ customizationIndex: index });
    },
    selectCustomizationButtonByPath(path: string) {
        const index = this.customizationButtons.findIndex((value) => value.text.toLowerCase() === path.toLowerCase());
        this.selectCustomizationButton(index);
    },
    isCustomizationButtonActive(currentIndex: number) {
        return this.customizationIndex === currentIndex;
    }
}))