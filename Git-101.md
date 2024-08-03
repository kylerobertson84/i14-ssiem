# Basic Git Workflow Commands and Notes

This document outlines the Git workflow and branching strategy for our I14 - SIEMS. The workflow is designed to ensure smooth collaboration, organised code management, and stable production releases.
#### Branches

1. **Main Branch (`main`):**
   - **Purpose:** This branch is reserved for production-ready code. It reflects the current state of the production environment.
   - **Usage:** Only merge code into `main` when it is thoroughly tested and approved for release.

2. **Development Branch (`develop`):**
   - **Purpose:** This branch is used for integrating feature development and bug fixes before they are merged into `main`.
   - **Usage:** Merge feature branches into `develop` for testing and integration purposes.

3. **Feature Branches:**
   - **Purpose:** Each team member creates a feature branch to work on new features, improvements, or bug fixes.
   - **Naming Convention:** Use descriptive names for feature branches. For example, `feature/your-feature-name` or `bugfix/your-bug-description`.
   - **Usage:** Work on your feature or fix in this branch and merge it into `develop` when the work is complete and tested.

#### Workflow Steps (Common)

1. **Creating a Feature Branch:**
   - **Step 1:** Ensure you have the latest changes from the `develop` branch.
     ```bash
     git checkout develop
     git pull origin develop
     ```
   - **Step 2:** Create a new feature branch from `develop`.
     ```bash
     git checkout -b feature/your-feature-name
     ```
   - **Step 3:** Work on your feature or bug fix in this branch.

2. **Committing Changes:**
   - **Step 1:** Stage your changes.
     ```bash
     git add .
     ```
   - **Step 2:** Commit your changes with a meaningful message.
     ```bash
     git commit -m "Add feature: your-feature-name"
     ```

3. **Pushing Changes:**
   - **Step 1:** Push your feature branch to the remote repository.
     ```bash
     git push origin feature/your-feature-name
     ```

4. **Merging Feature Branch into `develop`:**
   - **Step 1:** Ensure your feature branch is up to date with `develop`.
     ```bash
     git checkout develop
     git pull origin develop
     git checkout feature/your-feature-name
     git rebase develop
     ```
   - **Step 2:** Resolve any merge conflicts that may arise during rebase.
   - **Step 3:** Push the updated feature branch.
     ```bash
     git push origin feature/your-feature-name
     ```
   - **Step 4:** Create a pull request (PR) or merge request (MR) from `feature/your-feature-name` into `develop`.
   - **Step 5:** Review the PR/MR and have it approved by a team member or lead before merging.

5. **Merging `develop` into `main`:**  
> [!CAUTION]
> <ins>**DO NOT PROCEED WITHOUT TEAM MEETING**</ins>

   - **Step 1:** Ensure `develop` is up to date and stable.
     ```bash
     git checkout develop
     git pull origin develop
     ```
   - **Step 2:** Merge `develop` into `main`.
     ```bash
     git checkout main
     git pull origin main
     git merge develop
     ```
   - **Step 3:** Push the updated `main` branch to the remote repository.
     ```bash
     git push origin main
     ```

#### Best Practices

- **Frequent Commits:** Commit changes frequently to save progress and make it easier to track changes.
- **Descriptive Messages:** Use clear and descriptive commit messages to understand the purpose of changes.
- **Regular Updates:** Regularly pull the latest changes from `develop` into your feature branch to minimise conflicts.
- **Code Reviews:** Always create a PR/MR for merging into `develop` and `main`, and get your code reviewed by a team member.

#### Troubleshooting

- **Merge Conflicts:** If you encounter merge conflicts, resolve them by editing the conflicting files, staging the resolved changes, and completing the merge or rebase.
- **Rebasing Issues:** If rebasing causes problems, consult your team lead or review Git documentation for advanced conflict resolution strategies.