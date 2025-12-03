"use client"

import { DonutChart } from "@tremor/react"
import { Syringe } from "lucide-react"

interface ProtocolDonutCardProps {
  completed: number
  total: number
  peptides: string[]
}

export function ProtocolDonutCard({ completed, total, peptides }: ProtocolDonutCardProps) {
  const remaining = total - completed
  const percentage = Math.round((completed / total) * 100)

  const chartData = [
    { name: "Completed", value: completed, color: "teal" },
    { name: "Remaining", value: remaining, color: "slate" },
  ]

  return (
    <div className="rounded-3xl bg-card p-6 shadow-lg border border-border h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Protocol</p>
          <h3 className="text-lg font-semibold">This Week</h3>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Syringe className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div className="flex justify-center my-4">
        <DonutChart
          data={chartData}
          category="value"
          index="name"
          colors={["teal", "slate"]}
          className="h-32 w-32"
          showAnimation={true}
          showTooltip={false}
          showLabel={true}
          label={`${percentage}%`}
          variant="pie"
        />
      </div>

      <div className="text-center mb-4">
        <p className="text-2xl font-bold tabular-nums">
          {completed}<span className="text-muted-foreground text-lg">/{total}</span>
        </p>
        <p className="text-sm text-muted-foreground">Injections completed</p>
      </div>

      <div className="flex flex-wrap gap-1.5 justify-center">
        {peptides.slice(0, 4).map((peptide) => (
          <span
            key={peptide}
            className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary"
          >
            {peptide}
          </span>
        ))}
      </div>
    </div>
  )
}
