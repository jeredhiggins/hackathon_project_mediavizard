import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Download, ArrowLeft, Loader2, CheckCircle, AlertTriangle, Eye, EyeOff, RotateCcw, FileCheck, Zap, Target, ZoomIn } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ImageProcessor } from '../utils/imageProcessing';

interface ImageRedactionProps {
  file: File;
  onBack: () => void;
}

interface DetectedFace {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  id: string;
  enabled: boolean;
}

export const ImageRedaction: React.FC<ImageRedactionProps> = ({ file, onBack }) => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const processorRef = useRef<ImageProcessor | null>(null);
  const detectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDetectionRunningRef = useRef(false);
  
  const [faces, setFaces] = useState<DetectedFace[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<'blur' | 'pixelate' | 'blackout'>('blur');
  const [sensitivityLevel, setSensitivityLevel] = useState(1); // 0=Fast, 1=Balanced, 2=Thorough
  const [processing, setProcessing] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [livePreviewUrl, setLivePreviewUrl] = useState<string>('');
  const [showDebugOverlay, setShowDebugOverlay] = useState(true);
  const [metadataVerification, setMetadataVerification] = useState<any>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [processingTime, setProcessingTime] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [detectionComplete, setDetectionComplete] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [uniformRedactionSize, setUniformRedactionSize] = useState(false);
  const [zoomMode, setZoomMode] = useState(false);

  const redactionMethods = [
    { id: 'blur', name: t('blur'), description: t('blurDescription'), icon: '🌫️' },
    { id: 'pixelate', name: t('pixelate'), description: t('pixelateDescription'), icon: '🔲' },
    { id: 'blackout', name: t('blackout'), description: t('blackoutDescription'), icon: '⬛' }
  ];

  // Initialize processor once
  useEffect(() => {
    processorRef.current = new ImageProcessor();
    
    // Set up loading status callback
    processorRef.current.onLoadingStatus((status: string) => {
      setLoadingStatus(status);
    });
    
    return () => {
      if (processorRef.current) {
        processorRef.current.dispose();
      }
      if (detectionTimeoutRef.current) {
        clearTimeout(detectionTimeoutRef.current);
      }
    };
  }, []);

  // Set up preview URL once
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // Enhanced face detection function
  const runFaceDetection = useCallback(async (sensitivity: number) => {
    if (isDetectionRunningRef.current || !imageLoaded || !processorRef.current) {
      return;
    }
    
    isDetectionRunningRef.current = true;
    setDetecting(true);
    setError(null);
    
    try {
      console.log(`🚀 Starting ADVANCED detection with sensitivity level: ${sensitivity}`);
      
      const startTime = performance.now();
      const detectedFaces = await processorRef.current.detectFaces(file, sensitivity);
      const endTime = performance.now();
      const timeTaken = endTime - startTime;
      
      setProcessingTime(timeTaken);
      console.log(`🎯 ADVANCED detection completed: ${detectedFaces.length} faces found in ${timeTaken.toFixed(2)}ms`);
      
      // Auto-enable all detected faces (privacy-by-default)
      const facesWithIds = detectedFaces.map((face, index) => ({
        ...face,
        id: `face-${index}`,
        enabled: true
      }));
      
      setFaces(facesWithIds);
      setDetectionComplete(true);
      
      // Auto-generate live preview
      if (facesWithIds.length > 0) {
        setTimeout(() => {
          generateLivePreview(facesWithIds);
        }, 300);
      }
      
    } catch (error) {
      console.error('🚨 ADVANCED face detection failed:', error);
      setError('Advanced face detection failed. Please try again or adjust sensitivity.');
      setFaces([]);
    } finally {
      setDetecting(false);
      isDetectionRunningRef.current = false;
    }
  }, [imageLoaded, file]);

  // Generate live preview function
  const generateLivePreview = useCallback(async (facesToPreview: DetectedFace[] = faces) => {
    if (!processorRef.current || processing) return;
    
    try {
      const enabledFaces = facesToPreview.filter(f => f.enabled);
      if (enabledFaces.length === 0) {
        setLivePreviewUrl('');
        return;
      }
      
      const previewDataUrl = await processorRef.current.createLivePreview(file, enabledFaces, selectedMethod);
      setLivePreviewUrl(previewDataUrl);
    } catch (error) {
      console.error('Live preview generation failed:', error);
    }
  }, [file, selectedMethod, processing]);

  // Trigger detection when image loads or sensitivity changes
  useEffect(() => {
    if (imageLoaded && !isDetectionRunningRef.current) {
      if (detectionTimeoutRef.current) {
        clearTimeout(detectionTimeoutRef.current);
      }
      
      setDetectionComplete(false);
      setProcessedBlob(null);
      setLivePreviewUrl('');
      
      detectionTimeoutRef.current = setTimeout(() => {
        runFaceDetection(sensitivityLevel);
      }, 500);
    }
  }, [imageLoaded, runFaceDetection, sensitivityLevel]);

  // Update live preview when method or faces change
  useEffect(() => {
    if (faces.length > 0 && !detecting && !processing) {
      const timeoutId = setTimeout(() => {
        generateLivePreview();
      }, 200);
      
      return () => clearTimeout(timeoutId);
    }
  }, [faces, selectedMethod, generateLivePreview, detecting, processing]);

  const applyRedaction = async (facesToRedact: DetectedFace[] = faces.filter(f => f.enabled)) => {
    if (facesToRedact.length === 0 || !processorRef.current || processing) {
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      console.log(`🛡️ Applying ${selectedMethod} protection to ${facesToRedact.length} faces`);
      
      const redactedBlob = await processorRef.current.applyRedaction(file, facesToRedact, selectedMethod);
      
      if (redactedBlob && redactedBlob.size > 0) {
        const cleanBlob = processorRef.current.stripMetadata(redactedBlob);
        setProcessedBlob(cleanBlob);
        
        console.log(`✅ Protection successful. Final blob size: ${cleanBlob.size} bytes`);
        
        const verification = await processorRef.current.verifyMetadataRemoval(file, cleanBlob);
        setMetadataVerification(verification);
      } else {
        throw new Error('Protection failed: empty result');
      }
      
    } catch (error) {
      console.error('❌ Protection failed:', error);
      setError('Protection failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleSensitivityChange = (value: number) => {
    setSensitivityLevel(value);
  };

  const toggleFace = (faceId: string) => {
    setFaces(prev => {
      const updated = prev.map(face => 
        face.id === faceId ? { ...face, enabled: !face.enabled } : face
      );
      
      // Auto-generate live preview after toggle
      setTimeout(() => {
        generateLivePreview(updated);
      }, 100);
      
      return updated;
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !imageLoaded || detecting || processing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const scaleX = imageSize.width / rect.width;
    const scaleY = imageSize.height / rect.height;
    
    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;
    
    console.log(`🎯 Canvas clicked at: ${clickX}, ${clickY}`);
    
    // Increase tap region padding for easier tapping (minimum 32x32 px touch zones)
    const tapPadding = Math.max(16, Math.min(32, Math.min(rect.width, rect.height) * 0.02));
    
    const clickedFace = faces.find(face => {
      const centerX = face.x + face.width / 2;
      const centerY = face.y + face.height / 2;
      const expandedWidth = Math.max(face.width, tapPadding * scaleX);
      const expandedHeight = Math.max(face.height, tapPadding * scaleY);
      
      return clickX >= centerX - expandedWidth / 2 && 
             clickX <= centerX + expandedWidth / 2 &&
             clickY >= centerY - expandedHeight / 2 && 
             clickY <= centerY + expandedHeight / 2;
    });
    
    if (clickedFace) {
      console.log(`🔄 Toggling face: ${clickedFace.id}`);
      toggleFace(clickedFace.id);
    } else {
      // SMART ADAPTIVE manual protection zone sizing
      const smartZoneSize = calculateSmartZoneSize(clickX, clickY, faces, imageSize);
      
      const newFace: DetectedFace = {
        x: Math.max(0, clickX - smartZoneSize / 2),
        y: Math.max(0, clickY - smartZoneSize / 2),
        width: Math.min(smartZoneSize, imageSize.width - (clickX - smartZoneSize / 2)),
        height: Math.min(smartZoneSize, imageSize.height - (clickY - smartZoneSize / 2)),
        confidence: 1.0,
        id: `manual-${Date.now()}`,
        enabled: true
      };
      
      console.log(`➕ Adding SMART manual protection region (size: ${smartZoneSize.toFixed(0)}px):`, newFace);
      
      setFaces(prev => {
        const updated = [...prev, newFace];
        setTimeout(() => {
          generateLivePreview(updated);
        }, 100);
        return updated;
      });
    }
  };

  // SMART zone sizing algorithm with improved proportional sizing
  const calculateSmartZoneSize = (clickX: number, clickY: number, existingFaces: DetectedFace[], imageSize: { width: number; height: number }): number => {
    // Strategy 1: Analyze nearby faces for context
    const nearbyFaces = existingFaces.filter(face => {
      const centerX = face.x + face.width / 2;
      const centerY = face.y + face.height / 2;
      const distance = Math.sqrt(Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2));
      return distance < Math.min(imageSize.width, imageSize.height) * 0.3; // Within 30% of image
    });
    
    if (nearbyFaces.length > 0) {
      // Use average size of nearby faces
      const avgNearbySize = nearbyFaces.reduce((sum, face) => sum + (face.width + face.height) / 2, 0) / nearbyFaces.length;
      console.log(`🎯 Using nearby face context: ${avgNearbySize.toFixed(0)}px`);
      return Math.max(32, Math.min(200, avgNearbySize));
    }
    
    // Strategy 2: Use global face size statistics
    if (existingFaces.length > 0) {
      const allSizes = existingFaces.map(face => (face.width + face.height) / 2);
      const avgSize = allSizes.reduce((sum, size) => sum + size, 0) / allSizes.length;
      const medianSize = allSizes.sort((a, b) => a - b)[Math.floor(allSizes.length / 2)];
      const contextualSize = (avgSize + medianSize) / 2;
      console.log(`📊 Using global face statistics: ${contextualSize.toFixed(0)}px`);
      return Math.max(40, Math.min(150, contextualSize));
    }
    
    // Strategy 3: Adaptive sizing based on image resolution and click position
    const imageArea = imageSize.width * imageSize.height;
    const imageDPI = Math.sqrt(imageArea) / 1000; // Rough DPI estimate
    
    // Position-based sizing (smaller near edges, larger in center)
    const centerX = imageSize.width / 2;
    const centerY = imageSize.height / 2;
    const distanceFromCenter = Math.sqrt(Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2));
    const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));
    const centerFactor = 1 + (1 - distanceFromCenter / maxDistance) * 0.3; // 0.7 to 1.3 multiplier
    
    // Base size from image characteristics - improved proportional sizing
    const baseSize = Math.max(40, Math.min(120, imageDPI * 35 * centerFactor));
    
    console.log(`🎨 Using adaptive sizing: ${baseSize.toFixed(0)}px (DPI: ${imageDPI.toFixed(1)}, centerFactor: ${centerFactor.toFixed(2)})`);
    return baseSize;
  };

  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !imageRef.current || !imageLoaded) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const img = imageRef.current;
    
    const maxWidth = 800;
    const maxHeight = 500;
    const aspectRatio = img.width / img.height;
    
    let displayWidth = maxWidth;
    let displayHeight = maxWidth / aspectRatio;
    
    if (displayHeight > maxHeight) {
      displayHeight = maxHeight;
      displayWidth = maxHeight * aspectRatio;
    }
    
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Show live preview if available, otherwise show original
    if (livePreviewUrl && !showDebugOverlay) {
      const previewImg = new Image();
      previewImg.onload = () => {
        ctx.drawImage(previewImg, 0, 0, canvas.width, canvas.height);
      };
      previewImg.src = livePreviewUrl;
    } else {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    
    // Draw simplified face overlays if debug mode is on
    if (showDebugOverlay && faces.length > 0) {
      const scaleX = canvas.width / imageSize.width;
      const scaleY = canvas.height / imageSize.height;
      
      faces.forEach((face, index) => {
        const { x, y, width, height, enabled } = face;
        
        const canvasX = x * scaleX;
        const canvasY = y * scaleY;
        const canvasWidth = width * scaleX;
        const canvasHeight = height * scaleY;
        
        // More transparent detection zone
        ctx.strokeStyle = enabled ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)';
        ctx.lineWidth = 2;
        ctx.strokeRect(canvasX, canvasY, canvasWidth, canvasHeight);
        
        // Subtle fill for better visibility
        ctx.fillStyle = enabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
        ctx.fillRect(canvasX, canvasY, canvasWidth, canvasHeight);
        
        // Add manual detection indicator (small corner marker)
        if (face.id.startsWith('manual-')) {
          ctx.fillStyle = 'rgba(139, 92, 246, 0.8)';
          ctx.fillRect(canvasX, canvasY, 8, 8);
        }
        
        // Minimum 32x32 touch zone visualization in zoom mode
        if (zoomMode) {
          const minTouchSize = 32;
          const touchZoneX = canvasX + canvasWidth / 2 - minTouchSize / 2;
          const touchZoneY = canvasY + canvasHeight / 2 - minTouchSize / 2;
          
          ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(touchZoneX, touchZoneY, minTouchSize, minTouchSize);
          ctx.setLineDash([]);
        }
      });
    }
  }, [faces, showDebugOverlay, imageLoaded, imageSize, livePreviewUrl, zoomMode]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      const img = imageRef.current;
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      setImageLoaded(true);
      console.log(`📸 Image loaded: ${img.naturalWidth}x${img.naturalHeight}`);
    }
  };

  const handleDownload = () => {
    if (!processedBlob) {
      console.error('❌ No processed blob available for download');
      return;
    }
    
    console.log(`💾 Downloading protected image. Size: ${processedBlob.size} bytes`);
    
    const url = URL.createObjectURL(processedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `protected_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetToOriginal = () => {
    setProcessedBlob(null);
    setLivePreviewUrl('');
    setFaces(prev => prev.map(face => ({ ...face, enabled: true })));
    setMetadataVerification(null);
    setError(null);
    setDetectionComplete(false);
    
    if (imageLoaded && !isDetectionRunningRef.current) {
      setTimeout(() => {
        runFaceDetection(sensitivityLevel);
      }, 300);
    }
  };

  const getSensitivityLabel = (value: number): string => {
    switch (value) {
      case 0: return 'Fast & Basic';
      case 1: return 'Balanced (Default)';
      case 2: return 'Thorough & Advanced';
      default: return 'Balanced (Default)';
    }
  };

  const getSensitivityDescription = (value: number): string => {
    switch (value) {
      case 0: return 'MediaPipe Short - Speed-prioritized for clear faces (≥0.50 confidence)';
      case 1: return 'Multi-Model Detection - General-purpose with MediaPipe models (≥0.30 confidence)';
      case 2: return 'Advanced Multi-Model - Maximum accuracy with comprehensive post-processing (≥0.10 confidence)';
      default: return 'Multi-Model Detection - General-purpose with MediaPipe models (≥0.30 confidence)';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          aria-label={t('backToUpload')}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToUpload')}
        </button>
      </div>

      {/* Loading Status */}
      {loadingStatus && !detectionComplete && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="text-blue-800 dark:text-blue-300 font-medium">{loadingStatus}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-red-800 dark:text-red-300 font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('step2')}</h3>
              {detectionComplete && (
                <div className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
                  <Target className="h-4 w-4" />
                  ADVANCED Multi-Model Detection
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setZoomMode(!zoomMode)}
                className={`flex items-center gap-2 px-3 py-1 text-sm rounded-lg transition-colors ${
                  zoomMode 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label="Toggle zoom assist mode"
              >
                <ZoomIn className="h-4 w-4" />
                Zoom Assist
              </button>
              
              <button
                onClick={() => setShowDebugOverlay(!showDebugOverlay)}
                className={`flex items-center gap-2 px-3 py-1 text-sm rounded-lg transition-colors ${
                  showDebugOverlay 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-label={showDebugOverlay ? t('hideOverlay') : t('showOverlay')}
              >
                {showDebugOverlay ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showDebugOverlay ? 'Hide Detection' : 'Show Detection'}
              </button>
              
              {processingTime > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
                  <Zap className="h-4 w-4" />
                  {processingTime.toFixed(0)}ms
                </div>
              )}
            </div>
          </div>
          
          {/* Interactive Canvas with Live Preview */}
          <div className="space-y-4">
            <div className="relative">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className={`w-full max-w-4xl mx-auto border rounded-lg bg-gray-100 dark:bg-gray-700 ${
                  detecting || processing ? 'cursor-wait' : 'cursor-crosshair'
                }`}
                style={{ maxHeight: '500px' }}
                aria-label="Interactive face detection canvas with live preview"
              />
              
              <img
                ref={imageRef}
                src={previewUrl}
                alt="Preview"
                className="hidden"
                onLoad={handleImageLoad}
              />
              
              {showDebugOverlay && !detecting && !processing && (
                <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded">
                  💡 {t('tapToToggle')} • {t('tapToAdd')} • 🎯 Smart sizing enabled
                  {zoomMode && ' • 📱 32px touch zones visible'}
                </div>
              )}
              
              {!showDebugOverlay && livePreviewUrl && (
                <div className="absolute top-2 right-2 bg-green-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded">
                  ✨ Live Preview Active
                </div>
              )}
              
              {(detecting || processing) && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {detecting ? 'Running ADVANCED multi-model detection...' : 'Processing protection...'}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {detecting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  ADVANCED multi-model detection in progress...
                </div>
              ) : (
                <p>
                  {faces.length > 0 
                    ? `${faces.filter(f => f.enabled).length}/${faces.length} ${t('facesWillBeRedacted')} • ${faces.filter(f => f.id.startsWith('manual-')).length} manual zones`
                    : t('noFacesDetected')
                  }
                  {livePreviewUrl && !showDebugOverlay && ' • Live preview active'}
                </p>
              )}
            </div>
          </div>

          {/* ADVANCED Multi-Model Detection Sensitivity Slider */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('detectionSensitivity')}
              </label>
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                {getSensitivityLabel(sensitivityLevel)}
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={sensitivityLevel}
                onChange={(e) => handleSensitivityChange(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                disabled={detecting || processing}
                aria-label={t('detectionSensitivity')}
              />
              {/* Enhanced Slider tick marks */}
              <div className="flex justify-between mt-2 px-1">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full border-2 ${sensitivityLevel === 0 ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Fast</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">MediaPipe Short</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full border-2 ${sensitivityLevel === 1 ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Balanced</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">Multi-Model Detection</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full border-2 ${sensitivityLevel === 2 ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Thorough</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">Advanced Multi-Model</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              {getSensitivityDescription(sensitivityLevel)}
            </p>
          </div>

          {/* Protection Method Selector */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 dark:text-gray-200">{t('redactionMethod')}</h4>
            <div className="grid grid-cols-3 gap-3">
              {redactionMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedMethod(method.id as any);
                    // Auto-update live preview with new method
                    if (faces.filter(f => f.enabled).length > 0 && !processing) {
                      setTimeout(() => generateLivePreview(), 200);
                    }
                  }}
                  disabled={processing}
                  className={`p-3 border rounded-lg text-center transition-colors disabled:opacity-50 ${
                    selectedMethod === method.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  aria-label={`Select ${method.name} protection method`}
                >
                  <div className="text-2xl mb-1">{method.icon}</div>
                  <div className="font-medium text-sm">{method.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Redaction Options */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 dark:text-gray-200">Redaction Options</h4>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uniformRedactionSize}
                  onChange={(e) => setUniformRedactionSize(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Uniform redaction size (vs face-fitted)
                </span>
              </label>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {faces.length > 0 && (
              <button
                onClick={() => applyRedaction()}
                disabled={processing || detecting || faces.filter(f => f.enabled).length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label={`${t('applyRedaction')} to ${faces.filter(f => f.enabled).length} faces`}
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {t('applyRedaction')} ({faces.filter(f => f.enabled).length})
              </button>
            )}

            {processedBlob && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                aria-label={t('downloadSecureFile')}
              >
                <Download className="h-4 w-4" />
                {t('downloadSecureFile')}
              </button>
            )}

            {(processedBlob || livePreviewUrl) && (
              <button
                onClick={resetToOriginal}
                disabled={processing || detecting}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
                aria-label={t('resetToOriginal')}
              >
                <RotateCcw className="h-4 w-4" />
                {t('resetToOriginal')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Metadata Verification */}
      {metadataVerification && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FileCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('securityVerification')}</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h5 className="font-medium text-gray-700 dark:text-gray-300">{t('metadataRemoval')}</h5>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${metadataVerification.metadataRemoved ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {metadataVerification.metadataRemoved ? t('allMetadataRemoved') : t('noMetadataFound')}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-gray-700 dark:text-gray-300">{t('privacyProtection')}</h5>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('facesRedacted')}: {faces.filter(f => f.enabled).length} 
                  {faces.filter(f => f.id.startsWith('manual-')).length > 0 && ` (${faces.filter(f => f.id.startsWith('manual-')).length} manual)`}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-300">
              ✅ {t('readyForSharing')} - {t('noPersonalDataRemains')}
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Processing Complete */}
      {processedBlob && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-green-800 dark:text-green-300 font-medium">{t('processingComplete')}</p>
          </div>
          <p className="text-green-700 dark:text-green-400 text-sm">
            {faces.filter(f => f.enabled).length} faces protected using ADVANCED multi-model {selectedMethod} method • 
            {t('metadataRemoved')} • 
            {t('readyForDownload')}
          </p>
        </div>
      )}
    </div>
  );
};