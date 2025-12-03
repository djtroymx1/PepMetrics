"use client"

import { SparkAreaChart } from "@tremor/react"

interface HealthSparkCardProps {
  title: string
  value: string | number
  unit?: string
  data: { value: number }[]
  gradient: "rose" | "amber" | "violet" | "indigo" | "teal"
  stats?: { label: string; value: string }[]
}

const gradientStyles = {
  rose: "from-[#f43f5e] to-[#fb7185]",
  amber: "from-[#f59e0b] to-[#fb923c]",
  violet: "from-[#8b5cf6] to-[#a78bfa]",
  indigo: "from-[#6366f1] to-[#818cf8]",
  teal: "from-[#14b8a6] to-[#2dd4bf]",
}

export function HealthSparkCard({
  title,
  value,
  unit,
  data,
  gradient,
  stats,
}: HealthSparkCardProps) {
  return (
    <div
      className={`rounded-3xl bg-gradient-to-br ${gradientStyles[gradient]} p-6 text-white shadow-lg`}
    >
      <div className="mb-2">
        <p className="text-sm font-medium opacity-90 mb-1">{title}</p>
        <h3 className="text-2xl font-semibold">
          {value}
          {unit && <span className="text-lg ml-1 opacity-90">{unit}</span>}
        </h3>
      </div>

      <div className="h-16 my-4">
        <SparkAreaChart
          data={data}
          categories={["value"]}
          index="value"
          colors={["white"]}
          className="h-16 w-full [&_path]:fill-white/20 [&_path]:stroke-white"
          curveType="monotone"
        />
      </div>

      {stats && stats.length > 0 && (
        <div className="space-y-1">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between text-sm">
              <span className="opacity-90">{stat.label}</span>
              <span className="font-mono font-semibold">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
