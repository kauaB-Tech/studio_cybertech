
"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ClipboardList, CreditCard, User } from "lucide-react";
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

export default function DashboardClientContent() {
  const { toast } = useToast();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isViewAppointmentsOpen, setIsViewAppointmentsOpen] = useState(false);
  const [isViewExamResultOpen, setIsViewExamResultOpen] = useState(false);
  const [isViewMedicalHistoryOpen, setIsViewMedicalHistoryOpen] = useState(false);
  const [isViewBillingHistoryOpen, setIsViewBillingHistoryOpen] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Nome do Paciente Exemplo",
    email: "paciente@exemplo.com",
    phone: "(00) 12345-6789",
    avatarUrl: "https://placehold.co/150x150.png",
  });

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
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-6">
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
