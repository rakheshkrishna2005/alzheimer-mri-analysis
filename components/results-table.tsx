"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"
import type { ScanResult } from "@/lib/types"

interface ResultsTableProps {
  results: ScanResult[]
  onSelectResult: (result: ScanResult) => void
  selectedResult: ScanResult | null
}

export function ResultsTable({ results, onSelectResult, selectedResult }: ResultsTableProps) {
  const downloadCSV = () => {
    // Create CSV content
    const headers = ["File Name", "Prediction", "Information", "Treatment"]
    const csvContent = [
      headers.join(","),
      ...results.map((result) =>
        [`"${result.fileName}"`, `"${result.prediction}"`, `"${result.information}"`, `"${result.treatment}"`].join(
          ",",
        ),
      ),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "alzheimer_analysis_results.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">AI Predictions</h3>
        <Button variant="outline" size="sm" onClick={downloadCSV} className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          <span>Download CSV</span>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Prediction</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={index} className={selectedResult?.fileName === result.fileName ? "bg-muted/50" : ""}>
                <TableCell className="font-medium">{result.fileName}</TableCell>
                <TableCell>
                  <span
                    className={
                      result.prediction === "Non Demented"
                        ? "text-green-600 dark:text-green-400"
                        : result.prediction === "Very Mild Demented"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : result.prediction === "Mild Demented"
                            ? "text-orange-600 dark:text-orange-400"
                            : "text-red-600 dark:text-red-400"
                    }
                  >
                    {result.prediction}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onSelectResult(result)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
