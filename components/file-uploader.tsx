"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, FileImage, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
  onFilesUploaded: (files: File[]) => void
  isProcessing: boolean
}

export function FileUploader({ onFilesUploaded, isProcessing }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [progress, setProgress] = useState(0)
  const [processingTime, setProcessingTime] = useState<string>("")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".bmp"],
    },
    multiple: true,
  })

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    // Simulate progress for better UX
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 100)

    const startTime = Date.now()
    await onFilesUploaded(files)
    const endTime = Date.now()
    const duration = endTime - startTime
    
    // Format duration into minutes and seconds or just seconds
    const minutes = Math.floor(duration / 60000)
    const seconds = ((duration % 60000) / 1000).toFixed(1)
    const timeMessage = minutes > 0
      ? `${minutes}min ${seconds}secs`
      : `${seconds} secs`
    
    setProcessingTime(`Scans Processed in ${timeMessage}. Check Analysis Results.`)
    clearInterval(interval)
    setProgress(100)

    // Reset after completion
    setTimeout(() => {
      setProgress(0)
      setFiles([])
      setProcessingTime("")
    }, 10000)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors min-h-[300px] flex flex-col items-center justify-center relative",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50",
        )}
      >

        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4 my-8">
          <Upload className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
          <h3 className="text-lg md:text-xl font-medium">Drag & drop MRI scan images</h3>
          <p className="text-xs md:text-sm text-muted-foreground">or click to browse files (JPG, JPEG, PNG, BMP)</p>
          <div className="flex flex-wrap justify-center items-center gap-1 md:gap-2 mt-2">
            <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] md:text-xs font-medium">Rapid Analysis</span>
            <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-green-100 text-green-800 text-[10px] md:text-xs font-medium">AI Powered</span>
            <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-purple-100 text-purple-800 text-[10px] md:text-xs font-medium">Neural Networks</span>
          </div>
        </div>
      </div>

      {files.length > 0 && !processingTime && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Selected Files ({files.length})</h4>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div className="flex items-center space-x-2">
                    <FileImage className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm truncate max-w-[250px]">{file.name}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={isProcessing}>
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {progress > 0 && <Progress value={progress} className="h-2" />}

          <div className="space-y-4">
            <div className="flex justify-center">
              <Button onClick={handleUpload} disabled={files.length === 0 || isProcessing}>
                {isProcessing ? "Processing..." : "Analyze Scans"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {processingTime && (
        <div className="rounded-md bg-green-200 p-4 mt-4">
          <div className="flex items-center justify-center text-center">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{processingTime}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
