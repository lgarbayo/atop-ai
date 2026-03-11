# Contribution Guide

Thank you for your interest in contributing to AtopAI! This guide will help you understand the development process and how to get involved.

## 📋 Prerequisites

- Git configured on your local machine
- Python 3.11+
- Docker & Docker Compose (recommended for testing)

## Development Environment Setup

### Backend (Python)

```bash
# Clone the repository
git clone https://github.com/lgarbayo/document-search.git atopai
cd atopai/backend

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Install development tools
pip install pytest pytest-cov black flake8 mypy
```

### Local Services

```bash
# From the project root
docker compose up -d
```

Core Services:
- **Qdrant** (port 6333): Vector database
- **FastAPI** (port 8000): Application API

## Coding Standards

### Python
- **Style**: PEP 8 (enforced via Black)
- **Typing**: Use type hints whenever possible
- **Docstrings**: Google-style docstrings for public functions
- **Line Length**: Maximum 100 characters

### JavaScript/Frontend
- **Style**: Vanilla JS (avoid unnecessary frameworks)
- **Indentation**: 2 spaces
- **Naming**: camelCase for variables/functions, snake_case for HTML IDs

## 🔄 Contribution Workflow

1. **Create a Branch**: `git checkout -b feature/your-feature-name`
2. **Make Changes**: Keep commits atomic and descriptive.
3. **Tests & Linting**: Run `pytest tests/` and `black .` before pushing.
4. **Pull Request**: Describe your changes clearly and link related issues.

## Reporting Bugs

Please use GitHub Issues using the provided bug report template, including clear steps to reproduce and environment details.

## Project Structure

```
atopai/
├── backend/
│   ├── api/             # API Endpoints
│   ├── services/        # Logic: Vector DB, LLM, Extraction
│   ├── workers/         # Celery Tasks
│   ├── tests/           # Unit & Integration Tests
│   └── main.py          # Entry Point
├── frontend/            # Vanilla JS SPA
└── docker-compose.yml   # Orchestration
```

## Making a Release

1. Update `CHANGELOG.md`
2. Update version in `main.py`
3. Tag the release: `git tag v1.1.0`
4. Push tags: `git push origin v1.1.0`

## Community Guidelines

- Respect the Code of Conduct.
- Keep tests mandatory for new features.
- Update documentation alongside code changes.

Questions? Open an issue or join the discussions!

Thank you for contributing to AtopAI! 🎉
