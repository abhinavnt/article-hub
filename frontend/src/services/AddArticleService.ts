import type { ArticleFormData, Category } from "@/types/article";
import axiosInstance from "@/utils/axiosInstance";


export const getCategories=async (): Promise<Category[]>=>{
  const response = await axiosInstance.get(`/articles/categories`, { withCredentials: true });
    return response.data;
}


export const createCategory = async (name: string): Promise<Category> => {
  const response = await axiosInstance.post(`/articles/categories`, { name }, { withCredentials: true });
  return response.data;
};

export const saveDraft = async (formData: ArticleFormData): Promise<{ id: string; title: string }> => {
  try {
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("content", formData.content);
    if (formData.image) form.append("image", formData.image);
    form.append("tags", JSON.stringify(formData.tags));
    form.append("category", formData.category);

    const response = await axiosInstance.post(`/articles/draft`, form, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch available preferences:", error);
    throw error;
  }
};

export const publishArticle = async (formData: ArticleFormData): Promise<{ id: string; title: string }> => {
  try {
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("content", formData.content);
    if (formData.image) form.append("image", formData.image);
    form.append("tags", JSON.stringify(formData.tags));
    form.append("category", formData.category);

    const response = await axiosInstance.post(`/articles/publish`, form, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch available preferences:", error);
    throw error;
  }
};
