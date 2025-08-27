// src/app/v2/components/FileUpload/FileUpload.tsx

"use client";

import React, { InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import styles from './FileUpload.module.css';
import { FaFileAlt, FaFileImage, FaFilePdf, FaFileWord, FaFilePowerpoint, FaFileExcel, FaFileArchive, FaFileAudio, FaFileVideo, FaQuestionCircle, FaTimes } from 'react-icons/fa';


interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSelect: (files: File[]) => void; // onSelect will only receive valid files
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
  className?: string; // Classes for the container
  dragAndDropClassName?: string; // Classes for the drag-and-drop area
  fileDetailsClassName?: string; // Classes for file details
  uploadButtonLabel?: React.ReactNode; // Custom label for the upload button area
  dragDropText?: React.ReactNode; // Custom text for drag-and-drop area
  showFileList?: boolean;
  showProgressBar?: boolean; // Visual only in this component
  showRemoveButton?: boolean;
  onRemove?: (file: File) => void; // onRemove will receive the file being removed (valid or error)
  maxSize?: number;
}

// Define a type for files in our state
interface FileWithStatus {
  file: File;
  error?: string; // Optional error message for this file
}

// Map file types to icons
const fileTypeIcons: { [key: string]: React.ReactNode } = {
    'image': <FaFileImage />,
    'application/pdf': <FaFilePdf />,
    'application/msword': <FaFileWord />,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <FaFileWord />,
    'application/vnd.ms-powerpoint': <FaFilePowerpoint />,
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': <FaFilePowerpoint />,
    'application/vnd.ms-excel': <FaFileExcel />,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <FaFileExcel />,
    'application/zip': <FaFileArchive />,
    'audio': <FaFileAudio />,
    'video': <FaFileVideo />,
    // Add more mappings as needed
  };

const FileUpload: React.FC<FileUploadProps> = ({
  onSelect,
  multiple = false,
  accept,
  disabled = false,
  className,
  dragAndDropClassName,
  fileDetailsClassName,
  uploadButtonLabel,
  dragDropText = 'Drag and drop files here, or click to select files',
  showFileList = true,
  showProgressBar = false,
  showRemoveButton = true,
  onRemove,
  maxSize,
  ...props // Capture other input props
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  // Explicitly type the useState hook
  const [selectedFiles, setSelectedFiles] = useState<FileWithStatus[]>([]);
  const [filePreviews, setFilePreviews] = useState<{ [key: string]: string | null }>({});


  // Generate image previews when selectedFiles changes
  useEffect(() => {
    const generatePreviews = async () => {
        const previews: { [key: string]: string | null } = {};
        // Only generate previews for files that are images and don't have errors
        const filesToPreview = selectedFiles.filter(item => item.file.type.startsWith('image/') && !item.error);

        for (const item of filesToPreview) {
            const file = item.file;
            const reader = new FileReader();
            reader.onload = (e) => {
                previews[file.name] = e.target?.result as string;
                setFilePreviews({ ...previews });
            };
            reader.readAsDataURL(file);
        }
        // Ensure previews for removed/error files are also cleared
         setFilePreviews(prevPreviews => {
             const newPreviews = { ...prevPreviews };
             Object.keys(newPreviews).forEach(fileName => {
                 // Check if the file still exists in the selectedFiles state (by name) and has no error
                 if (!selectedFiles.some(item => item.file.name === fileName && !item.error)) {
                     delete newPreviews[fileName];
                 }
             });
             return newPreviews;
         });
    };

    generatePreviews();
}, [selectedFiles]);


const handleFileSelect = (files: FileList | null) => {
    if (files) {
        const incomingFiles = Array.from(files);
        const processedFiles: FileWithStatus[] = incomingFiles.map(file => {
            if (maxSize !== undefined && file.size > maxSize) {
                 console.warn(`File "${file.name}" exceeds maximum size of ${formatBytes(maxSize)}.`);
                return { file, error: `File exceeds maximum size (${formatBytes(maxSize)})` };
            }
            return { file }; // No error
        });

        // Update state with all files (including those with errors)
        setSelectedFiles(prevFiles => multiple ? [...prevFiles, ...processedFiles] : processedFiles);

        // Filter out files with errors before calling onSelect
        const validFiles = processedFiles
            .filter(item => !item.error)
            .map(item => item.file);

        onSelect(validFiles);
    }
  };


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files);
    event.target.value = '';
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
     if (!disabled) {
        event.dataTransfer.dropEffect = 'copy';
     }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragging(false);
      handleFileSelect(event.dataTransfer.files);
    }
  };

   // handleRemoveFile now expects a FileWithStatus object
  const handleRemoveFile = (itemToRemove: FileWithStatus) => {
    // Filter based on the file object within FileWithStatus
    setSelectedFiles(prevFiles => prevFiles.filter(item => item.file.name !== itemToRemove.file.name)); // Filter by name for uniqueness
     // Clear the preview for the removed file
    setFilePreviews(prevPreviews => {
        const newPreviews = { ...prevPreviews };
        delete newPreviews[itemToRemove.file.name];
        return newPreviews;
    });
    if (onRemove) {
        onRemove(itemToRemove.file); // Pass the actual File object to onRemove
    }
    // If the removed file was valid, call onSelect with the updated list of valid files
     if (!itemToRemove.error && onSelect) {
         // Filter based on the *updated* selectedFiles state after removal
         const remainingValidFiles = selectedFiles // Use the state directly here
             .filter(item => item.file.name !== itemToRemove.file.name && !item.error) // Filter by name and no error
             .map(item => item.file);
         onSelect(remainingValidFiles);
     }
};



