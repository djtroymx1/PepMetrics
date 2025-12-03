import { Syringe, Utensils, Weight, Camera, CheckSquare } from "lucide-react"

export function CalendarLegend() {
  const items = [
    { icon: Syringe, label: "Injections", color: "bg-primary" },
    { icon: Utensils, label: "Meals", color: "bg-warning" },
    { icon: Weight, label: "Weight Log", color: "bg-success" },
    { icon: Camera, label: "Progress Photos", color: "bg-secondary" },
    { icon: CheckSquare, label: "Daily Check-In", color: "bg-text-muted" },
  ]

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <h3 className="text-sm font-semibold mb-3">Legend</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${item.color}`} />
            <span className="text-xs text-text-secondary">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
