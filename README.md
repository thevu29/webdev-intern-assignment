# Webdev-Intern-Assignment

## Deploy
https://webdev-intern-assignment-eta.vercel.app/

## Setup Instructions for Running Locally

### Backend (NodeJS, ExpressJS)

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
