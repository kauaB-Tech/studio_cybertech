
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, LogIn, ShieldAlert, KeyRound, UserCog, UserCircle, Lock, UserX, UserCheck, AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface ActivityLogEntry {
  id: string;
  timestamp: string; // ISO 8601 string for consistent parsing
  event: string;
  details: string;
  ipAddress: string;
  device?: string;
  status: 'Sucesso' | 'Falha' | 'Informação';
  icon: React.ElementType;
}

interface UserAccountInfo {
  name: string;
  email: string;
  status: 'Ativa' | 'Suspensa' | 'Bloqueada';
}

const mockActivities: ActivityLogEntry[] = [
  {
    id: '1',
    timestamp: '2024-12-10T10:30:00Z',
    event: 'Login bem-sucedido',
    details: 'Acesso à conta.',
    ipAddress: '192.168.1.100',
    device: 'Desktop, Chrome',
    status: 'Sucesso',
    icon: LogIn,
  },
  {
    id: '2',
    timestamp: '2024-12-09T15:45:12Z',
    event: 'Tentativa de login falhou',
    details: 'Senha incorreta fornecida.',
    ipAddress: '203.0.113.45',
    device: 'Mobile, Safari',
    status: 'Falha',
    icon: ShieldAlert,
  },
  {
    id: '3',
    timestamp: '2024-12-08T09:15:30Z',
    event: 'Senha alterada',
    details: 'Senha atualizada com sucesso.',
    ipAddress: '198.51.100.22',
    device: 'Desktop, Firefox',
    status: 'Sucesso',
    icon: KeyRound,
  },
  {
    id: '4',
    timestamp: '2024-12-07T11:00:00Z',
    event: 'Informações de perfil atualizadas',
    details: 'Número de telefone alterado.',
    ipAddress: '192.168.1.102',
    device: 'Desktop, Chrome',
    status: 'Informação',
    icon: UserCog,
  },
  {
    id: '5',
    timestamp: '2024-12-05T14:20:05Z',
    event: 'Login bem-sucedido',
    details: 'Acesso à conta.',
    ipAddress: '192.168.1.105',
    device: 'Tablet, Chrome',
    status: 'Sucesso',
    icon: LogIn,
  },
];

