
# API Documentation

## 1. Accounts APIs

The Account APIs provides endpoints for user management, role management, employee records, and permission management. It uses RESTful principles and requires JWT (JSON Web Token) authentication for secured access to certain endpoints.

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

## Alerts API Endpoints

The Alerts API allows users to manage and investigate alerts generated by the system. It provides endpoints to create, retrieve, update, and delete alerts, as well as manage investigations.

### Alerts

#### 1. **List Alerts**
- **Endpoint:** `GET /api/v1/alerts/`
- **Description:** Retrieves a list of all alerts.
- **Query Parameters:**
  - `severity`: Filter alerts by severity (INFO, LOW, MEDIUM, HIGH, CRITICAL).
  - `rule__name`: Filter alerts by rule name.
- **Response:**
  - **200 OK**: A list of alerts.

#### 2. **Create Alert**
- **Endpoint:** `POST /api/v1/alerts/`
- **Description:** Creates a new alert.
- **Request Body:**
  ```json
  {
    "rule": <Rule ID>,
    "event": <Event ID>,
    "severity": <Severity Level>,
    "comments": "Optional comments"
  }
  ```
- **Response:**
  - **201 Created**: The created alert object.
  - **400 Bad Request**: Invalid input.

#### 3. **Retrieve Alert**
- **Endpoint:** `GET /api/v1/alerts/{id}/`
- **Description:** Retrieves a specific alert by ID.
- **Response:**
  - **200 OK**: The requested alert object.
  - **404 Not Found**: Alert not found.

#### 4. **Update Alert**
- **Endpoint:** `PATCH /api/v1/alerts/{id}/`
- **Description:** Updates a specific alert by ID.
- **Request Body:**
  ```json
  {
    "severity": <New Severity Level>,
    "comments": "Updated comments"
  }
  ```
- **Response:**
  - **200 OK**: The updated alert object.
  - **404 Not Found**: Alert not found.
  
#### 5. **Delete Alert**
- **Endpoint:** `DELETE /api/v1/alerts/{id}/`
- **Description:** Deletes a specific alert by ID.
- **Response:**
  - **204 No Content**: Successfully deleted.
  - **404 Not Found**: Alert not found.

#### 6. **Assign Alert**
- **Endpoint:** `POST /api/v1/alerts/{id}/assign/`
- **Description:** Assigns an alert to an investigator.
- **Request Body:**
  ```json
  {
    "assigned_to": <User ID>
  }
  ```
- **Response:**
  - **201 Created**: Alert assigned successfully.
  - **400 Bad Request**: No analyst ID provided.
  - **404 Not Found**: Analyst not found.

#### 7. **Latest Alerts**
- **Endpoint:** `GET /api/v1/alerts/latest_alerts/`
- **Description:** Retrieves the latest 4 alerts.
- **Response:**
  - **200 OK**: A list of the latest alerts.

### Investigate Alerts

#### 1. **List Investigate Alerts**
- **Endpoint:** `GET /api/v1/investigate/`
- **Description:** Retrieves a list of investigation alerts.
- **Query Parameters:**
  - `assigned_to__email`: Filter investigations by assigned analyst's email.
  - `alert__severity`: Filter investigations by alert severity.
  - `status`: Filter investigations by status (OPEN, IN PROGRESS, CLOSED).
- **Response:**
  - **200 OK**: A list of investigation alerts.

#### 2. **Create Investigate Alert**
- **Endpoint:** `POST /api/v1/investigate/`
- **Description:** Creates a new investigation alert.
- **Request Body:**
  ```json
  {
    "alert": <Alert ID>,
    "assigned_to": <User ID>,
    "notes": "Optional notes"
  }
  ```
- **Response:**
  - **201 Created**: The created investigation alert object.
  - **400 Bad Request**: Invalid input.

#### 3. **Retrieve Investigate Alert**
- **Endpoint:** `GET /api/v1/investigate/{id}/`
- **Description:** Retrieves a specific investigation alert by ID.
- **Response:**
  - **200 OK**: The requested investigation alert object.
  - **404 Not Found**: Investigation alert not found.

#### 4. **Update Investigation Alert**
- **Endpoint:** `PATCH /api/v1/investigate/{id}/update_investigation/`
- **Description:** Updates the investigation alert.
- **Request Body:**
  ```json
  {
    "status": <New Status>,
    "notes": "Updated notes"
  }
  ```
- **Response:**
  - **200 OK**: The updated investigation alert object.
  - **403 Forbidden**: User does not have permission to update.
  - **404 Not Found**: Investigation alert not found.

