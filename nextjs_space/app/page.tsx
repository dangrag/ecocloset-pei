import Header from '@/components/eco/header';
import Footer from '@/components/eco/footer';
import HomeContent from './_components/home-content';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HomeContent />
      </main>
      <Footer />
    </div>
  );
}
