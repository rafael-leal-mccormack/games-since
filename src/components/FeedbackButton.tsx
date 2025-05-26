'use client'

import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"

export function FeedbackButton() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed bottom-6 right-6 rounded-full bg-slate-700 hover:bg-slate-600 border-slate-600 text-slate-300 hover:text-white shadow-lg w-12 h-12"
      onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSdqNbmcyU-08TPZnsMiS5NWLGR6tyCF7frFVrPdudHNlDgegg/viewform?usp=dialog', '_blank')}
    >
      <HelpCircle className="h-6 w-6" />
      <span className="sr-only">Feedback</span>
    </Button>
  )
} 