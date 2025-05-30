
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, UserPlus, Users } from 'lucide-react';

const registerClientFormSchema = z.object({
  fullName: z.string().min(3, { message: "O nome completo deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  phone: z.string().min(10, { message: "O telefone deve ter pelo menos 10 dígitos (com DDD)." }),
});

type RegisterClientFormValues = z.infer<typeof registerClientFormSchema>;

export default function RegisterClientPage() {
  const { toast } = useToast();
  const form = useForm<RegisterClientFormValues>({
    resolver: zodResolver(registerClientFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  function onSubmit(values: RegisterClientFormValues) {
    console.log("Dados do novo cliente:", values);
    toast({
      title: "Cliente Registrado com Sucesso!",
      description: `O cliente ${values.fullName} foi adicionado ao sistema.`,
    });
    form.reset(); 
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-8 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-primary flex items-center gap-2">
            <UserPlus className="h-10 w-10" />
            Registrar Novo Cliente
          </h1>
          <p className="text-lg text-foreground/80 mt-2">
            Preencha os dados abaixo para cadastrar um novo cliente no sistema.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 self-start sm:self-auto">
          <Button variant="outline" asChild>
            <Link href="/area-cliente/ver-clientes" className="flex items-center gap-1">
              <Users className="h-4 w-4" /> Ver Clientes Cadastrados
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/area-cliente/dashboard?role=admin" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Voltar ao Painel do Admin
            </Link>
          </Button>
        </div>
      </header>

      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Formulário de Cadastro</CardTitle>
          <CardDescription>Insira as informações do novo cliente.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo do cliente" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 91234-5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Registrar Cliente
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">
                Após o registro, o cliente poderá acessar o sistema com as credenciais que serão definidas (funcionalidade a ser implementada).
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
