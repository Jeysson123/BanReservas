# 🚀 BanReservas

Welcome to **BanReservas**! This project is designed to be a **Product and Inventory Management System**. It leverages cutting-edge technologies to provide a scalable and efficient solution! 🎉

## 📦 Modules

### 1. **User Module** 👤
   - **Description**: Manages user authentication and authorization.
   - **Key Features**:
     - User creation, update, and deletion (CRUD)
     - Token generation for authentication using JWT
     - Secure login and session management

### 2. **Product Module** 📦
   - **Description**: Handles product management and integrates with Kafka for event-driven communication.
   - **Key Features**:
     - Product creation, update, and deletion (CRUD)
     - Kafka producer for product-related events
     
### 3. **Inventory Module** 📊
   - **Description**: Manages inventory operations and integrates with Kafka and Redis for real-time data handling.
   - **Key Features**:
     - Inventory creation, update, and deletion (CRUD)
     - Kafka consumer for processing product updates
     - Redis caching for efficient data retrieval

---

## 🚀 Versions & Technologies Used

### **Backend** (NestJS)
- **Libraries & Tools:**
  - NestJS
  - TypeScript
  - JWT
  - KafkaJS
  - Redis
  - TypeORM
  - MySQL
  - Axios
  - Docker

---

## 🛠️ Installation & Setup

### 1. Clone the repository:

   ```bash
   git clone https://github.com/Jeysson123/BanReservas.git
   cd BanReservas
   ```

### 2. Install dependencies:

   - Open the project with **VS Code** or another preferred editor
   - Install dependencies:

   ```bash
   npm install
   ```

### 3. Run the application:

   - Start the NestJS server:

   ```bash
   npm start
   ```

### 4. Run with Docker:

   - Start the **BanReservas** container via **Docker Desktop**

   ```bash
   docker compose up --build
   ```  

---

Workflow Diagram : https://lucid.app/lucidchart/b696c5a2-7eda-4fb0-bd38-d6226b493e61/edit?invitationId=inv_b75c7844-0724-4ebf-8baa-f3ac4db21255&page=0_0#


🚀 Happy Coding! 🎉

