"use client"

import { useState } from "react"
import Image from "next/image"
import { Camera, ChevronLeft, ChevronRight } from "lucide-react"
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

export function ProgressPhotos() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const current = photoEntries[currentIndex]

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Progress Photos</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="p-1.5 rounded-md border border-border hover:bg-elevated transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-text-muted font-mono tabular-nums">
            {currentIndex + 1} / {photoEntries.length}
          </span>
          <button
            onClick={() => setCurrentIndex(Math.min(photoEntries.length - 1, currentIndex + 1))}
            disabled={currentIndex === photoEntries.length - 1}
            className="p-1.5 rounded-md border border-border hover:bg-elevated transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{current.date}</p>
          <p className="text-xs text-text-muted">Weight: {current.weight}</p>
        </div>
        {currentIndex === 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Latest</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {(["front", "side", "back"] as const).map((angle) => (
          <div key={angle} className="space-y-2">
            <div className="relative aspect-[2/3] rounded-lg border border-border bg-elevated overflow-hidden">
              <Image
                src={current.photos[angle] || "/placeholder.svg"}
                alt={`${angle} view`}
                fill
                sizes="(min-width: 1024px) 20vw, 33vw"
                className="object-cover"
              />
            </div>
            <p className="text-xs text-center text-text-muted capitalize">{angle}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        {photoEntries.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              currentIndex === index ? "bg-primary" : "bg-border",
            )}
          />
        ))}
      </div>
    </div>
  )
}
