# Contributing to SIEM Project

Thank you for your interest in contributing to our SIEM (Security Information and Event Management) project. This document provides guidelines for contributing to the project and instructions for setting up your development environment.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Submitting Changes](#submitting-changes)
6. [Reporting Bugs](#reporting-bugs)

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct. Please report unacceptable behavior to [project_email@example.com].

## Getting Started

### Prerequisites

- Git
- Docker and Docker Compose
- Python 3.9+
- Node.js 14+

### Setting Up Your Development Environment

1. Clone the repository:

   ```
   gh repo clone kylerobertson84/i14-ssiem
   cd i14-ssiem
   ```

2. Create a new branch for your feature or bug fix:

   ```
   git checkout -b feature/your-feature-name
   ```

3. Set up the development environment:

   ```
   ./scripts/setup_dev_environment.sh
   ```

4. Start the application:
   ```
   docker-compose up
   ```

The application should now be running at `http://localhost:3000` (frontend) and `http://localhost:8000` (backend API).

## Development Workflow

1. Ensure you're working on the latest version of the `develop` branch:

   ```
   git checkout develop
   git pull origin develop
   ```

2. Create a new branch for your feature or bug fix:

   ```
   git checkout -b feature/your-feature-name
   ```

3. Make your changes, committing frequently with clear, concise commit messages.

4. Write or update tests for your changes.

5. Ensure all tests pass:

   ```
   docker-compose run backend python manage.py test
   docker-compose run frontend npm test
   ```

6. Push your branch to GitHub:

   ```
   git push origin feature/your-feature-name
   ```

7. Create a pull request against the `develop` branch.

## Coding Standards

- For Python code, follow PEP 8 style guide.
- For JavaScript code, follow the Airbnb JavaScript Style Guide.
- Use meaningful variable and function names.
- Write clear comments and docstrings.
- Maintain test coverage for new code.

## Submitting Changes

1. Ensure your code adheres to the project's coding standards.
2. Update documentation if you're changing any user-facing features.
3. Include tests that cover your changes.
4. Create a pull request with a clear title and description.
5. Link any relevant issues in your pull request description.

## Reporting Bugs

When reporting bugs, please include:

- A clear and descriptive title
- A detailed description of the issue
- Steps to reproduce the problem
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Your environment details (OS, browser version, etc.)

Thank you for contributing to our SIEM project!
