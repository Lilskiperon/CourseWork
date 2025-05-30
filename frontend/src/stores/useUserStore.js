import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: false,

    checkAuth: async () => {
		if (get().checkingAuth) return;
		
		set({ checkingAuth: true });
		
		try {
		  const response = await axios.get("/auth/check-guest/");
	  
		  if (response.data.isGuest) {
			set({
			  user: {
				_id: response.data.userId,
				sessionId: response.data.sessionId,
				isGuest: true,
				name: "",
				email: "",
			  },
			  checkingAuth: false
			});
		  } 
		  else {
			const profileResponse = await axios.get("/auth/profile");
			console.log("Profile response:", profileResponse);
			set({
			  user: profileResponse.data,
			  checkingAuth: false
			});
		  }
		} catch (error) {
		  if (!axios.isCancel(error)) {
			console.error("Auth check error:", error);
			set({ checkingAuth: false });
		  }
		}
	  },

	signup: async (FormData) => {
		set({ loading: true });

		try {
			const res = await axios.post("/auth/signup", FormData);
			set({ user: res.data, loading: false });
			toast.success("Registration successful");
			return { success: true };
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
			return { success: false };
		}
	},

	login: async (FormData) => {
		set({ loading: true });

		try {
			const res = await axios.post("/auth/login", FormData);
			toast.success("Login successful");
			set({ user: res.data, loading: false });
			return { success: true };
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
			return { success: false };
		}
	},

	logout: async () => {
		try {
			await axios.post("/auth/logout");
			set({ user: null });
		} catch (error) {
			toast.error(error.response?.data?.message || "An error occurred during logout");
		}
	},

	refreshToken: async () => {
		const user = get().user;
        if (user && user.guest === false) {
            // Prevent multiple simultaneous refresh attempts
            if (get().checkingAuth) return;
        
            set({ checkingAuth: true });
            try {
                const response = await axios.post("/auth/refresh-token");
                set({ checkingAuth: false });
                return response.data;
            } catch (error) {
                set({ user: null, checkingAuth: false });
                throw error;
            }
        } else {
            // Если пользователь гость, не обновляем токен
            set({ checkingAuth: false });
        }
    },
}));

let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {

				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}


				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {

				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);