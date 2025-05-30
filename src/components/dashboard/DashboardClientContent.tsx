
"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
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

const mockExamDataClient: MockExamResult = {
  examName: "Hemograma Completo (Cliente)",
  examDate: "15 de Dezembro de 2024",
  results: [
    { parameter: "Hemácias", value: "4.5 milhões/µL", reference: "4.2-5.4" },
    { parameter: "Leucócitos", value: "7.500/µL", reference: "4.000-11.000" },
    { parameter: "Plaquetas", value: "250.000/µL", reference: "150.000-450.000" },
  ],
  observations: "Valores dentro da normalidade (visão cliente).",
};

const mockExamDataAdmin: MockExamResult = {
  examName: "Eletrocardiograma (Paciente Exemplo A)",
  examDate: "18 de Dezembro de 2024",
  results: [
    { parameter: "Frequência Cardíaca", value: "72 bpm", reference: "60-100" },
    { parameter: "Intervalo PR", value: "0.16s", reference: "0.12-0.20" },
    { parameter: "Complexo QRS", value: "0.08s", reference: "<0.12" },
  ],
  observations: "Ritmo sinusal regular. Sem alterações significativas (visão admin).",
};


const mockLatestInvoiceClient: Invoice = {
  id: "FAT-2024-C01",
  issueDate: "2024-11-15",
  dueDate: "2024-12-01",
  amount: 150.00,
  status: "Paga",
  description: "Consulta Clínica Geral (Cliente)",
};

