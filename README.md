# PepMetrics

A personal health and peptide protocol tracking application built with Next.js.

## Features

- **Dashboard** - Overview of daily health metrics, fasting status, and protocol compliance
- **Protocol Management** - Track peptide protocols, dosages, and schedules
- **Health Metrics** - Monitor sleep, HRV, activity, and other health data
- **Progress Tracking** - Track weight, body composition, and progress photos
- **Calendar** - View scheduled injections and appointments
- **Insights** - AI-powered analysis and recommendations
- **Bloodwork** - Track and analyze lab results
- **Settings** - Configure integrations (Garmin), notifications, and preferences

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui, Tremor
- **Charts**: Tremor, Recharts
- **Forms**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/pepmetrics.git
cd pepmetrics

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

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

## Testing

PepMetrics uses Playwright for end-to-end testing.

```bash
# Install Playwright browsers (first time)
npx playwright install chromium

# Run all tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui

# Run in headed mode
npx playwright test --headed
```

## Project Structure

```
pepmetrics/
├── app/                    # Next.js App Router pages
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── dashboard/         # Dashboard components
│   └── health/            # Health page components
├── tests/
│   ├── e2e/              # End-to-end tests
│   ├── fixtures/         # Test data
│   └── page-objects/     # Page object models
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── public/               # Static assets
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

Private - All rights reserved.
