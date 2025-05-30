
"use client";

import { useState } from "react";
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
import type { Dispatch, SetStateAction } from "react";
import { useToast } from "@/hooks/use-toast";
import CreateAppointmentDialog from "./CreateAppointmentDialog"; // Novo import
import { PlusCircle } from "lucide-react";

interface ViewAppointmentsDialogProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

const mockAppointments = [
  { id: "1", date: "2024-12-25", time: "10:00", doctor: "Dr. Exemplo", specialty: "Clínica Geral", status: "Confirmado" },
  { id: "2", date: "2025-01-10", time: "14:30", doctor: "Dra. Modelo", specialty: "Cardiologia", status: "Agendado" },
  { id: "3", date: "2024-11-20", time: "09:00", doctor: "Dr. Teste", specialty: "Ortopedia", status: "Realizado" },
  { id: "4", date: "2024-10-15", time: "16:00", doctor: "Dr. Exemplo", specialty: "Clínica Geral", status: "Cancelado" },
  { id: "5", date: "2025-02-01", time: "11:00", doctor: "Dra. Nova", specialty: "Dermatologia", status: "Agendado" },
];

export default function ViewAppointmentsDialog({ 
  isOpen, 
  onOpenChange 
}: ViewAppointmentsDialogProps) {
  const { toast } = useToast();
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);

  const handleAction = (actionName: string, appointmentId: string) => {
    toast({
      title: `Ação: ${actionName}`,
      description: `Funcionalidade para ${actionName.toLowerCase()} o agendamento ${appointmentId} não implementada.`,
    });
  };

  const handleAppointmentCreated = () => {
    // No futuro, aqui você poderia recarregar a lista de agendamentos
    toast({
      title: "Agendamento Criado!",
      description: "Seu novo agendamento foi salvo (simulação).",
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Meus Agendamentos</DialogTitle>
            <DialogDescription>
              Aqui está a lista de todos os seus agendamentos, passados e futuros.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAppointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell>{new Date(appt.date + 'T00:00:00').toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell>{appt.doctor}</TableCell>
                    <TableCell>{appt.specialty}</TableCell>
                    <TableCell>
                      <span 
                        className={`px-2 py-1 text-xs font-semibold rounded-full
                          ${appt.status === "Confirmado" || appt.status === "Agendado" ? "bg-green-100 text-green-700" : ""}
                          ${appt.status === "Realizado" ? "bg-blue-100 text-blue-700" : ""}
                          ${appt.status === "Cancelado" ? "bg-red-100 text-red-700" : ""}`}
                      >
                        {appt.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {(appt.status === "Agendado" || appt.status === "Confirmado") && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleAction("Remarcar", appt.id)}>Remarcar</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleAction("Cancelar", appt.id)}>Cancelar</Button>
                        </>
                      )}
                       {appt.status === "Realizado" && (
                          <Button variant="outline" size="sm" onClick={() => handleAction("Ver Detalhes", appt.id)}>Detalhes</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter className="justify-between sm:justify-between">
             <DialogClose asChild>
              <Button type="button" variant="outline">Fechar</Button>
            </DialogClose>
            <Button onClick={() => setIsCreateAppointmentOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateAppointmentDialog
        isOpen={isCreateAppointmentOpen}
        onOpenChange={setIsCreateAppointmentOpen}
        onAppointmentCreated={handleAppointmentCreated}
      />
    </>
  );
}
