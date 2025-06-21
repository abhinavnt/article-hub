import { ArticlePreferencesSection } from "@/components/settings/ArticlePreferencesSection";
import { PasswordChangeSection } from "@/components/settings/PasswordChangeSection";
import { ProfileInformationSection } from "@/components/settings/ProfileInformationSection";
import { ProfilePhotoSection } from "@/components/settings/ProfilePhotoSection";
import { Loading } from "@/components/ui/Loading";
import { useAppSelector } from "@/redux/store";
import { changePassword, updatePreferences, updateProfile, uploadProfileImage } from "@/services/userService";
import { getCategories } from "@/services/AddArticleService";
import type { User } from "@/types/user";
import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Category {
  id: string;
  name: string;
}

export const Settings: React.FC = () => {
  const { user } = useAppSelector((state: any) => state.auth);

  const [profileData, setProfileData] = useState<Partial<User>>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth || new Date(),
    articlePreferences: user?.articlePreferences || [],
    profileImageUrl: user?.profileImageUrl || "",
  });

  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [preferencesLoading, setPreferencesLoading] = useState(true);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  // Track initial values for comparison
  const [initialPreferences, setInitialPreferences] = useState<string[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (user) {
      const userData: Partial<User> = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || new Date(),
        articlePreferences: user.articlePreferences || [],
        profileImageUrl: user.profileImageUrl || "",
      };
      setProfileData(userData);
      setInitialPreferences(user.articlePreferences || []);
    }
  }, [user]);




  const loadCategories = async () => {
    try {
      const categories = await getCategories();
      setAvailableCategories(categories);
    } catch (error) {
      console.error("Failed to load categories:", error);
       toast.error("Failed to load categories. Please try again.");
    } finally {
      setPreferencesLoading(false);
    }
  };


   // Map availablePreferences to options format for PreferenceButtons
     const transformedData = availableCategories.map((cat: Category) => ({
            ...cat,
            id: cat.name.toUpperCase(),
            originalId: cat.id, // Preserve original id as originalId
          }))
  
       const limitedCategories = transformedData.map((cat) => ({
      id: cat.id, // Use originalId for backend compatibility
      label: cat.id, // Display the new uppercase id field
    }))
  

  const handleImageUpdate = async (file: File) => {
    console.log("settings handleImageUpdate");

    if (!user) return;

    setImageUploadLoading(true);
    try {
      console.log("image uploading");

      const imageUrl = await uploadProfileImage(user.userId, file);
      setProfileData((prev) => ({ ...prev, profileImage: imageUrl }));
       toast.success("Profile photo updated successfully!");
    } catch (error: any) {
      console.error("Failed to update profile photo:", error);
       toast.error(error.response?.data?.message || "Failed to update profile photo. Please try again.");
    } finally {
      setImageUploadLoading(false);
    }
  };

  const handleProfileSubmit = async (formData: any) => {
    if (!user) return;

    setProfileLoading(true);
    try {
      const updatedProfileData = {
        ...formData,
        dateOfBirth: typeof formData.dateOfBirth === "string" ? new Date(formData.dateOfBirth) : formData.dateOfBirth,
      };

      await updateProfile(user.userId, updatedProfileData);
      setProfileData((prev) => ({ ...prev, ...updatedProfileData }));
       toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
       toast.error(error.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePreferenceToggle = (preference: string) => {
    const currentPreferences = profileData.articlePreferences || [];
    const updatedPreferences = currentPreferences.includes(preference)
      ? currentPreferences.filter((p) => p !== preference)
      : [...currentPreferences, preference];

    setProfileData((prev) => ({ ...prev, articlePreferences: updatedPreferences }));
  };

  const handlePreferencesSubmit = async () => {
    if (!user) return;

    setProfileLoading(true);
    try {
      await updatePreferences(user.userId, profileData.articlePreferences || []);
      setInitialPreferences(profileData.articlePreferences || []);
       toast.success("Preferences updated successfully!");
    } catch (error: any) {
      console.error("Failed to update preferences:", error);
       toast.error(error.response?.data?.message || "Failed to update preferences. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (passwordFormData: PasswordChangeData) => {
    if (!user) return;

    setPasswordLoading(true);
    try {
      await changePassword(user.userId, passwordFormData);
       toast.success("Password changed successfully!");
    } catch (error: any) {
      console.error("Failed to change password:", error);
       toast.error(error.response?.data?.message || "Failed to change password. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (preferencesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <ProfilePhotoSection
            profileImage={profileData.profileImageUrl}
            onImageUpdate={handleImageUpdate}
            loading={imageUploadLoading}
          />

          <ProfileInformationSection
            initialData={{
              firstName: profileData.firstName || "",
              lastName: profileData.lastName || "",
              email: profileData.email || "",
              phone: profileData.phone || "",
              dateOfBirth: profileData.dateOfBirth
                ? typeof profileData.dateOfBirth === "string"
                  ? profileData.dateOfBirth
                  : profileData.dateOfBirth.toISOString().split("T")[0]
                : "",
            }}
            onSubmit={handleProfileSubmit}
            loading={profileLoading}
          />

          <ArticlePreferencesSection
            availablePreferences={limitedCategories}
            selectedPreferences={profileData.articlePreferences || []}
            initialPreferences={initialPreferences}
            onPreferenceToggle={handlePreferenceToggle}
            onSubmit={handlePreferencesSubmit}
            loading={profileLoading}
          />

          <PasswordChangeSection onSubmit={handlePasswordSubmit} loading={passwordLoading} />
        </div>
      </div>
    </div>
  );
};