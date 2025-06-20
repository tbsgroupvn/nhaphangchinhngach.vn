// Google Drive Service - Tích hợp Google Drive cho Media Management

// Extend Window interface for gapi
declare global {
  interface Window {
    gapi: any
  }
}

export interface GoogleDriveConfig {
  clientId: string
  apiKey: string
  discoveryDoc: string
  scope: string
}

export interface DriveFile {
  id: string
  name: string
  mimeType: string
  size: string
  webViewLink: string
  webContentLink: string
  thumbnailLink?: string
  createdTime: string
  modifiedTime: string
  parents: string[]
}

export interface MediaFile {
  id: string
  name: string
  type: 'image' | 'video' | 'document' | 'audio'
  url: string
  thumbnail?: string
  size: number
  uploadedAt: string
  folder: string
  tags: string[]
  downloads: number
  description: string
}

export class GoogleDriveService {
  private gapi: any
  private isInitialized = false
  private isSignedIn = false
  
  // Google Drive configuration
  private config: GoogleDriveConfig = {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
    discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    scope: 'https://www.googleapis.com/auth/drive.file'
  }

  // TBS GROUP Media folder structure
  private folderStructure = {
    root: 'TBS GROUP Media',
    folders: {
      images: 'Hình ảnh',
      banners: 'Banner & Slides',
      logos: 'Logo & Branding', 
      services: 'Ảnh dịch vụ',
      documents: 'Tài liệu',
      videos: 'Video',
      uploads: 'Uploads'
    }
  }

  async initialize(): Promise<boolean> {
    try {
      // Load Google API script
      if (typeof window === 'undefined') {
        console.warn('Google Drive service only works in browser environment')
        return false
      }

      if (!window.gapi) {
        await this.loadGoogleAPI()
      }

      this.gapi = window.gapi

      // Initialize gapi
      await this.gapi.load('auth2:client', async () => {
        await this.gapi.client.init({
          apiKey: this.config.apiKey,
          clientId: this.config.clientId,
          discoveryDocs: [this.config.discoveryDoc],
          scope: this.config.scope
        })

        this.isInitialized = true
        
        // Check if user is already signed in
        const authInstance = this.gapi.auth2.getAuthInstance()
        this.isSignedIn = authInstance.isSignedIn.get()
      })

      return this.isInitialized
    } catch (error) {
      console.error('Failed to initialize Google Drive:', error)
      return false
    }
  }

  private loadGoogleAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://apis.google.com/js/api.js'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load Google API'))
      document.head.appendChild(script)
    })
  }

  async signIn(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        await this.initialize()
      }

      const authInstance = this.gapi.auth2.getAuthInstance()
      await authInstance.signIn()
      
      this.isSignedIn = authInstance.isSignedIn.get()
      
      if (this.isSignedIn) {
        // Setup folder structure on first sign in
        await this.setupFolderStructure()
      }
      
      return this.isSignedIn
    } catch (error) {
      console.error('Sign in failed:', error)
      return false
    }
  }

  async signOut(): Promise<void> {
    if (this.isInitialized) {
      const authInstance = this.gapi.auth2.getAuthInstance()
      await authInstance.signOut()
      this.isSignedIn = false
    }
  }

  getSignInStatus(): boolean {
    return this.isSignedIn
  }

  private async setupFolderStructure(): Promise<void> {
    try {
      // Create root folder
      const rootFolder = await this.createFolder(this.folderStructure.root)
      
      // Create subfolders
      for (const [key, name] of Object.entries(this.folderStructure.folders)) {
        await this.createFolder(name, rootFolder.id)
      }
    } catch (error) {
      console.error('Failed to setup folder structure:', error)
    }
  }

  async createFolder(name: string, parentId?: string): Promise<DriveFile> {
    const metadata: any = {
      name: name,
      mimeType: 'application/vnd.google-apps.folder'
    }

    if (parentId) {
      metadata.parents = [parentId]
    }

    const response = await this.gapi.client.drive.files.create({
      resource: metadata
    })

    return response.result
  }

  async uploadFile(file: File, folderId?: string, description?: string): Promise<DriveFile> {
    try {
      const metadata: any = {
        name: file.name,
        description: description || `Uploaded by TBS GROUP Media Manager`
      }

      if (folderId) {
        metadata.parents = [folderId]
      }

      // Create multipart upload
      const form = new FormData()
      form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}))
      form.append('file', file)

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
        },
        body: form
      })

      return await response.json()
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    }
  }

  async listFiles(folderId?: string, pageSize: number = 50): Promise<DriveFile[]> {
    try {
      let query = `trashed=false`
      
      if (folderId) {
        query += ` and '${folderId}' in parents`
      }

      const response = await this.gapi.client.drive.files.list({
        q: query,
        pageSize: pageSize,
        fields: 'files(id,name,mimeType,size,webViewLink,webContentLink,thumbnailLink,createdTime,modifiedTime,parents)'
      })

      return response.result.files || []
    } catch (error) {
      console.error('Failed to list files:', error)
      return []
    }
  }

  async deleteFile(fileId: string): Promise<boolean> {
    try {
      await this.gapi.client.drive.files.delete({
        fileId: fileId
      })
      return true
    } catch (error) {
      console.error('Failed to delete file:', error)
      return false
    }
  }

  // Convert Google Drive file to MediaFile format
  driveFileToMediaFile(driveFile: DriveFile): MediaFile {
    return {
      id: driveFile.id,
      name: driveFile.name,
      type: this.getMimeTypeCategory(driveFile.mimeType),
      url: driveFile.webContentLink || driveFile.webViewLink,
      thumbnail: driveFile.thumbnailLink,
      size: parseInt(driveFile.size || '0'),
      uploadedAt: new Date(driveFile.createdTime).toISOString().split('T')[0],
      folder: driveFile.parents?.[0] || 'root',
      tags: [],
      downloads: 0,
      description: `Stored on Google Drive`
    }
  }

  private getMimeTypeCategory(mimeType: string): MediaFile['type'] {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    return 'document'
  }

  // Sync local media with Google Drive
  async syncWithDrive(): Promise<{success: boolean, files: MediaFile[], errors: string[]}> {
    const errors: string[] = []
    
    try {
      if (!this.isSignedIn) {
        errors.push('Not signed in to Google Drive')
        return {success: false, files: [], errors}
      }

      const driveFiles = await this.listFiles()
      const mediaFiles = driveFiles.map(df => this.driveFileToMediaFile(df))

      return {
        success: true,
        files: mediaFiles,
        errors
      }
    } catch (error) {
      errors.push(`Sync failed: ${error}`)
      return {success: false, files: [], errors}
    }
  }
}

// Singleton instance
export const googleDriveService = new GoogleDriveService()

// Environment setup helper
export const setupGoogleDriveEnv = () => {
  return {
    requiredEnvVars: [
      'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
      'NEXT_PUBLIC_GOOGLE_API_KEY'
    ],
    setupInstructions: `
1. Tạo project tại Google Cloud Console
2. Enable Google Drive API
3. Tạo OAuth 2.0 credentials
4. Thêm vào .env.local:
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
   NEXT_PUBLIC_GOOGLE_API_KEY=your_api_key
5. Thêm domain vào authorized origins
`
  }
} 