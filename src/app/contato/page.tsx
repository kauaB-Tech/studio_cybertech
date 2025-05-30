import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <h1 className="text-4xl font-headline font-bold text-center mb-12 text-primary">
        Entre em Contato
      </h1>
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Nossas Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-lg">
            <div className="flex items-center gap-4">
              <MapPin className="h-8 w-8 text-accent flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Endereço</h3>
                <p className="text-foreground/80">Rua Exemplo, 123, Bairro Modelo, Cidade-UF, CEP 00000-000</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-8 w-8 text-accent flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Telefone</h3>
                <p className="text-foreground/80">(00) 12345-6789</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="h-8 w-8 text-accent flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-foreground/80">contato@clinicaweb.com</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mt-4 mb-2">Horário de Funcionamento</h3>
              <p className="text-foreground/80">Segunda a Sexta: 08:00 - 18:00</p>
              <p className="text-foreground/80">Sábado: 08:00 - 12:00</p>
            </div>
          </CardContent>
        </Card>
        
        <div>
          <Image 
            src="https://placehold.co/800x600.png" 
            alt="Localização da clínica"
            width={800}
            height={600}
            className="rounded-lg shadow-xl object-cover w-full h-auto md:h-[480px]"
            data-ai-hint="clinic exterior"
          />
           <p className="text-sm text-muted-foreground mt-2 text-center">Imagem meramente ilustrativa da fachada da clínica.</p>
        </div>
      </div>
    </div>
  );
}
