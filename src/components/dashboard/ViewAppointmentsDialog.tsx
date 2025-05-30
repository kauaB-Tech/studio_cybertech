
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
import CreateAppointmentDialog, { type NewAppointmentPayload } from "./CreateAppointmentDialog";
import { PlusCircle } from "lucide-react";

interface ViewAppointmentsDialogProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export interface Appointment {
  id: string;
  date: string; // Formato YYYY-MM-DD
  time: string;
  doctor: string;
  specialty: string;
  status: string;
  notes?: string;
}

const initialMockAppointments: Appointment[] = [
  { id: "1", date: "2024-12-25", time: "10:00", doctor: "Dr. Exemplo", specialty: "Clínica Geral", status: "Confirmado", notes: "Paciente com histórico de pressão alta." },
  { id: "2", date: "2025-01-10", time: "14:30", doctor: "Dra. Modelo", specialty: "Cardiologia", status: "Agendado" },
  { id: "3", date: "2024-11-20", time: "09:00", doctor: "Dr. Teste", specialty: "Ortopedia", status: "Realizado", notes: "Raio-X coluna." },
  { id: "4", date: "2024-10-15", time: "16:00", doctor: "Dr. Exemplo", specialty: "Clínica Geral", status: "Cancelado" },
  { id: "5", date: "2025-02-01", time: "11:00", doctor: "Dra. Nova", specialty: "Dermatologia", status: "Agendado", notes: "Verificar mancha na pele." },
];

export default function ViewAppointmentsDialog({ 
  isOpen, 
  onOpenChange 
}: ViewAppointmentsDialogProps) {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>(initialMockAppointments);
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const [appointmentToCancelId, setAppointmentToCancelId] = useState<string | null>(null);

  const handleRemarcarAction = (appointmentId: string) => {
    toast({
      title: "Funcionalidade em Desenvolvimento",
      description: `A funcionalidade "Remarcar Agendamento" (${appointmentId}) ainda não foi implementada.`,
    });
  };

  const promptCancelAppointment = (appointmentId: string) => {
    setAppointmentToCancelId(appointmentId);
    setIsCancelAlertOpen(true);
  };

  const handleConfirmCancel = () => {
    if (appointmentToCancelId) {
      setAppointments(prevAppointments =>
        prevAppointments.map(appt =>
          appt.id === appointmentToCancelId ? { ...appt, status: "Cancelado" } : appt
        )
      );
      toast({
        title: "Agendamento Cancelado!",
        description: `O agendamento ${appointmentToCancelId} foi cancelado com sucesso.`,
      });
    }
    setIsCancelAlertOpen(false);
    setAppointmentToCancelId(null);
  };
  
  const handleViewDetailsAction = (appointmentId: string) => {
    toast({
        title: "Funcionalidade em Desenvolvimento",
        description: `A funcionalidade "Ver Detalhes" (${appointmentId}) ainda não foi implementada.`,
    });
  };


  const handleAppointmentCreated = (data: NewAppointmentPayload) => {
    const newAppointment: Appointment = {
      ...data,
      id: Date.now().toString(), 
      status: "Agendado", 
    };
    setAppointments(prevAppointments => [newAppointment, ...prevAppointments]); 
    toast({
      title: "Agendamento Criado!",
      description: "Seu novo agendamento foi adicionado à lista.",
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
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
                  <TableHead>Observações</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appt) => (
                  <TableRow key={appt.id}>
                    <TableCell>{new Date(appt.date + 'T00:00:00').toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell>{appt.doctor}</TableCell>
                    <TableCell>{appt.specialty}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={appt.notes}>{appt.notes || '-'}</TableCell>
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
                          <Button variant="outline" size="sm" onClick={() => handleRemarcarAction(appt.id)}>Remarcar</Button>
                          <Button variant="destructive" size="sm" onClick={() => promptCancelAppointment(appt.id)}>Cancelar</Button>
                        </>
                      )}
                       {appt.status === "Realizado" && (
                          <Button variant="outline" size="sm" onClick={() => handleViewDetailsAction(appt.id)}>Detalhes</Button>
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

      <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja cancelar este agendamento? Esta ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAppointmentToCancelId(null)}>Não, manter</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>Sim, cancelar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