export default function RecentActivitiesPage() {
  const { toast } = useToast();
  const [accountInfo, setAccountInfo] = useState<UserAccountInfo>({
    name: "Nome do Paciente Exemplo",
    email: "paciente@exemplo.com",
    status: "Ativa",
  });
  const [isActionAlertOpen, setIsActionAlertOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<{ type: 'Bloquear' | 'Suspender' | 'Ativar'; newStatus: UserAccountInfo['status'] } | null>(null);
  
  const getStatusClass = (status: ActivityLogEntry['status']) => {
    switch (status) {
      case 'Sucesso':
        return 'text-green-600';
      case 'Falha':
        return 'text-red-600';
      case 'Informação':
        return 'text-blue-600';
      default:
        return '';
    }
  };
  
  const getIconBgClass = (status: ActivityLogEntry['status']) => {
    switch (status) {
      case 'Sucesso':
        return 'bg-green-100';
      case 'Falha':
        return 'bg-red-100';
      case 'Informação':
        return 'bg-blue-100';
      default:
        return 'bg-secondary';
    }
  };

  const handleAccountAction = (type: 'Bloquear' | 'Suspender' | 'Ativar', newStatus: UserAccountInfo['status']) => {
    setActionToConfirm({ type, newStatus });
    setIsActionAlertOpen(true);
  };

  const confirmAccountAction = () => {
    if (actionToConfirm) {
      setAccountInfo(prev => ({ ...prev, status: actionToConfirm.newStatus }));
      toast({
        title: `Conta ${actionToConfirm.newStatus.toLowerCase()}!`,
        description: `A conta foi ${actionToConfirm.newStatus.toLowerCase()} com sucesso.`,
        variant: actionToConfirm.newStatus === "Bloqueada" || actionToConfirm.newStatus === "Suspensa" ? "destructive" : "default",
      });
    }
    setIsActionAlertOpen(false);
    setActionToConfirm(null);
  };

  const getAccountStatusClass = (status: UserAccountInfo['status']) => {
    if (status === 'Ativa') return 'text-green-600';
    if (status === 'Suspensa') return 'text-yellow-600';
    if (status === 'Bloqueada') return 'text-red-600';
    return '';
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="h-10 w-10" />
            Minhas Atividades e Segurança
          </h1>
          <p className="text-lg text-foreground/80 mt-2">
            Acompanhe os eventos de segurança e gerencie o status da sua conta.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/area-cliente/dashboard" className="flex items-center gap-1 self-start sm:self-auto">
            <ArrowLeft className="h-4 w-4" /> Voltar ao Painel
          </Link>
        </Button>
      </header>

      <Card className="shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
            <UserCircle className="h-7 w-7" />
            Informações da Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Nome:</strong> {accountInfo.name}</p>
          <p><strong>Email:</strong> {accountInfo.email}</p>
          <p><strong>Status da Conta:</strong> <span className={`font-semibold ${getAccountStatusClass(accountInfo.status)}`}>{accountInfo.status}</span></p>
        </CardContent>
      </Card>
      
      <Card className="shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
             <UserCog className="h-7 w-7" />
            Gerenciamento da Conta
          </CardTitle>
          <CardDescription>Ações de segurança para sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          {accountInfo.status !== 'Bloqueada' ? (
            <Button 
              variant="destructive" 
              className="flex items-center gap-2"
              onClick={() => handleAccountAction('Bloquear', 'Bloqueada')}
              disabled={accountInfo.status === 'Bloqueada'}
            >
              <Lock className="h-5 w-5" /> Bloquear Conta
            </Button>
          ) : (
             <Button 
              variant="outline" 
              className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => handleAccountAction('Ativar', 'Ativa')}
            >
              <Lock className="h-5 w-5" /> Conta Bloqueada
            </Button>
          )}

          {accountInfo.status !== 'Suspensa' && accountInfo.status !== 'Bloqueada' ? (
            <Button 
              variant="outline" 
              className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 flex items-center gap-2"
              onClick={() => handleAccountAction('Suspender', 'Suspensa')}
              disabled={accountInfo.status === 'Suspensa' || accountInfo.status === 'Bloqueada'}
            >
              <UserX className="h-5 w-5" /> Suspender Conta
            </Button>
          ) : accountInfo.status === 'Suspensa' ? (
            <Button 
              variant="outline" 
              className="flex items-center gap-2 text-yellow-600 border-yellow-600 hover:bg-yellow-50 hover:text-yellow-700"
              onClick={() => handleAccountAction('Ativar', 'Ativa')}
            >
              <UserX className="h-5 w-5" /> Conta Suspensa
            </Button>
          ) : null}

          {(accountInfo.status === 'Suspensa' || accountInfo.status === 'Bloqueada') && (
            <Button 
              variant="default" 
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              onClick={() => handleAccountAction('Ativar', 'Ativa')}
            >
              <UserCheck className="h-5 w-5" /> Ativar Conta
            </Button>
          )}
        </CardContent>
        <CardFooter>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-yellow-500" /> 
                Ações de bloqueio e suspensão são críticas e devem ser usadas com cautela.
            </p>
        </CardFooter>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Log de Atividades de Segurança</CardTitle>
          <CardDescription>Eventos registrados em ordem cronológica decrescente.</CardDescription>
        </CardHeader>
        <CardContent>
          {mockActivities.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Data e Hora</TableHead>
                    <TableHead>Evento</TableHead>
                    <TableHead>Detalhes</TableHead>
                    <TableHead>Endereço IP</TableHead>
                    <TableHead>Dispositivo</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockActivities.map((activity) => {
                    const ActivityIcon = activity.icon;
                    return (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <div className={`p-2 rounded-full ${getIconBgClass(activity.status)} ${getStatusClass(activity.status)} inline-flex`}>
                            <ActivityIcon className="h-5 w-5" />
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {format(parseISO(activity.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="font-medium">{activity.event}</TableCell>
                        <TableCell>{activity.details}</TableCell>
                        <TableCell className="whitespace-nowrap">{activity.ipAddress}</TableCell>
                        <TableCell className="whitespace-nowrap">{activity.device || '-'}</TableCell>
                        <TableCell className={`text-center font-semibold ${getStatusClass(activity.status)}`}>
                          {activity.status}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Nenhuma atividade registrada recentemente.</p>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isActionAlertOpen} onOpenChange={setIsActionAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Ação</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja {actionToConfirm?.type.toLowerCase()} esta conta?
              {actionToConfirm?.type === 'Bloquear' && " Esta ação impedirá qualquer acesso à conta."}
              {actionToConfirm?.type === 'Suspender' && " Esta ação limitará temporariamente o acesso à conta."}
              {actionToConfirm?.type === 'Ativar' && " Esta ação restaurará o acesso total à conta."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsActionAlertOpen(false); setActionToConfirm(null); }}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmAccountAction}
              className={actionToConfirm?.newStatus === 'Bloqueada' || actionToConfirm?.newStatus === 'Suspensa' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              Confirmar {actionToConfirm?.type}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

