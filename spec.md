# MedyAI Authentication System

## Current State
Existing Medical Assistant AI app with three feature tabs (Prescription Reader, Symptom Analyzer, Medical Advice) and TTS voice output. No authentication layer exists.

## Requested Changes (Diff)

### Add
- User registration with name, email, password (hashed)
- User login returning auth token stored in localStorage
- Protected dashboard page showing user name and app features
- Auth middleware protecting dashboard route
- Logout functionality clearing token
- Toast notifications for success/error feedback
- Token persistence across page reloads
- Form validation on all auth forms
- Protected route wrapper redirecting unauthenticated users to login

### Modify
- App entry point to wrap with auth context and routing
- Main app features moved into protected dashboard

### Remove
- Nothing removed

## Implementation Plan
1. Select `authorization` Caffeine component for auth token management
2. Generate Motoko backend with User actor: register, login, getMe endpoints
3. Build frontend:
   - AuthContext for global auth state
   - Login page with email/password form
   - Register page with name/email/password form
   - ProtectedRoute component redirecting unauthenticated users
   - Dashboard page showing user name, logout button, and the three AI feature tabs
   - Toast notification system
   - Axios-equivalent backend calls via generated bindings
