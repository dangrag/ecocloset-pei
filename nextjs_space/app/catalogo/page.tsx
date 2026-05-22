import Header from '@/components/eco/header';
import Footer from '@/components/eco/footer';
import CatalogoContent from './_components/catalogo-content';

export default function CatalogoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <CatalogoContent />
      </main>
      <Footer />
    </div>
  );
}
