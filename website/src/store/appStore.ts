import { create } from "zustand";

type AppState = {
    headerIndex: number;
}
type AppActions = {
    selectHeaderIndex: (index: number) => void;
}

export const useAppStore = create<AppState & AppActions>((set, get) => ({
    headerIndex: -1,
    selectHeaderIndex(index: number) {
        set({ headerIndex: index });
    }
}))