import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const runtime = 'nodejs';

const MAX_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const categoryId = formData.get('categoryId') as string;
    const uploadedBy = formData.get('uploadedBy') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File exceeds 15 MB limit.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only PDF, JPEG, and PNG files are accepted.' },
        { status: 400 }
      );
    }

    const uploadDir = path.join(
      process.cwd(),
      'public',
      'uploads',
      'documents'
    );

    await mkdir(uploadDir, { recursive: true });

    const id = crypto.randomUUID();
    const extension = file.name.split('.').pop()?.toLowerCase();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${id}-${safeName}`;
    const filePath = path.join(uploadDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const url = `/uploads/documents/${filename}`;

    return NextResponse.json({
      id: `doc_${id}`,
      name: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
      uploadedBy: uploadedBy || 'Isha Ambani',
      status: 'pending',
      version: 1,
      comments: [],
      url: url,
      categoryId: categoryId
    });
  } catch (error) {
    console.error('Document upload error:', error);
    return NextResponse.json(
      { error: 'Document upload failed.' },
      { status: 500 }
    );
  }
}