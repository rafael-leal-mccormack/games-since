'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SubmitButton } from "./SubmitButton"
import { addSubscriber } from "@/actions/subscribers"

export function NotificationFormClient() {
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    const result = await addSubscriber(formData)
    
    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Successfully subscribed!' })
      // Reset form
      const form = document.querySelector('form')
      form?.reset()
    }
  }

  return (
    <div className="w-full max-w-md">
      <h3 className="text-xl font-medium mb-4 text-center text-sky-200">Get HR Notifications</h3>
      <form action={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="flex-1 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
          <SubmitButton />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-300">Notify me after</span>
          <Select name="limit" defaultValue="5">
            <SelectTrigger className="w-20 bg-slate-700 border-slate-600">
              <SelectValue placeholder="Games" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-slate-300">games without a home run</span>
        </div>
        {message && (
          <p className={`text-sm text-center ${
            message.type === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
            {message.text}
          </p>
        )}
        <p className="text-xs text-slate-400 text-center">
          We&apos;ll notify you whenever Shohei hits another home run!
        </p>
      </form>
    </div>
  )
} 