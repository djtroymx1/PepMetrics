"use client"

import { useState } from "react"
import { ProtocolCard } from "./protocol-card"

interface Protocol {
  id: string
  name: string
  peptides: string[]
  dosage: string
  frequency: string
  duration: string
  startDate: string
  progress: number
  status: "active" | "paused" | "completed"
  phase?: string
  nextDose?: string
  completedDoses?: number
  totalDoses?: number
}

const mockProtocols: Protocol[] = [
  {
    id: "1",
    name: "Retatrutide Protocol",
    peptides: ["Retatrutide"],
    dosage: "2 mg",
    frequency: "Weekly",
    duration: "24 weeks",
    startDate: "2024-10-15",
    progress: 25,
    status: "active",
    phase: "Titration - Week 6",
    nextDose: "Tomorrow, 8:00 AM",
    completedDoses: 6,
    totalDoses: 24,
  },
  {
    id: "2",
    name: "Recovery Stack",
    peptides: ["BPC-157", "TB-500"],
    dosage: "250/500 mcg",
    frequency: "Daily",
    duration: "8 weeks",
    startDate: "2024-11-01",
    progress: 45,
    status: "active",
    nextDose: "Today, 6:00 PM",
    completedDoses: 25,
    totalDoses: 56,
  },
  {
    id: "3",
    name: "Glow Stack",
    peptides: ["GHK-Cu", "SS-31"],
    dosage: "Various",
    frequency: "Daily",
    duration: "12 weeks",
    startDate: "2024-10-20",
    progress: 35,
    status: "active",
    nextDose: "Today, 9:00 PM",
    completedDoses: 29,
    totalDoses: 84,
  },
  {
    id: "4",
    name: "MOTS-c Protocol",
    peptides: ["MOTS-c"],
    dosage: "10 mg",
    frequency: "2x/week",
    duration: "Ongoing",
    startDate: "2024-10-01",
    progress: 100,
    status: "active",
    nextDose: "Saturday, 8:00 AM",
    completedDoses: 16,
    totalDoses: 16,
  },
]

export function ProtocolListCard() {
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null)
  const activeCount = mockProtocols.filter((p) => p.status === "active").length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Active Protocols</h2>
        <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {activeCount} active
        </span>
      </div>

      <div className="space-y-4">
        {mockProtocols.map((protocol) => (
          <ProtocolCard
            key={protocol.id}
            protocol={protocol}
            isSelected={selectedProtocol === protocol.id}
            onSelect={() => setSelectedProtocol(
              selectedProtocol === protocol.id ? null : protocol.id
            )}
          />
        ))}
      </div>
    </div>
  )
}
