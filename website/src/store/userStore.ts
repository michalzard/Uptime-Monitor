import axios from "axios";
import { create } from "zustand";
import { NavigateFunction } from "react-router-dom";

type UserState = {
    user: object | null;
    status: string;
    isLoggedIn: boolean;
}

type UserActions = {
    register: (values: RegisterValues, navigate: NavigateFunction) => void;
    login: (values: LoginValues, navigate: NavigateFunction) => void;
    logout: (navigate: NavigateFunction) => void;
    checkSession: () => void;
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
    register: async (values: RegisterValues, navigate: NavigateFunction) => {
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { ...values }, { withCredentials: true }).then(res => {
            const { user, message } = res.data;
            set({ user, isLoggedIn: true, status: message });
            navigate("/");
        }).catch(err => {
            set({ user: null, isLoggedIn: false, status: err.response.data.message });
        });
    },
    login: async (values: LoginValues, navigate: NavigateFunction) => {
        axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { ...values }, { withCredentials: true }).then(res => {
            const { user, message } = res.data;
            set({ user, isLoggedIn: true, status: message });
            navigate("/");
        }).catch(err => {
            set({ user: null, isLoggedIn: false, status: err.response.data.message });
        });
    },
    logout: (navigate: NavigateFunction) => {
        axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`, {}, { withCredentials: true }).then(res => {
            const { message } = res.data;
            set({ user: null, isLoggedIn: false, status: message });
            navigate("/");
        }).catch(err => {
            const { message } = err.reponse.data;
            set({ user: null, isLoggedIn: false, status: message });
            navigate("/");
        })
    },
    checkSession: () => {
        axios.get(`${import.meta.env.VITE_API_URL}/auth/session`, { withCredentials: true }).then(res => {
            const { user, message } = res.data;
            set({ user, isLoggedIn: true, status: message });
        }).catch(err => {
            set({ user: null, isLoggedIn: false, status: err.response.data.message });
        })
    },

}));