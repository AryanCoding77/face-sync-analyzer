import React, { useState, useRef } from 'react';
import { Upload, Camera, Image, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';

interface FaceUploaderProps {
  onImageCaptured: (imageData: string) => void;
  isAnalyzing?: boolean;
}

const FaceUploader: React.FC<FaceUploaderProps> = ({ onImageCaptured, isAnalyzing = false }) => {
  const [captureMode, setCaptureMode] = useState<'upload' | 'camera'>('upload');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageDataUrl = event.target.result as string;
        setPreviewImage(imageDataUrl);
        onImageCaptured(imageDataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const handleCameraMode = () => {
    setCaptureMode('camera');
    startCamera();
  };

  const captureImage = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/png');
      setPreviewImage(imageDataUrl);
      onImageCaptured(imageDataUrl);
      stopCamera();
    }
  };

  const clearImage = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const cancelCapture = () => {
    stopCamera();
    setCaptureMode('upload');
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto overflow-hidden animate-scale-in">
      <CardHeader>
        <CardTitle>Upload Your Photo</CardTitle>
        <CardDescription>
          Provide a clear, front-facing photo for the most accurate analysis
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="relative min-h-[320px] bg-gray-50 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
          {previewImage ? (
            <div className="relative w-full h-full">
              <img 
                src={previewImage} 
                alt="Preview" 
                className="w-full h-full object-contain" 
              />
              {!isAnalyzing && (
                <button 
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-text-secondary hover:text-destructive transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              
              {isAnalyzing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-center text-white">
                    <div className="relative w-16 h-16 mx-auto mb-4">
                      <div className="absolute inset-0 rounded-full border-t-2 border-accent-blue animate-spin"></div>
                      <div className="absolute inset-3 rounded-full border-t-2 border-accent-blue animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                    </div>
                    <p className="text-lg font-medium">Analyzing your face...</p>
                    <p className="text-sm text-white/80 mt-2">This may take a moment</p>
                  </div>
                </div>
              )}
            </div>
          ) : captureMode === 'camera' && isCapturing ? (
            <div className="relative w-full h-full">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="text-center p-6">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                {captureMode === 'upload' ? (
                  <Image className="h-12 w-12" />
                ) : (
                  <Camera className="h-12 w-12" />
                )}
              </div>
              <p className="text-sm text-text-secondary mb-1">
                {captureMode === 'upload' 
                  ? 'Drag and drop your image here, or click to browse' 
                  : 'Position your face in the frame'
                }
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF • Max 5MB
              </p>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap justify-center sm:justify-between gap-3">
        {!previewImage && captureMode === 'upload' && (
          <>
            <Button onClick={triggerFileInput}>
              <Upload className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
            <Button variant="secondary" onClick={handleCameraMode}>
              <Camera className="mr-2 h-4 w-4" />
              Use Camera
            </Button>
          </>
        )}

        {!previewImage && captureMode === 'camera' && isCapturing && (
          <>
            <Button onClick={captureImage}>
              Capture Photo
            </Button>
            <Button variant="secondary" onClick={cancelCapture}>
              Cancel
            </Button>
          </>
        )}

        {previewImage && !isAnalyzing && (
          <div className="w-full flex justify-center">
            <Button 
              onClick={() => onImageCaptured(previewImage)}
            >
              Continue to Analysis
            </Button>
          </div>
        )}
        
        {previewImage && isAnalyzing && (
          <div className="w-full flex justify-center">
            <Button disabled>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Analyzing Image...
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default FaceUploader;
