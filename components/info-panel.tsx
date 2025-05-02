import type { ScanResult } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Brain, Pill } from "lucide-react"

interface InfoPanelProps {
  result: ScanResult | null
}

export function InfoPanel({ result }: InfoPanelProps) {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center text-muted-foreground">
        <AlertCircle className="h-10 w-10 mb-2" />
        <p>Select a result to view detailed information</p>
      </div>
    )
  }

  const severityColor =
    result.prediction === "Non Demented"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      : result.prediction === "Very Mild Demented"
        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
        : result.prediction === "Mild Demented"
          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-2">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${severityColor}`}>{result.prediction}</div>
        <h3 className="text-lg font-medium">{result.fileName}</h3>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Condition Information</h4>
                <p className="text-sm text-muted-foreground mt-1">{result.information}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Pill className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Treatment Recommendations</h4>
                <p className="text-sm text-muted-foreground mt-1">{result.treatment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
