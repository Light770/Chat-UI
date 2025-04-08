// components/ChatUI/FileUploadZone.tsx
import React, { useState, useRef } from 'react';
import { 
  ArrowUpTrayIcon, 
  DocumentIcon, 
  PhotoIcon, 
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface FileUploadZoneProps {
  onFileUpload: (files: File[]) => void;
  onCancel: () => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
  className?: string;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileUpload,
  onCancel,
  maxFiles = 5,
  maxFileSize = 10, // 10MB default
  acceptedFileTypes,
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFiles = (files: File[]): boolean => {
    // Check number of files
    if (files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return false;
    }

    // Check file sizes
    const oversizedFiles = files.filter(file => file.size > maxFileSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`File size exceeds the ${maxFileSize}MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return false;
    }

    // Check file types if specified
    if (acceptedFileTypes && acceptedFileTypes.length > 0) {
      const invalidFiles = files.filter(file => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
        return !acceptedFileTypes.includes(`.${fileExtension}`) && 
               !acceptedFileTypes.includes(file.type);
      });

      if (invalidFiles.length > 0) {
        setError(`Invalid file type(s): ${invalidFiles.map(f => f.name).join(', ')}`);
        return false;
      }
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      handleFiles(droppedFiles);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (files: File[]) => {
    setError(null);
    
    if (validateFiles(files)) {
      setSelectedFiles(prevFiles => {
        const combinedFiles = [...prevFiles, ...files];
        // Deduplicate by name
        const uniqueFiles = combinedFiles.filter((file, index, self) => 
          index === self.findIndex(f => f.name === file.name)
        );
        return uniqueFiles.slice(0, maxFiles);
      });
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (selectedFiles.length > 0) {
      onFileUpload(selectedFiles);
      setSelectedFiles([]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    
    if (type.startsWith('image/')) {
      return <PhotoIcon className="h-6 w-6 text-blue-500" />;
    }
    
    return <DocumentIcon className="h-6 w-6 text-gray-500" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div 
        className={`
          border-2 border-dashed rounded-lg p-6 text-center
          ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
          ${error ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20' : ''}
        `}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          accept={acceptedFileTypes?.join(',')}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center">
          <ArrowUpTrayIcon className={`h-10 w-10 mb-3 ${error ? 'text-red-500' : 'text-gray-400'}`} />
          
          {error ? (
            <div className="text-red-600 dark:text-red-400 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-1" />
              <span>{error}</span>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Drag & drop files here, or{' '}
                <button
                  type="button"
                  onClick={onButtonClick}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium focus:outline-none"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {acceptedFileTypes 
                  ? `Accepted formats: ${acceptedFileTypes.join(', ')}`
                  : 'All file types accepted'
                }
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Max {maxFiles} files, up to {maxFileSize}MB each
              </p>
            </>
          )}
        </div>
      </div>
      
      {/* Selected files list */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Selected files ({selectedFiles.length}/{maxFiles})
          </h4>
          
          <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-md p-2">
                <div className="flex items-center space-x-3 overflow-hidden">
                  {getFileIcon(file)}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-red-500 focus:outline-none"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={selectedFiles.length === 0 || !!error}
          className={`
            px-4 py-2 text-sm font-medium rounded-md
            ${selectedFiles.length === 0 || !!error
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default FileUploadZone;