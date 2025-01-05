# E-Commerce Backend

This repository contains the server-side code for my E-commerce Project. The project is built using **NestJS** with **TypeScript** and utilizes **PostgreSQL** as the database, with **Sequelize** as the ORM for database interaction. 

### ⚠️ **In Progress**  
This project is still in progress and is not yet completed. I plan to scale it further in the future.

## Technologies

1. NestJS (Backend framework)
2. TypeScript
3. PostgreSQL (Database)
4. Sequelize (ORM)
5. Cloudinary (Image storage)

## Features

This backend currently includes the following core features:

- **Admins Management**: CRUD functionality for managing admins.
- **Authentication (Auth)**: User authentication mechanism.
- **Brands Management**: CRUD operations for managing brands, which will be associated with products.
- **Product Management**: Complete CRUD for handling products and their dynamic variants (e.g., RAM size, SSD size).
- **Permissions Management**: Handles roles and permissions assignments.
- **Role Management**: Allows management of different user roles and their respective permissions.
- **Admins Management**: Provides management of administrator accounts and their access.

These features have been implemented with scalability and maintainability in mind. The system is designed to be **100% scalable**, with the ability to grow over time.

## Database

The backend uses **PostgreSQL** as the database, and **Sequelize** ORM is used for data management.

## Seeder

A **Seeder** has been implemented to populate the database with initial data for:

- **Permissions** 
- **Roles**
- **Admins**
- **Brands**
- **Products**
- **Product Variants**

## Product and Variants Structure

Products are divided into two main parts:

1. **Product (Static data)**: This contains the main product details that remain unchanged.
2. **Product Variants (Dynamic fields)**: This includes dynamic fields like RAM size, SSD size, etc. Products can have multiple variants with different attributes.

Both the product and its variants are fully **CRUD**-enabled, allowing seamless addition, update, and deletion of products and variants.

## Role-Based Access Control

A complete **Role-Based Access Control (RBAC)** mechanism is implemented to manage user roles and their permissions. This system restricts access to certain parts of the application based on the user's role.

## Image Storage

Images for products and variants are stored using **Cloudinary**.

## Code Organization

The code is organized in a modular way for easy scalability and maintainability. It follows a clean architecture, with separate folders for each feature such as:

- **Auth**: Authentication-related logic.
- **Admins**: Admin management functionalities.
- **Brands**: CRUD operations for brands.
- **Products**: CRUD operations for products and variants.
- **Roles**: Management of user roles and their permissions.

## Future Plans

This project is built with a vision to scale gradually, adding more features and improvements as required.

## Installation

1. Clone this repository.

```bash
git clone https://github.com/muzair237/e-commerce-backend.git
```

2. Install dependencies.

```bash
npm install
```

3. Create a .env file in the root directory and configure your PostgreSQL database connection in the .env file as shown below.

```bash
PORT = 4008
ALLOWED_ORIGINS = 'http://localhost:3002'

# DATABASE
DATABASE_URI = 'postgres://postgres:1234@localhost:5432/e-commerce' # Replace it with your database connection URI

# ADMIN
ADMIN_EMAIL = 'admin@e.com'
ADMIN_PASSWORD = 'P@ssword1'

# CLOUDINARY
CLOUD_NAME = 'your-cloud-name'
API_KEY = "your-api-key"
API_SECRET = "your-api-secret"

# JWT SECRET
JWT_SECRET = 'your-jwt-secret'
```

4. Run the application.
```bash
npm run start:dev
```

5. Execute the following API's to populate the initial data.
```bash
1. http://localhost:4008/api/seeder/seed-pra
2. http://localhost:4008/api/seeder/seed-bpv
```

Thank you for checking out the project.