import { create } from "zustand";
import axios from "axios";
import { Location, NavigateFunction } from "react-router-dom";

type Page = {
    id: string;
    name: string;
    isPublic: boolean;
}

type PageState = {
    pages: Page[];
    currentPage: Page | null;
    status: string;
    isLoading: boolean;
}
type PageCreateValues = {
    name: string;
    isPublic: boolean;
}

type PageComponent = {
    name: string;
    description: string;
    startDate: Date;
}

type PageActions = {
    create: (values: PageCreateValues, navigate: NavigateFunction) => void;
    selectCurrentPage: (page: Page) => void;
    loadAll: (navigate: NavigateFunction, disabled?: boolean) => void;
    addComponent: ({ name, description, startDate }: PageComponent) => void;
}

export const usePageStore = create<PageState & PageActions>((set, get) => ({
    pages: [],
    status: "",
    isLoading: false,
    currentPage: null,
    create: (values: { name: string, isPublic: boolean }, navigate: NavigateFunction) => {
        set({ isLoading: true });
        axios.post(`${import.meta.env.VITE_API_URL}/pages/create`, { ...values }, { withCredentials: true }).then(res => {
            const { message, page }: { message: string, page: Page } = res.data;
            set((state) => ({ isLoading: false, pages: [...state.pages, page], currentPage: page, status: message }));
            if (page) navigate(`/dashboard/${page.id}/incidents`);
        }).catch(err => {
            set({ isLoading: false, status: err.response.data.message });
        });
    },
    loadAll: (navigate, disable) => {
        set({ isLoading: true });
        axios.get(`${import.meta.env.VITE_API_URL}/pages/all`, { withCredentials: true }).then(res => {
            const { message, pages }: { message: string, pages: Page[] } = res.data;
            set({ isLoading: false, status: message, pages, currentPage: pages[0] });
            if (pages.length > 0) {
                if (!disable) navigate(`/dashboard/${pages[0].id}/incidents`);
            }
        }).catch(err => {
            set({ isLoading: false, status: err.message });
        })
    },
    selectCurrentPage(page: Page) {
        set({ currentPage: page });
    },
    addComponent({ name, description, startDate }) {
        // send it to the good old backend and have it attached to current page
    },
}));