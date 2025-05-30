
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
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ViewAppointmentsDialogProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  userRole: 'cliente' | 'admin';
}

export interface Appointment {
  id: string;
  date: string; 
  time: string;
  doctor: string;
  specialty: string;
  status: string;
  notes?: string;
  patientName?: string; 
}

export const initialMockAppointments: Appointment[] = [
  { id: "1", date: "2024-12-25", time: "10:00", doctor: "Dr. Exemplo", specialty: "Clínica Geral", status: "Confirmado", notes: "Paciente com histórico de pressão alta.", patientName: "Cliente Logado" },
  { id: "2", date: "2025-01-10", time: "14:30", doctor: "Dra. Modelo", specialty: "Cardiologia", status: "Agendado", patientName: "Cliente Logado" },
  { id: "3", date: "2024-11-20", time: "09:00", doctor: "Dr. Teste", specialty: "Ortopedia", status: "Realizado", notes: "Raio-X coluna.", patientName: "Cliente Logado" },
  { id: "4", date: "2024-10-15", time: "16:00", doctor: "Dr. Exemplo", specialty: "Clínica Geral", status: "Cancelado", patientName: "Cliente Logado" },
  { id: "5", date: "2025-02-01", time: "11:00", doctor: "Dra. Nova", specialty: "Dermatologia", status: "Agendado", notes: "Verificar mancha na pele.", patientName: "Cliente Logado" },
  { id: "6", date: "2025-01-05", time: "09:30", doctor: "Dr. House", specialty: "Clínica Geral", status: "Agendado", patientName: "Paciente Alfa (Admin View)" },
  { id: "7", date: "2025-01-08", time: "15:00", doctor: "Dra. Grey", specialty: "Pediatria", status: "Confirmado", notes: "Consulta de rotina.", patientName: "Paciente Beta (Admin View)" },
  // Add more diverse future dates for testing client next appointment summary
  { id: "8", date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0], time: "11:00", doctor: "Dr. Futuro", specialty: "Clínica Geral", status: "Agendado", patientName: "Cliente Logado" },
  { id: "9", date: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0], time: "15:00", doctor: "Dra. Futura", specialty: "Cardiologia", status: "Confirmado", patientName: "Cliente Logado" },
];

export default function ViewAppointmentsDialog({ 
  isOpen, 
  onOpenChange,
  userRole
}: ViewAppointmentsDialogProps) {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>(initialMockAppointments);
  const [isCreateAppointmentOpen, setIsCreateAppointmentOpen] = useState(false);
  const [editingAppointmentData, setEditingAppointmentData] = useState<Appointment | null>(null);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const [appointmentToCancelId, setAppointmentToCancelId] = useState<string | null>(null);

  const dialogTitle = userRole === 'admin' ? "Gerenciar Agendamentos (Admin)" : "Meus Agendamentos";
  const dialogDescription = userRole === 'admin' 
    ? "Visualize e gerencie todos os agendamentos da clínica."
    : "Aqui está a lista de todos os seus agendamentos, passados e futuros.";

  const handleRemarcarAction = (appointment: Appointment) => {
    setEditingAppointmentData(appointment);
    setIsCreateAppointmentOpen(true);
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
        description: `O agendamento foi cancelado com sucesso.`,
      });
    }
    setIsCancelAlertOpen(false);
    setAppointmentToCancelId(null);
  };
  
  const handleSaveAppointment = (data: NewAppointmentPayload, editingId?: string) => {
    if (editingId) {
      setAppointments(prevAppointments =>
        prevAppointments.map(appt =>
          appt.id === editingId 
            ? { ...appt, 
                date: data.date, 
                time: data.time, 
                specialty: data.specialty, 
                doctor: data.doctor, 
                notes: data.notes,
                patientName: userRole === 'admin' ? data.patientName || appt.patientName : appt.patientName, // Keep existing if client
              } 
            : appt
        )
      );
      toast({
        title: "Agendamento Remarcado!",
        description: "Os detalhes do seu agendamento foram atualizados.",
      });
    } else {
      const newAppointment: Appointment = {
        ...data,
        id: Date.now().toString(), 
        status: "Agendado", 
        patientName: userRole === 'admin' ? data.patientName || "Paciente Novo (Admin)" : "Cliente Logado",
      };
      setAppointments(prevAppointments => [newAppointment, ...prevAppointments].sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())); 
      toast({
        title: "Agendamento Criado!",
        description: "Seu novo agendamento foi adicionado à lista.",
      });
    }
    setEditingAppointmentData(null); 
  };

  const openCreateAppointmentDialog = () => {
    setEditingAppointmentData(null); 
    setIsCreateAppointmentOpen(true);
  }

  const filteredAppointments = userRole === 'admin' 
    ? appointments 
    : appointments.filter(appt => appt.patientName === "Cliente Logado");

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              {dialogDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {userRole === 'admin' && <TableHead>Paciente</TableHead>}
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
                {filteredAppointments.map((appt) => (
                  <TableRow key={appt.id}>
                    {userRole === 'admin' && <TableCell>{appt.patientName || "N/A"}</TableCell>}
                    <TableCell>{format(parseISO(appt.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
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
                          <Button variant="outline" size="sm" onClick={() => handleRemarcarAction(appt)}>Remarcar</Button>
                          <Button variant="destructive" size="sm" onClick={() => promptCancelAppointment(appt.id)}>Cancelar</Button>
                        </>
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
            <Button onClick={openCreateAppointmentDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateAppointmentDialog
        isOpen={isCreateAppointmentOpen}
        onOpenChange={(open) => {
            setIsCreateAppointmentOpen(open);
            if (!open) {
              setEditingAppointmentData(null); 
            }
        }}
        onSaveAppointment={handleSaveAppointment}
        editingAppointment={editingAppointmentData}
        userRole={userRole}
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
