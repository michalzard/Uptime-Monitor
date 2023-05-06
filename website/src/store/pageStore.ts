import { create } from "zustand";
import axios from "axios";

type Page = {
    name: string;
    isPublic: boolean;
}

type PageState = {
    pages: Page[];
    currentPage: Page | null;
    status: string;
    isLoading: boolean;
}
type PageActions = {
    create: (values: Page) => void;
    selectCurrentPage: (page: Page) => void;
    loadAll: () => void;
}

export const usePageStore = create<PageState & PageActions>((set, get) => ({
    pages: [],
    status: "",
    isLoading: false,
    currentPage: null,
    create: (values: Page) => {
        set({ isLoading: true });
        axios.post(`${import.meta.env.VITE_API_URL}/pages/create`, { ...values }, { withCredentials: true }).then(res => {
            const { message, page }: { message: string, page: Page } = res.data;
            set((state) => ({ isLoading: false, pages: [...state.pages, page], status: message }));
        }).catch(err => {
            set({ isLoading: false, status: err.response.data.message });
        });
    },
    loadAll: () => {
        set({ isLoading: true })
        axios.get(`${import.meta.env.VITE_API_URL}/pages/all`, { withCredentials: true }).then(res => {
            const { message, pages }: { message: string, pages: Page[] } = res.data;
            set({ isLoading: false, status: message, pages });
        }).catch(err => {
            set({ isLoading: false, status: err.response.data.message });
        })
    },
    selectCurrentPage(page: Page) {
        set({ currentPage: page });
    },
}));