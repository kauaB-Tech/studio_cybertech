
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

interface MedicalRecord {
  id: string;
  date: string; // Formato YYYY-MM-DD
  type: string;
  doctor: string;
  summary: string;
}

const mockMedicalHistory: MedicalRecord[] = [
  { id: "rec1", date: "2024-10-15", type: "Consulta Clínica Geral", doctor: "Dr. Exemplo", summary: "Check-up anual. Paciente relata bom estado geral." },
  { id: "rec2", date: "2024-05-20", type: "Exame de Sangue (Hemograma)", doctor: "Laboratório VidaMais", summary: "Resultados dentro dos parâmetros normais." },
  { id: "rec3", date: "2023-11-10", type: "Consulta Ortopédica", doctor: "Dr. Teste", summary: "Paciente com dor no joelho direito. Solicitado Raio-X." },
  { id: "rec4", date: "2023-08-01", type: "Vacinação", doctor: "Enf. Modelo", summary: "Aplicação da vacina contra gripe." },
  { id: "rec5", date: "2023-03-22", type: "Consulta Dermatológica", doctor: "Dra. Nova", summary: "Avaliação de rotina da pele. Nenhuma anormalidade detectada." },
];


interface ViewMedicalHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export default function ViewMedicalHistoryDialog({
  isOpen,
  onOpenChange,
}: ViewMedicalHistoryDialogProps) {
  const [history, setHistory] = useState<MedicalRecord[]>(mockMedicalHistory);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Histórico Médico Completo</DialogTitle>
          <DialogDescription>
            Seu histórico de consultas, exames e outros registros médicos.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {history.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo de Registro</TableHead>
                  <TableHead>Profissional/Local</TableHead>
                  <TableHead>Resumo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.date + 'T00:00:00').toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell>{record.doctor}</TableCell>
                    <TableCell className="max-w-[300px] truncate" title={record.summary}>{record.summary}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground">Nenhum histórico médico encontrado.</p>
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
