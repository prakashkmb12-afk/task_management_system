# Simple Task Management Application

An intuitive, reliable, and light-weight task management web application built for the **Kovai.co Graduate Support Engineer Trainee Task Assessment**.

---

## 📌 Project Overview
This application enables authenticated users to create, view, and track personal tasks through three distinct status states. It leverages Firebase for Google Authentication and Firestore for real-time cloud data persistence, hosted as a static web deployment on Render.

---

## ⚡ Core Features (Strict Scope)
1. **Google Authentication**: Secure single-click sign-in using Firebase Auth.
2. **Create Tasks**: Create tasks with mandatory titles and optional descriptions. New tasks automatically start in the `Planned` status.
3. **View Tasks**: Display only the tasks belonging to the current logged-in user, sorted by creation date with optional status filtering tabs (`All`, `Planned`, `In Progress`, `Complete`).
4. **Update Task Status**: Seamlessly update task status between `Planned`, `In Progress`, and `Complete`.

---

## 🚀 How to Access & Run Locally

### Prerequisites
- Modern web browser (Chrome, Edge, Firefox, Safari)
- Node.js (Optional, for serving locally with `npx serve`)

### Local Setup Instructions
1. Clone this repository:
   ```bash
   git clone <YOUR_GITHUB_REPOSITORY_URL>
   cd task_management
   ```
2. Open `firebase-config.js` and replace the placeholder values with your Firebase Project credentials:
   ```javascript
   export const firebaseConfig = {
     apiKey: "YOUR_ACTUAL_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```
3. Serve the application locally using any static web server:
   ```bash
   npx -y serve . -p 3000
   ```
4. Open `http://localhost:3000` in your web browser.

---

## 🔐 Google Authentication Setup (Firebase)
1. In the **Firebase Console** (https://console.firebase.google.com):
   - Go to **Build > Authentication > Sign-in method**.
   - Enable **Google** as a sign-in provider.
   - Under **Settings > Authorized domains**, ensure `localhost` and your Render deployment domain (e.g., `https://your-app.onrender.com`) are listed.
2. Under **Build > Firestore Database**:
   - Create a Firestore Database.
   - Set security rules to restrict access to authenticated users:
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /tasks/{taskId} {
           allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
           allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
         }
       }
     }
     ```

---

## 📖 User Guide

### 1. Google Login
- Click the **"Sign in with Google"** button on the home page.
- Complete the Google OAuth popup modal.
- Upon successful authentication, your avatar, name, and email will appear in the top-right header.

### 2. How to Create a Task
- Fill in the **Task Title** (Required).
- (Optional) Provide additional details in the **Description** field.
- Click **"+ Create Task"**.
- The new task will immediately appear under your task list with status `Planned`.

### 3. How to View Tasks
- All tasks created by your account are automatically synced in real-time.
- Use the status filter buttons (**All**, **Planned**, **In Progress**, **Complete**) to filter your tasks.

### 4. How to Update Task Status
- Locate the target task in your list.
- Click the status dropdown menu on the right of the task card.
- Select your desired status: `Planned`, `In Progress`, or `Complete`.
- The status updates instantly in Cloud Firestore and syncs across all open tabs.

---

## 📋 Task Schema & Allowed Statuses
```json
{
  "id": "String (Firestore Auto-ID)",
  "title": "String (Required)",
  "description": "String (Optional)",
  "status": "Planned | In Progress | Complete",
  "userId": "String (Authenticated User UID)",
  "createdAt": "Timestamp"
}
```

Allowed Status Values:
- **`Planned`** (Default for new tasks)
- **`In Progress`**
- **`Complete`**

---

## 💡 Assumptions & Design Decisions
1. **User Data Isolation**: Tasks are strictly associated with the creator's `userId`. Users can only see and update their own tasks.
2. **Minimal Architecture**: Built using pure HTML5, CSS3, and JavaScript ES modules to ensure zero build overhead, maximum reliability, and effortless hosting.
3. **Validation**: Client-side validation prevents empty task titles and restricts status values strictly to the three allowed states.

---

## ⚠️ Known Limitations
- Deleting tasks is intentionally excluded per assessment constraints to keep the scope strictly focused on the 4 core requirements.
- Offline support is limited to browser memory during the active session.

---

## 🛠️ Technology Stack
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES Modules)
- **Authentication**: Firebase Authentication (Google OAuth 2.0 Popup)
- **Database**: Cloud Firestore (Real-time NoSQL)
- **Hosting**: Render (Static Web Service)
- **Version Control**: Git & GitHub

---

## 🌍 Deployment Instructions (Firebase Hosting)
1. Install Firebase CLI globally or use `npx firebase-tools`:
   ```bash
   npx firebase login
   ```
2. Deploy the application to Firebase Hosting:
   ```bash
   npx firebase deploy --only hosting
   ```
3. Your application is live at:
   `https://task-management-app-e305a.web.app` (and `https://task-management-app-e305a.firebaseapp.com`)
4. Firebase Hosting domains (`.web.app` and `.firebaseapp.com`) are automatically added to **Firebase Console > Authentication > Settings > Authorized Domains**.
