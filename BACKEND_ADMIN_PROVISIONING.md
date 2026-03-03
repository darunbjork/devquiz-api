# Backend Feature: Initial Admin User Provisioning

## Subject: Mechanism for First Admin User Creation

Hello Frontend Team,

This document describes the implementation of a critical feature that addresses the "First Admin" dilemma, ensuring a clear path for provisioning the initial administrative user in the system.

---

### Problem Addressed: "The First Admin" Dilemma

Previously, there was no straightforward way to create the very first admin user in the system. Regular registrations default to the 'user' role, and promoting users to 'admin' required an existing admin account. This created a "chicken-and-egg" problem, hindering development, testing, and initial production setup.

---

### Solution Implemented: Initial Admin Provisioning Script

We have implemented a standalone script, `scripts/createInitialAdmin.ts`, which can be executed once during application setup or deployment to create an initial administrative user. This approach keeps initial provisioning separate from regular user registration API endpoints.

**Key Features of the Script:**
*   **Standalone:** It's an out-of-band operation, not part of the regular API.
*   **Secure:** Credentials are passed via command-line arguments, suitable for CLI or deployment pipelines.
*   **Idempotent:** It checks if an admin user already exists (either with the provided email or any admin) to prevent duplicate admin accounts if run multiple times. If an admin already exists, the script will exit without creating a new one.
*   **Password Hashing:** Passwords are hashed consistently with how standard user passwords are handled.

---

### How to Use the Script

To create your initial admin user, navigate to the project's root directory in your terminal and run the following command, replacing the placeholder values with your desired credentials:

```bash
bun run create-admin --username "SuperAdmin" --email "admin@example.com" --password "securepassword123"
```

**Parameters:**
*   `--username`: The desired username for the admin.
*   `--email`: The email address for the admin (this will be their login email).
*   `--password`: The password for the admin.

**Example Output (Success):**
```
Successfully created initial admin user: SuperAdmin (admin@example.com) with ID: [MongoDB ObjectId]
```

**Example Output (Admin already exists):**
```
An admin user already exists in the database. Cannot create another initial admin.
If you need to create more admin users, please use the admin panel.
```

---

### Expected Outcome

After successfully running this script:
1.  An admin user with the specified `username`, `email`, and `password` will be created in the database with the `role: 'admin'`.
2.  This provisioned admin can then log in to the application.
3.  Upon logging in, this admin user will be able to access the frontend's `/admin` panel (if implemented) due to their `role: 'admin'` property, which is now correctly returned by the `/api/auth/me` endpoint.
4.  This initial admin can then use the `PUT /api/admin/users/:userId/role` functionality (which you can expose via the frontend UI) to promote or demote other registered users as needed.

---

Please let us know if you have any questions or require further clarification regarding this provisioning mechanism.

Thanks,
Backend Team
