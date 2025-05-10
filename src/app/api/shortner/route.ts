import { nanoid } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import clientPromise from '@/lib/mongodb';
import { UrlDocument } from '@/lib/types';

const urlSchema = z.object({
  url: z.string().url(),
  customSlug: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = urlSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid URL provider' },
        { status: 400 }
      );
    }
    const { url, customSlug } = validation.data;

    const client = await clientPromise;
    const db = client.db('urlshortener');
    const urls = db.collection<UrlDocument>('urls');

    //Generate short ID or use custom slug
    const id = customSlug || nanoid(6);

    // If custom slug is already taken
    if (customSlug) {
      const existing = await urls.findOne({ _id: customSlug });
      if (existing) {
        return NextResponse.json(
          { error: 'Custom slug already in use' },
          { status: 409 }
        );
      }
    }
    const urlData = {
      _id: id,
      originalUrl: url,
      createdAt: new Date().toISOString(),
      clicks: 0,
    };
    await urls.insertOne(urlData);

    return NextResponse.json({
      shortUrl: `${req.nextUrl.origin}/${id}`,
      id,
      originalUrl: url,
      createdAt: urlData.createdAt,
      clicks: 0,
    });
  } catch (error) {
    console.error('error shortening URL:', error);
    return NextResponse.json(
      { error: 'Failed to shorten URL' },
      { status: 500 }
    );
  }
}
