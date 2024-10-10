
# API Documentation

## 1. Introduction

This API provides endpoints for user management, role management, employee records, and permission management. It uses RESTful principles and requires JWT (JSON Web Token) authentication for secured access to certain endpoints.

---

## 2. Authentication

### Obtain JWT Token
- **URL:** `/api/v1/accounts/token/`
- **Method:** `POST`
- **Description:** Obtain a JWT access token by providing valid user credentials.
  
  **Request:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

  **Response:**
  ```json
  {
    "refresh": "jwt-refresh-token",
    "access": "jwt-access-token"
  }
  ```

### Refresh JWT Token
- **URL:** `/api/v1/accounts/token/refresh/`
- **Method:** `POST`
- **Description:** Refresh the access token using a valid refresh token.
  
  **Request:**
  ```json
  {
    "refresh": "jwt-refresh-token"
  }
  ```

  **Response:**
  ```json
  {
    "access": "new-jwt-access-token"
  }
  ```

---

## 3. API Endpoints

### Accounts API

#### User Management

- **List Users**
  - **URL:** `/api/v1/accounts/users/`
  - **Method:** `GET`
  - **Description:** Retrieve a list of all users.
  - **Response:**
    ```json
    [
      {
        "user_id": "uuid",
        "email": "user@example.com",
        "role": {
          "role_id": "uuid",
          "name": "Admin",
          "permissions": [
            {"permission_id": "uuid", "permission_name": "Can view users"}
          ]
        },
        "is_active": true,
        "is_staff": false
      },
      ...
    ]
    ```

- **Create User**
  - **URL:** `/api/v1/accounts/users/`
  - **Method:** `POST`
  - **Description:** Create a new user.
  - **Request:**
    ```json
    {
      "email": "user2@example.com",
      "password": "password123",
      "role_id": "uuid"
    }
    ```

  - **Response:**
    ```json
    {
      "user_id": "uuid",
      "email": "user2@example.com",
      "role": {
        "role_id": "uuid",
        "name": "Analyst"
      },
      "is_active": true,
      "is_staff": false
    }
    ```

- **Retrieve User**
  - **URL:** `/api/v1/accounts/users/{user_id}/`
  - **Method:** `GET`
  - **Description:** Get details of a specific user by their ID.
  - **Response:**
    ```json
    {
      "user_id": "uuid",
      "email": "user@example.com",
      "role": {
        "role_id": "uuid",
        "name": "Admin"
      },
      "is_active": true,
      "is_staff": false
    }
    ```

- **Update User**
  - **URL:** `/api/v1/accounts/users/{user_id}/`
  - **Method:** `PUT`
  - **Description:** Update an existing user's details.
  - **Request:**
    ```json
    {
      "email": "updated_user@example.com",
      "role_id": "uuid",
      "is_active": false
    }
    ```

  - **Response:**
    ```json
    {
      "user_id": "uuid",
      "email": "updated_user@example.com",
      "role": {
        "role_id": "uuid",
        "name": "Admin"
      },
      "is_active": false,
      "is_staff": false
    }
    ```

- **Delete User**
  - **URL:** `/api/v1/accounts/users/{user_id}/`
  - **Method:** `DELETE`
  - **Description:** Delete a user.
  - **Response:**
    ```json
    {
      "message": "User deleted successfully"
    }
    ```

#### Role Management

- **List Roles**
  - **URL:** `/api/v1/accounts/roles/`
  - **Method:** `GET`
  - **Description:** Retrieve a list of all roles.
  - **Response:**
    ```json
    [
      {
        "role_id": "uuid",
        "name": "Admin",
        "permissions": [
          {"permission_id": "uuid", "permission_name": "Can view users"}
        ]
      },
      ...
    ]
    ```

- **Create Role**
  - **URL:** `/api/v1/accounts/roles/`
  - **Method:** `POST`
  - **Description:** Create a new role.
  - **Request:**
    ```json
    {
      "name": "Editor"
    }
    ```

  - **Response:**
    ```json
    {
      "role_id": "uuid",
      "name": "Editor",
      "permissions": []
    }
    ```

- **Retrieve Role**
  - **URL:** `/api/v1/accounts/roles/{role_id}/`
  - **Method:** `GET`
  - **Description:** Retrieve a specific role by ID.
  - **Response:**
    ```json
    {
      "role_id": "uuid",
      "name": "Admin",
      "permissions": [
        {"permission_id": "uuid", "permission_name": "Can view users"}
      ]
    }
    ```

- **Update Role**
  - **URL:** `/api/v1/accounts/roles/{role_id}/`
  - **Method:** `PUT`
  - **Description:** Update an existing role.
  - **Request:**
    ```json
    {
      "name": "Moderator"
    }
    ```

  - **Response:**
    ```json
    {
      "role_id": "uuid",
      "name": "Moderator",
      "permissions": []
    }
    ```

- **Delete Role**
  - **URL:** `/api/v1/accounts/roles/{role_id}/`
  - **Method:** `DELETE`
  - **Description:** Delete a role.
  - **Response:**
    ```json
    {
      "message": "Role deleted successfully"
    }
    ```

#### Permission Management

- **List Permissions**
  - **URL:** `/api/v1/accounts/permissions/`
  - **Method:** `GET`
  - **Description:** Retrieve a list of all permissions.
  - **Response:**
    ```json
    [
      {
        "permission_id": "uuid",
        "permission_name": "Can view users"
      },
      ...
    ]
    ```

- **Create Permission**
  - **URL:** `/api/v1/accounts/permissions/`
  - **Method:** `POST`
  - **Description:** Create a new permission.
  - **Request:**
    ```json
    {
      "permission_name": "Can edit users"
    }
    ```

  - **Response:**
    ```json
    {
      "permission_id": "uuid",
      "permission_name": "Can edit users"
    }
    ```

#### Role-Permission Management

- **List Role-Permissions**
  - **URL:** `/api/v1/accounts/role-permissions/`
  - **Method:** `GET`
  - **Description:** Retrieve all role-permission relationships.
  - **Response:**
    ```json
    [
      {
        "role": {
          "role_id": "uuid",
          "name": "Admin"
        },
        "permission": {
          "permission_id": "uuid",
          "permission_name": "Can view users"
        }
      },
      ...
    ]
    ```

- **Assign Permissions to Role**
  - **URL:** `/api/v1/accounts/role-permissions/`
  - **Method:** `POST`
  - **Description:** Assign a permission to a role.
  - **Request:**
    ```json
    {
      "role": "uuid",
      "permission": "uuid"
    }
    ```

  - **Response:**
    ```json
    {
      "message": "Permission assigned to role"
    }
    ```

---

## 4. Additional Information

### Error Handling
All endpoints return standardized error messages in the following format:
```json
{
  "error": "Error description"
}
```

### Authentication Requirements
Most endpoints require authentication using JWT tokens. Ensure to include the token in the `Authorization` header as follows:
```
Authorization: Bearer <your_jwt_token>
```

---