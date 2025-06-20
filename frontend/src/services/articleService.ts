import type { Article, ArticleFormData, ArticleStats } from "@/types/article";
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

export const getUserArticles = async (): Promise<Article[]> => {
  const response = await axiosInstance.get("/articles/my");
  return response.data;
};

export const getUserArticleStats = async (): Promise<ArticleStats> => {
  const response = await axiosInstance.get("/articles/my/stats");
  return response.data;
};

export const getArticleById = async (id: string): Promise<Article> => {
  const response = await axiosInstance.get(`/articles/${id}`);
  return response.data;
};

export const updateArticle = async (id: string, data: FormData): Promise<void> => {
  await axiosInstance.put(`/articles/${id}`, data);
};

export const deleteArticle = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/articles/${id}`);
};
