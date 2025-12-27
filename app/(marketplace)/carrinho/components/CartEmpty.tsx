import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const CartEmpty = () => (
  <div className="container flex flex-col items-center justify-center py-24 text-center">
    <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
      <ShoppingCart className="h-12 w-12 text-muted-foreground" />
    </div>
    <h1 className="mb-2 text-2xl font-bold">Seu carrinho está vazio</h1>
    <p className="mb-8 max-w-md text-muted-foreground">
      Adicione equipamentos ao seu carrinho para começar a fazer sua locação.
    </p>
    <Link href="/equipamentos">
      <Button size="lg">Explorar Equipamentos</Button>
    </Link>
  </div>
);

export { CartEmpty };
