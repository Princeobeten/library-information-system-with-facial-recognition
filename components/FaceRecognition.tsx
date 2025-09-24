"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Scan } from "lucide-react"

interface FaceRecognitionProps {
  onFaceDetected: (faceData: string) => void
  loading?: boolean
}

export default function FaceRecognition({ onFaceDetected, loading }: FaceRecognitionProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)

  const simulateFaceScan = () => {
    setIsScanning(true)
    setScanProgress(0)

    // Simulate face scanning progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          // Mock face data - in real implementation, this would be actual face embedding
          const mockFaceData = `face_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          onFaceDetected(mockFaceData)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Scan className="h-5 w-5" />
          Facial Recognition
        </CardTitle>
        <CardDescription>Position your face in front of the camera for authentication</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
          {isScanning ? (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 animate-pulse">
              <div className="absolute inset-4 border-2 border-blue-500 rounded-lg">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white text-sm p-2 rounded">
                Scanning... {scanProgress}%
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Camera Preview</p>
            </div>
          )}
        </div>

        <Button onClick={simulateFaceScan} disabled={isScanning || loading} className="w-full">
          {isScanning ? "Scanning..." : "Start Face Scan"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          This is a mock implementation. In production, this would use real facial recognition technology.
        </p>
      </CardContent>
    </Card>
  )
}
