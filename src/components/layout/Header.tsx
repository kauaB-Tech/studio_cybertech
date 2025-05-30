import Link from 'next/link';
import { Stethoscope, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Contato', href: '/contato' },
    { label: 'Área do Cliente', href: '/area-cliente/login' },
  ];

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
          <Stethoscope className="h-8 w-8" />
          <h1 className="text-2xl font-headline font-bold">Clínica VidaMais</h1>
        </Link>
        
        <nav className="hidden md:flex gap-4">
          {navItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild>
              <Link href={item.href} className="text-foreground hover:text-primary transition-colors">
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
              <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4">
                <Stethoscope className="h-7 w-7" />
                <h1 className="text-xl font-headline font-bold">Clínica VidaMais</h1>
              </Link>
                {navItems.map((item) => (
                  <Button key={item.label} variant="ghost" asChild className="w-full justify-start">
                    <Link href={item.href} className="text-lg text-foreground hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
