export const validateEmail = (email: string): string => {
  if (!email.trim()) return "Email is required"
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return "Please enter a valid email address"
  return ""
}

export const validateIndianPhone = (phone: string): string => {
  if (!phone.trim()) return "Phone number is required"

  // Remove all spaces, hyphens, and parentheses
  const cleanPhone = phone.replace(/[\s\-$$$$]/g, "")

  // Check for Indian phone number patterns
  const indianPhoneRegex = /^(\+91|91)?[6-9]\d{9}$/

  if (!indianPhoneRegex.test(cleanPhone)) {
    return "Please enter a valid Indian phone number (10 digits starting with 6-9)"
  }

  return ""
}

export const validatePassword = (password: string): string => {
  if (!password) return "Password is required"
  if (password.length < 8) return "Password must be at least 8 characters long"
  if (!/(?=.*[a-z])/.test(password)) return "Password must contain at least one lowercase letter"
  if (!/(?=.*[A-Z])/.test(password)) return "Password must contain at least one uppercase letter"
  if (!/(?=.*\d)/.test(password)) return "Password must contain at least one number"
  return ""
}

export const validateName = (name: string, fieldName: string): string => {
  if (!name.trim()) return `${fieldName} is required`
  if (name.trim().length < 2) return `${fieldName} must be at least 2 characters long`
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) return `${fieldName} should only contain letters`
  return ""
}

export const validateDateOfBirth = (date: string): string => {
  if (!date) return "Date of birth is required"

  const birthDate = new Date(date)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  if (age < 13) return "You must be at least 13 years old to register"
  if (age > 120) return "Please enter a valid date of birth"

  return ""
}

export const validatePasswordConfirmation = (password: string, confirmation: string): string => {
  if (!confirmation) return "Password confirmation is required"
  if (password !== confirmation) return "Passwords do not match"
  return ""
}
