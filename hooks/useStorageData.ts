// hooks/useStorageData.ts - Updated with folder and workspace filtering
"use client";

import { useMemo } from 'react';
import { 
  EnhancedFolderItem, 
  EnhancedFileItem, 
  FilterType, 
  SortConfig 
} from '@/types/storage';

interface UseStorageDataProps {
  folders: EnhancedFolderItem[];
  files: EnhancedFileItem[];
  filters: FilterType;
  sortConfig: SortConfig;
  currentFolderId?: number | null;
  workspaceId?: number | null;
}

export function useStorageData({ 
  folders, 
  files, 
  filters, 
  sortConfig,
  currentFolderId,
  workspaceId
}: UseStorageDataProps) {
  
  // First, filter by current folder and workspace
  const filteredByContext = useMemo(() => {
    let filteredFolders = [...folders];
    let filteredFiles = [...files];

    // Filter by current folder
    if (currentFolderId !== undefined && currentFolderId !== null) {
      if (currentFolderId === 0) {
        // Root view - show items without parent folder
        filteredFolders = filteredFolders.filter(folder => !folder.parentFolderId);
        filteredFiles = filteredFiles.filter(file => !file.folderId);
      } else {
        // Specific folder view - show items in this folder
        filteredFolders = filteredFolders.filter(folder => folder.parentFolderId === currentFolderId);
        filteredFiles = filteredFiles.filter(file => file.folderId === currentFolderId);
      }
    }

    // Filter by workspace
    if (workspaceId !== undefined && workspaceId !== null) {
      if (workspaceId === 0) {
        // All workspaces - no filter
      } else {
        // Specific workspace - show items in this workspace
        filteredFolders = filteredFolders.filter(folder => folder.workspaceId === workspaceId);
        filteredFiles = filteredFiles.filter(file => file.workspaceId === workspaceId);
      }
    }

    return { filteredFolders, filteredFiles };
  }, [folders, files, currentFolderId, workspaceId]);

  // Then apply search and other filters
  const filteredFolders = useMemo(() => {
    let result = [...filteredByContext.filteredFolders];
    
    // Apply search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(folder => 
        folder?.name?.toLowerCase().includes(searchLower) ||
        folder?.owner?.toLowerCase().includes(searchLower) ||
        (folder?.tags && Array.isArray(folder.tags) && 
          folder.tags.some(tag => 
            tag?.toLowerCase().includes(searchLower)
          )
        )
      );
    }
    
    // Apply category filter
    if (filters?.category && filters.category !== 'all') {
      switch (filters.category) {
        case 'folders':
          // Already folders
          break;
        case 'documents':
          result = result.filter(folder => {
            const name = folder?.name?.toLowerCase() || '';
            const tags = Array.isArray(folder?.tags) ? folder.tags : [];
            return (
              name.includes('doc') ||
              name.includes('report') ||
              tags.some(tag => 
                ['documents', 'reports', 'files'].includes(tag?.toLowerCase())
              )
            );
          });
          break;
        case 'images':
        case 'video':
        case 'audio':
        case 'pdfs':
        case 'presentations':
        case 'spreadsheets':
          // These categories are more relevant for files
          result = [];
          break;
        default:
          break;
      }
    }
    
    // Apply last modified filter
    if (filters?.lastModified && filters.lastModified !== 'all') {
      const now = new Date();
      result = result.filter(folder => {
        if (!folder?.lastModified) return true;
        
        try {
          const folderDate = new Date(folder.lastModified);
          if (isNaN(folderDate.getTime())) return true;
          
          const diffTime = Math.abs(now.getTime() - folderDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          switch (filters.lastModified) {
            case 'today':
              return diffDays === 0;
            case 'week':
              return diffDays <= 7;
            case 'month':
              return diffDays <= 30;
            case 'year':
              return diffDays <= 365;
            case 'older':
              return diffDays > 365;
            default:
              return true;
          }
        } catch {
          return true;
        }
      });
    }
    
    // Apply date added filter
    if (filters?.dateAdded && filters.dateAdded !== 'all') {
      const now = new Date();
      result = result.filter(folder => {
        if (!folder?.dateAdded) return true;
        
        try {
          const addedDate = new Date(folder.dateAdded);
          if (isNaN(addedDate.getTime())) return true;
          
          const diffTime = Math.abs(now.getTime() - addedDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          switch (filters.dateAdded) {
            case 'today':
              return diffDays === 0;
            case 'week':
              return diffDays <= 7;
            case 'month':
              return diffDays <= 30;
            case 'year':
              return diffDays <= 365;
            case 'older':
              return diffDays > 365;
            default:
              return true;
          }
        } catch {
          return true;
        }
      });
    }
    
    // Apply people filter
    if (filters?.people && filters.people !== 'all') {
      switch (filters.people) {
        case 'me':
          // Filter to items owned by current user (assuming ID 1)
          result = result.filter(folder => folder?.ownerId === 1);
          break;
        case 'shared':
          // Use sharedWithIds length to determine if shared
          result = result.filter(folder => 
            Array.isArray(folder?.sharedWithIds) && folder.sharedWithIds.length > 0
          );
          break;
        case 'everyone':
          // No filter
          break;
      }
    }
    
    // Apply sorting
    if (sortConfig?.key) {
      result.sort((a, b) => {
        const aValue = a?.[sortConfig.key as keyof EnhancedFolderItem];
        const bValue = b?.[sortConfig.key as keyof EnhancedFolderItem];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'ascending' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'ascending'
            ? aValue - bValue
            : bValue - aValue;
        }
        
        // Special handling for size strings (e.g., "12 MB")
        if (sortConfig.key === 'size') {
          const getSizeInMB = (size: string): number => {
            if (!size) return 0;
            const match = size.match(/([\d.]+)\s*(MB|KB|GB|B)/i);
            if (!match) return 0;
            
            const value = parseFloat(match[1]);
            if (isNaN(value)) return 0;
            
            const unit = match[2].toUpperCase();
            
            switch (unit) {
              case 'GB': return value * 1024;
              case 'MB': return value;
              case 'KB': return value / 1024;
              case 'B': return value / (1024 * 1024);
              default: return value;
            }
          };
          
          const aSize = getSizeInMB(a?.size || '');
          const bSize = getSizeInMB(b?.size || '');
          
          return sortConfig.direction === 'ascending'
            ? aSize - bSize
            : bSize - aSize;
        }
        
        // Special handling for date strings
        if (sortConfig.key === 'lastModified' || sortConfig.key === 'dateAdded' || sortConfig.key === 'lastOpened') {
          try {
            const aDate = new Date(aValue as string);
            const bDate = new Date(bValue as string);
            
            if (isNaN(aDate.getTime()) || isNaN(bDate.getTime())) return 0;
            
            return sortConfig.direction === 'ascending'
              ? aDate.getTime() - bDate.getTime()
              : bDate.getTime() - aDate.getTime();
          } catch {
            return 0;
          }
        }
        
        // Special handling for shared count (using sharedWithIds length)
        if (sortConfig.key === 'sharedWith') {
          const aSharedCount = Array.isArray(a?.sharedWithIds) ? a.sharedWithIds.length : 0;
          const bSharedCount = Array.isArray(b?.sharedWithIds) ? b.sharedWithIds.length : 0;
          
          return sortConfig.direction === 'ascending'
            ? aSharedCount - bSharedCount
            : bSharedCount - aSharedCount;
        }
        
        // Special handling for files count (using fileIds length)
        if (sortConfig.key === 'filesInside') {
          const aFilesCount = Array.isArray(a?.fileIds) ? a.fileIds.length : 0;
          const bFilesCount = Array.isArray(b?.fileIds) ? b.fileIds.length : 0;
          
          return sortConfig.direction === 'ascending'
            ? aFilesCount - bFilesCount
            : bFilesCount - aFilesCount;
        }
        
        return 0;
      });
    }
    
    return result;
  }, [filteredByContext.filteredFolders, filters, sortConfig]);

  const filteredFiles = useMemo(() => {
    let result = [...filteredByContext.filteredFiles];
    
    // Apply search filter
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(file => 
        file?.name?.toLowerCase().includes(searchLower) ||
        file?.owner?.toLowerCase().includes(searchLower) ||
        file?.fileType?.toLowerCase().includes(searchLower) ||
        (Array.isArray(file?.tags) && 
          file.tags.some(tag => 
            tag?.toLowerCase().includes(searchLower)
          )
        )
      );
    }
    
    // Apply category filter
    if (filters?.category && filters.category !== 'all') {
      switch (filters.category) {
        case 'folders':
          // No files for folders category
          result = [];
          break;
        case 'documents':
          result = result.filter(file => {
            const fileType = file?.fileType?.toUpperCase() || '';
            const name = file?.name?.toLowerCase() || '';
            return (
              ['DOC', 'DOCX', 'TXT', 'PDF', 'RTF'].includes(fileType) ||
              name.includes('doc') ||
              name.includes('report')
            );
          });
          break;
        case 'images':
          result = result.filter(file => {
            const fileType = file?.fileType?.toUpperCase() || '';
            const name = file?.name?.toLowerCase() || '';
            return (
              ['JPG', 'JPEG', 'PNG', 'GIF', 'SVG', 'BMP', 'WEBP'].includes(fileType) ||
              name.includes('image') ||
              name.includes('photo') ||
              name.includes('screenshot')
            );
          });
          break;
        case 'video':
          result = result.filter(file => {
            const fileType = file?.fileType?.toUpperCase() || '';
            const name = file?.name?.toLowerCase() || '';
            return (
              ['MP4', 'MKV', 'AVI', 'MOV', 'WMV', 'FLV'].includes(fileType) ||
              name.includes('video') ||
              name.includes('recording')
            );
          });
          break;
        case 'audio':
          result = result.filter(file => {
            const fileType = file?.fileType?.toUpperCase() || '';
            const name = file?.name?.toLowerCase() || '';
            return (
              ['MP3', 'WAV', 'AAC', 'FLAC', 'OGG'].includes(fileType) ||
              name.includes('audio') ||
              name.includes('music')
            );
          });
          break;
        case 'pdfs':
          result = result.filter(file => 
            file?.fileType?.toUpperCase() === 'PDF'
          );
          break;
        case 'presentations':
          result = result.filter(file => {
            const fileType = file?.fileType?.toUpperCase() || '';
            const name = file?.name?.toLowerCase() || '';
            return (
              ['PPT', 'PPTX', 'KEY', 'ODP'].includes(fileType) ||
              name.includes('presentation') ||
              name.includes('deck')
            );
          });
          break;
        case 'spreadsheets':
          result = result.filter(file => {
            const fileType = file?.fileType?.toUpperCase() || '';
            const name = file?.name?.toLowerCase() || '';
            return (
              ['XLS', 'XLSX', 'CSV', 'ODS'].includes(fileType) ||
              name.includes('spreadsheet') ||
              name.includes('excel')
            );
          });
          break;
        case 'others':
          const commonTypes = ['DOC', 'DOCX', 'PDF', 'JPG', 'JPEG', 'PNG', 'MP4', 'MP3', 'XLS', 'XLSX', 'PPT', 'PPTX'];
          result = result.filter(file => {
            const fileType = file?.fileType?.toUpperCase() || '';
            return !commonTypes.includes(fileType);
          });
          break;
        default:
          break;
      }
    }
    
    // Apply last modified filter
    if (filters?.lastModified && filters.lastModified !== 'all') {
      const now = new Date();
      result = result.filter(file => {
        if (!file?.lastModified) return true;
        
        try {
          const fileDate = new Date(file.lastModified);
          if (isNaN(fileDate.getTime())) return true;
          
          const diffTime = Math.abs(now.getTime() - fileDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          switch (filters.lastModified) {
            case 'today':
              return diffDays === 0;
            case 'week':
              return diffDays <= 7;
            case 'month':
              return diffDays <= 30;
            case 'year':
              return diffDays <= 365;
            case 'older':
              return diffDays > 365;
            default:
              return true;
          }
        } catch {
          return true;
        }
      });
    }
    
    // Apply date added filter
    if (filters?.dateAdded && filters.dateAdded !== 'all') {
      const now = new Date();
      result = result.filter(file => {
        if (!file?.dateAdded) return true;
        
        try {
          const addedDate = new Date(file.dateAdded);
          if (isNaN(addedDate.getTime())) return true;
          
          const diffTime = Math.abs(now.getTime() - addedDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          switch (filters.dateAdded) {
            case 'today':
              return diffDays === 0;
            case 'week':
              return diffDays <= 7;
            case 'month':
              return diffDays <= 30;
            case 'year':
              return diffDays <= 365;
            case 'older':
              return diffDays > 365;
            default:
              return true;
          }
        } catch {
          return true;
        }
      });
    }
    
    // Apply people filter
    if (filters?.people && filters.people !== 'all') {
      switch (filters.people) {
        case 'me':
          // Filter to items owned by current user (assuming ID 1)
          result = result.filter(file => file?.ownerId === 1);
          break;
        case 'shared':
          // Use sharedWithIds length to determine if shared
          result = result.filter(file => 
            Array.isArray(file?.sharedWithIds) && file.sharedWithIds.length > 0
          );
          break;
        case 'everyone':
          // No filter
          break;
      }
    }
    
    // Apply sorting
    if (sortConfig?.key) {
      result.sort((a, b) => {
        const aValue = a?.[sortConfig.key as keyof EnhancedFileItem];
        const bValue = b?.[sortConfig.key as keyof EnhancedFileItem];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'ascending' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'ascending'
            ? aValue - bValue
            : bValue - aValue;
        }
        
        // Special handling for size strings
        if (sortConfig.key === 'size') {
          const getSizeInMB = (size: string): number => {
            if (!size) return 0;
            const match = size.match(/([\d.]+)\s*(MB|KB|GB|B)/i);
            if (!match) return 0;
            
            const value = parseFloat(match[1]);
            if (isNaN(value)) return 0;
            
            const unit = match[2].toUpperCase();
            
            switch (unit) {
              case 'GB': return value * 1024;
              case 'MB': return value;
              case 'KB': return value / 1024;
              case 'B': return value / (1024 * 1024);
              default: return value;
            }
          };
          
          const aSize = getSizeInMB(a?.size || '');
          const bSize = getSizeInMB(b?.size || '');
          
          return sortConfig.direction === 'ascending'
            ? aSize - bSize
            : bSize - aSize;
        }
        
        // Special handling for date strings
        if (sortConfig.key === 'lastModified' || sortConfig.key === 'dateAdded' || sortConfig.key === 'lastOpened') {
          try {
            const aDate = new Date(aValue as string);
            const bDate = new Date(bValue as string);
            
            if (isNaN(aDate.getTime()) || isNaN(bDate.getTime())) return 0;
            
            return sortConfig.direction === 'ascending'
              ? aDate.getTime() - bDate.getTime()
              : bDate.getTime() - aDate.getTime();
          } catch {
            return 0;
          }
        }
        
        // Special handling for shared count (using sharedWithIds length)
        if (sortConfig.key === 'sharedWith') {
          const aSharedCount = Array.isArray(a?.sharedWithIds) ? a.sharedWithIds.length : 0;
          const bSharedCount = Array.isArray(b?.sharedWithIds) ? b.sharedWithIds.length : 0;
          
          return sortConfig.direction === 'ascending'
            ? aSharedCount - bSharedCount
            : bSharedCount - aSharedCount;
        }
        
        // Special handling for version
        if (sortConfig.key === 'version') {
          const aVersion = typeof a?.version === 'number' ? a.version : 0;
          const bVersion = typeof b?.version === 'number' ? b.version : 0;
          
          return sortConfig.direction === 'ascending'
            ? aVersion - bVersion
            : bVersion - aVersion;
        }
        
        return 0;
      });
    }
    
    return result;
  }, [filteredByContext.filteredFiles, filters, sortConfig]);

  return { 
    filteredFolders, 
    filteredFiles,
    contextFiltered: filteredByContext
  };
}