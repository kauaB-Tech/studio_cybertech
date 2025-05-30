
"use client";

import { useState, useEffect, Suspense } from "react"; // Adicionado Suspense
import Link from "next/link";
import { useSearchParams } from 'next/navigation'; // Importado useSearchParams
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ClipboardList, CreditCard, User, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import EditProfileDialog from "./EditProfileDialog";
import ViewAppointmentsDialog from "./ViewAppointmentsDialog";
import ViewExamResultDialog, { type MockExamResult } from "./ViewExamResultDialog";
import ViewMedicalHistoryDialog from "./ViewMedicalHistoryDialog";
import ViewBillingHistoryDialog, { type Invoice } from "./ViewBillingHistoryDialog";


interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

const mockExamData: MockExamResult = {
  examName: "Hemograma Completo",
  examDate: "15 de Dezembro de 2024",
  results: [
    { parameter: "Hemácias", value: "4.5 milhões/µL", reference: "4.2-5.4" },
    { parameter: "Leucócitos", value: "7.500/µL", reference: "4.000-11.000" },
    { parameter: "Plaquetas", value: "250.000/µL", reference: "150.000-450.000" },
  ],
  observations: "Valores dentro da normalidade.",
};

const mockLatestInvoice: Invoice = {
  id: "FAT-2024-001",
  issueDate: "2024-11-15",
  dueDate: "2024-12-01",
  amount: 150.00,
  status: "Paga",
  description: "Consulta Clínica Geral",
};

