import { updateUser } from "@/redux/features/AuthSlice";
import { store } from "@/redux/store";
import type { UserUpdateData } from "@/types/user";
import axiosInstance from "@/utils/axiosInstance";

export const updateProfile = async (userId: string, data: Partial<UserUpdateData>) => {
  try {
    const response = await axiosInstance.patch(`/user/profile/${userId}`, data);

    const updatedUser = response.data;

    store.dispatch(updateUser({ user: updatedUser }));

    return updatedUser;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
};

export const updatePreferences = async (userId: string, preferences: string[]) => {
  try {
    const response = await axiosInstance.patch(`/user/preferences/${userId}`, {
      articlePreferences: preferences,
    });

    const updatedUser = response.data;

    store.dispatch(updateUser({ user: updatedUser }));

    return updatedUser;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
};

export const uploadProfileImage = async (userId: string, file: File) => {
  try {
    const formData = new FormData();

    formData.append("photo", file);

    const response = await axiosInstance.post(`/user/profile-photo/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data.user, "after profile updated");

    const updatedUser = response.data.user;

    store.dispatch(updateUser({ user: updatedUser }));

    // return updateUser.profileImageUrl
  } catch (error) {
    console.error("Failed to upload profile photo:", error);
    throw error;
  }
};

export const changePassword = async (userId: string, data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
  try {
    await axiosInstance.post(`/user/change-password/${userId}`, data);
  } catch (error) {
    console.error("Failed to change password:", error);
    throw error;
  }
};

export const getAvailablePreferences = () => {
  try {
    return ["Technology", "Sports", "News", "Entertainment"];
  } catch (error) {
    console.error("Failed to fetch available preferences:", error);
    throw error;
  }
};
