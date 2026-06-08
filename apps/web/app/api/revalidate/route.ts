import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { auth } from '@/lib/auth';

/**
 * On-demand cache revalidation for CMS pages. Called by the admin editor
 * after publishing so changes appear immediately instead of after the 60s ISR
 * window. Restricted to ADMIN / GALLERY_STAFF sessions.
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  const role = session?.user?.role;

  if (role !== 'ADMIN' && role !== 'GALLERY_STAFF') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  let slug: string | undefined;
  try {
    const body = await req.json();
    slug = typeof body?.slug === 'string' ? body.slug : undefined;
  } catch {
    // no/invalid body — fall through to a broad revalidation
  }

  // Purge the specific page (and the shared tag, which covers site-settings/footer
  // consumed across every page).
  if (slug) revalidateTag(`cms:${slug}`);
  revalidateTag('cms');

  return NextResponse.json({ success: true, revalidated: true, slug: slug ?? 'all' });
}
