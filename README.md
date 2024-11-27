
# TaskMaster

TaskMaster is a portfolio project by **Max Gertzen**. This is a simple to-do list application that demonstrates the ability to organize tasks within various lists.

## Table of Contents
- [Features](#features)
- [Built With](#built-with)
- [Getting Started](#getting-started)
   - [Running with Docker](#running-with-docker)
   - [Running locally](#running-locally)

## Features

- **Add, Remove, Edit, Reorder (Drag & Drop) Lists**: Organize tasks into various lists.
- **Add, Remove, Edit, Reorder (Drag & Drop) Tasks**: Manage tasks within each list.
- **Search Tasks**: Live search of all your tasks.
- **Bulk Actions**: Remove all or completed tasks from list; "Complete" all tasks from list;
- **Task Views**: Filter task view based on "completed", "active" and "all"; Sort alphabetically ("Desc" & "Asc").

## Built With

### FE
- **React**
- **Vite**
- **TypeScript**
- **Emotion**
- **Auth0 2.0**
- **React Router**
- **React Query**
- **Zustand**
- **@hello-pangea/dnd**

### BE
- **Node.js**
- **Express**
- **Redis**
- **Auth0 2.0**
- **TypeScript**

## Getting Started

### Running with Docker

You can run the entire TaskMaster application, including the frontend, backend, and Redis database, using Docker and Docker Compose.

#### Prerequisites

Ensure you have the following installed:
- **Docker** (v20+ recommended)
- **Docker Compose** (v2.9+ recommended)

#### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/maxgertzen/taskmaster.git
   cd taskmaster
   ```

2. Build and start the Docker containers:

   ```bash
   docker-compose up --build
   ```

3. Open your browser and navigate to [http://localhost:3001](http://localhost:3001) to view the application.

4. The backend API will be accessible at [http://localhost:3000](http://localhost:3000).

#### Configuration

- **Environment Variables**:
  - The Docker Compose setup uses `.env.development` file for configuration.
  - Ensure `.env.development` exists in both the `client` and `backend` directories for development configuration.

- **VITE_USE_MOCK**:
  - For security reasons, configuration data for Auth0 was omitted and mocked login was made.
  - This means the login/logout functionality is disabled and you'd be considered "logged in".

#### Clean Up

To stop the containers and remove all volumes and images:

```bash
docker-compose down --volumes --rmi all
```

#### Notes

- The frontend is served on [http://localhost:3001](http://localhost:3001) via `vite preview` inside the Docker container.
- The Redis database uses the `redis/redis-stack:latest` image, which supports RedisJSON and RedisSearch functionalities.
- The backend runs on [http://localhost:3000](http://localhost:3000) and provides the REST API.
- If for any reason you need to update ports, please do so via the *docker-compose.yml*, in the ports section - 3000 & 3001 for BE & FE respectively

### Running locally

#### Prerequisites

Make sure you have **Node.js** and **npm** installed.

#### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/maxgertzen/taskmaster.git
   cd taskmaster
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and go to [http://localhost:5173](http://localhost:5173) to view the app.

#### Scripts

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the app for production.
- **`npm run preview`**: Previews the production build.
- **`npm run lint`**: Runs ESLint for code linting.