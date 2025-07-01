# ArticleHub

ArticleHub is a full-stack web platform where users can create, read, and manage articles across categories like sports, politics, and space. The platform supports user preferences, secure authentication, interactive article feeds, and article engagement metrics.

## 🧭 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)


## 🚀 Features
- **User Authentication**: Signup and login using email or phone with password.
- **Article Preferences**: Select preferred categories like sports, politics, or space.
- **Personalized Dashboard**: Article feed based on user preferences.
- **Article Interactions**: Like, dislike, or block articles.
- **Article Management**: Create, edit, delete articles with media and tags.
- **Responsive UI**: Works across mobile and desktop devices.

### 🧾 Pages
- **Registration Page**: Collects user details (name, phone, email, DOB, preferences).
- **Login Page**: Login via email or phone.
- **Dashboard**: Personalized article feed with interaction buttons.
- **Settings Page**: Edit personal info and preferences.
- **Article Creation Page**: Title, description, images, tags, category.
- **Article List Page**: Manage created articles.
- **Edit Page**: Modify existing articles.

## 🛠️ Tech Stack
**Frontend**:
- React
- Tailwind CSS
- shadcn/ui

**Backend**:
- Node.js
- Express

**Database**:
- MongoDB

**Auth**:
- JSON Web Token (JWT)

**Image Upload**:
- Multer (for local processing)
- Cloudinary (for cloud image hosting)

**Deployment**:
- Frontend: Vercel 
- Backend: Render 

## 🧩 Installation

### 1. Clone the repository
```bash
git clone https://github.com/abhinavnt/article-hub.git
cd articlehub
```

### 2. Install dependencies
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

## 🌐 Environment Variables

Create a `.env` file inside the **server** folder:

```env
PORT=5000
DATABASE_URL=mongodb://localhost:27017/articlehub
JWT_SECRET=your_jwt_secret_key

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Create a `.env` file in the **client** folder (if needed):

```env
VITE_API_BASE_URL=http://localhost:5000
```

## ⚙️ Usage

### Start Backend
```bash
cd server
npm start
```
Runs on: `http://localhost:5000`

### Start Frontend
```bash
cd client
npm run dev
```
Runs on: `http://localhost:5173`

## 🧑‍💻 Contributing

We welcome contributions!

1. Fork the repository.
2. Create a new branch:
```bash
git checkout -b feature/your-feature
```
3. Commit your changes:
```bash
git commit -m "Add your feature"
```
4. Push the branch:
```bash
git push origin feature/your-feature
```
5. Open a pull request.




