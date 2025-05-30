import DashboardClientContent from '@/components/dashboard/DashboardClientContent';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold text-primary">
          Painel do Cliente
        </h1>
        <p className="text-lg text-foreground/80 mt-2">
          Bem-vindo(a) de volta! Aqui você pode gerenciar suas informações e serviços.
        </p>
      </header>
      <DashboardClientContent />
    </div>
  );
}
