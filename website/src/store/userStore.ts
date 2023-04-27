import axios from "axios";
import { create } from "zustand";
import { NavigateFunction } from "react-router-dom";

type UserState = {
    user: object | null;
    status: string;
    isLoggedIn: boolean;
    isLoading: boolean;
}

type UserActions = {
    register: (values: RegisterValues, navigate: NavigateFunction) => void;
    login: (values: LoginValues, navigate: NavigateFunction) => void;
    logout: (navigate: NavigateFunction) => void;
    checkSession: () => void;
    githubRedirect: () => void;
    githubAuth: (code: string, navigate: NavigateFunction) => void;
}

export type RegisterValues = {
    username: string;
    email: string;
    password: string;
}

export type LoginValues = {
    username: string;
    password: string;
}

export const useUserStore = create<UserState & UserActions>((set, get) => ({
    user: null,
    isLoggedIn: false,
    status: "",
    isLoading: false,
    register: async (values: RegisterValues, navigate: NavigateFunction) => {
        set({ isLoading: true });
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { ...values }, { withCredentials: true }).then(res => {
            const { user, message } = res.data;
            set({ user, isLoggedIn: true, isLoading: false, status: message });
            navigate("/");
        }).catch(err => {
            set({ user: null, isLoggedIn: false, isLoading: false, status: err.response.data.message });
        });
    },
    login: async (values: LoginValues, navigate: NavigateFunction) => {
        set({ isLoading: true });
        axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { ...values }, { withCredentials: true }).then(res => {
            const { user, message } = res.data;
            set({ user, isLoggedIn: true, isLoading: false, status: message });
            navigate("/");
        }).catch(err => {
            set({ user: null, isLoggedIn: false, isLoading: false, status: err.response.data.message });
        });
    },
    logout: (navigate: NavigateFunction) => {
        set({ isLoading: true });
        axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {}, { withCredentials: true }).then(res => {
            const { message } = res.data;
            set({ user: null, isLoggedIn: false, isLoading: false, status: message });
            navigate("/");
        }).catch(err => {
            set({ user: null, isLoggedIn: false, isLoading: false, status: err.response.data.message });
        })
    },
    checkSession: async () => {
        set({ isLoading: true });
        axios.get(`${import.meta.env.VITE_API_URL}/auth/session`, { withCredentials: true }).then(res => {
            const { user, message } = res.data;
            set({ user, isLoggedIn: true, isLoading: false, status: message });
        }).catch(err => {
            set({ user: null, isLoggedIn: false, isLoading: false, status: err.response.data.message });
        })
    },
    githubRedirect: () => {
        // redirects to github's oauths page
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_GITHUB_CLIENT_ID}&scope=user`;
    },
    githubAuth: async (code: string, navigate: NavigateFunction) => {
        set({ isLoading: true });
        axios.post(`${import.meta.env.VITE_API_URL}/auth/github`, { code }, { withCredentials: true }).then(res => {
            const { message, user } = res.data;
            set({ user, isLoggedIn: true, isLoading: false, status: message });
            navigate("/");
        }).catch(err => {
            set({ isLoading: false, status: err.response.data.message });
        })
    },
}));