const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

   // Determine the file type icon based on MIME type
   const getFileTypeIcon = (file: File): React.ReactNode => {
       if (file.type.startsWith('image/')) return fileTypeIcons['image'];
       if (file.type.startsWith('audio/')) return fileTypeIcons['audio'];
       if (file.type.startsWith('video/')) return fileTypeIcons['video'];
       return fileTypeIcons[file.type] || <FaQuestionCircle />;
   };


  const containerClasses = `${styles.fileUploadContainer} ${disabled ? styles.disabled : ''} ${className || ''}`;
  const dragAndDropAreaClasses = `${styles.dragAndDropArea} ${isDragging ? styles.active : ''} ${disabled ? styles.disabled : ''} ${dragAndDropClassName || ''}`;


  return (
    <div className={containerClasses}>
      {/* Visually hidden native file input */}
      <input
        type="file"
        ref={fileInputRef}
        className={styles.nativeFileInput}
        onChange={handleInputChange}
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        {...props}
      />

      {/* Clickable/Drag-and-drop area */}
      <div
        className={dragAndDropAreaClasses}
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {uploadButtonLabel ? (
           uploadButtonLabel
        ) : (
           <span>{dragDropText}</span>
        )}
      </div>

      {/* Optional File List */}
      {showFileList && selectedFiles.length > 0 && (
        <div className={styles.fileList}>
          {selectedFiles.map((item) => ( // Iterate over FileWithStatus objects (used 'item' for clarity)
            <div key={item.file.name} className={styles.fileItem}> {/* Use item.file.name for key */}
                <div className={styles.fileInfo}>
                    {/* Image Preview or File Type Icon (only show preview if no error) */}
                     {item.file.type.startsWith('image/') && filePreviews[item.file.name] && !item.error ? (
                         <img src={filePreviews[item.file.name]!} alt={`Preview of ${item.file.name}`} className={styles.imagePreview} />
                     ) : (
                          // Only show icon if no preview or if not an image
                         <span className={styles.fileTypeIcon}>{getFileTypeIcon(item.file)}</span>
                     )}

                    <div className={styles.fileDetails}>
                       <span>{item.file.name}</span>
                       <span className={styles.fileSize}>({formatBytes(item.file.size)})</span>
                        {/* Display error message if exists */}
                        {item.error && (
                             <p className={styles.fileError}>{item.error}</p>
                        )}
                    </div>
                </div>


               {showRemoveButton && !disabled && (
                 <span className={styles.removeButton} onClick={() => handleRemoveFile(item)}> {/* Pass the FileWithStatus item */}
                    <FaTimes />
                 </span>
               )}
            </div>
          ))}
        </div>
      )}

       {/* Optional Progress Bar (Visual only) */}
       {showProgressBar && (
           <div className={styles.progressBarContainer}>
                <div className={styles.progressBarFill} style={{ width: '0%' }}></div>
           </div>
       )}

    </div>
  );
};

export default FileUpload;
