"use client"

import { Card, Metric, Text, AreaChart } from "@tremor/react"

// Sample heart rate data over time
const heartRateData = [
  { time: "6am", bpm: 62 },
  { time: "9am", bpm: 78 },
  { time: "12pm", bpm: 85 },
  { time: "3pm", bpm: 72 },
  { time: "6pm", bpm: 88 },
  { time: "9pm", bpm: 68 },
]

export function TremorTest() {
  return (
    <Card className="max-w-lg">
      <Text>Average Heart Rate</Text>
      <Metric>75 bpm</Metric>
      <AreaChart
        className="mt-4 h-48"
        data={heartRateData}
        index="time"
        categories={["bpm"]}
        colors={["rose"]}
        showLegend={false}
        showYAxis={true}
        showXAxis={true}
      />
    </Card>
  )
}
