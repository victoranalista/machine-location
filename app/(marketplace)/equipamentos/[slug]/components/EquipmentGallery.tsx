'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EquipmentGalleryProps = {
  images: { id: string; url: string; alt: string | null; isPrimary: boolean }[];
  mainImage: string | null;
  name: string;
};

const EquipmentGallery = ({
  images,
  mainImage,
  name
}: EquipmentGalleryProps) => {
  const allImages = mainImage
    ? [
        { id: 'main', url: mainImage, alt: name, isPrimary: true },
        ...images.filter((img) => img.url !== mainImage)
      ]
    : images;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = allImages[selectedIndex];
  const handlePrev = () =>
    setSelectedIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  const handleNext = () =>
    setSelectedIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  if (allImages.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-xl bg-muted">
        <ImageIcon className="h-16 w-16 text-muted-foreground" />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        <Image
          src={selectedImage?.url ?? ''}
          alt={selectedImage?.alt ?? name}
          fill
          className="object-cover"
          priority
        />
        {allImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {allImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                index === selectedIndex
                  ? 'border-primary'
                  : 'border-transparent opacity-60 hover:opacity-100'
              )}
            >
              <Image
                src={image.url}
                alt={image.alt ?? ''}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { EquipmentGallery };