const mockLatestInvoiceAdmin: Invoice = {
  id: "FAT-2024-A05",
  issueDate: "2024-11-20",
  dueDate: "2024-12-05",
  amount: 300.00,
  status: "Pendente",
  description: "Consulta Especializada (Paciente B)",
};


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

  const [currentExamData, setCurrentExamData] = useState<MockExamResult>(mockExamDataClient);
  const [currentInvoiceData, setCurrentInvoiceData] = useState<Invoice>(mockLatestInvoiceClient);


  useEffect(() => {
    const roleFromQuery = searchParams.get('role');
    if (roleFromQuery === 'admin') {
      setUserRole('admin');
      setUserProfile(prev => ({
        ...prev,
        name: "Nome do Administrador",
        email: "admin@exemplo.com",
      }));
      setCurrentExamData(mockExamDataAdmin);
      setCurrentInvoiceData(mockLatestInvoiceAdmin);
    } else {
      setUserRole('cliente');
      setUserProfile(prev => ({
        ...prev,
        name: "Nome do Paciente Exemplo",
        email: "paciente@exemplo.com",
      }));
      setCurrentExamData(mockExamDataClient);
      setCurrentInvoiceData(mockLatestInvoiceClient);
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
            <CalendarDays className="h-5 w-5" /> {userRole === 'admin' ? 'Gerenciar Agendamentos' : 'Meus Agendamentos'}
          </TabsTrigger>
          <TabsTrigger value="records" className="flex items-center gap-2 py-3">
            <ClipboardList className="h-5 w-5" /> {userRole === 'admin' ? 'Gerenciar Prontuários' : 'Meus Prontuários'}
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2 py-3">
            <CreditCard className="h-5 w-5" /> {userRole === 'admin' ? 'Gerenciar Faturamento' : 'Faturamento'}
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
                <CalendarDays className="h-6 w-6" /> 
                {userRole === 'admin' ? 'Gerenciar Agendamentos (Visão Admin)' : 'Meus Agendamentos'}
              </CardTitle>
              <CardDescription>
                {userRole === 'admin' 
                  ? 'Visualize e gerencie todos os agendamentos da clínica.' 
                  : 'Visualize e gerencie seus próximos agendamentos e histórico.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {userRole === 'admin'
                  ? 'Nesta seção, você pode criar, remarcar ou cancelar agendamentos para qualquer paciente.'
                  : 'Nesta seção, você poderá ver suas consultas e exames agendados, remarcar ou cancelar conforme necessário.'
                }
              </p>
              <div className="border p-4 rounded-lg">
                <h4 className="font-semibold">
                  {userRole === 'admin' ? 'Próximo Agendamento (Clínica):' : 'Próxima Consulta:'}
                </h4>
                <p>{userRole === 'admin' ? 'Paciente Y - Dra. Modelo - Cardiologia' : 'Dr. Exemplo - Clínica Geral'}</p>
                <p>Data: {userRole === 'admin' ? '28 de Dezembro de 2024, 11:00' : '25 de Dezembro de 2024, 10:00'}</p>
                <p>Status: Confirmado</p>
              </div>
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setIsViewAppointmentsOpen(true)}
              >
                {userRole === 'admin' ? 'Ver Todos Agendamentos (Admin)' : 'Ver Todos Agendamentos'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                <ClipboardList className="h-6 w-6" /> 
                {userRole === 'admin' ? 'Prontuários (Visão Admin)' : 'Meus Prontuários'}
              </CardTitle>
              <CardDescription>
                 {userRole === 'admin' 
                  ? 'Acesse resultados de exames e históricos médicos dos pacientes.' 
                  : 'Acesse seus resultados de exames e histórico médico.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {userRole === 'admin'
                  ? 'Tenha acesso seguro aos prontuários médicos e resultados de exames dos pacientes.'
                  : 'Tenha acesso seguro aos seus prontuários médicos, resultados de exames laboratoriais e de imagem.'
                }
              </p>
               <div className="border p-4 rounded-lg">
                <h4 className="font-semibold">
                  {userRole === 'admin' ? 'Último Exame Registrado (Paciente X):' : 'Último Exame:'}
                </h4>
                <p>{currentExamData.examName}</p>
                <p>Data: {currentExamData.examDate}</p>
                <Button variant="link" className="p-0 h-auto" onClick={() => setIsViewExamResultOpen(true)}>
                  {userRole === 'admin' ? 'Ver Resultado (Admin)' : 'Ver Resultado'}
                </Button>
              </div>
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setIsViewMedicalHistoryOpen(true)}
              >
                {userRole === 'admin' ? 'Acessar Históricos (Admin)' : 'Acessar Histórico Completo'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                <CreditCard className="h-6 w-6" /> 
                {userRole === 'admin' ? 'Faturamento (Visão Admin)' : 'Faturamento e Pagamentos'}
              </CardTitle>
              <CardDescription>
                {userRole === 'admin' 
                  ? 'Verifique faturas, histórico de pagamentos e informações financeiras dos pacientes.'
                  : 'Verifique suas faturas, histórico de pagamentos e informações financeiras.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                {userRole === 'admin'
                  ? 'Acompanhe faturas em aberto, histórico de pagamentos e gerencie informações de cobrança dos pacientes.'
                  : 'Acompanhe suas faturas em aberto, histórico de pagamentos e gerencie suas informações de cobrança.'
                }
              </p>
              <div className="border p-4 rounded-lg">
                <h4 className="font-semibold">
                   {userRole === 'admin' ? 'Última Fatura (Paciente B):' : 'Última Fatura:'}
                </h4>
                <p>Referente: {currentInvoiceData.description}</p>
                <p>Valor: R$ {currentInvoiceData.amount.toFixed(2).replace('.', ',')}</p>
                <p>Status: {currentInvoiceData.status}</p>
              </div>
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setIsViewBillingHistoryOpen(true)}
              >
                {userRole === 'admin' ? 'Ver Histórico de Faturas (Admin)' : 'Ver Histórico de Faturas'}
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
        userRole={userRole}
      />
      <ViewExamResultDialog
        isOpen={isViewExamResultOpen}
        onOpenChange={setIsViewExamResultOpen}
        examResult={currentExamData}
        userRole={userRole}
      />
      <ViewMedicalHistoryDialog
        isOpen={isViewMedicalHistoryOpen}
        onOpenChange={setIsViewMedicalHistoryOpen}
        userRole={userRole}
      />
      <ViewBillingHistoryDialog
        isOpen={isViewBillingHistoryOpen}
        onOpenChange={setIsViewBillingHistoryOpen}
        userRole={userRole}
      />
    </>
  );
}

export default function DashboardClientContent() {
  return (
    <Suspense fallback={<div>Carregando informações do usuário...</div>}>
      <DashboardContentInternal />
    </Suspense>
  );
}

