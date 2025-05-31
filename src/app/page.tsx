
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const services = [
  {
    title: 'Consultas Gerais',
    description: 'Atendimento médico para avaliação geral da saúde e acompanhamento.',
    imageUrl: '/logo-vidamais.png',
    aiHint: 'clinic logo',
  },
  {
    title: 'Exames Laboratoriais',
    description: 'Coleta e análise de amostras para diagnósticos precisos.',
    imageUrl: '/logo-vidamais.png',
    aiHint: 'clinic logo',
  },
  {
    title: 'Pequenas Cirurgias',
    description: 'Procedimentos cirúrgicos de baixa complexidade realizados com segurança.',
    imageUrl: '/logo-vidamais.png',
    aiHint: 'clinic logo',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
            Bem-vindo à Clínica VidaMais
          </h1>
          <p className="mt-4 max-w-[700px] mx-auto text-foreground/80 md:text-xl">
            Sua saúde em primeiro lugar. Oferecemos atendimento de qualidade com profissionais experientes.
          </p>
          <div className="mt-6">
            <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/contato">Agende sua Consulta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/logo-vidamais.png" 
                alt="Logo da Clínica VidaMais"
                width={400} 
                height={200} 
                className="rounded-lg shadow-xl mx-auto" 
                data-ai-hint="clinic logo"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-headline font-bold tracking-tighter text-primary">Sobre Nós</h2>
              <p className="text-foreground/80">
                A Clínica VidaMais é dedicada a fornecer cuidados de saúde excepcionais em um ambiente acolhedor e moderno. Nossa equipe de especialistas está comprometida com o seu bem-estar, utilizando as mais recentes tecnologias e abordagens médicas.
              </p>
              <p className="text-foreground/80">
                Valorizamos a relação médico-paciente e buscamos oferecer um atendimento personalizado, focado nas suas necessidades individuais.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span>Atendimento humanizado e individualizado</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span>Profissionais qualificados e experientes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span>Tecnologia de ponta para diagnósticos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full py-12 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-headline font-bold tracking-tighter text-center mb-12 text-primary">
            Nossos Serviços
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card key={service.title} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={service.imageUrl}
                  alt={service.title}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                  data-ai-hint={service.aiHint}
                />
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-primary">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
