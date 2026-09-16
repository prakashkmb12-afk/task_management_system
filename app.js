// Import Firebase SDK Modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

// Global Application State
let app;
let auth;
let db;
let currentUser = null;
let tasksList = [];
let activeFilter = "ALL";
let unsubscribeTasks = null;

// Allowed Status Constants
const STATUSES = {
  PLANNED: "Planned",
  IN_PROGRESS: "In Progress",
  COMPLETE: "Complete"
};

// DOM Elements
const loadingSpinner = document.getElementById("loading-spinner");
const loginSection = document.getElementById("login-section");
const taskSection = document.getElementById("task-section");
const userProfile = document.getElementById("user-profile");
const userAvatar = document.getElementById("user-avatar");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const btnLogin = document.getElementById("btn-login");
const btnLogout = document.getElementById("btn-logout");

const errorBanner = document.getElementById("error-banner");
const errorMessage = document.getElementById("error-message");
const btnCloseError = document.getElementById("btn-close-error");

const createTaskForm = document.getElementById("create-task-form");
const taskTitleInput = document.getElementById("task-title");
const taskDescInput = document.getElementById("task-desc");
const btnCreateTask = document.getElementById("btn-create-task");
const btnCreateText = document.getElementById("btn-create-text");
const btnCreateLoader = document.getElementById("btn-create-loader");

const taskContainer = document.getElementById("task-container");
const taskCount = document.getElementById("task-count");
const filterButtons = document.querySelectorAll(".filter-btn");

// Initialization
function initApp() {
  try {
    // 1. Check if Firebase credentials are provided
    if (!firebaseConfig || firebaseConfig.apiKey === "YOUR_API_KEY") {
      showError("Firebase configuration is missing. Please add your credentials in firebase-config.js");
      hideElement(loadingSpinner);
      showElement(loginSection);
      return;
    }

    // 2. Initialize Firebase App & Services
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // 3. Listen to Authentication State Changes
    onAuthStateChanged(auth, (user) => {
      hideElement(loadingSpinner);
      if (user) {
        // Authenticated State
        currentUser = user;
        renderUserProfile(user);
        hideElement(loginSection);
        showElement(taskSection);
        showElement(userProfile);
        
        // Listen to live tasks for current user
        subscribeToUserTasks(user.uid);
      } else {
        // Unauthenticated State
        currentUser = null;
        if (unsubscribeTasks) {
          unsubscribeTasks();
          unsubscribeTasks = null;
        }
        hideElement(taskSection);
        hideElement(userProfile);
        showElement(loginSection);
      }
    });

  } catch (err) {
    console.error("Firebase Initialization Error:", err);
    showError("Failed to initialize application. Please verify your Firebase configuration.");
    hideElement(loadingSpinner);
    showElement(loginSection);
  }
}

// ------------------------------------------------------------------
// AUTHENTICATION FUNCTIONS
// ------------------------------------------------------------------

// Login with Google Popup
async function handleLogin() {
  clearError();
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error("Google Sign-In Error:", err);
    if (err.code === "auth/popup-closed-by-user") {
      showError("Sign-in cancelled. Please try again when ready.");
    } else if (err.code === "auth/unauthorized-domain") {
      showError("Domain not authorized in Firebase Console > Authentication > Settings > Authorized domains.");
    } else {
      showError(`Sign-in failed: ${err.message || "An unexpected error occurred."}`);
    }
  }
}

// Sign Out
async function handleLogout() {
  clearError();
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Logout Error:", err);
    showError("Failed to sign out. Please try again.");
  }
}

