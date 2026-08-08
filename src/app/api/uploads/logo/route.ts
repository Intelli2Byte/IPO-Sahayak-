import {
  NextRequest,
  NextResponse,
} from 'next/server';

import {
  mkdir,
  writeFile,
} from 'fs/promises';

import path from 'path';
import crypto from 'crypto';

export const runtime =
  'nodejs';

const MAX_SIZE =
  10 * 1024 * 1024;

const ALLOWED_EXTENSIONS =
  [
    'png',
    'svg',
    'eps',
    'pdf',
  ];

export async function POST(
  req: NextRequest
) {
  try {
    const formData =
      await req.formData();

    const file =
      formData.get(
        'file'
      ) as File | null;

    const type =
      String(
        formData.get(
          'type'
        ) || 'issuer'
      );

    if (!file) {
      return NextResponse.json(
        {
          error:
            'No file uploaded.',
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size >
      MAX_SIZE
    ) {
      return NextResponse.json(
        {
          error:
            'File exceeds 10 MB limit.',
        },
        {
          status: 400,
        }
      );
    }

    const originalName =
      file.name;

    const extension =
      originalName
        .split('.')
        .pop()
        ?.toLowerCase();

    if (
      !extension ||
      !ALLOWED_EXTENSIONS.includes(
        extension
      )
    ) {
      return NextResponse.json(
        {
          error:
            'Only PNG, SVG, EPS and PDF files are accepted.',
        },
        {
          status: 400,
        }
      );
    }

    const uploadDir =
      path.join(
        process.cwd(),
        'public',
        'uploads',
        'logos'
      );

    await mkdir(
      uploadDir,
      {
        recursive: true,
      }
    );

    const id =
      crypto.randomUUID();

    const safeName =
      originalName
        .replace(
          /[^a-zA-Z0-9._-]/g,
          '_'
        );

    const filename =
      `${id}-${safeName}`;

    const filePath =
      path.join(
        uploadDir,
        filename
      );

    const buffer =
      Buffer.from(
        await file.arrayBuffer()
      );

    await writeFile(
      filePath,
      buffer
    );

    const url =
      `/uploads/logos/${filename}`;

    return NextResponse.json({
      id,
      name:
        originalName,
      url,
      type,
      size:
        file.size,
      mimeType:
        file.type ||
        'application/octet-stream',
    });
  } catch (error) {
    console.error(
      'Logo upload error:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Logo upload failed.',
      },
      {
        status: 500,
      }
    );
  }
}