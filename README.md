# Green Community Docker Deployment

This project is set up for easy deployment using Docker. Follow the instructions below to get started.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed on your system.
- [Docker Compose](https://docs.docker.com/compose/install/) installed on your system.

## Getting Started

1.  **Clone the repository**

    ```bash
    git clone https://github.com/your-username/green-community.git
    cd green-community
    ```

2.  **Environment Configuration**

    The application uses the existing `.env` file located in the `Server/.env` directory. This file contains your MongoDB Atlas connection string, JWT secrets, and other configuration values.

    Make sure your `Server/.env` file has all the necessary environment variables configured for your application to run properly.

3.  **Run the deployment script**

    Two deployment scripts are provided:

    -   `deploy.sh` for Linux and macOS
    -   `deploy.ps1` for Windows PowerShell

    Choose the script that matches your operating system and run it from the root of the project:

    **For Linux and macOS:**

    ```bash
    chmod +x deploy.sh
    ./deploy.sh
    ```

    **For Windows PowerShell:**

    ```powershell
    ./deploy.ps1
    ```

    The script will:

    -   Check for Docker and Docker Compose.
    -   Verify your existing Server/.env file exists.
    -   Build the Docker images.
    -   Start all the services in the background.
    -   Show you the status of the running containers.

## Accessing the Application

-   **Client (Frontend):** [http://localhost:3000](http://localhost:3000)
-   **Server (Backend API):** [http://localhost:5000](http://localhost:5000)
-   **MongoDB:** `mongodb://localhost:27017`

## Managing the Application

-   **View logs:**

    ```bash
    docker-compose logs -f
    ```

-   **Stop the application:**

    ```bash
    docker-compose down
    ```

-   **Restart the application:**

    ```bash
    docker-compose restart
    ```

## Additional Notes

-   The `docker-compose.yml` file is configured to use a local MongoDB instance running in a Docker container. If you prefer to use an external MongoDB service, you can update the `MONGO_URI` in your `.env` file.

-   The client application is configured to proxy API requests to the server, so you can make requests to `/api` on the same domain as the client.

