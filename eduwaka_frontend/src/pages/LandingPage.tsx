import Features from '../components/AppFeatures';
import CompanyInformation from '../components/CompanyInfo';
import FAQ from '../components/FAQ';
import Header from '../components/Header';
import Hero from '../components/Hero';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <FAQ />
      <CompanyInformation />
    </div>
  );
};

export default LandingPage;
