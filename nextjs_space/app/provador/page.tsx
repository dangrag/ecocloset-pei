import Header from '@/components/eco/header';
import Footer from '@/components/eco/footer';
import ProvadorContent from './_components/provador-content';

export default function ProvadorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <ProvadorContent />
      </main>
      <Footer />
    </div>
  );
}
