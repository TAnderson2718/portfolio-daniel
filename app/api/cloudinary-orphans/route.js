import { NextResponse } from 'next/server';
import { listInFolder } from '@/lib/cloudinary-admin';
import { readContent } from '@/lib/storage';
import { collectCloudinaryUrls, publicIdFromUrl } from '@/lib/extract-urls';

export const dynamic = 'force-dynamic';

// Asset folder name configured in the upload preset.
const FOLDER = 'portfolio';

export async function GET() {
  try {
    const [assets, content] = await Promise.all([listInFolder(FOLDER), readContent()]);

    const usedUrls = collectCloudinaryUrls(content);
    const usedPublicIds = new Set();
    for (const url of usedUrls) {
      const pid = publicIdFromUrl(url);
      if (pid) usedPublicIds.add(pid);
    }

    const orphans = [];
    const inUse = [];
    for (const a of assets) {
      const item = {
        publicId: a.public_id,
        secureUrl: a.secure_url,
        bytes: a.bytes,
        width: a.width,
        height: a.height,
        format: a.format,
        createdAt: a.created_at,
      };
      if (usedPublicIds.has(a.public_id)) inUse.push(item);
      else orphans.push(item);
    }

    // Newest first — easier to spot recently-leaked uploads.
    orphans.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const inUseBytes = inUse.reduce((s, o) => s + (o.bytes || 0), 0);
    const orphanBytes = orphans.reduce((s, o) => s + (o.bytes || 0), 0);
    return NextResponse.json({
      folder: FOLDER,
      totalAssets: assets.length,
      inUseCount: inUse.length,
      orphanCount: orphans.length,
      inUseBytes,
      orphanBytes,
      totalBytes: inUseBytes + orphanBytes,
      orphans,
      inUse,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.status || 500 });
  }
}
