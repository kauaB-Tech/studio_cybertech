
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

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

export default function DashboardClientContent() {
  const { toast } = useToast();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isViewAppointmentsOpen, setIsViewAppointmentsOpen] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Nome do Paciente Exemplo",
    email: "paciente@exemplo.com",
    phone: "(00) 12345-6789",
    avatarUrl: "https://placehold.co/150x150.png",
  });

  const handleFeatureNotImplemented = (featureName: string) => {
    toast({
      title: "Funcionalidade em Desenvolvimento",
      description: `A funcionalidade "${featureName}" ainda não foi implementada.`,
      variant: "default",
    });
  };

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
                <p>Hemograma Completo</p>
                <p>Data: 15 de Dezembro de 2024</p>
                <Button variant="link" className="p-0 h-auto" onClick={() => handleFeatureNotImplemented("Ver Resultado de Exame")}>Ver Resultado</Button>
              </div>
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => handleFeatureNotImplemented("Acessar Histórico Completo de Prontuários")}
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
                <p>Referente: Consulta Clínica Geral</p>
                <p>Valor: R$ 150,00</p>
                <p>Status: Paga</p>
              </div>
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => handleFeatureNotImplemented("Ver Histórico de Faturas")}
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
    </>
  );
}

