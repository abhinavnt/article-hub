// import axiosInstance from "@/utils/axiosInstance"



export interface RegisterData {
  firstName: string
  lastName: string
  phone: string
  email: string
  dateOfBirth: string
  password: string
  passwordConfirmation: string
  articlePreferences: string[]
}

export interface LoginData {
  identifier: string // email or phone
  password: string
}

export const authService = {
  register: async (data: RegisterData) => {
    // const response = await axiosInstance.post("/auth/register", data)
    // return response.data
  },

  login: async (data: LoginData) => {
    // const response = await axiosInstance.post("/auth/login", data)
    // if (response.data.token) {
    //   localStorage.setItem("authToken", response.data.token)
    // }
    // return response.data
  },

  logout: () => {
    localStorage.removeItem("authToken")
  },
}
