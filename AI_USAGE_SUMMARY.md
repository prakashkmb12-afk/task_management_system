# AI Usage Summary

**Candidate Role**: Kovai.co Graduate Support Engineer Trainee Applicant  
**AI Assistant Used**: ChatGPT / Gemini AI Assistant (Antigravity IDE)  

---

## 1. Overview of AI Usage
AI assistance was utilized throughout the development lifecycle in accordance with Kovai.co assessment guidelines. The primary focus was requirement analysis, architecture selection, defensive error handling, step-by-step implementation, and documentation.

---

## 2. Areas Where AI Was Utilized

### A. Requirement Analysis & Architecture Planning
- **Prompt Example**: *"Analyze the Kovai.co support engineer assessment prompt, extract mandatory features, identify explicit non-requirements, and recommend a zero-build-step minimal architecture."*
- **Outcome**: Established a clean Vanilla HTML/CSS/JS + Firebase modular SDK architecture to prevent build pipeline failures and ensure 100% deployment reliability.

### B. Code Generation & Modular Setup
- **Prompt Example**: *"Generate a clean, single-page application using Firebase v10 CDN ES modules supporting Google Popup login and real-time Firestore queries scoped to user ID."*
- **Outcome**: Generated `index.html`, `style.css`, `app.js`, and `firebase-config.js` adhering to clean design principles.

### C. Error Handling & Support Engineering Diagnostics
- **Prompt Example**: *"Identify all potential error conditions in a web-based task app with Google login and Firestore, and write user-friendly error banners with support diagnostic logs."*
- **Outcome**: Implemented explicit error handling for `auth/popup-closed-by-user`, `auth/unauthorized-domain`, Firestore rule permission failures, and input validation.

### D. Documentation & README Preparation
- **Prompt Example**: *"Generate a README.md and AI Usage Summary that clearly explains architecture decisions, setup steps, task schema, assumptions, and deployment steps."*
- **Outcome**: Generated comprehensive documentation for evaluators.

---

## 3. Manual Verification, Reviews & Corrections

Although AI generated initial structural code, all code was manually reviewed, verified, and adjusted:

1. **Firebase Modular Import Fixes**: Ensured CDN module imports specify correct `@10.12.0` versions to avoid browser loading errors.
2. **Task Schema Enforcement**: Verified that task statuses strictly map to `Planned`, `In Progress`, and `Complete`.
3. **HTML Sanitization**: Added an `escapeHtml()` helper function in `app.js` to prevent Cross-Site Scripting (XSS) vulnerabilities when rendering user input.
4. **CSS Responsive Adjustments**: Modified layout rules to ensure forms and status selectors render cleanly on mobile viewport screens.
