import Header from '@/components/eco/header';
import Footer from '@/components/eco/footer';
import CarrinhoContent from './_components/carrinho-content';

export default function CarrinhoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <CarrinhoContent />
      </main>
      <Footer />
    </div>
  );
}
