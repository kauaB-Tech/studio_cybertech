
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Users, Edit } from 'lucide-react';
import EditClientDialog from '@/components/admin/EditClientDialog';
import { useToast } from '@/hooks/use-toast';

export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  // Adicionar mais campos conforme necessário, ex: dataCadastro, status, etc.
}

const mockClients: Client[] = [
  { id: '1', fullName: 'Cliente Exemplo CyberTech', email: 'cliente@cybertech.com', phone: '(11) 98765-4321' },
];

export default function ViewClientsPage() {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false);
  const [editingClientData, setEditingClientData] = useState<Client | null>(null);

  const handleEditClient = (client: Client) => {
    setEditingClientData(client);
    setIsEditClientDialogOpen(true);
  };

  const handleSaveClient = (updatedClient: Client) => {
    setClients(prevClients =>
      prevClients.map(client =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
    toast({
      title: "Cliente Atualizado!",
      description: `As informações de ${updatedClient.fullName} foram atualizadas com sucesso.`,
    });
    setEditingClientData(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-2">
            <Users className="h-10 w-10" />
            Visualizar Clientes Cadastrados
          </h1>
          <p className="text-lg text-foreground/80 mt-2">
            Gerencie e edite as informações dos clientes da clínica.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/area-cliente/dashboard?role=admin" className="flex items-center gap-1 self-start sm:self-auto">
            <ArrowLeft className="h-4 w-4" /> Voltar ao Painel do Admin
          </Link>
        </Button>
      </header>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Lista de Clientes</CardTitle>
          <CardDescription>Total de clientes: {clients.length}</CardDescription>
        </CardHeader>
        <CardContent>
          {clients.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome Completo</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.fullName}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClient(client)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Nenhum cliente cadastrado ainda.</p>
          )}
        </CardContent>
      </Card>

      <EditClientDialog
        isOpen={isEditClientDialogOpen}
        onOpenChange={(isOpen) => {
          setIsEditClientDialogOpen(isOpen);
          if (!isOpen) {
            setEditingClientData(null);
          }
        }}
        clientData={editingClientData}
        onSave={handleSaveClient}
      />
    </div>
  );
}
