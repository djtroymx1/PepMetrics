"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { BadgeDelta } from "@tremor/react"
import { Sparkles, TrendingUp, Moon, Zap, MessageSquare, ArrowRight, Brain } from "lucide-react"

const insights = [
  {
    id: 1,
    title: "Sleep Quality Correlation",
    description: "Your deep sleep increased 23% on days you took MOTS-c before 8am compared to evening doses.",
    type: "correlation",
    strength: "strong",
    peptide: "MOTS-c",
    metric: "Deep Sleep",
    change: "+23%",
    icon: Moon,
  },
  {
    id: 2,
    title: "Recovery Pattern Detected",
    description: "HRV scores are consistently 15% higher 48-72 hours after BPC-157 injections.",
    type: "pattern",
    strength: "moderate",
    peptide: "BPC-157",
    metric: "HRV",
    change: "+15%",
    icon: TrendingUp,
  },
  {
    id: 3,
    title: "Fasting Window Impact",
    description: "Weight loss accelerated when maintaining 16+ hour fasts on Retatrutide injection days.",
    type: "correlation",
    strength: "strong",
    peptide: "Retatrutide",
    metric: "Weight",
    change: "-2.3 lbs/week",
    icon: Zap,
  },
]

const suggestedQuestions = [
  "How has my sleep changed since starting Retatrutide?",
  "Compare my HRV on injection vs rest days",
  "What time of day shows best results for MOTS-c?",
  "Show my weight trend for the past 30 days",
]

export default function InsightsPage() {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <MobileNav />

      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold">AI Insights</h1>
                <p className="text-muted-foreground mt-1">
                  Personalized analysis and correlations from your tracking data
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Insights Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weekly Summary Card */}
              <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-purple-500/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex-shrink-0">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Weekly Summary</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      This week you maintained excellent protocol compliance at 92%. Your sleep quality improved
                      by 18% compared to last week, likely correlated with consistent morning MOTS-c doses.
                      Weight trend continues downward at 1.8 lbs/week, which is within healthy range for your
                      current Retatrutide protocol. Consider logging meals more consistently to unlock deeper
                      nutrition insights.
                    </p>
                  </div>
                </div>
              </div>

              {/* Insight Cards */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Discovered Patterns</h2>
                <div className="space-y-4">
                  {insights.map((insight) => {
                    const Icon = insight.icon
                    return (
                      <div
                        key={insight.id}
                        className="rounded-2xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-medium">{insight.title}</h3>
                              <span className={`text-xs px-2.5 py-1 rounded-full ${
                                insight.strength === "strong"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : "bg-amber-500/10 text-amber-500"
                              }`}>
                                {insight.strength} correlation
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {insight.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm flex-wrap">
                              <span className="text-muted-foreground">
                                Peptide: <span className="text-foreground font-medium">{insight.peptide}</span>
                              </span>
                              <span className="text-muted-foreground">
                                Metric: <span className="text-foreground font-medium">{insight.metric}</span>
                              </span>
                              <BadgeDelta
                                deltaType={insight.change.startsWith("+") || insight.change.startsWith("-2") ? "increase" : "decrease"}
                                size="sm"
                              >
                                {insight.change}
                              </BadgeDelta>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Chat Column */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-border bg-card p-5 sticky top-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                    <MessageSquare className="h-4 w-4 text-violet-500" />
                  </div>
                  <h3 className="font-semibold">Ask About Your Data</h3>
                </div>

                {/* Chat Input */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Ask a question..."
                    className="w-full rounded-xl border border-border bg-muted px-4 py-3 pr-12 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-violet-500 text-white hover:bg-violet-600 transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Suggested Questions */}
                <div>
                  <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Suggested questions</p>
                  <div className="space-y-2">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        className="w-full text-left text-sm px-3 py-2.5 rounded-xl border border-border hover:border-violet-500/50 hover:bg-violet-500/5 transition-all"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sample Response */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-violet-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        Based on your data, sleep duration increased from an average of 6.8 hours
                        to 7.9 hours after starting Retatrutide, with the most significant improvement
                        in deep sleep stages.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
