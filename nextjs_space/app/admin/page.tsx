import Header from '@/components/eco/header';
import Footer from '@/components/eco/footer';
import AdminContent from './_components/admin-content';

export default function AdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <AdminContent />
      </main>
      <Footer />
    </div>
  );
}
