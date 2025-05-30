
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Appointment } from "./ViewAppointmentsDialog"; // Import Appointment type

const appointmentFormSchema = z.object({
  date: z.date({ required_error: "A data do agendamento é obrigatória." }),
  time: z.string({ required_error: "A hora do agendamento é obrigatória." }),
  specialty: z.string({ required_error: "A especialidade é obrigatória." }),
  doctor: z.string({ required_error: "O profissional é obrigatório." }),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

export interface NewAppointmentPayload {
  date: string; // Data formatada como string YYYY-MM-DD
  time: string;
  specialty: string;
  doctor: string;
  notes?: string;
}

interface CreateAppointmentDialogProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  onSaveAppointment: (data: NewAppointmentPayload, editingId?: string) => void;
  editingAppointment?: Appointment | null;
}

const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
const availableSpecialties = ["Clínica Geral", "Cardiologia", "Ortopedia", "Dermatologia", "Pediatria"];
const availableDoctors = ["Dr. Exemplo", "Dra. Modelo", "Dr. Teste", "Dra. Nova", "Dr. House"];


export default function CreateAppointmentDialog({ 
  isOpen, 
  onOpenChange,
  onSaveAppointment,
  editingAppointment
}: CreateAppointmentDialogProps) {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
        date: undefined,
        time: undefined,
        specialty: undefined,
        doctor: undefined,
        notes: "",
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (editingAppointment) {
        form.reset({
          date: new Date(editingAppointment.date + 'T00:00:00'), // Ajuste para fuso horário local
          time: editingAppointment.time,
          specialty: editingAppointment.specialty,
          doctor: editingAppointment.doctor,
          notes: editingAppointment.notes || "",
        });
      } else {
        form.reset({
          date: undefined,
          time: undefined,
          specialty: undefined,
          doctor: undefined,
          notes: "",
        });
      }
    }
  }, [isOpen, editingAppointment, form]);

  function onSubmit(data: AppointmentFormValues) {
    const payload: NewAppointmentPayload = {
      date: format(data.date, "yyyy-MM-dd"),
      time: data.time,
      specialty: data.specialty,
      doctor: data.doctor,
      notes: data.notes,
    };
    onSaveAppointment(payload, editingAppointment ? editingAppointment.id : undefined);
    onOpenChange(false); 
  }
  
  const dialogTitle = editingAppointment ? "Remarcar Agendamento" : "Criar Novo Agendamento";
  const dialogDescription = editingAppointment 
    ? "Altere os dados abaixo para remarcar o agendamento."
    : "Preencha os dados abaixo para criar um novo agendamento.";
  const saveButtonText = editingAppointment ? "Salvar Alterações" : "Salvar Agendamento";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        // Não resetar o form aqui, pois o useEffect já lida com isso baseado em isOpen e editingAppointment
        // Isso previne que o form seja resetado para valores vazios brevemente antes de fechar ao editar.
      }
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data do Agendamento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Escolha uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0,0,0,0)) 
                        }
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um horário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableTimes.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Especialidade</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma especialidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                       {availableSpecialties.map(specialty => (
                        <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="doctor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profissional</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um profissional" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                       {availableDoctors.map(doctor => (
                        <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Alguma informação adicional para o agendamento?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                 <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit">{saveButtonText}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
