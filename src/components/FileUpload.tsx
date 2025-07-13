import React, { useCallback, useState } from 'react';
import { Upload, Image, Music, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FileUploadProps {
  type: 'image' | 'audio';
  onFileSelect: (file: File) => void;
  accept: string;
  maxSize: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  type,
  onFileSelect,
  accept,
  maxSize
}) => {
  const { t } = useLanguage();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return t('fileTooLarge');
    }
    
    const validTypes = accept.split(',').map(t => t.trim());
    const fileType = file.type;
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.some(validType => 
      fileType.includes(validType.replace('*', '')) || 
      validType === fileExtension
    )) {
      return t('unsupportedFormat');
    }
    
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError(null);
    onFileSelect(file);
  }, [onFileSelect, maxSize, accept, t]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const Icon = type === 'image' ? Image : Music;
  const uploadText = type === 'image' ? t('dragDropImage') : t('dragDropAudio');
  const formatText = type === 'image' ? t('supportedImageFormats') : t('supportedAudioFormats');

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={uploadText}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className={`p-3 rounded-full ${error ? 'bg-red-100' : 'bg-gray-100'}`}>
            {error ? (
              <AlertTriangle className="h-8 w-8 text-red-500" />
            ) : (
              <Icon className="h-8 w-8 text-gray-600" />
            )}
          </div>
          
          <div className="space-y-2">
            <p className={`text-lg font-medium ${error ? 'text-red-700' : 'text-gray-700'}`}>
              {error || uploadText}
            </p>
            <p className="text-sm text-gray-500">{formatText}</p>
          </div>
          
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            {type === 'image' ? t('uploadImage') : t('uploadAudio')}
          </button>
        </div>
      </div>
    </div>
  );
};