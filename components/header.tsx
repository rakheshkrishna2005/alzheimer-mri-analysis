import { Brain } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">AI Powered Alzheimer App</h1>
        </div>
        <ModeToggle />
      </div>
    </header>
  )
}
