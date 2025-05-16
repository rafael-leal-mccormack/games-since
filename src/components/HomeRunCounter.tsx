import { Card, CardContent } from "@/components/ui/card"

interface HomeRunCounterProps {
  gamesSince: number
  lastUpdated: string
}

export function HomeRunCounter({ gamesSince, lastUpdated }: HomeRunCounterProps) {
  return (
    <Card className="w-full bg-slate-700 border-slate-600">
      <CardContent className="p-8 flex flex-col items-center">
        <h2 className="text-xl text-slate-300 mb-4">Games Since Last Home Run</h2>
        <div className="text-7xl md:text-9xl font-bold text-sky-300">{gamesSince}</div>
        <p className="text-slate-300 mt-4">
          Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </CardContent>
    </Card>
  )
} 