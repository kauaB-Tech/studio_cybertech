
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
  date: string; 
  type: string;
  doctor: string;
  summary: string;
  patientName?: string; 
}

const mockMedicalHistory: MedicalRecord[] = [
  { id: "rec1", date: "2024-10-15", type: "Consulta Clínica Geral", doctor: "Dr. Exemplo", summary: "Check-up anual. Paciente relata bom estado geral. Pressão arterial 120/80 mmHg. Nenhuma queixa ativa. Solicitado exames de rotina.", patientName: "Cliente Logado" },
  { id: "rec2", date: "2024-05-20", type: "Exame de Sangue (Hemograma)", doctor: "Laboratório VidaMais", summary: "Resultados dentro dos parâmetros normais. Hemoglobina 14.5 g/dL, Leucócitos 6.500/µL, Plaquetas 280.000/µL.", patientName: "Cliente Logado"},
  { id: "rec3", date: "2023-11-10", type: "Consulta Ortopédica", doctor: "Dr. Teste", summary: "Paciente com dor no joelho direito após atividade física. Exame físico sugere leve entorse. Solicitado Raio-X e recomendado repouso.", patientName: "Cliente Logado"},
  { id: "rec4", date: "2023-11-12", type: "Raio-X Joelho Direito", doctor: "Clínica de Imagem VidaMais", summary: "Estruturas ósseas íntegras. Sem sinais de fratura ou luxação. Leve edema de partes moles.", patientName: "Cliente Logado"},
  { id: "rec5", date: "2023-08-01", type: "Vacinação", doctor: "Enf. Modelo", summary: "Aplicação da vacina contra gripe (Influenza) e reforço da vacina antitetânica.", patientName: "Cliente Logado"},
  { id: "rec6", date: "2023-03-22", type: "Consulta Dermatológica", doctor: "Dra. Nova", summary: "Avaliação de rotina da pele. Nenhuma anormalidade detectada. Recomendado uso de protetor solar FPS 50.", patientName: "Cliente Logado"},
  { id: "rec7", date: "2024-11-05", type: "Consulta Pediátrica", doctor: "Dra. Grey", summary: "Acompanhamento de rotina do Paciente Alfa. Desenvolvimento normal.", patientName: "Paciente Alfa (Admin View)"},
  { id: "rec8", date: "2024-11-15", type: "Exames Cardiológicos", doctor: "Dr. House", summary: "Ecocardiograma e teste ergométrico para Paciente Beta. Resultados a serem avaliados.", patientName: "Paciente Beta (Admin View)"},
];


interface ViewMedicalHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  userRole: 'cliente' | 'admin';
}

export default function ViewMedicalHistoryDialog({
  isOpen,
  onOpenChange,
  userRole,
}: ViewMedicalHistoryDialogProps) {
  const [history, setHistory] = useState<MedicalRecord[]>(mockMedicalHistory);

  const dialogTitle = userRole === 'admin' ? "Histórico Médico (Visão Admin)" : "Histórico Médico Completo";
  const dialogDescription = userRole === 'admin' 
    ? "Histórico de consultas, exames e outros registros médicos dos pacientes."
    : "Seu histórico de consultas, exames e outros registros médicos.";

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
          {history.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  {userRole === 'admin' && <TableHead>Paciente</TableHead>}
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo de Registro</TableHead>
                  <TableHead>Profissional/Local</TableHead>
                  <TableHead>Resumo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history
                  .filter(record => userRole === 'admin' || record.patientName === "Cliente Logado")
                  .map((record) => (
                  <TableRow key={record.id}>
                    {userRole === 'admin' && <TableCell>{record.patientName || "N/A"}</TableCell>}
                    <TableCell>{new Date(record.date + 'T00:00:00').toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell>{record.doctor}</TableCell>
                    <TableCell className="max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl whitespace-pre-wrap break-words">{record.summary}</TableCell>
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

