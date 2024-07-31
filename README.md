# SIEM Project

Welcome to our Security Information and Event Management (SIEM) project. This README provides an overview of the project and instructions for setting it up on your local machine.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Running the Application](#running-the-application)
5. [Running Tests](#running-tests)
6. [Project Structure](#project-structure)
7. [Contributing](#contributing)
8. [License](#license)

## Project Overview

This SIEM project is designed to collect, process, and analyze security event logs from various sources. It provides a user-friendly interface for security analysts to monitor and respond to potential security threats.

Key features include:
- Log ingestion and normalization
- Real-time alerting based on predefined rules
- Interactive dashboard for threat visualization
- Detailed reporting capabilities

## Prerequisites
> [!IMPORTANT]
> Before you begin, ensure you have the following installed on your system:

- [Git](https://git-scm.com/downloads)
- [Docker](https://docs.docker.com/get-docker/)
- Docker Compose (this will be installed with above)
- [Python](https://www.python.org/downloads/) (version 3.9 or later)
- [Node.js](https://nodejs.org/en/download/prebuilt-installer/current) (get LTS ones)

## Installation

1. Clone the repository:
   ```
   gh repo clone kylerobertson84/i14-ssiem
   cd i14-ssiem
   ```

2. Set up the development environment:
> [!IMPORTANT]
> Make sure your [Docker Hub](https://docs.docker.com/get-docker/) is running in the background.
   ```
   ./scripts/setup_dev_environment.sh
   ```

This script will:
- Create necessary Docker volumes
- Build Docker images for the backend, frontend, and database
- Install dependencies for both backend and frontend

## Running the Application

To start the application, run:

```
docker-compose up
```

This will start all services defined in the `docker-compose.yml` file.

- The frontend will be available at `http://localhost:3000`
- The backend API will be available at `http://localhost:8000`
- The database will be running on its default port

To stop the application, press `Ctrl+C` in the terminal where docker-compose is running.

## Running Tests

To run backend tests:
```
docker-compose run backend python manage.py test
```

To run frontend tests:
```
docker-compose run frontend npm test
```

## Project Structure

```
i14-ssiem/
├── backend/         # Django backend
├── frontend/        # React frontend
├── database/        # Database configuration and init scripts
├── docs/            # Project documentation
├── scripts/         # Utility scripts
├── tests/           # Integration and E2E tests
└── docker-compose.yml
```

For more detailed information about the project structure, refer to the `docs/developer_guide.md`.

## Contributing

We welcome contributions to the SIEM project! Please see our [Contributing Guide](CONTRIBUTING.md) for more details on how to get started.

## License

This project is licensed under the [MIT License](LICENSE).
