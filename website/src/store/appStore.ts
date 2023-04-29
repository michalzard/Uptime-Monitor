import { create } from "zustand";

type AppState = {
    headerIndex: number;
    dashboardButtonIndex: number;
}
type AppActions = {
    selectHeaderIndex: (index: number) => void;
    selectDashboardButton: (index: number) => void;
    isDashboardButtonSelected: (buttonIndex: number) => boolean;
}

export const useAppStore = create<AppState & AppActions>((set, get) => ({
    headerIndex: -1,
    dashboardButtonIndex: 1,
    selectHeaderIndex(index: number) {
        set({ headerIndex: index });
    },
    selectDashboardButton(index: number) {
        set({ dashboardButtonIndex: index });
    },
    isDashboardButtonSelected(buttonIndex: number) {
        return this.dashboardButtonIndex === buttonIndex;
    },
}))