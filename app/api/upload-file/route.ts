import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'poster', 'trailer', 'food', 'article'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type based on upload type
    if (type === 'food' || type === 'article' || type === 'poster') {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'File must be an image file' }, { status: 400 });
      }
    } else if (type === 'trailer') {
      if (!file.type.startsWith('video/')) {
        return NextResponse.json({ error: 'Trailer must be a video file' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'Invalid type. Must be "poster", "trailer", "food", or "article"' }, { status: 400 });
    }

    // Determine upload directory based on type
    let uploadDir: string;
    let publicUrlPrefix: string;
    
    if (type === 'poster' || type === 'trailer') {
      uploadDir = path.join(process.cwd(), 'public', 'movie');
      publicUrlPrefix = '/movie';
    } else if (type === 'food') {
      uploadDir = path.join(process.cwd(), 'public', 'catalog');
      publicUrlPrefix = '/catalog';
    } else if (type === 'article') {
      uploadDir = path.join(process.cwd(), 'public', 'article');
      publicUrlPrefix = '/article';
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Get file extension
    const originalName = file.name;
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    
    // Create unique filename with timestamp
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileName = `${baseName}-${timestamp}-${randomStr}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    // Write file
    await writeFile(filePath, buffer);

    // Return the public URL
    const publicUrl = `${publicUrlPrefix}/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      fileName: fileName 
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file', details: error.message }, { status: 500 });
  }
}

