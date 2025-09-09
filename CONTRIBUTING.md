# Contributing to CRUD Users API

We're excited that you're interested in contributing to our project! Whether it's a bug report, new feature, or documentation improvement, your contributions are welcome.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

1. **Check for Existing Issues**: Before creating a new issue, please check if a similar issue already exists.
2. **Create a New Issue**: If you can't find an existing issue, create a new one with a clear title and description.
3. **Provide Details**: Include steps to reproduce the bug, expected behavior, actual behavior, and any relevant screenshots or logs.

### Suggesting Enhancements

1. **Check for Existing Suggestions**: Search the issues to see if your enhancement has already been suggested.
2. **Create a Feature Request**: If not, create a new issue with the "enhancement" label.
3. **Be Specific**: Describe the feature, why you need it, and how it should work.

### Pull Requests

1. **Fork the Repository**: Create your own fork of the repository.
2. **Create a Branch**: Create a feature branch for your changes.
3. **Make Your Changes**: Implement your feature or bug fix.
4. **Test Your Changes**: Ensure all tests pass and add new tests if necessary.
5. **Submit a Pull Request**: Create a PR with a clear title and description.

## Development Setup

### Prerequisites

- Node.js v18 or later
- npm v9 or later
- MongoDB (local or Atlas)
- AWS Account (for deployment)

### Installation

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/your-username/crud-users-api.git
   cd crud-users-api
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   # Update the .env file with your configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Coding Standards

- Follow the existing code style (ESLint + Prettier)
- Write meaningful commit messages
- Keep PRs focused and small
- Add tests for new features
- Update documentation when necessary

## Testing

Run tests with:

```bash
npm test
```

## Deployment

See the [README.md](README.md) for deployment instructions.

## Questions?

Feel free to open an issue if you have any questions or need clarification.
