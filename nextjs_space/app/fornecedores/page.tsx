import Header from '../../components/eco/header';
import Footer from '../../components/eco/footer';
import FornecedoresContent from './_components/fornecedores-content';

export default function FornecedoresPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <FornecedoresContent />
      </main>
      <Footer />
    </div>
  );
}
