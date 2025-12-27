import { auth } from '@/lib/auth/auth';
import { getCartItems } from './actions';
import { CartClient } from './components/CartClient';
import { CartEmpty } from './components/CartEmpty';
import { CartSummary } from './components/CartSummary';

const CarrinhoPage = async () => {
  const session = await auth();
  const cartItems = await getCartItems();
  if (cartItems.length === 0) return <CartEmpty />;
  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">
        Carrinho de Locação
      </h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <CartClient items={cartItems} isLoggedIn={!!session?.user} />
        <CartSummary items={cartItems} isLoggedIn={!!session?.user} />
      </div>
    </div>
  );
};

export default CarrinhoPage;
