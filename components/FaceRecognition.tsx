"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Scan, Video, VideoOff } from "lucide-react"

interface FaceRecognitionProps {
  onFaceDetected: (faceData: string) => void
  loading?: boolean
}

export default function FaceRecognition({ onFaceDetected, loading }: FaceRecognitionProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [hasCameraAccess, setHasCameraAccess] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Request camera access
  const startCamera = async () => {
    try {
      setCameraError(null)
      
      // Ensure video ref is available
      const video = videoRef.current
      if (!video) {
        throw new Error('Video element not initialized. Please refresh the page.')
      }
      
      // Check if browser supports mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser')
      }

      // Check if running in secure context (required for camera access)
      if (window.isSecureContext === false) {
        throw new Error('Camera access requires a secure context (HTTPS or localhost)')
      }

      // Try to get camera stream
      const constraints = {
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      }

      console.log('Requesting camera with constraints:', constraints)
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      
      if (!stream) {
        throw new Error('No stream returned from camera')
      }
      
      // Double-check video element
      if (!videoRef.current) {
        stream.getTracks().forEach(track => track.stop())
        throw new Error('Video element was unmounted during camera initialization')
      }
      
      // Set the stream to the video element
      video.srcObject = stream
      
      // Wait for the video to be ready
      await new Promise<void>((resolve, reject) => {
        const onLoaded = () => {
          video.removeEventListener('loadedmetadata', onLoaded)
          video.play()
            .then(() => {
              console.log('Camera stream started')
              streamRef.current = stream
              setHasCameraAccess(true)
              resolve()
            })
            .catch(err => {
              console.error('Error playing video:', err)
              reject(new Error('Could not start video playback'))
            })
        }
        
        video.addEventListener('loadedmetadata', onLoaded, { once: true })
        
        // Add a timeout in case the video never loads
        const timeout = setTimeout(() => {
          video.removeEventListener('loadedmetadata', onLoaded)
          reject(new Error('Video metadata loading timed out'))
        }, 5000) // 5 seconds timeout
        
        // Clean up the timeout if the promise resolves
        Promise.resolve().then(() => clearTimeout(timeout))
      })
    } catch (err) {
      const error = err as Error
      console.error('Camera access error:', error)
      
      // More specific error messages
      if (error.name === 'NotAllowedError') {
        setCameraError('Camera access was denied. Please allow camera access to use face recognition.')
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setCameraError('No camera found. Please check if your camera is connected.')
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        setCameraError('Camera is already in use by another application.')
      } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
        setCameraError('The requested camera configuration is not supported.')
      } else {
        setCameraError(`Camera error: ${error.message || 'Unknown error occurred'}`)
      }
      
      setHasCameraAccess(false)
      
      // Clean up any partial stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }

  // Stop camera when component unmounts or when dependencies change
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        console.log('Cleaning up camera stream')
        streamRef.current.getTracks().forEach(track => {
          track.stop()
          console.log('Stopped track:', track.kind)
        })
        streamRef.current = null
      }
    }
  }, [])

  const startFaceScan = async () => {
    if (!hasCameraAccess) {
      await startCamera()
      return
    }
    
    setIsScanning(true)
    
    // In a real implementation, you would:
    // 1. Capture a frame from the video
    // 2. Send it to your face recognition API
    // 3. Process the response
    
    // For now, we'll simulate the face recognition with a timeout
    setTimeout(() => {
      const mockFaceData = `face_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      onFaceDetected(mockFaceData)
      setIsScanning(false)
    }, 2000)
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
      setHasCameraAccess(false)
    }
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
        <div className="relative aspect-square bg-black/80 rounded-lg flex items-center justify-center overflow-hidden">
          {/* Debug info - only shown in development */}
          {process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && (
            <div className="absolute top-2 left-2 text-xs text-white/50 z-10 bg-black/70 p-2 rounded">
              <div>Secure: {window.isSecureContext ? '✅' : '❌'}</div>
              <div>MediaDevices: {navigator.mediaDevices ? '✅' : '❌'}</div>
              <div>getUserMedia: {navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function' ? '✅' : '❌'}</div>
              <div>Video Element: {videoRef.current ? '✅' : '❌'}</div>
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover ${hasCameraAccess ? 'block' : 'hidden'}`}
          />
          {!hasCameraAccess && (
                <div className="text-center p-4">
                  <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Camera access is required for face recognition</p>
                  {cameraError && (
                    <p className="text-sm text-red-500 mt-2">{cameraError}</p>
                  )}
                </div>
              )}
              {isScanning && (
                <div className="absolute inset-0 border-4 border-blue-500 rounded-lg animate-pulse z-10">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>
                </div>
              )}
        </div>

        <div className="flex gap-2">
          {hasCameraAccess ? (
            <>
              <Button 
                onClick={startFaceScan} 
                disabled={isScanning || loading} 
                className="flex-1"
              >
                {isScanning ? (
                  <span className="flex items-center gap-2">
                    <Scan className="h-4 w-4 animate-pulse" />
                    Scanning...
                  </span>
                ) : 'Start Face Scan'}
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={stopCamera}
                title="Turn off camera"
              >
                <VideoOff className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button 
              onClick={startCamera} 
              className="w-full flex items-center gap-2"
              disabled={isScanning || loading}
            >
              <Video className="h-4 w-4" />
              Enable Camera
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {hasCameraAccess 
            ? "Make sure your face is well-lit and clearly visible"
            : "We need your permission to access the camera for face recognition"}
        </p>
      </CardContent>
    </Card>
  )
}
