import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Schema Types
export interface MediaFile {
  id: string
  name: string
  type: 'image' | 'video' | 'document' | 'audio'
  url: string
  thumbnail_url?: string
  size: number
  dimensions?: { width: number; height: number }
  uploaded_at: string
  folder_id: string | null
  tags: string[]
  downloads: number
  description: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface Folder {
  id: string
  name: string
  parent_id: string | null
  item_count: number
  user_id: string
  created_at: string
  updated_at: string
}

// Media Service Functions
export class MediaService {
  // Upload file to Supabase Storage
  static async uploadFile(file: File, folder?: string): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    const { data, error } = await supabase.storage
      .from('media')
      .upload(filePath, file)

    if (error) throw error

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)

    return publicUrlData.publicUrl
  }

  // Save file metadata to database
  static async saveFileMetadata(fileData: Omit<MediaFile, 'id' | 'created_at' | 'updated_at'>): Promise<MediaFile> {
    const { data, error } = await supabase
      .from('media_files')
      .insert([fileData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Get all files with optional filters
  static async getFiles(filters?: {
    folder_id?: string
    type?: string
    search?: string
  }): Promise<MediaFile[]> {
    let query = supabase
      .from('media_files')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters?.folder_id) {
      query = query.eq('folder_id', filters.folder_id)
    }

    if (filters?.type && filters.type !== 'all') {
      query = query.eq('type', filters.type)
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  // Create folder
  static async createFolder(folderData: Omit<Folder, 'id' | 'created_at' | 'updated_at'>): Promise<Folder> {
    const { data, error } = await supabase
      .from('folders')
      .insert([folderData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Get all folders
  static async getFolders(): Promise<Folder[]> {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  }

  // Delete file
  static async deleteFile(fileId: string): Promise<void> {
    // Get file data first
    const { data: file } = await supabase
      .from('media_files')
      .select('url')
      .eq('id', fileId)
      .single()

    if (file?.url) {
      // Extract file path from URL
      const url = new URL(file.url)
      const filePath = url.pathname.split('/').pop()
      
      if (filePath) {
        // Delete from storage
        await supabase.storage
          .from('media')
          .remove([filePath])
      }
    }

    // Delete from database
    const { error } = await supabase
      .from('media_files')
      .delete()
      .eq('id', fileId)

    if (error) throw error
  }

  // Update download count
  static async incrementDownload(fileId: string): Promise<void> {
    const { error } = await supabase
      .from('media_files')
      .update({ downloads: supabase.raw('downloads + 1') })
      .eq('id', fileId)

    if (error) throw error
  }

  // Generate thumbnail for images
  static async generateThumbnail(file: File): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        const maxSize = 300
        const ratio = Math.min(maxSize / img.width, maxSize / img.height)
        
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob))
          } else {
            resolve('')
          }
        }, 'image/jpeg', 0.8)
      }

      img.src = URL.createObjectURL(file)
    })
  }
}

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileType = (mimeType: string): MediaFile['type'] => {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  return 'document'
} 