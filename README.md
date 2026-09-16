# Simple Task Management App

A fast, clean, and easy-to-use web application to organize and track your daily tasks.

---

##  Key Features
- **Google Sign-In**: Securely log in using your Google account with one click.
- **Create Tasks**: Create new tasks with a title and an optional description.
- **View Tasks**: See your personal task list in real time, filtered by status.
- **Update Task Status**: Change task progress easily between `Planned`, `In Progress`, and `Complete`.

---

##  Task Statuses
Every task moves through three simple states:
-  **Planned**: Tasks you plan to start (default for new tasks).
-  **In Progress**: Tasks you are actively working on.
-  **Complete**: Tasks you have finished.

---

##  Built With
- **HTML5 & CSS3**: Clean, responsive user interface.
- **JavaScript (Vanilla)**: Lightweight application logic.
- **Firebase Auth**: Secure Google Sign-In authentication.
- **Cloud Firestore**: Real-time cloud database storage.

---

##  Quick Setup & Local Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/prakashkmb12-afk/task_management_system.git
   cd task_management_system
   ```

2. **Add Firebase Credentials**:
   Open `firebase-config.js` and add your Firebase project settings:
   ```javascript
   export const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

3. **Run Locally**:
   Serve the project using any static web server:
   ```bash
   npx serve .
   ```
   Or simply open `index.html` in your web browser.
