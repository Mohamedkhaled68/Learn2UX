# Admin Panel Documentation

## Overview

Complete admin functionality for managing categories and questions in the Learn2UX platform.

## Components Created

### 1. **AdminRegister.tsx** (`/components/AdminRegister.tsx`)

-   Registration form for new admin accounts
-   Validates username and password
-   Sends POST request to `/api/admin/register`
-   Redirects to login after successful registration

### 2. **AdminLogin.tsx** (`/components/AdminLogin.tsx`)

-   Login form for existing admin accounts
-   Validates credentials
-   Sends POST request to `/api/admin/login`
-   Stores JWT token in secure cookies
-   Redirects to admin dashboard after successful login

### 3. **AdminDashboard.tsx** (`/components/AdminDashboard.tsx`)

-   Main admin panel with tab navigation
-   Protected route - checks for authentication token
-   Two tabs: "Add Category" and "Add Question"
-   Logout functionality
-   Responsive design

### 4. **AddCategory.tsx** (`/components/AddCategory.tsx`)

-   Form to add new categories
-   Fields:
    -   Title (English)
    -   Title (Arabic)
    -   Description (English)
    -   Description (Arabic)
-   Sends POST request to `/api/categories`
-   Uses authentication token from cookies
-   Validates all required fields
-   Clears form after successful submission

### 5. **AddQuestion.tsx** (`/components/AddQuestion.tsx`)

-   Form to add new questions
-   Fields:
    -   Category selection (dropdown populated from API)
    -   Question text (English)
    -   Question text (Arabic)
    -   Answer text (English)
    -   Answer text (Arabic)
    -   External links (dynamic list, optional)
-   Fetches categories from `/api/categories` on mount
-   Sends POST request to `/api/questions`
-   Uses authentication token from cookies
-   Allows adding/removing multiple external links
-   Validates all required fields
-   Clears form after successful submission

## Routes Created

1. `/[lang]/admin/register` - Admin registration page
2. `/[lang]/admin/login` - Admin login page
3. `/[lang]/admin/dashboard` - Admin dashboard (protected)

## Features

### ✅ Authentication

-   JWT token stored in secure cookies with:
    -   7-day expiration
    -   Secure flag in production
    -   SameSite strict policy
-   Token sent with all authenticated requests
-   Protected routes check for token presence
-   Automatic redirect to login if not authenticated
-   Logout clears token and redirects to login

### ✅ Form Validation

-   All required fields validated before submission
-   Real-time error clearing when user types
-   Clear validation messages
-   Prevents empty submissions

### ✅ Error Handling

-   API error messages displayed to user
-   Network error handling
-   Fallback error messages
-   Authentication error detection

### ✅ Loading States

-   Loading spinners during API requests
-   Disabled inputs during submission
-   Visual feedback for all async operations

### ✅ Success Feedback

-   Success messages after successful operations
-   Automatic form clearing
-   Visual confirmation with icons

### ✅ UI/UX

-   Clean, modern design with TailwindCSS
-   Responsive layout (mobile and desktop)
-   Consistent styling across all components
-   Accessible form labels
-   RTL support for Arabic text
-   Tab navigation in dashboard
-   Smooth transitions and hover effects

### ✅ Dynamic Features

-   Category dropdown auto-populated from API
-   Dynamic link fields (add/remove)
-   Real-time form state management
-   Conditional rendering based on auth state

## Backend API Endpoints Expected

### Admin Endpoints

```
POST /api/admin/register
Body: { username: string, password: string }
Response: { message: string }

POST /api/admin/login
Body: { username: string, password: string }
Response: { token: string, message?: string }
```

### Category Endpoints

```
GET /api/categories
Headers: { Authorization: Bearer <token> }
Response: Array<{ _id: string, title: { en: string, ar: string }, description: { en: string, ar: string } }>

POST /api/categories
Headers: { Authorization: Bearer <token> }
Body: {
  title: { en: string, ar: string },
  description: { en: string, ar: string }
}
Response: { message: string }
```

### Question Endpoints

```
POST /api/questions
Headers: { Authorization: Bearer <token> }
Body: {
  categoryId: string,
  question: { en: string, ar: string },
  answer: { en: string, ar: string },
  links?: string[]
}
Response: { message: string }
```

## Navigation

The `LanguageLevelSelector` component now includes:

-   **Admin Login** button (gray)
-   **Admin Register** button (indigo)

Both buttons are bilingual (English/Arabic) and navigate to the appropriate routes.

## Usage Flow

1. **Register**: Admin navigates to register page and creates account
2. **Login**: Admin logs in with credentials
3. **Token Storage**: JWT token is stored in secure cookies
4. **Dashboard Access**: Admin is redirected to dashboard
5. **Add Category**: Admin can create new categories with bilingual content
6. **Add Question**: Admin can create questions, select category, and add optional links
7. **Logout**: Admin can logout, clearing the token

## Security Notes

-   Authentication token required for all admin operations
-   Token stored in secure cookies with:
    -   **HttpOnly-like behavior** via js-cookie
    -   **Secure flag** enabled in production (HTTPS only)
    -   **SameSite strict** policy to prevent CSRF attacks
    -   **7-day expiration** period
-   Protected routes redirect to login if unauthenticated
-   All API requests include Authorization header
-   Cookies are more secure than localStorage as they're less vulnerable to XSS attacks

## Styling

All components use:

-   TailwindCSS utility classes
-   Consistent color scheme (indigo primary)
-   Rounded, modern design
-   Responsive breakpoints
-   Smooth transitions
-   Accessible focus states

## Future Enhancements

Consider adding:

-   Token refresh mechanism
-   Session timeout handling
-   Edit/delete functionality for categories and questions
-   List view of existing categories and questions
-   Search and filter capabilities
-   Role-based access control
-   Activity logging
-   File upload for images
-   Rich text editor for answers
-   Preview mode before submission
