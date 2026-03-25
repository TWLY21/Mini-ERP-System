import { defineStore } from "pinia";

import { loginRequest } from "../api/auth";

const TOKEN_KEY = "mini_erp_token";
const USER_KEY = "mini_erp_user";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
    initialized: false,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
  },
  actions: {
    bootstrap() {
      if (this.initialized) {
        return;
      }

      const token = localStorage.getItem(TOKEN_KEY);
      const user = localStorage.getItem(USER_KEY);

      this.token = token;
      this.user = user ? JSON.parse(user) : null;
      this.initialized = true;
    },
    async login(credentials) {
      const { token, user } = await loginRequest(credentials);
      this.token = token;
      this.user = user;
      this.initialized = true;

      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    logout() {
      this.token = null;
      this.user = null;
      this.initialized = true;

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
  },
});
