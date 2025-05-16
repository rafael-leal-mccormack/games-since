"use client"

import { useFormStatus } from "react-dom"
import { Button } from "./ui/button"
import { Bell } from "lucide-react"

export function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      type="submit" 
      className="gap-2 bg-sky-500 hover:bg-sky-600"
      disabled={pending}
    >
      <Bell className="h-4 w-4" />
      <span className="hidden sm:inline">
        {pending ? 'Subscribing...' : 'Subscribe'}
      </span>
    </Button>
  )
}