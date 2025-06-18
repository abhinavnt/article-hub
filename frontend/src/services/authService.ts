import { clearUser, setCredentials } from "@/redux/features/AuthSlice";
import type { AppDispatch } from "@/redux/store";
import axiosInstance from "@/utils/axiosInstance";

export interface RegisterData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  password: string;
  passwordConfirmation: string;
  articlePreferences: string[];
}

export interface LoginData {
  identifier: string; // email or phone
  password: string;
}


export const registerUser = async (data: RegisterData, dispatch: AppDispatch) => {
  try {
    console.log("going the response");
    
    const response = await axiosInstance.post("/auth/register", { data }, { withCredentials: true });
    console.log(response,"response from the register api");
    
    dispatch(setCredentials({ accessToken: response.data.accessToken, user: response.data.user }));
    localStorage.setItem("isAuthenticated", "true");
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const login = async (data: LoginData, dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.post("/auth/login", { data }, { withCredentials: true });

    dispatch(
      setCredentials({
        accessToken: response.data.accessToken,
        user: response.data.user,
      })
    );

    localStorage.clear();
    localStorage.setItem("isAuthenticated", "true");
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const userLogout = async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.post("/auth/logout", {}, { withCredentials: true });

    if (response.status === 200) {
      dispatch(clearUser());
    }

    return response;
  } catch (error) {
    console.error(error);
    throw new Error("error while logging out");
  }
};

export const refreshToken = async (dispatch: AppDispatch) => {
  try {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const isAdmin = localStorage.getItem("adminLoggedIn");

    let data = { role: "user" };

    if (isAuthenticated === "true") {
      if (isAdmin === "true") {
        data = { role: "admin" };
      }

      const response = await axiosInstance.post(`/auth/refresh-token`, data, { withCredentials: true });

      dispatch(setCredentials({ accessToken: response.data.accessToken, user: response.data.user }));
      return response.data.accessToken;
    }
    throw new Error("Session expired. Please log in again");
  } catch (error) {
    console.log(error);
    //   dispatch(logout());
    throw new Error("Session expired. Please log in again.");
  }
};