// Componente interno para usar useSearchParams, pois precisa estar dentro de <Suspense>
function DashboardContentInternal() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isViewAppointmentsOpen, setIsViewAppointmentsOpen] = useState(false);
  const [isViewExamResultOpen, setIsViewExamResultOpen] = useState(false);
  const [isViewMedicalHistoryOpen, setIsViewMedicalHistoryOpen] = useState(false);
  const [isViewBillingHistoryOpen, setIsViewBillingHistoryOpen] = useState(false);
  const [userRole, setUserRole] = useState<'cliente' | 'admin'>('cliente'); 

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Nome do Paciente Exemplo",
    email: "paciente@exemplo.com",
    phone: "(00) 12345-6789",
    avatarUrl: "https://placehold.co/150x150.png",
  });

  useEffect(() => {
    const roleFromQuery = searchParams.get('role');
    if (roleFromQuery === 'admin') {
      setUserRole('admin');
      setUserProfile(prev => ({
        ...prev,
        name: "Nome do Administrador",
        email: "admin@exemplo.com",
      }));
    } else {
      setUserRole('cliente');
      setUserProfile(prev => ({
        ...prev,
        name: "Nome do Paciente Exemplo",
        email: "paciente@exemplo.com",
      }));
    }
  }, [searchParams]);

  const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
    setUserProfile(prev => ({...prev, ...updatedProfile}));
    toast({
      title: "Perfil Atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  }

  return (
    <>
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className={`grid w-full grid-cols-1 ${userRole === 'admin' ? 'md:grid-cols-5' : 'md:grid-cols-4'} mb-6`}>
          <TabsTrigger value="profile" className="flex items-center gap-2 py-3">
            <User className="h-5 w-5" /> Meu Perfil
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2 py-3">
            <CalendarDays className="h-5 w-5" /> Agendamentos
          </TabsTrigger>
          <TabsTrigger value="records" className="flex items-center gap-2 py-3">
            <ClipboardList className="h-5 w-5" /> Prontuários
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2 py-3">
            <CreditCard className="h-5 w-5" /> Faturamento
          </TabsTrigger>
          {userRole === 'admin' && (
            <TabsTrigger value="security" className="flex items-center gap-2 py-3">
              <Shield className="h-5 w-5" /> Segurança
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                <User className="h-6 w-6" /> Meu Perfil
              </CardTitle>
              <CardDescription>Gerencie suas informações pessoais e de contato.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row items-center gap-6 p-4 border rounded-lg">
                <Image src={userProfile.avatarUrl} alt="Foto do Perfil" width={150} height={150} className="rounded-full" data-ai-hint="profile avatar" />
                <div>
                  <h3 className="text-xl font-semibold">{userProfile.name}</h3>
                  <p className="text-muted-foreground">{userProfile.email}</p>
                  <p className="text-muted-foreground">{userProfile.phone}</p>
                </div>
              </div>
              <p>Aqui você poderá editar seus dados cadastrais, como endereço, telefone e preferências de comunicação.</p>
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setIsEditProfileOpen(true)}
              >
                Editar Perfil
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                <CalendarDays className="h-6 w-6" /> Meus Agendamentos
              </CardTitle>
              <CardDescription>Visualize e gerencie seus próximos agendamentos e histórico.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Nesta seção, você poderá ver suas consultas e exames agendados, remarcar ou cancelar conforme necessário.</p>
              <div className="border p-4 rounded-lg">
                <h4 className="font-semibold">Próxima Consulta:</h4>
                <p>Dr. Exemplo - Clínica Geral</p>
                <p>Data: 25 de Dezembro de 2024, 10:00</p>
                <p>Status: Confirmado</p>
              </div>
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setIsViewAppointmentsOpen(true)}
              >
                Ver Todos Agendamentos
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                <ClipboardList className="h-6 w-6" /> Meus Prontuários
              </CardTitle>
              <CardDescription>Acesse seus resultados de exames e histórico médico.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Tenha acesso seguro aos seus prontuários médicos, resultados de exames laboratoriais e de imagem.</p>
               <div className="border p-4 rounded-lg">
                <h4 className="font-semibold">Último Exame:</h4>
                <p>{mockExamData.examName}</p>
                <p>Data: {mockExamData.examDate}</p>
                <Button variant="link" className="p-0 h-auto" onClick={() => setIsViewExamResultOpen(true)}>Ver Resultado</Button>
              </div>
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setIsViewMedicalHistoryOpen(true)}
              >
                Acessar Histórico Completo
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                <CreditCard className="h-6 w-6" /> Faturamento e Pagamentos
              </CardTitle>
              <CardDescription>Verifique suas faturas, histórico de pagamentos e informações financeiras.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Acompanhe suas faturas em aberto, histórico de pagamentos e gerencie suas informações de cobrança.</p>
              <div className="border p-4 rounded-lg">
                <h4 className="font-semibold">Última Fatura:</h4>
                <p>Referente: {mockLatestInvoice.description}</p>
                <p>Valor: R$ {mockLatestInvoice.amount.toFixed(2).replace('.', ',')}</p>
                <p>Status: {mockLatestInvoice.status}</p>
              </div>
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setIsViewBillingHistoryOpen(true)}
              >
                Ver Histórico de Faturas
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {userRole === 'admin' && (
          <TabsContent value="security">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                  <Shield className="h-6 w-6" /> Monitoramento de Segurança
                </CardTitle>
                <CardDescription>Acompanhe as atividades recentes e gerencie a segurança da sua conta.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Para sua proteção, registramos atividades importantes relacionadas à sua conta. Você pode visualizar o log detalhado de atividades para verificar acessos e modificações.</p>
                <p className="text-sm text-muted-foreground">Recomendamos verificar esta seção regularmente.</p>
                <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/area-cliente/atividades-recentes">
                    Ver Log de Atividades Detalhado
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                 <div className="mt-6 border-t pt-4">
                  <h4 className="text-lg font-semibold mb-2">Dicas de Segurança</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-foreground/80">
                      <li>Use senhas fortes e únicas.</li>
                      <li>Não compartilhe suas credenciais de login.</li>
                      <li>Fique atento a emails ou mensagens suspeitas.</li>
                      <li>Monitore suas atividades recentes regularmente.</li>
                  </ul>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

      </Tabs>
      <EditProfileDialog 
        isOpen={isEditProfileOpen} 
        onOpenChange={setIsEditProfileOpen} 
        userProfile={userProfile}
        onProfileUpdate={handleProfileUpdate}
      />
      <ViewAppointmentsDialog 
        isOpen={isViewAppointmentsOpen}
        onOpenChange={setIsViewAppointmentsOpen}
      />
      <ViewExamResultDialog
        isOpen={isViewExamResultOpen}
        onOpenChange={setIsViewExamResultOpen}
        examResult={mockExamData}
      />
      <ViewMedicalHistoryDialog
        isOpen={isViewMedicalHistoryOpen}
        onOpenChange={setIsViewMedicalHistoryOpen}
      />
      <ViewBillingHistoryDialog
        isOpen={isViewBillingHistoryOpen}
        onOpenChange={setIsViewBillingHistoryOpen}
      />
    </>
  );
}

export default function DashboardClientContent() {
  // Envolve DashboardContentInternal com Suspense para permitir o uso de useSearchParams
  return (
    <Suspense fallback={<div>Carregando informações do usuário...</div>}>
      <DashboardContentInternal />
    </Suspense>
  );
}
