# Contributing to PepMetrics

Thank you for your interest in contributing to PepMetrics! This guide will help you get started with development.

## Development Setup

### Prerequisites

- Node.js 20+
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/pepmetrics.git
   cd pepmetrics
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

   > **Note**: The `--legacy-peer-deps` flag is required due to React 19 compatibility with some packages.

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run tests with interactive UI |
| `npm run test:e2e:report` | View test report |

## Running Tests

### E2E Tests with Playwright

Tests require the dev server to be running. Start it in a separate terminal first:

**Terminal 1 - Start dev server:**
```bash
npm run dev
```

**Terminal 2 - Run tests:**
```bash
# Install Playwright browsers (first time only)
npm run test:install

# Run all tests
npm run test:e2e

# Run tests in UI mode (recommended)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run specific test file
npx playwright test smoke.spec.ts

# Run only chromium tests
npm run test:e2e -- --project=chromium
```

**VS Code Users:** Use the Playwright Test extension for the best experience. It will show a play button next to each test.

## Project Structure

```
pepmetrics/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── protocols/         # Protocol management
│   ├── health/            # Health metrics
│   └── ...
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── dashboard/         # Dashboard components
│   └── health/            # Health page components
├── tests/
│   ├── e2e/              # End-to-end tests
│   ├── fixtures/         # Test data
│   └── page-objects/     # Page object models
├── .claude/skills/        # Claude Code skills
└── .github/workflows/     # CI/CD workflows
```

## Code Style

### General Guidelines

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Use meaningful variable and function names
- Keep components focused and single-purpose

### Component Patterns

- Use `"use client"` directive for client-side components
- Follow the existing page structure pattern (AppSidebar + MobileNav + main)
- Use shadcn/ui components from `/components/ui`
- Use Tremor for charts and data visualization

### Styling

- Use Tailwind CSS for styling
- Follow the design system colors:
  - Primary: teal (`#14b8a6`)
  - Accent: violet (`#8b5cf6`)
- Use consistent spacing and rounded corners

## Pull Request Process

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit with clear messages:
   ```bash
   git commit -m "Add: description of what you added"
   ```

3. Run tests to ensure nothing is broken:
   ```bash
   npm run lint
   npm run build
   npm run test:e2e
   ```

4. Push your branch and create a Pull Request

5. Wait for CI checks to pass and request a review

## Commit Message Guidelines

Use clear, descriptive commit messages:

- `Add: new feature or file`
- `Fix: bug fix`
- `Update: modification to existing feature`
- `Refactor: code restructuring`
- `Docs: documentation changes`
- `Test: test additions or modifications`

## Questions?

If you have questions, please open an issue or reach out to the maintainers.
