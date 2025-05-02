"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUploader } from "@/components/file-uploader"
import { ResultsTable } from "@/components/results-table"
import { InfoPanel } from "@/components/info-panel"
import { Header } from "@/components/header"
import { processScans } from "@/lib/actions"
import type { ScanResult } from "@/lib/types"

export function Dashboard() {
  const [results, setResults] = useState<ScanResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedResult, setSelectedResult] = useState<ScanResult | null>(null)

  const handleFilesUploaded = async (files: File[]) => {
    setIsProcessing(true)
    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append("files", file)
      })

      const processedResults = await processScans(formData)
      setResults(processedResults)
      if (processedResults.length > 0) {
        setSelectedResult(processedResults[0])
      }
    } catch (error) {
      console.error("Error processing scans:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-6 container mx-auto">
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="upload">Upload Scans</TabsTrigger>
            <TabsTrigger value="results" disabled={results.length === 0}>
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload MRI Scans</CardTitle>
                <CardDescription>
                  Upload MRI scan images to analyze for signs of Alzheimer&apos;s disease
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader onFilesUploaded={handleFilesUploaded} isProcessing={isProcessing} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>MRI scan analysis results and classifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResultsTable results={results} onSelectResult={setSelectedResult} selectedResult={selectedResult} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detailed Information</CardTitle>
                  <CardDescription>Information and treatment recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <InfoPanel result={selectedResult} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="py-4 border-t text-center text-sm text-muted-foreground">
        &copy; Rakhesh Krishna P. All rights reserved.
      </footer>
    </div>
  )
}
