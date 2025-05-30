
"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

export interface Invoice {
  id: string;
  issueDate: string; 
  dueDate: string;   
  amount: number;
  status: "Paga" | "Pendente" | "Vencida";
  description: string;
  patientName?: string; 
}

const mockInvoices: Invoice[] = [
  { id: "FAT-2024-C01", issueDate: "2024-11-15", dueDate: "2024-12-01", amount: 150.00, status: "Paga", description: "Consulta Clínica Geral", patientName: "Cliente Logado" },
  { id: "FAT-2024-C02", issueDate: "2024-12-01", dueDate: "2024-12-15", amount: 250.00, status: "Pendente", description: "Exames Laboratoriais", patientName: "Cliente Logado" },
  { id: "FAT-2023-C03", issueDate: "2023-09-10", dueDate: "2023-09-25", amount: 80.00, status: "Vencida", description: "Consulta de Retorno", patientName: "Cliente Logado" },
  { id: "FAT-2023-A04", issueDate: "2023-07-05", dueDate: "2023-07-20", amount: 320.00, status: "Paga", description: "Pequena Cirurgia Ambulatorial (Paciente Alfa)", patientName: "Paciente Alfa (Admin View)" },
  { id: "FAT-2023-A05", issueDate: "2023-05-12", dueDate: "2023-05-27", amount: 120.00, status: "Paga", description: "Consulta Cardiológica (Paciente Beta)", patientName: "Paciente Beta (Admin View)" },
  { id: "FAT-2024-A06", issueDate: "2024-11-25", dueDate: "2024-12-10", amount: 180.00, status: "Pendente", description: "Fisioterapia Sessão 1 (Paciente Gamma)", patientName: "Paciente Gamma (Admin View)" },
];

interface ViewBillingHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  userRole: 'cliente' | 'admin';
}

export default function ViewBillingHistoryDialog({
  isOpen,
  onOpenChange,
  userRole,
}: ViewBillingHistoryDialogProps) {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);

  const dialogTitle = userRole === 'admin' ? "Histórico de Faturas (Visão Admin)" : "Histórico de Faturas";
  const dialogDescription = userRole === 'admin'
    ? "Lista de todas as faturas dos pacientes."
    : "Aqui está a lista de todas as suas faturas.";

  const handleDownloadPdf = (invoiceId: string) => {
    toast({
      title: "Download em Desenvolvimento",
      description: `A funcionalidade de download de PDF para a fatura ${invoiceId} está em desenvolvimento.`,
    });
  };

  const getStatusClass = (status: Invoice["status"]) => {
    switch (status) {
      case "Paga":
        return "bg-green-100 text-green-700";
      case "Pendente":
        return "bg-yellow-100 text-yellow-700";
      case "Vencida":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID da Fatura</TableHead>
                  {userRole === 'admin' && <TableHead>Paciente</TableHead>}
                  <TableHead>Descrição</TableHead>
                  <TableHead>Data Emissão</TableHead>
                  <TableHead>Data Vencimento</TableHead>
                  <TableHead className="text-right">Valor (R$)</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices
                  .filter(invoice => userRole === 'admin' || invoice.patientName === "Cliente Logado")
                  .map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    {userRole === 'admin' && <TableCell>{invoice.patientName || "N/A"}</TableCell>}
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell>{new Date(invoice.issueDate + 'T00:00:00').toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{new Date(invoice.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="text-right">{invoice.amount.toFixed(2).replace('.', ',')}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(invoice.status)}`}
                      >
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPdf(invoice.id)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Baixar PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground">Nenhuma fatura encontrada.</p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

