import { HeroSection } from './components/HeroSection';
import { PopularCategories } from './components/PopularCategories';
import { HowItWorks } from './components/HowItWorks';
import { WhyChooseUs } from './components/WhyChooseUs';
import { PopularLocations } from './components/PopularLocations';
import { CTASection } from './components/CTASection';
import { Header } from './(marketplace)/components/Header';
import { Footer } from './(marketplace)/components/Footer';

const Home = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">
      <HeroSection />
      <PopularCategories />
      <HowItWorks />
      <WhyChooseUs />
      <PopularLocations />
      <CTASection />
    </main>
    <Footer />
  </div>
);

export default Home;
