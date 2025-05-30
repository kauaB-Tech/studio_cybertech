
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, LogIn, ShieldAlert, KeyRound, UserCog } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="h-10 w-10" />
            Minhas Atividades Recentes
          </h1>
          <p className="text-lg text-foreground/80 mt-2">
            Acompanhe os eventos de segurança relacionados à sua conta.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/area-cliente/dashboard" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Voltar ao Painel
          </Link>
        </Button>
      </header>

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
    </div>
  );
}
