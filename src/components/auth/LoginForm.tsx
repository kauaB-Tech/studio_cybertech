"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Stethoscope } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Mock login logic
    console.log("Login attempt with:", values);
    // Simulate API call
    setTimeout(() => {
      if (values.email === "cliente@exemplo.com" && values.password === "senha123") {
        toast({
          title: "Login bem-sucedido!",
          description: "Redirecionando para o painel...",
        });
        router.push("/area-cliente/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: "Email ou senha incorretos.",
        });
      }
    }, 1000);
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
            <Stethoscope className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-3xl font-headline text-primary">Área do Cliente</CardTitle>
        <CardDescription>Acesse sua conta para gerenciar seus dados e agendamentos.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seuemail@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Sua senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Entrar
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center">
          <Link href="/area-cliente/recuperar-senha" className="text-sm text-primary hover:underline">
            Esqueceu sua senha?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
