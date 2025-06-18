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
    const response = await axiosInstance.post("/auth/register", { data }, { withCredentials: true });
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