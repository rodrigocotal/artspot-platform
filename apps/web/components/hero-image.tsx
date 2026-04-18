import Image from 'next/image';
import Link from 'next/link';
import type { ImageFieldValue } from '@/lib/seo';

interface HeroImageProps {
  image: ImageFieldValue | null | undefined;
}

export function HeroImage({ image }: HeroImageProps) {
  if (!image || !image.url) return null;
  if (image.visible === false) return null;

  const img = (
    <Image
      src={image.url}
      alt={image.alt ?? ''}
      width={image.width ?? 1600}
      height={image.height ?? 900}
      className="w-full h-auto object-cover"
      priority
    />
  );

  const body = (
    <figure className="mx-auto w-[78%] max-w-4xl">
      <div className="aspect-video overflow-hidden">{img}</div>
      {image.caption && (
        <figcaption className="mt-3 text-center text-sm font-serif text-neutral-500">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );

  if (image.linkUrl) {
    return (
      <Link href={image.linkUrl} className="block">
        {body}
      </Link>
    );
  }

  return body;
}
