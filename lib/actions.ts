"use server"

import type { ScanResult } from "./types"

export async function processScans(formData: FormData): Promise<ScanResult[]> {
  try {
    const response = await fetch('http://localhost:8000/api/analyze', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const results = await response.json()
    return results
  } catch (error) {
    console.error('Error processing scans:', error)
    const files = formData.getAll("files") as File[]
    return files.map(file => ({
      fileName: file.name,
      prediction: "Error",
      information: "An error occurred while processing the scan.",
      treatment: "Please try again or contact support if the issue persists."
    }))
  }
}
