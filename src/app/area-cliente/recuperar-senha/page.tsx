import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

export default function RecoverPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Recuperar Senha</CardTitle>
          <CardDescription>Insira seu email para enviarmos instruções de recuperação.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div>
              <Label htmlFor="email-recover">Email</Label>
              <Input id="email-recover" type="email" placeholder="seuemail@exemplo.com" required className="mt-1" />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Enviar Link de Recuperação
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Button variant="link" asChild>
              <Link href="/area-cliente/login" className="text-sm text-primary hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="h-4 w-4" /> Voltar para o Login
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
