# Backend Changes for Frontend Integration

## Subject: User Role and Admin User Management Updates

Hello Frontend Team,

This document outlines recent backend changes related to user roles and the new admin user management functionality. These updates are crucial for the proper functioning of the admin panel and role-based access control.

---

### 1. User Role Included in `/api/auth/me` Endpoint

**Issue Addressed:**
The `role` property was missing from the user object returned by the `/api/auth/me` endpoint, preventing the frontend's admin panel access logic from functioning correctly.

**Change:**
The `getMe` function in `services/auth.ts` has been modified to explicitly include the `role` property in the returned user object.

**Expected `/api/auth/me` Response Example:**
```json
{
  "id": "someUserId",
  "username": "Darunbfds",
  "email": "Darunbfds@gmail.com",
  "role": "user", // or "admin"
  "quizzes": [...],
  "createdQuizzes": [...],
  "settings": { "theme": "light" }
}
```

**Verification:**
After logging in, inspect the network response from `GET /api/auth/me`. The `user` object should now contain the `role` property.

---

### 2. New Admin User Listing Endpoint

**Purpose:**
To allow administrators to view a list of all registered users for management purposes.

**Endpoint:**
`GET /api/admin/users`

**Authentication:**
This endpoint requires an authenticated user with an `admin` role. Access by non-admin users will result in an authorization error.

**Expected Response:**
An array of user objects. Each user object will include basic user details and their `role`.

```json
[
  {
    "id": "userId1",
    "username": "userOne",
    "email": "user1@example.com",
    "role": "user"
  },
  {
    "id": "adminId1",
    "username": "adminUser",
    "email": "admin@example.com",
    "role": "admin"
  },
  // ... more users
]
```

**Frontend Integration Notes:**
*   You can fetch this list in your admin panel to display all users.
*   Remember to send the JWT in the `Authorization` header.

---

### 3. Existing User Role Update Endpoint

**Purpose:**
To allow an administrator to change the role of any user. This endpoint was already available but is highlighted here for convenience.

**Endpoint:**
`PUT /api/admin/users/:userId/role`

**Authentication:**
This endpoint requires an authenticated user with an `admin` role.

**Request Body Example:**
To change a user's role to 'admin':
```json
{
  "role": "admin"
}
```
To change a user's role to 'user':
```json
{
  "role": "user"
}
```

**Frontend Integration Notes:**
*   When an admin wishes to change a user's role, send a `PUT` request to this endpoint with the target `userId` in the path and the new `role` in the request body.

---

### 4. User Deletion Endpoint with Cascade

**Purpose:**
To allow administrators to permanently remove a user and all their associated data from the system. This includes all quizzes created by the user, all quiz attempts made by the user, and all notes written by the user.

**Endpoint:**
`DELETE /api/admin/users/:userId`

**Authentication:**
This endpoint requires an authenticated user with an `admin` role.

**Expected Response:**
`{ message: 'User deleted successfully' }`

**Frontend Integration Notes:**
*   This endpoint should be used with caution as it performs a permanent deletion of a user and all their related content.
*   Consider implementing a confirmation step in the frontend UI before sending this request.

---

### Overview of Relevant Authentication & User Management Routes:

| Method | Endpoint                       | Description                                   | Authentication           |
| :----- | :----------------------------- | :-------------------------------------------- | :----------------------- |
| `POST` | `/api/auth/register`           | Register a new user                           | None                     |
| `POST` | `/api/auth/login`              | Log in an existing user                       | None                     |
| `GET`  | `/api/auth/profile`            | Get authenticated user's full profile         | `fastify.authenticate`   |
| `GET`  | `/api/auth/me`                 | Get basic authenticated user data (now with `role`)| `fastify.authenticate`   |
| `PATCH`| `/api/auth/profile`            | Update authenticated user's profile settings  | `fastify.authenticate`   |
| `GET`  | `/api/admin/users`             | **NEW:** Get all users for admin management   | `fastify.authenticate`, `fastify.adminAuthenticate` |
| `PUT`  | `/api/admin/users/:userId/role`| Update a specific user's role                 | `fastify.authenticate`, `fastify.adminAuthenticate` |
| `DELETE`| `/api/admin/users/:userId`     | **NEW:** Delete a user and associated data    | `fastify.authenticate`, `fastify.adminAuthenticate` |

---

Please reach out if you have any questions or require further assistance with integration.

Thanks,
Backend Team
