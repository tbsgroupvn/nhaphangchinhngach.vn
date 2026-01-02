/**
 * API Route: /api/admin/media/upload
 * Upload files to Supabase Storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { withPermission } from '@/lib/middleware/auth';
import { supabaseAdmin } from '@/lib/supabase/server';
import { logMediaUploaded } from '@/lib/audit';

// =====================================================
// POST /api/admin/media/upload
// Upload file to Supabase Storage
// =====================================================
export async function POST(request: NextRequest) {
  const auth = await withPermission(request, 'media.manage');
  if (auth.error) return auth.error;

  try {
    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;
    const altText = formData.get('altText') as string;
    const tags = formData.get('tags') as string; // comma-separated

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 50MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileExt = file.name.split('.').pop();
    const sanitizedName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .substring(0, 50);
    const fileName = `${sanitizedName}-${timestamp}-${randomStr}.${fileExt}`;

    // Build storage path: yyyy/mm/userId/filename
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const userId = auth.user!.id;
    const storagePath = `${year}/${month}/${userId}/${fileName}`;

    // Convert File to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('cms-media')
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { success: false, error: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('cms-media')
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // Determine media type
    let mediaType: string;
    if (file.type.startsWith('image/')) {
      mediaType = 'image';
    } else if (file.type.startsWith('video/')) {
      mediaType = 'video';
    } else if (file.type.startsWith('audio/')) {
      mediaType = 'audio';
    } else {
      mediaType = 'document';
    }

    // Get image dimensions if it's an image
    let dimensions = null;
    if (mediaType === 'image' && file.type !== 'image/svg+xml') {
      // For images, we could use sharp or image-size library
      // For now, leave it null - can be updated later by frontend
      dimensions = null;
    }

    // Insert media record to database
    const { data: mediaRecord, error: dbError } = await supabaseAdmin
      .from('media_files')
      // @ts-ignore - Supabase type inference issue
      .insert({
        name: fileName,
        original_name: file.name,
        type: mediaType,
        mime_type: file.type,
        url: publicUrl,
        size: file.size,
        dimensions: dimensions,
        description: description || null,
        alt_text: altText || null,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        user_id: userId,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Try to cleanup storage
      await supabaseAdmin.storage.from('cms-media').remove([storagePath]);
      return NextResponse.json(
        { success: false, error: dbError.message },
        { status: 500 }
      );
    }

    // Audit log
    await logMediaUploaded(
      userId,
      (mediaRecord as any).id,
      file.name,
      file.size,
      request
    );

    return NextResponse.json({
      success: true,
      data: mediaRecord,
      message: 'File uploaded successfully',
    });
  } catch (error: any) {
    console.error('Upload failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
