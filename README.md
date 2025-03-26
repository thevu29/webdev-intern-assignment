# Webdev-Intern-Assignment

## Introduction

This is an assignment for web development interns. The project is designed to assess fundamental web development skills, including frontend and backend development.

## Technologies Used

- **Frontend:** React, TailwindCSS, Mantine
- **Backend:** NodeJS, Express
- **Database:** PostgreSQL

## Deploy
https://webdev-intern-assignment-eta.vercel.app/

## Installation and Running the Project

### Clone the Repository

```sh
git clone https://github.com/thevu29/webdev-intern-assignment.git
cd webdev-intern-assignment
```

### Backend (NodeJS, Express)

1. Navigate to the `be` directory:
    ```sh
    cd be
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Build and run the Docker containers:
    ```sh
    docker-compose up --build
    ```

### Frontend (ReactJS/Typescript)

1. Navigate to the `fe` directory:
    ```sh
    cd fe
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Run the React development server:
    ```sh
    npm run dev
    ```
4. If you run locally, comment `baseURL: "https://webdev-intern-assignment-ccvd.onrender.com/api"`, and uncomment `baseURL: "http://localhost:8080/api"` in `fe/src/utils/axiosCustom.ts` 
