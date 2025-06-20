import type { Article } from "@/types/article";
import axiosInstance from "@/utils/axiosInstance";

export const getAllArticles = async (page: number, pageSize: number): Promise<Article[]> => {
  const response = await axiosInstance.get(`/articles/?page=${page}&pageSize=${pageSize}`);
  return response.data;
};

export const getArticlesByPreferences = async (page: number, pageSize: number): Promise<Article[]> => {
  const response = await axiosInstance.get(`/articles/preferences?page=${page}&pageSize=${pageSize}`);
  return response.data;
};

export const likeArticle = async (id: string): Promise<void> => {
  await axiosInstance.put(`/articles/${id}/like`);
};

export const dislikeArticle = async (id: string): Promise<void> => {
  await axiosInstance.put(`/articles/${id}/dislike`);
};

export const blockArticle = async (id: string): Promise<void> => {
  await axiosInstance.put(`/articles/${id}/block`);
};
