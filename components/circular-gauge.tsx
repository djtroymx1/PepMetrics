"use client"

interface CircularGaugeProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  label: string
  color?: string
}

export function CircularGauge({
  value,
  max,
  size = 120,
  strokeWidth = 10,
  label,
  color = "#14b8a6",
}: CircularGaugeProps) {
  const percentage = (value / max) * 100
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle 
            cx={size / 2} 
            cy={size / 2} 
            r={radius} 
            stroke="currentColor" 
            className="text-muted"
            strokeWidth={strokeWidth} 
            fill="none" 
          />
          {/* Progress circle with glow effect */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
            style={{
              filter: `drop-shadow(0 0 6px ${color}50)`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums font-mono">{value}</span>
          <span className="text-xs text-muted-foreground">of {max}</span>
        </div>
      </div>
      <p className="text-sm font-medium text-center text-foreground">{label}</p>
    </div>
  )
}
