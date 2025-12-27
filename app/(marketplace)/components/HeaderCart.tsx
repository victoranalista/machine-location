'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type HeaderCartProps = {
  count: number;
};

const HeaderCart = ({ count }: HeaderCartProps) => (
  <Link href="/carrinho" className="relative">
    <Button variant="ghost" size="icon">
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-xs">
          {count}
        </Badge>
      )}
    </Button>
  </Link>
);

export { HeaderCart };