// Render Profile details
function renderUserProfile(user) {
  userName.textContent = user.displayName || "Authenticated User";
  userEmail.textContent = user.email || "";
  userAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}`;
}

// ------------------------------------------------------------------
// FIRESTORE TASK OPERATIONS
// ------------------------------------------------------------------

// Subscribe to real-time task updates for authenticated user
function subscribeToUserTasks(userId) {
  try {
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("userId", "==", userId));

    unsubscribeTasks = onSnapshot(q, (snapshot) => {
      tasksList = [];
      snapshot.forEach((docSnap) => {
        tasksList.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      });

      // Sort tasks by createdAt descending (newest first)
      tasksList.sort((a, b) => {
        const timeA = a.createdAt ? a.createdAt.toMillis() : Date.now();
        const timeB = b.createdAt ? b.createdAt.toMillis() : Date.now();
        return timeB - timeA;
      });

      renderTasks();
    }, (err) => {
      console.error("Firestore Subscribe Error:", err);
      showError("Failed to fetch your tasks. Please check your Firestore security rules.");
    });
  } catch (err) {
    console.error("Task query setup failed:", err);
    showError("Error connecting to Firestore database.");
  }
}

// Create Task
async function handleCreateTask(e) {
  e.preventDefault();
  clearError();

  if (!currentUser) {
    showError("You must be logged in to create a task.");
    return;
  }

  const title = taskTitleInput.value.trim();
  const description = taskDescInput.value.trim();

  // Validation
  if (!title) {
    showError("Task title cannot be empty.");
    return;
  }

  // UI Button Loading State
  btnCreateTask.disabled = true;
  hideElement(btnCreateText);
  showElement(btnCreateLoader);

  try {
    const newTask = {
      title,
      description,
      status: STATUSES.PLANNED,
      userId: currentUser.uid,
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, "tasks"), newTask);

    // Reset Form
    createTaskForm.reset();
  } catch (err) {
    console.error("Create Task Error:", err);
    showError("Failed to create task. Please try again.");
  } finally {
    btnCreateTask.disabled = false;
    showElement(btnCreateText);
    hideElement(btnCreateLoader);
  }
}

// Update Task Status
async function handleUpdateStatus(taskId, newStatus) {
  clearError();
  if (!currentUser) return;

  // Validate allowed status values
  if (!Object.values(STATUSES).includes(newStatus)) {
    showError("Invalid task status selected.");
    return;
  }

  try {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error("Update Task Status Error:", err);
    showError("Failed to update status. Please try again.");
  }
}

// ------------------------------------------------------------------
// UI RENDER FUNCTIONS
// ------------------------------------------------------------------

function renderTasks() {
  // Filter tasks based on active tab
  const filteredTasks = tasksList.filter(task => {
    if (activeFilter === "ALL") return true;
    return task.status === activeFilter;
  });

  taskCount.textContent = filteredTasks.length;

  if (filteredTasks.length === 0) {
    taskContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📂</div>
        <p><strong>No tasks found.</strong></p>
        <p>${activeFilter === "ALL" ? "Create your first task above!" : `No tasks with status "${activeFilter}".`}</p>
      </div>
    `;
    return;
  }

  taskContainer.innerHTML = "";

  filteredTasks.forEach(task => {
    const taskElement = document.createElement("div");
    taskElement.className = "task-item";
    
    // Status color helper class
    let statusClass = "status-planned";
    if (task.status === STATUSES.IN_PROGRESS) statusClass = "status-in-progress";
    if (task.status === STATUSES.COMPLETE) statusClass = "status-complete";

    taskElement.innerHTML = `
      <div class="task-content">
        <div class="task-title">${escapeHtml(task.title)}</div>
        ${task.description ? `<div class="task-desc">${escapeHtml(task.description)}</div>` : ''}
        <div class="task-meta">Status: <strong>${task.status}</strong></div>
      </div>
      <div class="task-status-control">
        <select class="status-select ${statusClass}" data-id="${task.id}">
          <option value="${STATUSES.PLANNED}" ${task.status === STATUSES.PLANNED ? 'selected' : ''}>Planned</option>
          <option value="${STATUSES.IN_PROGRESS}" ${task.status === STATUSES.IN_PROGRESS ? 'selected' : ''}>In Progress</option>
          <option value="${STATUSES.COMPLETE}" ${task.status === STATUSES.COMPLETE ? 'selected' : ''}>Complete</option>
        </select>
      </div>
    `;

    // Event listener for status select change
    const selectElem = taskElement.querySelector(".status-select");
    selectElem.addEventListener("change", (e) => {
      handleUpdateStatus(task.id, e.target.value);
    });

    taskContainer.appendChild(taskElement);
  });
}

// Filter Tab Click Handlers
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.getAttribute("data-filter");
    renderTasks();
  });
});

// Helper Utilities
function showError(msg) {
  errorMessage.textContent = msg;
  showElement(errorBanner);
}

function clearError() {
  errorMessage.textContent = "";
  hideElement(errorBanner);
}

function showElement(el) {
  if (el) el.classList.remove("hidden");
}

function hideElement(el) {
  if (el) el.classList.add("hidden");
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}

// Event Listeners
btnLogin.addEventListener("click", handleLogin);
btnLogout.addEventListener("click", handleLogout);
createTaskForm.addEventListener("submit", handleCreateTask);
btnCloseError.addEventListener("click", clearError);

// Run App Initialization
document.addEventListener("DOMContentLoaded", initApp);
