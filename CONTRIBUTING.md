# Contributing Guide

Thank you for your interest in contributing to this project. To maintain a clean and understandable workflow, we ask that you follow these guidelines when making commits to this repository.

## Making Commits

1. **Clear Commit Messages**:

- Use English/Spanish for commit messages.
- The message should be brief and descriptive.
- Use the present tense in commit messages.

  **Recommended format**: [Type]: Brief description

**Examples**:

- `fix: correct typo in function name`
- `feat: add new endpoint for user registration`
- `docs: update README with new instructions`

2. **Commit Types**:

- `feat`: New feature
- `fix`: Bug fix
- `translate`: New translations
- `docs`: Documentation changes
- `style`: Changes that do not affect the logic of the code (whitespace, formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or modifying tests
- `chore`: Updating build tasks, package manager configs, etc.

3. **Atomic Commits**:

- Ensure each commit makes a single logical change.
- If you are making multiple changes, make one commit per change.

4. **Referencing Issues**:

- If your commit fixes an issue, include a reference to the issue in the commit message.
- Use `Fixes #<issue_number>` to automatically close the issue when the commit is merged.

**Example**: fix: handle null pointer exception

This commit fixes a null pointer exception that occurs when ...
Fixes #42

5. **Code Reviews**:

- Ensure your code passes existing tests.
- Review the code for common errors before committing.

## Pull Request Process

1. **Fork and Clone**:

- Fork the repository.
- Clone your fork to your local machine.

```sh
git clone https://github.com/rafacv23/F1-api.git
cd F1-api
```

2. Create a Branch
   Create a new branch for your work

```sh
git checkout -b your-branch-name
```

3. Make Commits

- Follow the commit guidelins mentioned above
- Make frequent and clear commits

4. Push to Your Fork:
   Push your changes to your fork on Github

```sh
git push origin your-branch-name
```

5. Create a Pull Request

- Open a Pull Request from your branch in your fork to the main repository.
- Provide a detailed description of the changes you made and why.

## Review and Approval

- Your Pull Request will be reviewed by one or more project maintainers.
- You may be asked to make changes before your Pull Request is accepted.
- Once your Pull Request is approved, it will be merged into the main repository.

Thank you for following these guidelines and for contributing to our project.
