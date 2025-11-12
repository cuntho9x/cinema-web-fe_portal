import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'poster' or 'trailer'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!type || (type !== 'poster' && type !== 'trailer')) {
      return NextResponse.json({ error: 'Invalid type. Must be "poster" or "trailer"' }, { status: 400 });
    }

    // Validate file type
    if (type === 'poster' && !file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Poster must be an image file' }, { status: 400 });
    }

    if (type === 'trailer' && !file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'Trailer must be a video file' }, { status: 400 });
    }

    // Create directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'movie');
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
    const publicUrl = `/movie/${fileName}`;

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