#### 5. **Investigation Status Count**
- **Endpoint:** `GET /api/v1/investigate/investigation_status_count/`
- **Description:** Retrieves counts of investigations by status (CLOSED, OPEN, IN PROGRESS).
- **Response:**
  - **200 OK**: A count of investigations per status.

#### 6. **Open Investigations**
- **Endpoint:** `GET /api/v1/investigate/open_investigations/`
- **Description:** Fetches open investigations for a specific user or all users (for ADMIN).
- **Response:**
  - **200 OK**: A list of open investigations.
  - **403 Forbidden**: Unauthorized access.

## Models

### Alert
- `id`: Integer (primary key)
- `rule`: ForeignKey to `Rule`
- `event`: ForeignKey to `BronzeEventData`
- `severity`: String (choices: INFO, LOW, MEDIUM, HIGH, CRITICAL)
- `comments`: TextField (optional)

### InvestigateAlert
- `id`: Integer (primary key)
- `alert`: OneToOneField to `Alert`
- `assigned_to`: ForeignKey to `User`
- `status`: String (choices: OPEN, IN PROGRESS, CLOSED)
- `notes`: TextField (optional)

## Status Codes
- `200 OK`: Successful requests.
- `201 Created`: Resource successfully created.
- `204 No Content`: Resource successfully deleted.
- `400 Bad Request`: Invalid input or missing required fields.
- `403 Forbidden`: Access denied.
- `404 Not Found`: Resource not found.

### Core Endpoints

### 1. **List All Rules**
   - **Endpoint**: `/api/v1/rules/`
   - **Method**: `GET`
   - **Description**: Fetch a list of all rules defined in the system.
   - **Response**:
     - **200 OK**: Returns a list of rules.
     - **Example**:
       ```json
       [
         {
           "id": 1,
           "name": "Login Failure Alert",
           "description": "Trigger on 5 failed login attempts",
           "conditions": "Failed logins > 5",
           "severity": "HIGH"
         }
       ]
       ```

### 2. **Retrieve a Single Rule**
   - **Endpoint**: `/api/v1/rules/{id}/`
   - **Method**: `GET`
   - **Description**: Fetch details of a specific rule by ID.
   - **Response**:
     - **200 OK**: Returns details of the rule.
     - **404 Not Found**: Rule not found.
     - **Example**:
       ```json
       {
         "id": 1,
         "name": "Login Failure Alert",
         "description": "Trigger on 5 failed login attempts",
         "conditions": "Failed logins > 5",
         "severity": "HIGH"
       }
       ```

### 3. **Create a New Rule**
   - **Endpoint**: `/api/v1/rules/`
   - **Method**: `POST`
   - **Description**: Create a new rule by providing the necessary data.
   - **Request Body**:
     - **Example**:
       ```json
       {
         "name": "File Deletion Alert",
         "description": "Trigger on mass file deletions",
         "conditions": "Files deleted > 10",
         "severity": "CRITICAL"
       }
       ```
   - **Response**:
     - **201 Created**: Rule successfully created.
     - **400 Bad Request**: Validation error.
     - **Example**:
       ```json
       {
         "id": 2,
         "name": "File Deletion Alert",
         "description": "Trigger on mass file deletions",
         "conditions": "Files deleted > 10",
         "severity": "CRITICAL"
       }
       ```

### 4. **Update an Existing Rule**
   - **Endpoint**: `/api/v1/rules/{id}/`
   - **Method**: `PUT`
   - **Description**: Update the details of a specific rule.
   - **Request Body**:
     - **Example**:
       ```json
       {
         "name": "Updated Rule Name",
         "description": "Updated rule description",
         "conditions": "Updated conditions",
         "severity": "MEDIUM"
       }
       ```
   - **Response**:
     - **200 OK**: Rule successfully updated.
     - **404 Not Found**: Rule not found.
     - **400 Bad Request**: Validation error.

### 5. **Delete a Rule**
   - **Endpoint**: `/api/v1/rules/{id}/`
   - **Method**: `DELETE`
   - **Description**: Delete a specific rule by ID.
   - **Response**:
     - **204 No Content**: Rule successfully deleted.
     - **404 Not Found**: Rule not found.

## Models

### Rule Model
Represents the structure of a rule.

- **id**: Primary key, auto-incremented integer.
- **name**: A descriptive name for the rule.
- **description**: A short description explaining the rule.
- **conditions**: The conditions that trigger the rule, stored as text.
- **severity**: The severity level of the rule (choices: `INFO`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).

Example:
```json
{
  "id": 1,
  "name": "Login Failure Alert",
  "description": "Trigger on 5 failed login attempts",
  "conditions": "Failed logins > 5",
  "severity": "HIGH"
}
