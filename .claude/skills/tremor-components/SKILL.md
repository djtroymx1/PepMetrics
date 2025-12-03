---
name: tremor-components
description: Guide for using Tremor components in PepMetrics. Use when building or updating dashboard visualizations.
---

# Tremor Components in PepMetrics

## Overview

Tremor (@tremor/react) provides beautiful chart and dashboard components. PepMetrics uses Tremor for data visualization alongside shadcn/ui for general UI.

**Note**: Tremor requires React 18. Project uses React 19 with `--legacy-peer-deps`.

## Import Pattern

```tsx
"use client"  // Required for Tremor components

import {
  Card,
  AreaChart,
  BarChart,
  DonutChart,
  Metric,
  Text,
  Flex,
  ProgressBar,
} from '@tremor/react';
```

## Available Components

### Charts
- **AreaChart** - Time series, trends
- **BarChart** - Comparisons, activity
- **LineChart** - Trends over time
- **DonutChart** - Proportions, compliance
- **SparkAreaChart** - Mini inline charts

### Metrics & Text
- **Metric** - Large numbers
- **Text** - Labels and descriptions
- **Title** - Section headings
- **Bold** - Emphasis

### Layout
- **Card** - Container with styling
- **Flex** - Flexbox layout
- **Grid** - Grid layout
- **Col** - Grid columns

### Indicators
- **ProgressBar** - Progress indicators
- **CategoryBar** - Multi-category progress
- **DeltaBar** - Change indicators
- **Badge** - Status badges
- **Tracker** - Daily/weekly tracking

## Styling for PepMetrics

### Color Mapping
```tsx
// Map PepMetrics colors to Tremor color names
const colorMap = {
  primary: 'teal',      // #14b8a6
  accent: 'violet',     // #8b5cf6
  success: 'emerald',
  warning: 'amber',
  error: 'rose',
};
```

### Custom Card Styling
```tsx
<Card className="rounded-xl border border-border bg-card">
  {/* Tremor card with PepMetrics styling */}
</Card>
```

### Chart Color Schemes
```tsx
// Good color combinations for PepMetrics
<AreaChart
  colors={['teal', 'violet']}  // Primary + accent
  // or
  colors={['emerald', 'amber', 'rose']}  // Status colors
/>
```

## Common Patterns

### Health Metric Card
```tsx
import { Card, Metric, Text, SparkAreaChart } from '@tremor/react';

function HealthMetricCard({ label, value, unit, data, color }) {
  return (
    <Card className="rounded-xl">
      <Text>{label}</Text>
      <Flex alignItems="baseline" className="gap-1">
        <Metric>{value}</Metric>
        <Text>{unit}</Text>
      </Flex>
      <SparkAreaChart
        data={data}
        categories={['value']}
        index="date"
        colors={[color]}
        className="h-10 mt-2"
      />
    </Card>
  );
}
```

### Activity Bar Chart
```tsx
import { Card, Title, BarChart } from '@tremor/react';

function ActivityChart({ data }) {
  return (
    <Card>
      <Title>Weekly Activity</Title>
      <BarChart
        data={data}
        index="day"
        categories={['steps', 'activeMinutes']}
        colors={['teal', 'violet']}
        valueFormatter={(v) => `${v.toLocaleString()}`}
        yAxisWidth={48}
      />
    </Card>
  );
}
```

### Protocol Compliance Donut
```tsx
import { Card, Title, DonutChart } from '@tremor/react';

function ComplianceDonut({ completed, total }) {
  const data = [
    { name: 'Completed', value: completed },
    { name: 'Remaining', value: total - completed },
  ];

  return (
    <Card>
      <Title>Protocol Compliance</Title>
      <DonutChart
        data={data}
        category="value"
        index="name"
        colors={['teal', 'gray']}
        valueFormatter={(v) => `${v} doses`}
      />
    </Card>
  );
}
```

### Progress Tracker
```tsx
import { Card, Tracker } from '@tremor/react';

function WeeklyTracker({ data }) {
  // data: [{ color: 'emerald', tooltip: 'Completed' }, ...]
  return (
    <Card>
      <Tracker data={data} className="mt-2" />
    </Card>
  );
}
```

## Data Format

### For AreaChart/LineChart/BarChart
```typescript
const data = [
  { date: '2024-01-01', value: 100, category: 'A' },
  { date: '2024-01-02', value: 120, category: 'A' },
];

<AreaChart
  data={data}
  index="date"           // x-axis field
  categories={['value']} // y-axis fields
/>
```

### For DonutChart
```typescript
const data = [
  { name: 'Category A', value: 40 },
  { name: 'Category B', value: 60 },
];

<DonutChart
  data={data}
  index="name"      // label field
  category="value"  // value field
/>
```

### For SparkAreaChart
```typescript
const data = [
  { value: 10 },
  { value: 15 },
  { value: 12 },
];

<SparkAreaChart
  data={data}
  categories={['value']}
  index="date"  // Optional for spark charts
/>
```

## Integration with shadcn/ui

Tremor and shadcn/ui can work together:

```tsx
import { Card as ShadcnCard } from '@/components/ui/card';
import { AreaChart } from '@tremor/react';

function MetricCard() {
  return (
    <ShadcnCard className="p-4">
      {/* Use shadcn card styling */}
      <h3 className="font-semibold">Metric Title</h3>
      {/* Use Tremor chart inside */}
      <AreaChart
        data={data}
        index="date"
        categories={['value']}
        colors={['teal']}
        showLegend={false}
        showYAxis={false}
        className="h-20 mt-2"
      />
    </ShadcnCard>
  );
}
```

## Performance Tips

1. **Use `showAnimation={false}`** for many charts
2. **Lazy load heavy charts** with `dynamic` import
3. **Limit data points** to what's visible
4. **Use SparkAreaChart** for small inline charts

```tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(
  () => import('@tremor/react').then((mod) => mod.AreaChart),
  { ssr: false }
);
```
