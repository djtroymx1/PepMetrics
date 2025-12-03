"use client"

import { useState } from "react"
import { Camera, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface PhotoEntry {
  id: string
  date: string
  weight: string
  photos: {
    front: string
    side: string
    back: string
  }
}

const photoEntries: PhotoEntry[] = [
  {
    id: "1",
    date: "Feb 19, 2024",
    weight: "185.2 lbs",
    photos: {
      front: "/male-front-progress-photo.jpg",
      side: "/male-side-progress-photo.jpg",
      back: "/male-back-progress-photo.jpg",
    },
  },
  {
    id: "2",
    date: "Feb 5, 2024",
    weight: "188.1 lbs",
    photos: {
      front: "/male-front-progress-photo-before.jpg",
      side: "/male-side-progress-photo-before.jpg",
      back: "/male-back-progress-photo-before.jpg",
    },
  },
  {
    id: "3",
    date: "Jan 1, 2024",
    weight: "195.2 lbs",
    photos: {
      front: "/male-front-progress-photo-initial.jpg",
      side: "/male-side-progress-photo-initial.jpg",
      back: "/male-back-progress-photo-initial.jpg",
    },
  },
]

export function PhotoGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const current = photoEntries[currentIndex]

  return (
    <div className="rounded-2xl border border-border bg-card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Camera className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Progress Photos</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-muted-foreground font-mono tabular-nums px-2">
            {currentIndex + 1} / {photoEntries.length}
          </span>
          <button
            onClick={() => setCurrentIndex(Math.min(photoEntries.length - 1, currentIndex + 1))}
            disabled={currentIndex === photoEntries.length - 1}
            className="p-2 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between bg-muted/50 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{current.date}</p>
            <p className="text-xs text-muted-foreground">Weight: {current.weight}</p>
          </div>
        </div>
        {currentIndex === 0 && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Latest
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {(["front", "side", "back"] as const).map((angle) => (
          <div key={angle} className="space-y-2">
            <div className="aspect-[2/3] rounded-xl border border-border bg-muted overflow-hidden">
              <img
                src={current.photos[angle] || "/placeholder.svg"}
                alt={`${angle} view`}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-xs text-center text-muted-foreground capitalize font-medium">{angle}</p>
          </div>
        ))}
      </div>

      {/* Timeline dots */}
      <div className="mt-4 flex gap-2">
        {photoEntries.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-2 flex-1 rounded-full transition-all",
              currentIndex === index ? "bg-primary" : "bg-muted hover:bg-muted-foreground/30",
            )}
          />
        ))}
      </div>
    </div>
  )
}
