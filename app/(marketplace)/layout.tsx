import { Header } from './components/Header';
import { Footer } from './components/Footer';

type MarketplaceLayoutProps = {
  children: React.ReactNode;
};

const MarketplaceLayout = ({ children }: MarketplaceLayoutProps) => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default MarketplaceLayout;
